'use strict';

const { join, resolve } = require('path');
const Collection = require('@discordjs/collection');
const { Telegraf } = require('telegraf');

const TelegrafI18n = require('telegraf-i18n');
const LocalSession = require('telegraf-session-local');

const HandlerStore = require('./stores/HandlerStore');
const MiddlewareStore = require('./stores/MiddlewareStore');
const UpdateStore = require('./stores/UpdateStore');

const i18n = new TelegrafI18n({
  useSession: true,
  defaultLanguage: 'uk',
  defaultLanguageOnMissing: true,
  directory: resolve(__dirname, '../locales'),
  templateData: {
    pluralize: TelegrafI18n.pluralize,
  },
});

module.exports = class Client extends Telegraf {
  constructor(options) {
    super(options);
    this.stores = new Collection();

    this.middlewares = new MiddlewareStore(this);
    this.handlers = new HandlerStore(this);
    this.events = new UpdateStore(this);

    this.registerStore(this.middlewares);
    this.registerStore(this.handlers);
    this.registerStore(this.events);

    const pieceDirectory = join(__dirname, '../');
    for (const store of this.stores.values()) store.registerPieceDirectory(pieceDirectory);

    console.log(`[Client] Начинается авторизация клиента`);

    this.use(new LocalSession({ database: 'sessions.json' }).middleware());
    this.use(i18n.middleware());

    this.context.client = this;
    this.login();
  }

  registerStore(store) {
    this.stores.set(store.names[0], store);
    return this;
  }

  async login(token) {
    const loaded = await Promise.all(
      this.stores.map(async store => `[Loader] Загружено ${await store.loadAll()} ${store.names[1]}.`),
    ).catch(err => {
      console.error(err);
      process.exit();
    });
    console.log(loaded.join('\n'));

    this.clearUpdates();
    super.startPolling(token);
    console.log('[Client] Бот успешно запущен.\n');

    return this;
  }

  clearUpdates() {
    return this.telegram
      .getUpdates(0, 100, -1)
      .then(updates =>
        updates.length > 0 ? this.telegram.getUpdates(0, 100, updates[updates.length - 1].update_id + 1) : [],
      );
  }

  isDev(id) {
    return this.developers.includes(id);
  }
};
