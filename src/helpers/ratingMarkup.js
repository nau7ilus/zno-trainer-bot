/* eslint-disable newline-per-chained-call */
'use strict';

const { formatInt, getUserStats } = require('./index');
const User = require('../models/User');

module.exports = async ({ telegram, i18n }, userID) => {
  // Ищем пользователей и фильтруем сразу в запросе
  const users = await User.find().sort('-points').limit(10).cache(3);
  if (!users) throw new Error('Не найдено ни одного пользователя');

  // Создаем строку с готовым рейтингом и инфой о текущем пользователе
  const rating = [];
  const userInfo = [];

  for await (const [i, user] of users.entries()) {
    // Начинаем поиск чата пользователя с ботом, чтобы получить его username
    // Если чата нет, указываем пользователя, как неизвестного
    const { points, answers, id, askedQuestions, incognito } = user;
    const { first_name: firstName } = await telegram.getChat(id);
    const userName = firstName && !incognito ? firstName : i18n.t('rating.incognito');
    const formattedPoints = formatInt(points);
    const rightAnswersPercent = ((answers / askedQuestions) * 100).toFixed(1);
    const userRatingData = `<b>${i + 1}. ${userName} — ${
      isNaN(formattedPoints) ? 0 : formattedPoints
    } | ${isNaN(rightAnswersPercent) ? 0 : rightAnswersPercent}%</b>`;

    await rating.push(userRatingData);
    // Если ID юзера на итерации совпадает с ID автора команды, добавляем готовую информацию
    // Чтобы в дальнейшем не делать лишние запросы к БД
    if (id === userID) userInfo.push(userRatingData);
  }

  // Если пользователя не было в рейтинге, запрашиваем статистику
  if (userInfo === 0) {
    const { rightAnswersPercent: userRightAnswers, points, incognito } = await getUserStats(userID);
    const { first_name: firstName } = await telegram.getChat(userID);
    const userName = firstName && incognito ? firstName : i18n.t('rating.incognito');
    const formattedPoints = formatInt(points);
    userInfo.push(
      `<b>10+.</b> ${userName} — ${isNaN(formattedPoints) ? 0 : formattedPoints} | ${
        isNaN(userRightAnswers) ? 0 : userRightAnswers
      }%`,
    );
  }

  return { rating, userInfo };
};
