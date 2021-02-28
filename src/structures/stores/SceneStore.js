'use strict';

const Store = require('../base/Store');
const Scene = require('../pieces/Scene');

module.exports = class SceneStore extends Store {
  constructor(client) {
    super(client, ['scenes', 'сцен'], Scene);
  }
};
