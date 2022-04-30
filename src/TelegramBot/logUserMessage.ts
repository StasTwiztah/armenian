import { Message, CallbackQuery } from "node-telegram-bot-api";

export const logMessage = (message: Message) => {
  console.log(`
user ${message?.chat?.first_name} ${message?.chat?.last_name}
message ${message?.text}
`);
};

export const logCommand = (message: CallbackQuery) => {
  console.log(`
user ${message?.from?.first_name} ${message?.from?.last_name}
command ${message?.data}
`);
};
