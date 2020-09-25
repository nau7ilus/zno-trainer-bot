module.exports = () => [
  "blank",
  async (ctx) => {
    return ctx.answerCbQuery("Это ничего не делает");
  },
];
