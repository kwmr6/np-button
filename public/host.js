// ----------------------------------------------------------------------------
// User Interface Event Handlers
// ----------------------------------------------------------------------------
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
            const span1= document.createElement("span");
            span1.classList.add("nickname");
            span1.textContent =u.nickname;
            li.appendChild(span1);
            const span2= document.createElement("span");
            span2.classList.add("realname");
            span2.textContent =u.realname;
            li.appendChild(span2);
           // li.textContent = u.nickname + " " + u.realname; //できなさそうだったら（）で実名囲むのもあり
        }
        li.style.display = 'inline-block';
        li.style.visibility = u.hidden ? 'hidden' : 'visible';
        parent.appendChild(li);
    }
});

const btn = document.getElementById('redisplay');

btn.addEventListener('click', e => {
    socket.emit('ShowAllNames');
});

// ----------------------------------------------------------------------------
// Start up
// ----------------------------------------------------------------------------

socket.emit('teacher');


