import TelegramBot, { CallbackQuery, Message } from "node-telegram-bot-api";
import { questionFactory } from "../questions/questionFactory";
import { QuestionsStore } from "../questions/QuestionsStore";
import { ButtonCommand } from "../types/ButtonCommand";
import { getUserCommands, MessageCommand } from "./commands/MessageCommands";
import { logCommand, logMessage } from "./logUserMessage";

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
    logMessage(message);

    const text = message.text;
    const chatId = message.chat.id;
    const activeQuestion = this.questionsStore.getQuestion(chatId);

    const messageCommand = text as MessageCommand;
    if (messageCommand) {
      if (messageCommand === "/start") {
        return this.botInstance.sendMessage(
          chatId,
          `
Доступные команды:
${getUserCommands()
  .map(({ command, description }) => `${command}: ${description}`)
  .join("\n")}`
        );
      }

      if (messageCommand === "/alphabet") {
        return await this.createQuestion(message.chat.id, "AlphabetQuestion");
      }

      if (messageCommand === "/numbertoword") {
        return await this.createQuestion(chatId, "NumberToWordQuestion");
      }

      if (messageCommand === "/wordtonumber") {
        return await this.createQuestion(chatId, "WordToNumberQuestion");
      }

      if (messageCommand === "/about") {
        return await this.botInstance.sendMessage(
          chatId,
          `
Привет!
По всем вопросам, идеям и фидбэку @twiztagram`
        );
      }
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
    logCommand(message);

    const data = message.data;
    const chatId = message.message?.chat.id;
    const activeQuestion = this.questionsStore.getQuestion(chatId);

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
