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

const mainMenu = ctx => [
  [{ text: ctx.i18n.t('menus.start.startGame'), callback_data: 'select::subject' }],
  [
    { text: ctx.i18n.t('menus.start.profile'), callback_data: 'profile' },
    { text: ctx.i18n.t('menus.start.rating'), callback_data: 'rating' },
  ],
  [{ text: ctx.i18n.t('menus.start.settings'), callback_data: 'settings' }],
];

const settingsMenu = ctx => [
  [{ text: ctx.i18n.t('menus.settings.dropStats.title'), callback_data: 'dropstats' }],
  [
    { text: ctx.i18n.t('menus.settings.setLanguage'), callback_data: 'language' },
    { text: ctx.i18n.t('menus.settings.incognito.title'), callback_data: 'incognito' },
  ],
];

const selectSubject = ctx => [
  [
    {
      text: ctx.i18n.t('select.subjects.total'),
      callback_data: 'startGame::total',
    },
  ],
  [
    {
      text: ctx.i18n.t('select.subjects.algebra'),
      callback_data: 'select::types::algebra',
    },
    {
      text: ctx.i18n.t('select.subjects.geometry'),
      callback_data: 'select::types::geometry',
    },
  ],
];

const selectTypes = (ctx, subject) => [
  [
    {
      text: ctx.i18n.t('select.types.competition'),
      callback_data: `startGame::${subject}`,
    },
    {
      text: ctx.i18n.t('select.types.training'),
      callback_data: `select::themes::${subject}`,
    },
  ],
];

const languagesMenu = [
  [{ text: '🇷🇺 Русский', callback_data: 'language::ru' }],
  [{ text: '🇺🇦 Українська', callback_data: 'language::uk' }],
];

const nextTaskKeyboard = ctx => ({
  reply_markup: {
    inline_keyboard: [
      [
        {
          text: ctx.i18n.t('tasks.getExplanation.btnName'),
          callback_data: `getExplanation::${ctx.session.currentTask.id}`,
        },
        {
          text: ctx.i18n.t('tasks.next'),
          callback_data: `startGame::${ctx.session.lobby}${
            ctx.session?.taskTag ? `::${ctx.session.taskTag.join('::')}` : ''
          }`,
        },
      ],
      [
        {
          text: ctx.session.backBtn
            ? ctx.i18n.t(`menus.${ctx.session.backBtn.split('::').slice(0, 3).join('::')}.back`)
            : ctx.i18n.t('menus.start.back'),
          callback_data: ctx.session.backBtn ?? 'start',
        },
      ],
    ],
  },
});

const backButton = (ctx, cb) => [{ text: ctx.i18n.t(`menus.${cb}.back`), callback_data: cb }];

const alphabet = ['А', 'Б', 'В', 'Г', 'Д', 'Е', 'Є', 'Ж', 'З'];

const send = async (ctx, content, keyboard) => {
  const markup = { reply_markup: { inline_keyboard: keyboard }, parse_mode: 'HTML' };

  try {
    const hasPhoto = ctx.update?.callback_query?.message?.photo;
    if (ctx.message || hasPhoto) {
      if (hasPhoto) await ctx.editMessageReplyMarkup();
      await ctx.replyWithHTML(content, markup);
    } else {
      await ctx.answerCbQuery();
      await ctx.editMessageText(content, markup);
    }
  } catch (err) {
    if (err.message.includes('message is not modified')) return;
    console.error(err);
  }
};

// Это выглядит страшно. Я бы переписал...
// Эта функция просто делает объект тем с переводом под текущий язык
const getThemes = ctx =>
  Object.fromEntries(
    Array.from(
      [
        [
          'algebra',
          [new Array(4), new Array(5), new Array(6), new Array(2)].map(el => Array.from(el, (x, i) => i + 1)),
        ],
        ['geometry', [new Array(7), new Array(5)].map(el => Array.from(el, (x, i) => i + 1))],
      ],
      k => [
        k[0],
        Object.fromEntries(
          k[1].map((el, i) => [
            ctx.i18n.t(`themes.${k[0]}.${i}.0`),
            el.map(j => ctx.i18n.t(`themes.${k[0]}.${i}.${j}`)),
          ]),
        ),
      ],
    ),
  );

module.exports = {
  alphabet,
  mainMenu,
  languagesMenu,
  selectSubject,
  selectTypes,
  send,
  backButton,
  settingsMenu,
  updateDatabase: require('./updateDatabase'),
  formatInt,
  getThemes,
  nextTaskKeyboard,
};
