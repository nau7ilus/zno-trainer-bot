const Markup = require("telegraf/markup");
const Extra = require("telegraf/extra");

const { alphabet } = require("./index");

class Table {
  constructor(keyboardBtns, { lang, columns, rows } = { lang: "ua", columns: 5, rows: 3 }) {
    // Добавление в заголовок букв, согласно полученным данным
    // if (alphabet[lang].length < columns) {
    //   throw new Error("Количество колонок превышает количество алфавита");
    // }

    this.rows = keyboardBtns || [];

    // Создание пустой таблицы
    if (!keyboardBtns) {
      // Добавляем буквы сверху
      this.addRow(false, ...alphabet[lang].slice(0, columns));

      // Создаем поле для указанного количества столбиков
      for (let i = 0; i < rows; i++) {
        this.addRow(false, ...new Array(columns).fill(this.DISABLED_CELL));
      }
    }
  }

  get SELECTED_CELL() {
    return "❎";
  }

  get DISABLED_CELL() {
    return " ";
  }

  addRow(checkAns = false, ...rowData) {
    const formattedData = []; // Подумать над названием переменной
    const rowsLength = this.rows.length;

    if (!checkAns) {
      formattedData.push(Markup.callbackButton(!rowsLength ? " " : rowsLength, "blank"));
      rowData.forEach((btnName, i) => {
        formattedData.push(
          Markup.callbackButton(btnName, !rowsLength ? "blank" : this.cbName(i + 1, rowsLength))
        );
      });
    } else {
      formattedData.push(Markup.callbackButton("📚 Проверить ответы", "check_ans"));
    }

    this.rows.push([...formattedData.flat()]);
    return this;
  }

  cbName(x, y) {
    return "table::" + x + "::" + y;
  }

  getColumn(i) {
    const columnItems = new Array();
    this.rows.forEach((row) => {
      if (row[i]) columnItems.push(row[i]);
    });
    return columnItems;
  }

  toJSON() {
    return {
      rows: this.rows,
    };
  }

  toKeyboard() {
    return Extra.markdown().markup(Markup.inlineKeyboard(this.rows));
  }
}

module.exports = Table;
