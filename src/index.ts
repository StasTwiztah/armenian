import TelegramBot from "node-telegram-bot-api";
import { AlphabetQuestion } from "./questions/alphabet/AlphabetQuestion";
import { NumberToWordQuestion } from "./questions/numbers/NumberToWordQuestion";
import { WordToNumberQuestion } from "./questions/numbers/WordToNumberQuestion";
import { QuestionsStore } from "./questions/QuestionsStore";
import { ButtonCommand } from "./types/ButtonCommand";
import { QuestionBase } from "./types/QuestionBase";
import { application } from "express";
import "dotenv/config";

const telegramBot = new TelegramBot(
  "5130108766:AAG9xfpWV38xWMimwlnF6OR6Et1YbHeOzpE",
  {
    polling: true,
  }
);

telegramBot.setMyCommands([
  {
    command: "/start",
    description: "Start",
  },
  { command: "/alphabet", description: "Угадай букву армянского алфавита" },
  {
    command: "/number_to_word",
    description: "Назови цифру. Можно отвечать и по-русски, и по-армянски",
  },
  {
    command: "/word_to_number",
    description: "Переведи цифру",
  },
]);

const questionsStore = new QuestionsStore();

async function createQuestion(
  chatId: number,
  type:
    | "AlphabetQuestion"
    | "NumberToWordQuestion"
    | "WordToNumberQuestion"
    | string
) {
  let questionBase: QuestionBase | undefined;

  switch (type) {
    case "AlphabetQuestion":
      questionBase = new AlphabetQuestion();
      break;
    case "NumberToWordQuestion":
      questionBase = new NumberToWordQuestion();
      break;
    case "WordToNumberQuestion":
      questionBase = new WordToNumberQuestion();
      break;
    default:
      break;
  }

  if (!questionBase) {
    return telegramBot.sendMessage(
      chatId,
      "Что-то пошло не так, введите новую команду"
    );
  }

  const question = questionsStore.setQuestion(chatId, questionBase);

  return telegramBot.sendMessage(chatId, question.questionText, {
    reply_markup: question.replyMarkup,
  });
}

const start = async () => {
  telegramBot.on("message", async (message) => {
    const text = message.text;
    const chatId = message.chat.id;
    const activeQuestion = questionsStore.getQuestion(chatId);

    console.log(`
user ${message.chat.first_name} ${message.chat.last_name}
message ${message.text}
    `);

    if (text === "/start") {
      return telegramBot.sendMessage(
        chatId,
        "Жми menu, чтобы посмотреть список доступных команд"
      );
    }

    if (text === "/alphabet") {
      return await createQuestion(chatId, "AlphabetQuestion");
    }

    if (text === "/number_to_word") {
      return await createQuestion(chatId, "NumberToWordQuestion");
    }

    if (text === "/word_to_number") {
      return await createQuestion(chatId, "WordToNumberQuestion");
    }

    if (activeQuestion && text) {
      return questionsStore.handleAnswer(
        chatId,
        text,
        async () => {
          await telegramBot.sendMessage(
            chatId,
            `✅ Верно! ${activeQuestion.answerText}`
          );
          return await createQuestion(chatId, activeQuestion.type);
        },
        async () => {
          await telegramBot.sendMessage(
            chatId,
            `❌ Неверно, ${activeQuestion.answerText}`
          );
          return await createQuestion(chatId, activeQuestion.type);
        },
        async () => {
          return await telegramBot.sendMessage(chatId, "Нет активных уроков");
        }
      );
    }

    return telegramBot.sendMessage(chatId, "Неизвестная команда");
  });

  telegramBot.on("callback_query", async (message) => {
    const data = message.data;
    const chatId = message.message?.chat.id;
    const activeQuestion = questionsStore.getQuestion(chatId);

    console.log(`
user ${message.from.first_name} ${message.from.last_name}
command ${message.data}
        `);

    const command = data as ButtonCommand;
    if (chatId) {
      if (activeQuestion && command === "getAnswer") {
        await telegramBot.sendMessage(chatId, activeQuestion.answerText);
        return await createQuestion(chatId, activeQuestion.type);
      }

      if (activeQuestion && command === "stopLesson") {
        questionsStore.deleteQuestion(chatId);

        return telegramBot.sendMessage(chatId, "Урок окончен :)");
      }

      if (command === "showAlphabet") {
        return telegramBot.sendPhoto(
          chatId,
          "https://megabook.ru/stream/mediapreview?Key=%D0%90%D1%80%D0%BC%D1%8F%D0%BD%D1%81%D0%BA%D0%B8%D0%B9%20%D0%B0%D0%BB%D1%84%D0%B0%D0%B2%D0%B8%D1%82"
        );
      }
    }

    if (chatId) return telegramBot.sendMessage(chatId, "Нет активных уроков");
  });

  application.listen(process.env.PORT || 5000, () => {
    console.log("app started");
  });
};

try {
  start();
} catch (error: any) {
  console.log(error?.message);
}
