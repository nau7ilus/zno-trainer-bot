'use strict';

const Table = require('../../../helpers/Table');
const Handler = require('../../../structures/pieces/Handler');

module.exports = class extends Handler {
  constructor(...args) {
    super(...args, {
      name: 'sendTableTask',
      types: ['action'],
    });
  }
  run(ctx, task) {
    const table = new Table({
      columns: 5,
      rows: task.answer.length,
    });
    table.rows.push([{ text: ctx.i18n.t('tasks.table.checkAnswers'), callback_data: 'checkTable' }]);

    const photoURL = `${process.env.CDN_URL}/${task.id}/task.png`;
    ctx.replyWithPhoto(photoURL, {
      // Caption: ctx.i18n.t('tasks.table.question'),
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: [...table.rows, [{ text: ctx.i18n.t('tasks.skip.title'), callback_data: 'skip' }]],
      },
    });
  }
};
