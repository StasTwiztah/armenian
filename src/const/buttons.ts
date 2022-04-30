export const Buttons = {
  stoplesson: { text: "Закончить урок", callback_data: "stoplesson" },
  getanswer: { text: "Узнать ответ", callback_data: "getanswer" },
  showalphabet: { text: "Алфавит", callback_data: "showalphabet" },
  shownumbers: { text: "Цифры", callback_data: "shownumbers" },
};

export type ButtonCommand = keyof typeof Buttons;
