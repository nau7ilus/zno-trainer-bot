const Extra = require("telegraf/extra");

const Table = require("../../helpers/table");
const Task = require("../../models/Task");

module.exports = () => [
  "send_task",
  async (ctx) => {
    ctx.answerCbQuery();
    try {
      // Поиск рандомного задания
      const docsCount = await Task.countDocuments();
      const randomTask = await Task.findOne()
        .where("_id")
        .nin(ctx.session.alreadyAsked || [])
        .skip(Math.floor(Math.random() * docsCount))
        .cache();

      if (!randomTask) {
        return ctx.replyWithHTML(
          "<b><code>[⚠️ | Ошибка]</code>\nПроизошла ошибка при поиске новой задачи." +
            "Попробуйте еще раз. Если ошибка не пропала, свяжитесь с нами. /feedback</b>"
        );
      }

      ctx.session.task = randomTask;
      if (!ctx.session.alreadyAsked) ctx.session.alreadyAsked = [];
      ctx.session.alreadyAsked.push(randomTask._id);

      if (randomTask.type === "table") {
        const table = new Table(null, {
          columns: 5,
          rows: randomTask.answers.length,
        }).addRow(true);

        ctx.replyWithPhoto(randomTask.photoURL, table.toKeyboard());
      } else if (randomTask.type === "simple") {
        ctx.replyWithPhoto(
          randomTask.photoURL,
          Extra.HTML().markup((m) =>
            m.inlineKeyboard([
              m.callbackButton("А", "simple::a"),
              m.callbackButton("Б", "simple::b"),
              m.callbackButton("В", "simple::c"),
              m.callbackButton("Г", "simple::d"),
              m.callbackButton("Д", "simple::e"),
            ])
          )
        );
      } else ctx.reply("Произошла ошибка при загрузке заданий");
    } catch (err) {
      console.error(`[%s] Произошла ошибка при отправке задания.`, new Date().toTimeString(), err);
    }
  },
];
