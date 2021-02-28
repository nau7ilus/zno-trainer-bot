'use strict';

const Piece = require('../base/Piece');

module.exports = class Scene extends Piece {
  constructor(store, directory, file, options) {
    super(store, directory, file, options);
    this.name = options.name;
  }

  run() {
    throw new Error(`Функция на запуск ивента ${this.name}не указана`);
  }
};
