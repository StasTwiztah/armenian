import { QuestionBase } from "../types/QuestionBase";
import { AlphabetQuestion } from "./alphabet/AlphabetQuestion";
import { NumberToWordQuestion } from "./numbers/NumberToWordQuestion";
import { WordToNumberQuestion } from "./numbers/WordToNumberQuestion";

export const questionFactory = (
  questionType:
    | "AlphabetQuestion"
    | "NumberToWordQuestion"
    | "WordToNumberQuestion"
    | string
) => {
  let questionBase: QuestionBase | undefined;

  switch (questionType) {
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

  return questionBase;
};
