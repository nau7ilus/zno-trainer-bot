'use strict';

const { stringify } = require('querystring');
const axios = require('axios');
const cheerio = require('cheerio');

const Task = require('../models/Task');

module.exports = async () => {
  const testIDs = await getTestIDs();

  testIDs.forEach(async testID => {
    const fetchedAnswers = replaceNames(await fetchAnswers(testID));
    const $ = cheerio.load(fetchedAnswers);

    for (let i = 1; i < 24; i++) {
      // eslint-disable-next-line no-await-in-loop
      const parsedTask = await parseTask(findTask($, i));

      const taskType = getTaskType(findTask($, i));
      if (!taskType) return;

      const photoURL = getPhotoURL(findTask($, i));
      if (!photoURL) throw new Error('Вы облажались: нет фотки');

      let answers = null;

      if (taskType === 'simple') {
        answers = parsedTask.indexOf('true');
      } else if (taskType === 'table') {
        const tableAnswers = [];
        parsedTask.forEach((el, j) => tableAnswers.push([j + 1, el.indexOf('true')]));
        answers = tableAnswers;
      }
      try {
        Task.create({ type: taskType, photoURL, answers, ids: { test: testID, task: i } });
      } catch (err) {
        console.error(err);
      }
    }
  });
};

function getPhotoURL($) {
  return `https://zno.osvita.ua${$.find('.question').find('img')[0].attribs.src}`;
}

function getTaskType($) {
  let taskType = $.find('.description').children('a');
  if (taskType[0].children[0].data.startsWith('Дивитись')) taskType = taskType[1].children[0].data;
  else taskType = taskType[0].children[0].data;
  if (taskType === 'Завдання з вибором однієї правильної відповіді') return 'simple';
  else if (taskType === 'Завдання на встановлення відповідності (логічні пари)') return 'table';
  else return null;
}

async function getTestIDs() {
  const res = await axios.get('https://zno.osvita.ua/mathematics');
  const isSuccess = res.status && res.status === 200 && res.data;
  if (!isSuccess) throw new Error('Вы облажались: getTestIDs');

  const matchedData = res.data
    .match(/<a href="\/mathematics\/([0-9]{3})/gi)
    .map(el => el.split('<a href="/mathematics/')[1]);
  return matchedData;
}

async function fetchAnswers(testID) {
  const res = await axios.post(
    'https://zno.osvita.ua/users/znotest/',
    stringify({
      do: 'send_all_serdata',
      znotest: testID,
    }),
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    },
  );
  const isSuccess = res.status && res.status === 200 && res.data && res.data.ok;
  if (!isSuccess) throw new Error('Вы облажались: fetchAnswers');
  return res.data.result.quest;
}

function replaceNames(html) {
  return html
    .replace(new RegExp('<label><span class="marker"></span></label>', 'gi'), 'false')
    .replace(new RegExp('<label><span class="marker ok"></span></label>', 'gi'), 'true');
}

function findTask($, id) {
  return $(`#q${id}`);
}

function parseTask($) {
  const answers = [];
  $.find('table.select-answers-variants')
    .find('tr')
    .each((i, el) => {
      answers.push(
        el.children
          .filter(j => ['th', 'td'].includes(j.name))
          .map(j => (j.children[0] ? j.children[0].data : ''), '\n'),
      );
    });

  return answers.slice(1).length === 1 ? answers.slice(1)[0] : answers.slice(1);
}
