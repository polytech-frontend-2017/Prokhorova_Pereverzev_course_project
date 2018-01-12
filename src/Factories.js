const uuidv4 = require('uuid/v4');

/**
* createUser
* Creates a user.
* @prop id {string}
* @prop name {string}
* @param {object}
*   name{string}
 */
const createUser = ({name=""}={})=>(
    {
        id:uuidv4(),
        name
    }
);

/**
* createStartVoiting
* Creates a Start Voiting object.
* @prop id {string}
* @prop time {Date} the time in 24hr format i.e. 14:22
* @prop start {bool}
* @prop sender {string}
* @param {object}
*   start{bool}
*   sender{string}
*/
const createStartVoiting = ({start=true, sender=""}={})=>(
    {
        id:uuidv4(),
        time:getTime(new Date(Date.now())),
        start,
        sender,
    }
);

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
const createVoice = ({voice="", sender=""}={})=>(
    {
        id:uuidv4(),
        time:getTime(new Date(Date.now())),
        voice,
        sender,
    }
);

/*
* CreateVoiting
* Creates a Voiting object
* @prop id {string}
* @prop name {string}
* @prop voiting {Array.string}
* @prop users {Array.string}
* @param {object}
*   voiting {Array.string}
*   name {string}
*   users {Array.string}
*/
const CreateVoiting = ({voiting=[],name="Voiting",users=[]}={})=>(
    {
        id:uuidv4(),
        name,
        voiting,
        users,
        typingUsers:[]
    }
);

/**
 * @param date {Date}
 * @return a string represented in 24hr time i.e. '11:30'
 */
const getTime = (date)=>{
    return `${date.getHours()}:${("0"+date.getMinutes()).slice(-2)}`
};

module.exports = {
    createStartVoiting,
    CreateVoiting,
    createUser,
    createVoice,
};