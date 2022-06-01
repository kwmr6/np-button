// ----------------------------------------------------------------------------
// Socket Event Handlers
// ----------------------------------------------------------------------------
socket.on('Reset', () => {
  btn2.checked = true;
})

// ----------------------------------------------------------------------------
// User Interface Event Handlers
// ----------------------------------------------------------------------------

const btn1 = document.getElementById('npbutton');
const btn2 = document.getElementById('pbutton');
const progress = document.getElementById('timerProgress');
const memoArea = document.getElementById('memo');

const params = new URL(window.location.href).searchParams;
const memo = params.get('memo') == 'true';
const timeout = params.get('timeout') == 'true';

if(!memo) memoArea.style.display = 'none';
if(!timeout) progress.style.display = 'none';

let timer;

btn1.addEventListener("click", e => {
    socket.emit('NoOpinions', { timeout });
    if(timeout) timer = setInterval(updateProgress, 300);
});
  
btn2.addEventListener("click", e => {
    socket.emit('ShowName');
    stopTimer();
});

function stopTimer(){
    if(timer){
        clearInterval(timer);
        timer = null;
        progress.value = 100;  
        btn2.checked = true;
    }
}

function updateProgress() {
  if (progress.value > 0) {
    progress.value--;
  } else if (progress.value == 0) {
    stopTimer();
  }
}

// ----------------------------------------------------------------------------
// Start up
// ----------------------------------------------------------------------------

const realname = prompt('実名を入力してください') || 'unknown';
const nickname = prompt('仮の名前を入力してください') || 'unknown';
socket.emit('name', { realname, nickname});
alert('こんにちは' + nickname + 'さん!');

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
