import { InlineKeyboardMarkup } from "node-telegram-bot-api";
import { buttons } from "../../const/buttons";
import { Question } from "../../types/Question";
import { letters } from "./letters";

export class AlphabetQuestion {
  public questionItem: Question;
  public replyMarkup: InlineKeyboardMarkup;

  private getRandomLetter = () => {
    return letters[Math.floor(Math.random() * letters.length)];
  };

  constructor() {
    this.questionItem = this.getRandomLetter();
    this.replyMarkup = {
      inline_keyboard: [
        [buttons.showAlphabet, buttons.getAnswer, buttons.stopLesson],
      ],
    };
  }

  public validateAnswer = (answer: string) =>
    this.questionItem.answer.has(answer.trim().toLowerCase());
}
