import TelegramBot from "node-telegram-bot-api";

const token = "5130108766:AAG9xfpWV38xWMimwlnF6OR6Et1YbHeOzpE";

type Question = { question: string; answer: Set<string> };
const letters: Question[] = [
  { question: "Աա", answer: new Set("а") },
  { question: "Բբ", answer: new Set("б") },
  { question: "Գգ", answer: new Set("г") },
  { question: "Դդ", answer: new Set("д") },
  { question: "Եե", answer: new Set("е") },
  { question: "Զզ", answer: new Set("з") },
  { question: "Էէ", answer: new Set("э") },
  { question: "Ըը", answer: new Set("ы") },
  { question: "Թթ", answer: new Set(["т", "th"]) },
  { question: "Ժժ", answer: new Set("ж") },
  { question: "Իի", answer: new Set("и") },
  { question: "Լլ", answer: new Set("л") },
  { question: "Խխ", answer: new Set("х") },
  { question: "Ծծ", answer: new Set(["ts", "тс"]) },
  { question: "Կկ", answer: new Set("к") },
  { question: "Հհ", answer: new Set("h") },
  { question: "Ձձ", answer: new Set("дз") },
  { question: "Ղղ", answer: new Set("кх") },
  { question: "Ճճ", answer: new Set("тш") },
  { question: "Մմ", answer: new Set("м") },
  { question: "Յյ", answer: new Set("й") },
  { question: "Նն", answer: new Set("н") },
  { question: "Շշ", answer: new Set("ш") },
  { question: "Ոո", answer: new Set(["о", "во"]) },
  { question: "Չչ", answer: new Set("ч") },
  { question: "Պպ", answer: new Set("п") },
  { question: "Ռռ", answer: new Set("р") },
  { question: "Սս", answer: new Set("с") },
  { question: "Վվ", answer: new Set("в") },
  { question: "Տտ", answer: new Set("т") },
  { question: "Րր", answer: new Set("р") },
  { question: "Ցց", answer: new Set("ц") },
  { question: "Ււ", answer: new Set(["у", "ю", "йу"]) },
  { question: "Փփ", answer: new Set("п") },
  { question: "Քք", answer: new Set(["х", "kh"]) },
  { question: "Օօ", answer: new Set("о") },
  { question: "Ֆֆ", answer: new Set("ф") },
  { question: "ու", answer: new Set("у") },
  { question: "և", answer: new Set(["ев", "эв"]) },
];

const lessons: Record<number, Question> = {};
const stopLesson = (chatId: number) => {
  delete lessons?.[chatId];
};

const getRandomLetter = () => {
  return letters[Math.floor(Math.random() * letters.length)];
};

const telegramBot = new TelegramBot(token, { polling: true });
telegramBot.setMyCommands([
  { command: "/start", description: "hi" },
  { command: "/alphabet", description: "Угадай букву армянского алфавита" },
]);

type ButtonCommand = "stopLesson" | "getAnswer";
const buttons: Record<ButtonCommand, any> = {
  stopLesson: { text: "Закончить урок", callback_data: "stopLesson" },
  getAnswer: { text: "Узнать ответ", callback_data: "getAnswer" },
};

const start = () => {
  telegramBot.on("message", (message) => {
    const text = message.text;
    const chatId = message.chat.id;

    const lesson = lessons?.[chatId];

    if (lesson) {
      const inlineKeyboard = {
        reply_markup: {
          inline_keyboard: [[buttons.getAnswer, buttons.stopLesson]],
        },
      };
      if (lesson.answer.has(text?.trim().toLowerCase() || "")) {
        stopLesson(chatId);

        return telegramBot.sendMessage(chatId, "Верно", inlineKeyboard);
      }

      return telegramBot.sendMessage(
        chatId,
        "Неверно, попробуй еще раз",
        inlineKeyboard
      );
    }

    if (text === "/start") {
      return telegramBot.sendMessage(chatId, "hi!");
    }

    if (text === "/alphabet") {
      if (!lessons?.[chatId]) {
        lessons[chatId] = getRandomLetter();
      }

      return telegramBot.sendMessage(chatId, lessons[chatId].question, {
        reply_markup: {
          inline_keyboard: [[buttons.getAnswer, buttons.stopLesson]],
        },
      });
    }

    return telegramBot.sendMessage(chatId, "Неизвестная команда");
  });

  telegramBot.on("callback_query", (message) => {
    const data = message.data;
    const chatId = message.message?.chat.id;

    const command = data as ButtonCommand;

    if (chatId && lessons?.[chatId] && command === "getAnswer") {
      return telegramBot.sendMessage(
        chatId,
        Array.from(lessons[chatId].answer).toString()
      );
    }

    if (chatId && lessons?.[chatId] && command === "stopLesson") {
      stopLesson(chatId);

      return telegramBot.sendMessage(chatId, "Урок окончен :)");
    }

    if (chatId) return telegramBot.sendMessage(chatId, "Нет активных уроков");
  });
};

start();
