import { Buttons } from "../../const/Buttons";
import { QuestionBase } from "../../types/QuestionBase";
import { wordToNumber } from "./wordToNumber";

const getRandomNumber = () =>
  wordToNumber[Math.floor(Math.random() * wordToNumber.length)];

export class WordToNumberQuestion extends QuestionBase {
  constructor() {
    super(getRandomNumber());

    this.type = "WordToNumberQuestion";

    this.replyMarkup = {
      inline_keyboard: [
        [Buttons.shownumbers, Buttons.getanswer, Buttons.stoplesson],
      ],
    };
  }
}
