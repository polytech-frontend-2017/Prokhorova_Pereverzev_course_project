const io = require('./index.js').io;
const usersMenu = [];

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
let connectedUsers = {};

module.exports = function(socket) {
  console.log('Socket Id:' + socket.id);
  let sendVoiceToUserFromSender;
  //Verify Username
  socket.on(VERIFY_USER, (nickname, callback) => {
    if (isUser(connectedUsers, nickname)) {
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
    connectedUsers = addUser(connectedUsers, user, typePage);
    socket.user = user;
    sendVoiceToUserFromSender = sendVoiceToUser(user.name);
    console.log(connectedUsers);
  });
  //Start voiting button
  socket.on(COMMUNITY_VOITING, (isActivePults, user) => {
    isactivePults = isActivePults;
    console.log('isActivePults: ' + isActivePults + ', by ' + user.id);
    /*to broadcast ALL*/
    io.emit(START_VOITING, isactivePults);
  });
  //Stop voiting button
  socket.on(STOP_VOITING, (isActivePults, user) => {
    isactivePults = isActivePults;
    console.log('isActivePults: ' + isActivePults + ', by ' + user.id);
    /*to broadcast ALL*/
    io.emit(STOP_VOITING, isactivePults);
  });
  //User disconnects
  socket.on('disconnect', () => {
    if ('user' in socket) {
      console.log('user : ' + socket.user.name + ' is disconnect');
      connectedUsers = removeUser(connectedUsers, socket.user.name);
      console.log(connectedUsers);
    }
  });
  //User logout
  socket.on(LOGOUT, () => {
    if ('user' in socket) {
      console.log('user : ' + socket.user.name + ' is disconnected');
      connectedUsers = removeUser(connectedUsers, socket.user.name);
      console.log(connectedUsers);
    }
  });

  //Community Voiting
  socket.on(VOICE_RECIEVED, ({ voice, sender }) => {});
  //User-pult send voice-message
  socket.on(VOITING_SENT, ({ userId, voice }) => {
    sendVoiceToUserFromSender(userId, voice);
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
* Return a function that will take a user id and message-voice
* and then emit a broadcast to the user id.
* @param sender {string} username of sender.
* @return function(userId, voice)
 */
function sendVoiceToUser(sender) {
  return (userId, voice) => {
    io.emit(`${VOICE_RECIEVED}-${userId}`, createVoice(voice, sender));
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
function isUser(userList, username) {
  return username in userList;
}
