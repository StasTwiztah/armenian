import { InlineKeyboardMarkup } from "node-telegram-bot-api";
import { Buttons } from "../../const/buttons";
import { QuestionBase } from "../../types/QuestionBase";
import { letters } from "./letters";

const getRandomLetter = () => {
  return letters[Math.floor(Math.random() * letters.length)];
};

export class AlphabetQuestion extends QuestionBase {
  public replyMarkup: InlineKeyboardMarkup;

  constructor() {
    super(getRandomLetter());

    this.type = "AlphabetQuestion";

    this.replyMarkup = {
      inline_keyboard: [
        [Buttons.showalphabet, Buttons.getanswer, Buttons.stoplesson],
      ],
    };
  }
}
