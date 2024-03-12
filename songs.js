import { data } from './data/data.js';

// Enable Disable Script
function enableDisable(element) {
    console.log(element.style);
    if (element.style.fill !== "rgb(29, 185, 84)") {
        element.style.setProperty('fill', '#1db954');
    } else {
        element.style.setProperty('fill', '#fff');
    }
}

// Greetings Script
const greeting = document.getElementById("greeting");
const hour = new Date().getHours();
const welcomeTypes = ["Good morning", "Good afternoon", "Good evening"];
let welcomeText = "";

if (hour < 12) welcomeText = welcomeTypes[0];
else if (hour < 18) welcomeText = welcomeTypes[1];
else welcomeText = welcomeTypes[2];

greeting.innerHTML = welcomeText;

// Scrolling nav bar code
const nav = document.querySelector("#topNav");
const sectionOne = document.querySelector(".fw-bold");
const sectionOneOptions = {};
const sectionOneObserver = new IntersectionObserver(function (entries, sectionOneObserver) {
    entries.forEach(entry => {
        if (!entry.isIntersecting) {
            nav.style.backgroundColor = "black";
        } else {
            nav.style.backgroundColor = "transparent";
        }
    });
}, sectionOneOptions);
sectionOneObserver.observe(sectionOne);

// Render top songs
const topSongContainer = document.querySelector('#playlistsRecentes');
topSongContainer.innerHTML = data.slice(0, 6).map((song, index) => {
    return `<li id="${index}">
                <img src="./data/${song.thumbnail}" alt="${song.title}">
                <span class="fw-semibold ms-3 me-auto">${song.title}</span>
                <button type="button" class="btn me-3">
                    <svg role="img" height="24" width="24" viewBox="0 0 24 24">
                        <path d="M7.05 3.606l13.49 7.788a.7.7 0 010 1.212L7.05 20.394A.7.7 0 016 19.788V4.212a.7.7 0 011.05-.606z"></path>
                    </svg>
                </button>
            </li>`;
}).join('');

// Render top mixes
const topMixesContainer = document.querySelector("#playsongslist");
topMixesContainer.innerHTML = data.map((song, index) => {

    return `<li id='${song.id}'>
            <img src="./data/${song.thumbnail}">
            <button type="button" id="songPlayBtn-${song.id}" class="btn me-3" >
                <svg role="img" height="24" width="24" viewBox="0 0 24 24">
                    <path d="M7.05 3.606l13.49 7.788a.7.7 0 010 1.212L7.05 20.394A.7.7 0 016 19.788V4.212a.7.7 0 011.05-.606z"></path>
                </svg>
            </button>
            <span>${song.title}</span>
            <p><br>${song.artist}</p>
        </li>`;
}).join('');


// const playPauseButton = document.getElementById('playPauseButton');
// const playPauseIcon = document.getElementById("playPauseIcon");
// const audioPlayer = new Audio();
// let isPlaying = false;

// function togglePlayPause() {
//     if (isPlaying) {
//         audioPlayer.pause();
//         playPauseIcon.innerHTML = '<svg role="img" height="24" width="24" viewBox="0 0 24 24"><path d="M7.05 3.606l13.49 7.788a.7.7 0 010 1.212L7.05 20.394A.7.7 0 016 19.788V4.212a.7.7 0 011.05-.606z"></path></svg>';
//     } else {
//         audioPlayer.play();
//         playPauseIcon.innerHTML = '<svg role="img" height="24" width="24" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 13H8V9h3V7h2v8h3v2h-5v-6z"></path></svg>';
//     }
//     isPlaying = !isPlaying;
// }

// playPauseButton.addEventListener("click", togglePlayPause);

// function playSong(songId) {
//     const song = data.filter(song => song.id === songId);
//     if (song) {
//         audioPlayer.src = song.file_location;
//         audioPlayer.play();
//         isPlaying = true;
//         playPauseIcon.innerHTML = '<svg role="img" height="24" width="24" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 13H8V9h3V7h2v8h3v2h-5v-6z"></path></svg>';
//     }else{console.log('not playing')}
// }
// playSong(0)

// // Function to control song progress (e.g., update progress bar)
// function updateProgress() {
//     const progressBar = document.getElementById("progressBar");
//     progressBar.value = (audioPlayer.currentTime / audioPlayer.duration) * 100;
//     // Update other UI elements like current time, total time, etc.
// }

// // Add event listeners for song progress
// audioPlayer.addEventListener("timeupdate", updateProgress);

let playpause_btn = document.querySelector(".playpause-track");
let next_btn = document.querySelector(".next-track");
let prev_btn = document.querySelector(".prev-track");

let seek_slider = document.querySelector(".seek_slider");
let volume_slider = document.querySelector(".volume_slider");
let curr_time = document.querySelector(".current-time");
let total_duration = document.querySelector(".total-duration");


let curr_index = 0;
let isPlaying = false;
let updateTimer;
let downloadLink = document.querySelector('.download-link');


let curr_track = document.createElement('audio');

function resetValues() {
    curr_time.textContent = "00:00";
    total_duration.textContent = "00:00";
    seek_slider.value = 0;
}


function playSong(songId) {

    const curr_song = data.find(song => song.id === songId); // Use find instead of filter
    console.log(curr_song);
    if (curr_song) {
        curr_track.src = `./data/${curr_song.file_location}`;
        curr_track.play();
        isPlaying = true;
        globalThis.curr_index = curr_song.id;
        console.log(globalThis.curr_index);

        downloadLink.addEventListener('click', () => {
            downloadLink.setAttribute('href', `./data/${curr_song.file_location}`);
            downloadLink.setAttribute('download', `${curr_song.title}.mp3`);
        });
        

} else {
    console.log('Song not found.');
}
  }

function randomSong() {
    const random_index = Math.floor(Math.random() * data.length);
    playSong(data[random_index].id); // Play the randomly selected song
}

// Add event listener to the audio track for the 'ended' event
function clickrandom() {
    curr_track.addEventListener('ended', randomSong);
}
document.querySelector('.randomsong').addEventListener('click', clickrandom);

data.forEach(song => {
    document.getElementById(`songPlayBtn-${song.id}`).addEventListener('click', () => playSong(song.id));
});

function nextTrack() {
    if (curr_index == data.length - 1) {
        curr_index = 0;
    } else {
        curr_index += 1;
    }
    playSong(data[curr_index].id);
}

function previousTrack() {
    if (curr_index == 0) {
        curr_index = data.length - 1;
    } else {
        curr_index -= 1;
    }
    playSong(data[curr_index].id);
}


prev_btn.addEventListener('click', previousTrack);
next_btn.addEventListener('click', nextTrack);

// Function to set the volume of the audio track
function setVolume() {
    // Set the volume according to the percentage of the volume slider
    curr_track.volume = volume_slider.value / 100;
}
function muteVolume() {
    if (curr_track.volume) {
        curr_track.volume = 0;
    } else { curr_track.volume = 1; }
}
document.querySelector('.mutevolume').addEventListener('click', muteVolume);
// Function to seek to a specific position in the audio track
function seekTo() {
    // Calculate the seek position by the percentage of the seek slider
    const seekto = curr_track.duration * (seek_slider.value / 100);

    // Set the current track position to the calculated seek position
    curr_track.currentTime = seekto;
}

// Function to update the seek slider and display current time and total duration
function seekUpdate() {
    let seekPosition = 0;

    // Check if the current track duration is a legible number
    if (!isNaN(curr_track.duration)) {
        // Calculate the seek position as a percentage of the duration
        seekPosition = (curr_track.currentTime / curr_track.duration) * 100;
        seek_slider.value = seekPosition;

        // Calculate current and total time in minutes and seconds
        let currentMinutes = Math.floor(curr_track.currentTime / 60);
        let currentSeconds = Math.floor(curr_track.currentTime - currentMinutes * 60);
        let durationMinutes = Math.floor(curr_track.duration / 60);
        let durationSeconds = Math.floor(curr_track.duration - durationMinutes * 60);

        // Add leading zeros to single digit time values
        if (currentSeconds < 10) { currentSeconds = "0" + currentSeconds; }
        if (durationSeconds < 10) { durationSeconds = "0" + durationSeconds; }
        if (currentMinutes < 10) { currentMinutes = "0" + currentMinutes; }
        if (durationMinutes < 10) { durationMinutes = "0" + durationMinutes; }

        // Display the updated current time and total duration
        curr_time.textContent = currentMinutes + ":" + currentSeconds;
        total_duration.textContent = durationMinutes + ":" + durationSeconds;
    }
}

// Add event listeners for volume slider change and seek slider change
volume_slider.addEventListener('input', setVolume);
seek_slider.addEventListener('input', seekTo);

// Update seek slider, current time, and total duration on timeupdate event of audio track
curr_track.addEventListener('timeupdate', seekUpdate);



let fullScreen = document.getElementById('full-screen');

fullScreen.addEventListener('click', () => openFullscreen());

const elem = document.documentElement;
function openFullscreen() {
    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen(); // Safari
    } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen(); // IE11
    }
    addEventListener('keypress', (e) => {
        if (e.key === 'esc') {
            closeFullscreen();
        }
    });
}

function closeFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen(); // Safari
    } else if (document.msExitFullscreen) {
        document.msExitFullscreen(); // IE11
    }
}
const playPauseButton = document.getElementById('playPauseButton');
const playPauseIcon = document.getElementById("playPauseIcon");

function togglePlayPause() {
    if (isPlaying) {
        curr_track.pause();
        playPauseIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" id="playPauseIcon" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M8 5V19M16 5V19" stroke="#000000" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`;
    } else {
        curr_track.play();
        playPauseIcon.innerHTML = `<svg role="img" height="24"
        id="playPauseIcon" width="24" viewBox="0 0 24 24">
        <path
          d="M7.05 3.606l13.49 7.788a.7.7 0 010 1.212L7.05 20.394A.7.7 0 016 19.788V4.212a.7.7 0 011.05-.606z">
        </path>
      </svg>`;
    }
    isPlaying = !isPlaying;
}


playPauseButton.addEventListener("click", togglePlayPause);