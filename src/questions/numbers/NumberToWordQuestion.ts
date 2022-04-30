import { Buttons } from "../../const/buttons";
import { QuestionBase } from "../../types/QuestionBase";
import { numberToWord } from "./numberToWord";

const getRandomNumber = () =>
  numberToWord[Math.floor(Math.random() * numberToWord.length)];

export class NumberToWordQuestion extends QuestionBase {
  constructor() {
    super(getRandomNumber());

    this.type = "NumberToWordQuestion";

    this.replyMarkup = {
      inline_keyboard: [
        [Buttons.shownumbers, Buttons.getanswer, Buttons.stoplesson],
      ],
    };
  }
}
