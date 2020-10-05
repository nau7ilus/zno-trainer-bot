const { mainMenu } = require("../../helpers");
const User = require("../../models/User");

module.exports = () => async (ctx) => {
  try {
    // Поиск пользователя в базе данных
    const user = await User.findOne({ id: ctx.session.id }).cache();
    if (!user) {
      await User.create({ id: ctx.session.id });
    }
    await ctx.replyWithMarkdown("Добро пожаловать", {
      reply_markup: { inline_keyboard: mainMenu },
    });
  } catch (err) {
    ctx.replyWithHTML(
      "<b><code>[⚠️ | Ошибка]</code>\nПроизошла неизвестная ошибка при отправке сообщения." +
        "Попробуйте еще раз. Если ошибка не пропала, свяжитесь с нами. /feedback</b>"
    );

    console.error(`[%s] Произошла ошибка при создании таблицы.`, new Date().toTimeString(), err);
  }
};
