import "dotenv/config";
import express from "express";
import router from "./router";
import { ping } from "./utils/ping";
import { createTelegramBot } from "./TelegramBot/createBot";
import TelegramBotApiHandler from "./TelegramBot/TelegramBotApiHandler";
import translate from "./locales/ru/translate.json";
import i18next from "i18next";

if (!translate) {
  throw new Error("There was an error loading the translation files.");
}

i18next.init({
  resources: translate,
  react: {
    useSuspense: false,
  },
  interpolation: {
    escapeValue: false, // not needed for react as it escapes by default
  },
  fallbackLng: "ru",
  debug: false,
});

const application = express();
application.use(express.json());
application.use(router);

const telegramBot = createTelegramBot();
const telegramBotApiHandler = new TelegramBotApiHandler(telegramBot);

const start = async () => {
  telegramBot.on("message", telegramBotApiHandler.handleMessage);
  telegramBot.on("callback_query", telegramBotApiHandler.handleCommand);

  application.listen(process.env.PORT || 5000, () => {
    console.log("app started");
  });

  setInterval(ping, 5 * 60 * 1000);
};

try {
  start();
} catch (error: any) {
  console.log(error?.message);
}
