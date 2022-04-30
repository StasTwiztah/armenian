import TelegramBot from "node-telegram-bot-api";
import { getUserMessageCommands } from "./commands/MessageCommands";

export const createTelegramBot = () => {
  const telegramBot = new TelegramBot(
    "5130108766:AAG9xfpWV38xWMimwlnF6OR6Et1YbHeOzpE",
    {
      polling: true,
    }
  );

  telegramBot.setMyCommands(getUserMessageCommands());

  return telegramBot;
};
