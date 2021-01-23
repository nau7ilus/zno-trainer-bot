'use strict';

const cachegoose = require('cachegoose');
const mongoose = require('mongoose');

const initPlugins = () => {
  cachegoose(mongoose);
};

module.exports = cb => {
  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  };

  mongoose.connect(process.env.DB_URL, options, cb);
  initPlugins();
};
