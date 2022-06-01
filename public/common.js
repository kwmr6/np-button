// ----------------------------------------------------------------------------
// Socket Event Handlers
// ----------------------------------------------------------------------------
const socket = io();

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

socket.on('NoOpinions', hideName);

socket.on('ShowName', showName);

function hideName(u){
    const li = document.getElementById(u.id);
    li.style.visibility = 'hidden';  
}

function showName(u){
    const li = document.getElementById(u.id);
    li.style.visibility = 'visible';
}