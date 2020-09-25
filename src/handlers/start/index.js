const { mainMenu } = require("../../helpers");

module.exports = () => async (ctx) => {
  await ctx.replyWithMarkdown("Добро пожаловать", { reply_markup: { inline_keyboard: mainMenu } });
};
