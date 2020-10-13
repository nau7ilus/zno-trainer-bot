'use strict';

const User = require('../models/User');

module.exports = async (userID, session) => {
  // Если нет задания, пишем об этом
  if (!session.task) return 'tasks.skip.error';

  // Ищем пользователя в базе данных
  const user = await User.findOne({ id: userID });
  if (!user) throw new Error('Нет пользователя');

  // Считаем пропущенное задание
  user.askedQuestions += 1;
  await user.save();

  session.task = null;
  session.askedAt = null;

  return 'tasks.skip.success';
};
