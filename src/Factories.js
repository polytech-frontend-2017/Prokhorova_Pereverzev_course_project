const uuidv4 = require('uuid/v4');

/**
 * createUser
 * Creates a user.
 * @prop id {string}
 * @prop name {string}
 * @param {object}
 *   name{string}
 */
const createUser = ({ name = '' } = {}) => ({
  id: uuidv4(),
  name
});

/**
 * createVoice
 * Creates a Voice object from pult.
 * @prop id {string}
 * @prop time {Date} the time in 24hr format i.e. 14:22
 * @prop voice {string}
 * @prop sender {string}
 * @param {object}
 *   voice{string}
 *   sender{string}
 */
const createVoice = ({ voice = '', sender = { name: '' } } = {}) => ({
  id: uuidv4(),
  time: getTime(new Date(Date.now())),
  voice,
  name: sender.name
});

/**
 * @param date {Date}
 * @return a string represented in 24hr time i.e. '11:30'
 */
const getTime = date => {
  return `${date.getHours()}:${('0' + date.getMinutes()).slice(-2)}`;
};

module.exports = {
  createUser,
  createVoice: createVoice
};
