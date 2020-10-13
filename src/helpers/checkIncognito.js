'use strict';

const User = require('../models/User');

module.exports = async userID => {
  // Ищем пользователя в базе данных
  const user = await User.findOne({ id: userID });
  if (!user) throw new Error('Нет пользователя');

  return user.incognito;
};
