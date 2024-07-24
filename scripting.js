const levels = {
    easy: 3,
    medium: 4,
    hard: 5
};

const images = [
    { src: 'img/triangle.png', sound: 'aud/triangle.mp3' },
    { src: 'img/circle.png', sound: 'aud/circle.mp3' },
    { src: 'img/square.png', sound: 'aud/square.mp3' },
    { src: 'img/star.png', sound: 'aud/star.mp3' },
    { src: 'img/heart.png', sound: 'aud/heart.mp3' }
];

let selectedLevel;
let correctCount = 0;

const music = document.getElementById('background-music');
const musicIcon = document.getElementById('music-icon');

let isMusicPlaying = true;
music.volume = 0.08;

const victorySound = new Audio('aud/hurra.mp3');
victorySound.volume = 0.1;

const defeatSound = new Audio('aud/derrota.mp3');
defeatSound.volume = 0.1;

const buttonClickSound = new Audio('aud/click.mp3');
buttonClickSound.volume = 0.1;
const backButtonSound = new Audio('aud/click.mp3');
backButtonSound.volume = 0.1;
const musicButtonSound = new Audio('aud/click.mp3');
musicButtonSound.volume = 0.1;



function playVictorySound() {
    victorySound.currentTime = 0;
    victorySound.play();
    setTimeout(() => {
        victorySound.pause();
        victorySound.currentTime = 0;
    }, 3000);
}

function playDefeatSound() {
    defeatSound.currentTime = 0;
    defeatSound.play();
    setTimeout(() => {
        defeatSound.pause();
        defeatSound.currentTime = 0;
    }, 3000);
}

function playShapeSound(soundSrc) {
    const shapeSound = new Audio(soundSrc);
    shapeSound.volume = 0.3;
    shapeSound.play();
}

function playButtonClickSound() {
    buttonClickSound.currentTime = 0;
    buttonClickSound.play();
}

function playBackButtonSound() {
    backButtonSound.currentTime = 0;
    backButtonSound.play();
}

function playMusicButtonSound() {
    musicButtonSound.currentTime = 0;
    musicButtonSound.play();
}


function toggleMusic() {
    playMusicButtonSound(); 

    if (isMusicPlaying) {
        music.pause();
        musicIcon.src = 'img/musica-off.png';
    } else {
        music.play();
        musicIcon.src = 'img/musica-on.png';
    }
    isMusicPlaying = !isMusicPlaying;
}

function startGame(level) {
    playButtonClickSound(); 
    selectedLevel = level;
    correctCount = 0;
    document.getElementById('menu').style.display = 'none';
    document.getElementById('game').style.display = 'block';
    document.getElementById('back-button').style.display = 'block';
    setupGame();
}

function setupGame() {
    const leftPanel = document.getElementById('left-panel');
    const rightPanel = document.getElementById('right-panel');
    leftPanel.innerHTML = '';
    rightPanel.innerHTML = '';

    const levelImages = images.slice(0, levels[selectedLevel]);
    const dropZones = levelImages.map((image, index) => ({
        id: `droppable-${index}`,
        ...image
    }));

    dropZones.sort(() => Math.random() - 0.5);

    levelImages.forEach((image, index) => {
        const imgElement = document.createElement('img');
        imgElement.src = image.src;
        imgElement.className = 'draggable';
        imgElement.id = `draggable-${index}`;
        imgElement.draggable = true;
        imgElement.dataset.sound = image.sound;
        imgElement.addEventListener('click', function() {
            playShapeSound(image.sound);
        });
        imgElement.addEventListener('dragstart', dragStart);
        leftPanel.appendChild(imgElement);
    });

    dropZones.forEach((zone, index) => {
        const dropZone = document.createElement('div');
        dropZone.className = 'droppable';
        dropZone.id = zone.id;
        dropZone.style.transform = `rotate(${Math.random() * 20 - 10}deg)`;
        dropZone.style.width = `${100 + Math.random() * 20}px`;
        dropZone.style.height = `${100 + Math.random() * 20}px`;
        dropZone.addEventListener('dragover', dragOver);
        dropZone.addEventListener('drop', drop);

        const dropZoneImg = document.createElement('img');
        dropZoneImg.src = zone.src;
        dropZoneImg.alt = `Drop Zone`;
        dropZoneImg.style.opacity = '0.5';
        dropZone.appendChild(dropZoneImg);

        rightPanel.appendChild(dropZone);
    });
}

function dragStart(event) {
    event.dataTransfer.setData('text/plain', event.target.id);
}

function dragOver(event) {
    event.preventDefault();
}

function drop(event) {
    event.preventDefault();
    const draggableId = event.dataTransfer.getData('text/plain');
    const droppableId = event.target.id || event.target.parentElement.id;
    const draggableElement = document.getElementById(draggableId);
    const droppableElement = document.getElementById(droppableId);

    if (draggableElement && droppableElement) {
        const draggableIndex = draggableId.split('-')[1];
        const droppableIndex = droppableId.split('-')[1];

        if (draggableIndex === droppableIndex) {
            droppableElement.appendChild(draggableElement);
            correctCount++;
            checkResult();
        } else {
            playDefeatSound();
            showResult('That figure doesnt go there! Try again (Esa forma no va ahí, Inténtalo de nuevo)');
        }
    }
}

function checkResult() {
    if (correctCount === levels[selectedLevel]) {
        playVictorySound();
        showResult('Victory! (Victoria)');
    }
}

function showResult(result) {
    document.getElementById('game').style.display = 'none';
    document.getElementById('result').style.display = 'block';
    document.getElementById('result-message').innerText = result;
}

function resetGame() {
    playButtonClickSound();
    document.getElementById('result').style.display = 'none';
    document.getElementById('menu').style.display = 'block';
}

function goBackToMenu() {
    playBackButtonSound(); 
    document.getElementById('game').style.display = 'none';
    document.getElementById('menu').style.display = 'block';
    document.getElementById('back-button').style.display = 'none';
}

document.addEventListener('DOMContentLoaded', function() {
    const videoOverlay = document.getElementById('video-overlay');
    const instructionsOverlay = document.getElementById('instructions-overlay');
    const video = document.getElementById('intro-video');
    const closeButton = document.getElementById('close-video');
    let videoPlayed = false;
    video.volume = 0.7;

    document.addEventListener('keydown', function(event) {
        if ((event.key === 'a' || event.key === 'A') && !videoPlayed) {
            instructionsOverlay.style.display = 'none';
            videoOverlay.style.display = 'flex';
            video.play();
            videoPlayed = true;
        }
    });

    closeButton.addEventListener('click', function() {
        closeVideo();
    });

    video.addEventListener('ended', function() {
        closeVideo();
        music.play();
        isMusicPlaying = true;
        musicIcon.src = 'img/musica-on.png';
    });

    function closeVideo() {
        playBackButtonSound(); 
        videoOverlay.style.display = 'none';
        video.pause();
        video.currentTime = 0;
        video.volume = 0;
        music.play();
    }
});
