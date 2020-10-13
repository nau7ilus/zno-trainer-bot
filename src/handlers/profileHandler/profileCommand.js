'use strict';

const Extra = require('telegraf/extra');
const { getUserStats } = require('../../helpers');

module.exports = () => async ({ i18n, message, replyWithHTML }) => {
  try {
    replyWithHTML(
      i18n.t('profile.stats', await getUserStats(message.from.id)),
      Extra.markup(m =>
        m.inlineKeyboard([[{ text: i18n.t('menus.main.back'), callback_data: 'router::main' }]]),
      ),
    );
  } catch (err) {
    replyWithHTML(i18n.t('errors.unknown'));
    console.error(
      `[%s] Произошла ошибка при использовании команды profile. | UserID: %d`,
      new Date().toTimeString(),
      message.from.id,
      err,
    );
  }
};
