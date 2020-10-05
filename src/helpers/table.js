const Markup = require("telegraf/markup");
const Extra = require("telegraf/extra");

const { alphabet } = require("./index");

class Table {
  constructor(keyboardBtns, { columns, rows } = { columns: 5, rows: 3 }) {
    this.rows = keyboardBtns || [];

    // Создание пустой таблицы
    if (!keyboardBtns) {
      // Добавляем буквы сверху
      this.addRow(false, ...alphabet.slice(0, columns));

      // Создаем поле для указанного количества столбиков
      for (let i = 0; i < rows; i++) {
        this.addRow(false, ...new Array(columns).fill(this.DISABLED_CELL));
      }
    }
  }

  get TRUE_CELL() {
    return "❎";
  }

  get FALSE_CELL() {
    return "❌";
  }

  get NULL_CELL() {
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

  select(x, y) {
    const selectedCell = this.rows[x].find((btn) => btn.text.includes(this.TRUE_CELL));
    if (selectedCell) selectedCell.text = this.NULL_CELL;
    this.rows[x][y].text = this.TRUE_CELL;
    return this;
  }

  getColumn(i) {
    const columnItems = new Array();
    this.rows.forEach((row) => {
      if (row[i]) columnItems.push(row[i]);
    });
    return columnItems;
  }

  toKeyboard() {
    return Extra.markdown().markup(Markup.inlineKeyboard(this.rows));
  }
}

module.exports = Table;
