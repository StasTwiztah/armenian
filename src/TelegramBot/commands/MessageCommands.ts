import { BotCommand } from "node-telegram-bot-api";

export const MessageCommands = {
  ["/start"]: "Надо с чего-то начать",
  ["/commands"]: "Список доступных команд",
  ["/alphabet"]: "Прочитай букву армянского алфавита",
  ["/numbertoword"]:
    "Назови цифру текстом. Можно отвечать и по-русски, и по-армянски",
  ["/wordtonumber"]: "Назови цифру",
  ["/about"]: "Описание",
};

export type MessageCommand = keyof typeof MessageCommands;

export const getAllMessageCommands: () => BotCommand[] = () =>
  Object.entries(MessageCommands).map(([command, description]) => ({
    command,
    description,
  }));

export const getUserMessageCommands: () => BotCommand[] = () =>
  Object.entries(MessageCommands)
    .filter(([command]) => command !== "/start")
    .map(([command, description]) => ({
      command,
      description,
    }));
