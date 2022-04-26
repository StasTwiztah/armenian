import { InlineKeyboardMarkup } from "node-telegram-bot-api";

export interface IQuestion {
  question: string;
  answer: Set<string>;
  questionText: string;
  questionContent?: string;
  answerText: string;
}
