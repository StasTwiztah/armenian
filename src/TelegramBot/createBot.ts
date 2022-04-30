import TelegramBot from "node-telegram-bot-api";

export const createTelegramBot = () => {
  const telegramBot = new TelegramBot(
    "5130108766:AAG9xfpWV38xWMimwlnF6OR6Et1YbHeOzpE",
    {
      polling: true,
    }
  );

  telegramBot.setMyCommands([
    {
      command: "/start",
      description: "Start",
    },
    { command: "/alphabet", description: "Угадай букву армянского алфавита" },
    {
      command: "/number_to_word",
      description: "Назови цифру. Можно отвечать и по-русски, и по-армянски",
    },
    {
      command: "/word_to_number",
      description: "Переведи цифру",
    },
  ]);

  return telegramBot;
};
