'use strict';

const { send, handleRateLimit } = require('../../helpers');
const Handler = require('../../structures/pieces/Handler');

const caption = () =>
  `👋 Привіт, дякую, що ти з нами ⭐️

📅 До ЗНО-2021 з математики залишилось <b>менше 55 днів</b>

Ми продовжуємо серію Онлайн-Інтенсивів, щоб підсилити тебе 📚📈

✅ Третій Онлайн-Інтенсив відбудеться вже завтра, 4-го квітня 2021 року:

📗Тема №3: <b>«Показникова і Логарифмічна функція, їх вирази та рівняння»</b>

На якій ти дізнаєшся:
🧩 про <b>поняття степеневих функцій</b>
🧩 про <b>поняття показникових та логарифмічних виразів, які формули тобі потрібно знати та як ними користуватися?</b>
🧩 як <b>побудувати графіки показникової та логарифмічної функції та чим вони відрізняються?</b>
🧩 як <b>розв'язувати показникові, логарифмічні рівняння та нерівності?</b>
 
⏳Тривалість сесії: 3год 45хв
 • Перша частина 1.5год
 • Друга частина 1.5год
 • 💬Запитання, відповіді 45хв
 
🗓Дата: 04.04.21 (Нд)
⏰Час: 14:00-17:45
💻Місце: Discord-сервер (online трансляція)
👨🏻‍🏫Викладач: @mwell7

Саме зараз час підтягнути:
<b>📚 Теорію</b> і <b>📐 Практику</b>`;

const sendMessage = (ctx, id, nick = '') =>
  ctx.telegram
    .sendPhoto(id, 'https://i.imgur.com/scfO3fS.jpg', {
      caption: caption(),
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: [
          [{ text: '📱 Регистрируйся ТУТ', url: 'https://secure.wayforpay.com/payment/ZnoMathematicsUA3' }],
        ],
      },
    })
    // eslint-disable-next-line consistent-return
    .catch(err => {
      if (err.code === 429) return handleRateLimit(ctx, err);
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
