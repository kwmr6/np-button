// ----------------------------------------------------------------------------
// User Interface Event Handlers
// ----------------------------------------------------------------------------

const btn = document.getElementById('redisplay');

btn.addEventListener('click', e => {
    socket.emit('ShowAllNames');
});

// ----------------------------------------------------------------------------
// Start up
// ----------------------------------------------------------------------------

socket.emit('teacher');

const parent = document.getElementById('onlineUsers');
//onlineUsersの中身はbuildUserlistの関数の結果
socket.on('UserList', function (onlineUsers) {
    onlineUsers.sort((a, b) => a.nickname.localeCompare(b.nickname));

    parent.querySelectorAll('li').forEach(li => li.style.display = 'none');

    for (let u of onlineUsers) {
        let li = document.getElementById(u.id);
        if(!li){
            li = document.createElement('li');
            li.id = u.id;
            li.textContent = u.nickname + " " + u.realname;
        }
        li.style.display = 'inline-block';
        li.style.visibility = u.hidden ? 'hidden' : 'visible';
        parent.appendChild(li);
    }
});
