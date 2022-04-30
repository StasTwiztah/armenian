import { BotCommand } from "node-telegram-bot-api";

export const MessageCommands = {
  ["/start"]: "Надо с чего-то начать",
  ["/alphabet"]: "Прочитай букву армянского алфавита",
  ["/numbertoword"]:
    "Назови цифру текстом. Можно отвечать и по-русски, и по-армянски",
  ["/wordtonumber"]: "Назови цифру",
  ["/about"]: "Описание",
};

export type MessageCommand = keyof typeof MessageCommands;

export const getAllCommands: () => BotCommand[] = () =>
  Object.entries(MessageCommands).map(([command, description]) => ({
    command,
    description,
  }));

export const getUserCommands: () => BotCommand[] = () =>
  Object.entries(MessageCommands)
    .filter(([command]) => command !== "/start")
    .map(([command, description]) => ({
      command,
      description,
    }));
