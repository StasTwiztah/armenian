import TelegramBot, { CallbackQuery, Message } from "node-telegram-bot-api";
import { questionFactory } from "../questions/questionFactory";
import { QuestionsStore } from "../questions/QuestionsStore";
import {
  getUserMessageCommands,
  MessageCommand,
} from "./commands/MessageCommands";
import { logCommand, logMessage } from "./logUserMessage";
import { t } from "i18next";
import { ButtonCommand } from "../const/Buttons";

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
      return this.botInstance.sendMessage(chatId, t("error"));
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
          getAvailableCommandsMessage()
        );
      }

      if (messageCommand === "/commands") {
        return this.botInstance.sendMessage(
          chatId,
          getAvailableCommandsMessage()
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
        return await this.botInstance.sendMessage(chatId, t("about"));
      }
    }

    if (activeQuestion && text) {
      return this.questionsStore.handleAnswer(
        chatId,
        text,
        async () => {
          await this.botInstance.sendMessage(
            chatId,
            t("answer-correct", { description: activeQuestion.answerText })
          );
          return await this.createQuestion(chatId, activeQuestion.type);
        },
        async () => {
          await this.botInstance.sendMessage(
            chatId,
            t("answer-incorrect", { description: activeQuestion.answerText })
          );
          return await this.createQuestion(chatId, activeQuestion.type);
        },
        async () => {
          return await this.botInstance.sendMessage(
            chatId,
            t("no-active-lessons")
          );
        }
      );
    }

    return this.botInstance.sendMessage(chatId, t("unknown-command"));
  };

  public handleCommand = async (message: CallbackQuery) => {
    logCommand(message);

    const data = message.data;
    const chatId = message.message?.chat.id;
    const activeQuestion = this.questionsStore.getQuestion(chatId);

    const command = data as ButtonCommand;
    if (chatId) {
      if (activeQuestion && command === "getanswer") {
        await this.botInstance.sendMessage(chatId, activeQuestion.answerText);
        return await this.createQuestion(chatId, activeQuestion.type);
      }

      if (activeQuestion && command === "stoplesson") {
        this.questionsStore.deleteQuestion(chatId);

        return this.botInstance.sendMessage(chatId, t("lesson-ended"));
      }

      if (command === "showalphabet") {
        return this.botInstance.sendPhoto(chatId, t("alphabet-link"));
      }

      if (command === "shownumbers") {
        return this.botInstance.sendMessage(chatId, t("numbers"));
      }
    }

    if (chatId)
      return this.botInstance.sendMessage(chatId, t("no-active-lessons"));
  };
}

const getAvailableCommandsMessage = () =>
  t("available-commands", {
    commands: getUserMessageCommands()
      .map(({ command, description }) => `${command}: ${description}`)
      .join("\n"),
  });
