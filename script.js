const socket = io('https://your-render-server-url.onrender.com');

let player = { username: "Captain Benton", faction: "Federation", x:100, y:100, hp:100, energy:50 };

const gameArea = document.getElementById('gameArea');
const playerDiv = document.createElement('div');
playerDiv.classList.add('player');
gameArea.appendChild(playerDiv);

document.getElementById('playerName').textContent = player.username;
document.getElementById('hp').textContent = player.hp;
document.getElementById('energy').textContent = player.energy;

// Send new player to server
socket.emit('newPlayer', player);

// Movement
document.addEventListener('keydown', (e)=>{
    const step = 10;
    if(e.key === 'ArrowLeft') player.x -= step;
    if(e.key === 'ArrowRight') player.x += step;
    if(e.key === 'ArrowUp') player.y -= step;
    if(e.key === 'ArrowDown') player.y += step;
    playerDiv.style.left = player.x + 'px';
    playerDiv.style.top = player.y + 'px';
    socket.emit('move', player);
});

// Listen for other players
socket.on('playerJoined', (otherPlayer)=>{
    console.log('New player joined:', otherPlayer.username);
});
socket.on('playerMoved', (otherPlayer)=>{
    console.log('Player moved:', otherPlayer.username);
});
document.getElementById('playerName').textContent = player.username;
document.getElementById('hp').textContent = player.hp;
document.getElementById('energy').textContent = player.energy;
</script>