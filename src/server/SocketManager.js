const io = require('./index.js').io;

const {
  VERIFY_USER,
  USER_CONNECTED,
  LOGOUT,
  STOP_VOITING,
  COMMUNITY_VOITING,
  START_VOITING,
  VOITING_SENT,
  VOICE_RECIEVED
} = require('../Events.js');

const {
  createUser,
  createStartVoiting,
  CreateVoiting,
  createVoice
} = require('../Factories.js');

let isactivePults = false;
let connectedUsersMain = {};
let connectedUsersJudge = {};
let judgeVoices = {};
module.exports = function(socket) {
  console.log('Socket Id:' + socket.id);
  let addVoiceFromSender;
  let changeVoiceFromSender;
  //Verify Username
  socket.on(VERIFY_USER, (nickname, password, callback) => {
    if (isUser(connectedUsersMain, nickname, password)) {
      callback({ isUser: true, user: null });
    } else {
      callback({
        isUser: false,
        user: createUser({ name: nickname }),
        isActive: isactivePults
      });
    }
  });
  //User Connects with username
  socket.on(USER_CONNECTED, (user, typePage) => {
    if (typePage === 'main')
      connectedUsersMain = addUser(connectedUsersMain, user);
    else connectedUsersJudge = addUser(connectedUsersJudge, user);
    socket.user = user;
    addVoiceFromSender = addVoice(user);
    console.log('MAIN:');
    console.log(connectedUsersMain);
    console.log('JUDGES:');
    console.log(connectedUsersJudge);
  });
  //Start voiting button
  socket.on(COMMUNITY_VOITING, (isActivePults, user) => {
    isactivePults = isActivePults;
    console.log('isActivePults: ' + isActivePults + ', by ' + user.id);
    if (isActivePults) {
      judgeVoices = {};
      io.emit(START_VOITING);
    } else {
      io.emit(STOP_VOITING, isactivePults);
      io.emit(VOICE_RECIEVED, judgeVoices);
    }
  });
  //Stop voiting button
  socket.on(STOP_VOITING, (isActivePults, user) => {
    console.log('isActivePults stopped: ' + isActivePults + ', by ' + user.id);
  });
  //User disconnects
  socket.on('disconnect', () => {
    if ('user' in socket) {
      console.log('user : ' + socket.user.name + ' is disconnect');
      connectedUsersMain = removeUser(connectedUsersMain, socket.user.name);
      connectedUsersJudge = removeUser(connectedUsersJudge, socket.user.name);
      console.log('MAIN:');
      console.log(connectedUsersMain);
      console.log('JUDGES:');
      console.log(connectedUsersJudge);
    }
  });
  //User logout
  socket.on(LOGOUT, () => {
    if ('user' in socket) {
      console.log('user : ' + socket.user.name + ' is disconnected');
      connectedUsersMain = removeUser(connectedUsersMain, socket.user.name);
      connectedUsersJudge = removeUser(connectedUsersJudge, socket.user.name);
      console.log('MAIN:');
      console.log(connectedUsersMain);
      console.log('JUDGES:');
      console.log(connectedUsersJudge);
    }
  });

  //Community Voiting
  //User-pult send voice-message
  socket.on(VOITING_SENT, voice => {
    addVoiceFromSender(voice);
    console.log(judgeVoices);
  });
};

/*
*Adds user to list passed in.
* @param userList {Object} Object with key value pairs of users
* @param user {User} the user to added to the list.
* @return userList {Object} Object with key value pairs of Users
 */
function addUser(userList, user) {
  let newList = Object.assign({}, userList);
  newList[user.name] = user;
  return newList;
}

/*
* Return a function that will take a sender user and message-voice
* and then add a voice to the voice list.
* @param sender {name:string, id: string} username of sender.
* @return function(voice)
 */
function addVoice(sender) {
  return voice => {
    console.log(`user ${sender.name} voited by ${voice}`);
    judgeVoices = addUser(judgeVoices, createVoice({ voice, sender }));
  };
}

/*
*Removes user to list passed in.
* @param userList {Object} Object with key value pairs of users
* @param username {string} name of user to be removed.
* @return userList {Object} Object with key value pairs of Users
 */
function removeUser(userList, username) {
  let newList = Object.assign({}, userList);
  delete newList[username];
  return newList;
}

/*
*Check if the user is in list passed in.
* @param userList {Object} Object with key value pairs of users
* @param username {string}
* @return userList {Object} Object with key value pairs of Users
 */
function isUser(userList, username, password) {
  return username in userList;
}
