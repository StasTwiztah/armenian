import "dotenv/config";
import express from "express";
import router from "./router";
import { ping } from "./utils/ping";
import { createTelegramBot } from "./TelegramBot/createBot";
import TelegramBotApiHandler from "./TelegramBot/TelegramBotApiHandler";

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

  setInterval(ping, 10 * 60 * 1000);
};

try {
  start();
} catch (error: any) {
  console.log(error?.message);
}
