'use strict';

const formatInt = int =>
  int
    .toString()
    .split('')
    .reverse()
    .join('')
    .match(/[0-9]{1,3}/g)
    .join('.')
    .split('')
    .reverse()
    .join('');

const mainMenu = i18n => [
  [{ text: i18n.t('menus.main.startGame'), callback_data: 'create::false' }],
  [
    { text: i18n.t('menus.main.profile'), callback_data: 'router::profile' },
    { text: i18n.t('menus.main.rating'), callback_data: 'router::rating' },
  ],
  [{ text: i18n.t('menus.main.settings'), callback_data: 'router::settings' }],
];

const settingsMenu = i18n => [
  [{ text: i18n.t('menus.settings.dropStats.title'), callback_data: 'router::drop' }],
  [
    { text: i18n.t('menus.settings.setLanguage'), callback_data: 'router::languages' },
    { text: i18n.t('menus.settings.incognito.title'), callback_data: 'router::incognito' },
  ],
  [{ text: i18n.t('menus.main.back'), callback_data: 'router::main' }],
];

const languagesMenu = [
  [{ text: '🇷🇺 Русский', callback_data: 'language::ru' }],
  [{ text: '🇺🇦 Українська', callback_data: 'language::uk' }],
];

const alphabet = ['А', 'Б', 'В', 'Г', 'Д', 'Е', 'Є', 'Ж', 'З'];

/**
 * BUG: Если экспортировать ./ratingMarkup, не получится
 * использовать утилиты из этого файла
 */

module.exports = {
  alphabet,
  mainMenu,
  languagesMenu,
  settingsMenu,
  skipTask: require('./skipTask'),
  updateDatabase: require('./updateDatabase'),
  getUserStats: require('./getUserStats'),
  checkIncognito: require('./checkIncognito'),
  formatInt,
};
