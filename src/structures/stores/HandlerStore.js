'use strict';

const { join } = require('path');
const Store = require('../base/Store');
const Handler = require('../pieces/Handler');

module.exports = class HandlerStore extends Store {
  constructor(client) {
    super(client, ['handlers', 'хендлеров'], Handler);
  }

  load(directory, file) {
    const fileLocation = join(directory, file);
    let storedPiece = null;
    try {
      const Piece = require(fileLocation);
      storedPiece = new Piece(this, file, directory);
      if (!storedPiece.types) throw new Error('Не указан тип команды');
      if (storedPiece.types.includes('middleware')) {
        this.client.use(storedPiece.run.bind());
      } else {
        storedPiece.types.forEach(type => {
          this.client[type](storedPiece.name, storedPiece.run.bind());
        });
      }

      this.set(storedPiece);
    } catch (err) {
      console.error(err.message);
    }
    return storedPiece;
  }
};
