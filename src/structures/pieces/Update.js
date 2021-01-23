'use strict';

const Piece = require('../base/Piece');

module.exports = class Update extends Piece {
  constructor(store, directory, file, options) {
    super(store, directory, file, options);
    this.type = options.type;
    this.name = options.update;
  }

  run() {
    throw new Error(`Функция на запуск ивента ${this.name}не указана`);
  }
};
