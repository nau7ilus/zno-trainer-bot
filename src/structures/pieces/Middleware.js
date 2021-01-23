'use strict';

const Piece = require('../base/Piece');

module.exports = class Middleware extends Piece {
  constructor(store, file, directory, options = {}) {
    super(store, file, directory, options);
    this.name = options.name;
  }

  run() {
    throw new Error(`Функция на запуск команды ${this.name}не указана`);
  }
};
