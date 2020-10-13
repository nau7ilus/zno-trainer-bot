'use strict';

const Extra = require('telegraf/extra');
const ratingMarkup = require('../../helpers/ratingMarkup');

module.exports = () => async ({ i18n, message, replyWithHTML, telegram }) => {
  try {
    replyWithHTML(
      i18n.t('rating.markup', await ratingMarkup({ telegram, i18n }, message.from.id)),
      Extra.markup(m =>
        m.inlineKeyboard([[{ text: i18n.t('menus.main.back'), callback_data: 'router::main' }]]),
      ),
    );
  } catch (err) {
    replyWithHTML(i18n.t('errors.unknown'));
    console.error(
      `[%s] Произошла ошибка при использовании команды rating. | UserID: %d`,
      new Date().toTimeString(),
      message.from.id,
      err,
    );
  }
};
