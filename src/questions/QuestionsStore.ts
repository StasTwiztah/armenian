import { AlphabetQuestion } from "./alphabet/AlphabetQuestion";

export class QuestionsStore {
  private questions: Record<number, AlphabetQuestion>;

  constructor() {
    this.questions = {};
  }

  public setQuestion = (chatId: number, question: AlphabetQuestion) => {
    this.questions[chatId] = question;
    return this.questions[chatId];
  };

  public getQuestion = (chatId?: number) => {
    if (!chatId) return undefined;
    return this.questions?.[chatId];
  };

  public deleteQuestion = (chatId: number) => {
    delete this.questions?.[chatId];
  };

  public handleAnswer = async (
    chatId: number,
    answer: string,
    onCorrect: () => void,
    onIncorrect: () => void,
    onError: () => void
  ) => {
    const question = this.questions?.[chatId];

    if (!question) {
      return onError();
    }

    if (question.validateAnswer(answer)) {
      return onCorrect();
    }

    return onIncorrect();
  };
}
