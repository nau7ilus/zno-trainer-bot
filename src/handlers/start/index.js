'use strict';

const { mainMenu, languagesMenu } = require('../../helpers');
const User = require('../../models/User');

module.exports = () => async ({ i18n, message, replyWithHTML }) => {
  try {
    // Ищем пользователя в базе данных
    const user = await User.findOne({ id: message.from.id }).cache();
    if (!user) {
      // Если пользователя нет в базе данных, создаем его
      await User.create({ id: message.from.id });

      // Спрашиваем, какой язык использовать
      replyWithHTML(i18n.t('greeting.firstTime'), {
        reply_markup: { inline_keyboard: languagesMenu },
      });
    } else {
      // Иначе отправляем простое приветствие с главным меню
      replyWithHTML(i18n.t('greeting.other'), {
        reply_markup: { inline_keyboard: mainMenu(i18n) },
      });
    }
  } catch (err) {
    replyWithHTML(i18n.t('errors.unknown'));
    console.error(
      `[%s] Произошла ошибка при использовании команды start. | UserID: %d`,
      new Date().toTimeString(),
      message.from.id,
      err,
    );
  }
};
