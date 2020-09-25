const Table = require("../../helpers/table");

module.exports = () => [
  /^table(?:::(\w+))?(?:::(\w+))?$/,
  async (ctx) => {
    const ctxTable = ctx.update.callback_query.message.reply_markup.inline_keyboard;
    const table = new Table(ctxTable);

    const selectedColumn = table.getColumn(ctx.match[1]);
    const selectedCell = selectedColumn.find((btn) => btn.text.includes(table.SELECTED_CELL));
    if (selectedCell) selectedCell.text = table.DISABLED_CELL;
    table.rows[ctx.match[2]][ctx.match[1]].text = table.SELECTED_CELL;

    const tableToKeyboard = table.toKeyboard();
    if (ctxTable === tableToKeyboard) return;
    ctx.editMessageText(ctx.update.callback_query.message.text, table.toKeyboard());
  },
];
