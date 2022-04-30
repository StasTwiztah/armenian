import TelegramBot from "node-telegram-bot-api";
import { CallbackQuery, Message } from "node-telegram-bot-api";
import { QuestionsStore } from "../questions/QuestionsStore";
import { ButtonCommand } from "../types/ButtonCommand";
import { logMessage, logCommand } from "./logUserMessage";
import { questionFactory } from "../questions/questionFactory";

export default class TelegramBotApiHandler {
  botInstance: TelegramBot;
  questionsStore: QuestionsStore;

  constructor(instance: TelegramBot) {
    this.botInstance = instance;
    this.questionsStore = new QuestionsStore();
  }

  private createQuestion = async (chatId: number, type: string) => {
    const questionBase = questionFactory(type);

    if (!questionBase) {
      return this.botInstance.sendMessage(
        chatId,
        "Что-то пошло не так, введите новую команду"
      );
    }

    const question = this.questionsStore.setQuestion(chatId, questionBase);

    return this.botInstance.sendMessage(chatId, question.questionText, {
      reply_markup: question.replyMarkup,
    });
  };

  public handleMessage = async (message: Message) => {
    const text = message.text;
    const chatId = message.chat.id;
    const activeQuestion = this.questionsStore.getQuestion(chatId);

    logMessage(message);

    if (text === "/start") {
      return this.botInstance.sendMessage(
        chatId,
        "Жми menu, чтобы посмотреть список доступных команд"
      );
    }

    if (text === "/alphabet") {
      return await this.createQuestion(chatId, "AlphabetQuestion");
    }

    if (text === "/number_to_word") {
      return await this.createQuestion(chatId, "NumberToWordQuestion");
    }

    if (text === "/word_to_number") {
      return await this.createQuestion(chatId, "WordToNumberQuestion");
    }

    if (activeQuestion && text) {
      return this.questionsStore.handleAnswer(
        chatId,
        text,
        async () => {
          await this.botInstance.sendMessage(
            chatId,
            `✅ Верно! ${activeQuestion.answerText}`
          );
          return await this.createQuestion(chatId, activeQuestion.type);
        },
        async () => {
          await this.botInstance.sendMessage(
            chatId,
            `❌ Неверно, ${activeQuestion.answerText}`
          );
          return await this.createQuestion(chatId, activeQuestion.type);
        },
        async () => {
          return await this.botInstance.sendMessage(
            chatId,
            "Нет активных уроков"
          );
        }
      );
    }

    return this.botInstance.sendMessage(chatId, "Неизвестная команда");
  };

  public handleCommand = async (message: CallbackQuery) => {
    const data = message.data;
    const chatId = message.message?.chat.id;
    const activeQuestion = this.questionsStore.getQuestion(chatId);

    logCommand(message);

    const command = data as ButtonCommand;
    if (chatId) {
      if (activeQuestion && command === "getAnswer") {
        await this.botInstance.sendMessage(chatId, activeQuestion.answerText);
        return await this.createQuestion(chatId, activeQuestion.type);
      }

      if (activeQuestion && command === "stopLesson") {
        this.questionsStore.deleteQuestion(chatId);

        return this.botInstance.sendMessage(chatId, "Урок окончен :)");
      }

      if (command === "showAlphabet") {
        return this.botInstance.sendPhoto(
          chatId,
          "https://megabook.ru/stream/mediapreview?Key=%D0%90%D1%80%D0%BC%D1%8F%D0%BD%D1%81%D0%BA%D0%B8%D0%B9%20%D0%B0%D0%BB%D1%84%D0%B0%D0%B2%D0%B8%D1%82"
        );
      }
    }

    if (chatId)
      return this.botInstance.sendMessage(chatId, "Нет активных уроков");
  };
}
