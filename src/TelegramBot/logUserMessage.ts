import { Message, CallbackQuery } from "node-telegram-bot-api";

export const logUserMessage = (message: Message | CallbackQuery) => {
  if (message as Message) {
    const log = message as Message;
    console.log(`
user ${log.chat.first_name} ${log.chat.last_name}
message ${log.text}
`);
  }

  if (message as CallbackQuery) {
    const log = message as CallbackQuery;
    console.log(`
user ${log.from.first_name} ${log.from.last_name}
command ${log.data}
`);
  }
};
