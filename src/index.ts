import TelegramBot from "node-telegram-bot-api";
import { AlphabetQuestion } from "./questions/alphabet/AlphabetQuestion";
import { QuestionsStore } from "./questions/QuestionsStore";
import { ButtonCommand } from "./types/ButtonCommand";

const token = "5130108766:AAG9xfpWV38xWMimwlnF6OR6Et1YbHeOzpE";

const questionsStore = new QuestionsStore();

const telegramBot = new TelegramBot(token, { polling: true });
telegramBot.setMyCommands([
  {
    command: "/start",
    description: "Start",
  },
  { command: "/alphabet", description: "Угадай букву армянского алфавита" },
]);

const createAlphabetQuestion = async (chatId: number) => {
  const question = questionsStore.setQuestion(chatId, new AlphabetQuestion());

  return telegramBot.sendMessage(chatId, question.questionItem.questionText, {
    reply_markup: question.replyMarkup,
  });
};

const start = () => {
  telegramBot.on("message", async (message) => {
    const text = message.text;
    const chatId = message.chat.id;
    const activeQuestion = questionsStore.getQuestion(chatId);

    if (activeQuestion && text) {
      return questionsStore.handleAnswer(
        chatId,
        text,
        async () => {
          await telegramBot.sendMessage(
            chatId,
            `Верно! ${activeQuestion.questionItem.answerText}`
          );
          return await createAlphabetQuestion(chatId);
        },
        async () => {
          await telegramBot.sendMessage(
            chatId,
            `Неверно, ${activeQuestion.questionItem.answerText}`
          );
          return await createAlphabetQuestion(chatId);
        },
        async () => {
          return await telegramBot.sendMessage(chatId, "Нет активных уроков");
        }
      );
    }

    if (text === "/start") {
      return telegramBot.sendMessage(
        chatId,
        "Жми menu, чтобы посмотреть список доступных команд"
      );
    }

    if (text === "/alphabet") {
      return await createAlphabetQuestion(chatId);
    }

    return telegramBot.sendMessage(chatId, "Неизвестная команда");
  });

  telegramBot.on("callback_query", async (message) => {
    const data = message.data;
    const chatId = message.message?.chat.id;
    const activeQuestion = questionsStore.getQuestion(chatId);

    const command = data as ButtonCommand;
    if (chatId) {
      if (activeQuestion && command === "getAnswer") {
        await telegramBot.sendMessage(
          chatId,
          activeQuestion.questionItem.answerText
        );
        return await createAlphabetQuestion(chatId);
      }

      if (activeQuestion && command === "stopLesson") {
        questionsStore.deleteQuestion(chatId);

        return telegramBot.sendMessage(chatId, "Урок окончен :)");
      }

      if (command === "showAlphabet") {
        return telegramBot.sendPhoto(
          chatId,
          "https://www.showbell.ru/blog/wp-content/uploads/2012/04/arm4.jpg"
        );
      }
    }

    if (chatId) return telegramBot.sendMessage(chatId, "Нет активных уроков");
  });
};

start();
