const express = require('express');
const app = express();
app.use(express.static('public'));

const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);

// ----------------------------------------------------------------------------
// Environment
// ----------------------------------------------------------------------------
const port = process.env.PORT || 3000;
const MONGODB_URL = process.env.MONGODB_URL;

// ----------------------------------------------------------------------------
// Data
// ----------------------------------------------------------------------------

const mongoose = require('mongoose');
mongoose.connect(MONGODB_URL, { useNewUrlParser: true });

const userSchema = mongoose.Schema({
  nickname: String,
  realname: String,
});

const LogSchema = mongoose.Schema({
  userName: String,
  action: String
}, { timestamps: true });

const Users = mongoose.model('User', userSchema);
const Log = mongoose.model('Log', LogSchema);

const onlineUsers = new Map(); // user id => user
const hiddenUsers = new Set();

function buildEmitData(u) {
  return { id: u.id, nickname: u.nickname, realname: u.realname, hidden: hiddenUsers.has(u.id) };
}

function buildUserlist(){
  return Array.from(onlineUsers.values()).map(buildEmitData);
}

// ----------------------------------------------------------------------------
// Socket Event Handlers
// ----------------------------------------------------------------------------

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('name', (data) => {
//date.nicknameならnicknameだけ取ってこれる
    Users.findOneAndUpdate({ data }, {}, { upsert: true, new: true }, (err, u) => {
      console.log(data.realname + ' loggedin.');
      onlineUsers.set(u.id, u);
      io.emit('UserList', buildUserlist());

      socket.on('disconnect', () => {
        console.log(data.realname + ' disconnected.');
        onlineUsers.delete(u.id);
        io.emit('UserList', buildUserlist());
      });

      socket.on('NoOpinions', (option) => {
        hiddenUsers.add(u.id);
      
        if(option.timeout){
          setTimeout(() => {
            hiddenUsers.delete(u.id);
            io.emit('ShowName', buildEmitData(u));
          }, 30000);
        }

        io.emit('NoOpinions', buildEmitData(u));

        Log.create({ userName: u.realname, action: 'NoOpinions' });
      });

      socket.on('ShowName', () => {
        hiddenUsers.delete(u.id);
        io.emit('ShowName', buildEmitData(u));
        Log.create({ userName: u.realname, action: 'ShowName' });
      });
    });

  });

  socket.on('teacher', () => {
    io.emit('UserList', buildUserlist());

    socket.on('disconnect', () => {
      console.log('teacher disconnected.');
    });

    socket.on('ShowAllNames', () => {
      hiddenUsers.clear();
      io.emit('UserList', buildUserlist());
      io.emit('Reset');
      Log.create({ userName: 'teacher', action: 'ShowAllNames' });
    });
  });

});


server.listen(port);