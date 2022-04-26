import { InlineKeyboardMarkup } from "node-telegram-bot-api";
import { IQuestion } from "./IQuestion";

export abstract class QuestionBase implements IQuestion {
  type: string;
  replyMarkup?: InlineKeyboardMarkup;

  question: string;
  answer: Set<string>;
  questionText: string;
  questionContent?: string | undefined;
  answerText: string;

  constructor(item: IQuestion) {
    this.type = "super";
    this.question = item.question;
    this.answer = item.answer;
    this.questionText = item.questionText;
    this.answerText = item.answerText;
    this.questionContent = item.questionContent;
  }

  public validateAnswer = (answer: string) =>
    this.answer.has(answer.trim().toLowerCase());
}
