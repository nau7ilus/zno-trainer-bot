'use strict';

const { send, handleRateLimit } = require('../../helpers');
const Handler = require('../../structures/pieces/Handler');

const caption = nick =>
  `<b>👋 Привет${nick ? `, ${nick}` : ''}! 😉</b>

🔥Анонс 🔥
Уже завтра, 20 марта, состоится первый <b>Интенсив-Онлайн Сессия</b> по <b>Теме: «Тригонометрия»</b> длительностью <b>3 часа 45 мин</b> ⏰

На ИНТЕНСИВЕ:
✅ Получишь разбор всех основных примеров ЗНО, практические материалы, видео запись курса
✅ Научишься пользоваться формулами по тригонометрии
✅ Научишься решать тригонометрические уравнения и строить графики функций (sin, cos)
✅ Поймешь, как легко, без помощи калькулятора находить значения sin, cos, tg, ctg разных углов
✅ Разберемся что такое arcsin, arccos, arctg и arcctg

🧩В каком формате будет проходить?
🧩Как зарегистрироваться? 
-> 💻 Смотри на YouTube - https://youtu.be/5Kg43kHdxBA

🎓Не упусти возможность выучить (повторить) одну из самых сложных тем ЗНО - «Тригонометрия»

❇️ Регистрация - https://secure.wayforpay.com/payment/ZnoMathematicsUA`;

const sendMessage = (ctx, id, nick = '') =>
  ctx.telegram
    .sendPhoto(id, 'https://i.imgur.com/wtmswBc.jpg', {
      caption: caption(nick),
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: [
          [{ text: '📱 Регистрируйся ТУТ', url: 'https://secure.wayforpay.com/payment/ZnoMathematicsUA' }],
        ],
      },
    })
    // eslint-disable-next-line no-empty-function
    .catch(err => {
      if (err.code === 429) handleRateLimit(ctx, err);
      console.error('Не получилось отправить сообщение');
    });

module.exports = class extends Handler {
  constructor(...args) {
    super(...args, {
      name: 'test',
      types: ['command', 'action'],
    });
  }

  async run(ctx, userID) {
    if (!userID || ![546886852, 409482221].includes(ctx.from.id)) return;

    let success = 0;
    for await (const user of ctx.users) {
      // eslint-disable-next-line no-empty-function
      const data = (await ctx.telegram.getChat(user.id).catch(() => {})) || {};
      await sendMessage(ctx, user.id, data.first_name);
      console.log('Отправлено сообщение', user.id);
      success += 1;
    }
    send(ctx, `Отправлено успешно ${success} сообщений`);
  }
};
