import { ButtonCommand } from "../types/ButtonCommand";

export const buttons: Record<ButtonCommand, any> = {
  stopLesson: { text: "Закончить урок", callback_data: "stopLesson" },
  getAnswer: { text: "Узнать ответ", callback_data: "getAnswer" },
  showAlphabet: { text: "Алфавит", callback_data: "showAlphabet" },
};
