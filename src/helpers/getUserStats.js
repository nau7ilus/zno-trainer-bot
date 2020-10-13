'use strict';

const User = require('../models/User');

module.exports = async userID => {
  const user = await User.findOne({ id: userID });
  if (!user) throw new Error('Нет пользователя');

  // Считаем информацию о пользователе
  const { answers, askedQuestions, points, incognito } = user;
  const rightAnswersPercent = ((answers / askedQuestions) * 100).toFixed(1);

  return { rightAnswersPercent, points, askedQuestions, incognito };
};
