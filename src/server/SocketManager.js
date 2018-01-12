const io = require('./index.js');

const {VERIFY_USER, USER_CONNECTED, LOGOUT, USER_DISCONNECTED} = require('../Events.js');

const {createUser, createStartVoiting, CreateVoiting, createVoice} = require('../Factories.js');

let connectedUsers = {};

module.exports = function(socket){
    console.log("Socket Id:" + socket.id);

//Verify Username
    socket.on(VERIFY_USER, (nickname, callback) => {
        if (isUser(connectedUsers, nickname)) {
            callback({isUser: true, user: null})
        } else {
            callback({isUser: false, user: createUser({name: nickname})})
        }
    });
//User Connects with username
    socket.on(USER_CONNECTED, (user)=>{
        connectedUsers = addUser(connectedUsers,user);
        socket.user = user;
        console.log(connectedUsers)
    })
//User disconnects

//User logout
};

/*to broadcast ALL*/
/* io.emit(START_VOITING,startVoiting)*/

/*
*Adds user to list passed in.
* @param userList {Object} Object with key value pairs of users
* @param user {User} the user to added to the list.
* @return userList {Object} Object with key value pairs of Users
 */
function addUser(userList,user) {
    let newList = Object.assign({},userList);
    newList[user.name]=user;
    return newList
}

/*
*Removes user to list passed in.
* @param userList {Object} Object with key value pairs of users
* @param username {string} name of user to be removed.
* @return userList {Object} Object with key value pairs of Users
 */
function removeUser(userList,username) {
    let newList = Object.assign({},userList);
    delete newList[username];
    return newList
}

/*
*Check if the user is in list passed in.
* @param userList {Object} Object with key value pairs of users
* @param username {string}
* @return userList {Object} Object with key value pairs of Users
 */
function isUser(userList,username) {
    return username in userList
}