const Table = require("../../helpers/table");

module.exports = () => [
  "create_table",
  async (ctx) => {
    const table = new Table(null, { lang: "ua", columns: 5, rows: 3 }).addRow(true);
    console.log(table.toKeyboard());
    await ctx.replyWithPhoto({
      url: "https://zno.osvita.ua/doc/images/znotest/199/19967/os-math-2020-23.png",
    });
    ctx.replyWithMarkdown(
      "📙 Бічні сторони AB та CD прямокутної трапеції АBCD дорівнюють 6 см і 10 см відповідно. Менша діагональ трапеції лежить на бісектрисі її прямого кута (див. рисунок). Установіться відповідність між відрізком (1-3) та його довжиною (А-Д)",
      table.toKeyboard()
    );
  },
];
