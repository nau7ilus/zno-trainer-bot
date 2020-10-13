'use strict';

const Extra = require('telegraf/extra');

module.exports = () => [
  /^language(?:::(\w+))?$/,
  ({ i18n, match, editMessageText }) => {
    i18n.locale(match[1]);
    editMessageText(
      i18n.t('languages.success'),
      Extra.HTML().markup(m =>
        m.inlineKeyboard([
          [m.callbackButton(i18n.t('menus.main.back'), 'router::main')],
          [m.callbackButton(i18n.t('menus.settings.back'), 'router::settings')],
        ]),
      ),
    );
  },
];
