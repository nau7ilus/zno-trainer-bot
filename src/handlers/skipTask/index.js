'use strict';

const Extra = require('telegraf/extra');
const { skipTask } = require('../../helpers');

module.exports = () => async ({ i18n, message, replyWithHTML, session }) => {
  try {
    const phrase = await skipTask(message.from.id, session);
    replyWithHTML(
      i18n.t(phrase),
      Extra.markup(m =>
        m.inlineKeyboard([
          [{ text: i18n.t('menus.main.back'), callback_data: 'router::main' }],
          [{ text: i18n.t('tasks.next'), callback_data: 'create::true' }],
        ]),
      ),
    );
  } catch (err) {
    replyWithHTML(i18n.t('errors.unknown'));
    console.error(
      `[%s] Произошла ошибка при использовании команды skip. | UserID: %d`,
      new Date().toTimeString(),
      message.from.id,
      err,
    );
  }
};
