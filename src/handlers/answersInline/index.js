const Extra = require("telegraf/extra");
const Table = require("../../helpers/table");

const answers = ["table::1::1", "table::2::2", "table::4::3"];

module.exports = () => [
  "check_ans",
  async (ctx) => {
    ctx.answerCbQuery("📚 Ответы на тест 23:\n  - 1A\n  - 2Б\n  - 3Г", true);
    ctx.reply(
      "Правильно - Вот балл получи",
      Extra.HTML().markup((m) =>
        m.inlineKeyboard([m.callbackButton("Загрузить новый тест", "create_table")])
      )
    );
  },
];
