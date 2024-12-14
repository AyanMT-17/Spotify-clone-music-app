console.log("lets write JS");


let currentsong = new Audio();
let isPlaying = false;


const updatePlayBar = (songName, artistName) => {
    document.querySelector(".song-title").textContent = songName;
    document.querySelector(".artist-name").textContent = artistName;

    // Reset progress bar and timers when a new song starts
    document.querySelector(".progress-bar").style.width = "0%";
    document.querySelector(".time-elapsed").textContent = "0:00";
    document.querySelector(".time-remaining").textContent = "0:00";
};

const playmusic = (track) => {
    if (currentsong.src.includes(track) && !currentsong.paused) {
        currentsong.pause();
        isPlaying = false;
        // Update play button UI to "play"
    } else {
        currentsong.src = "http://127.0.0.1:3000/Project/Spotify-clone/Songs/" + track;
        currentsong.play();
        isPlaying = true;

        // Update play-bar dynamically
        const songName = track.replace(".mp3", "").replaceAll("%20", " ");
        updatePlayBar(songName, "Ayan");
    }
};

const progressBar = document.querySelector(".progress-bar");
    const timeElapsed = document.querySelector(".time-elapsed");
    const timeRemaining = document.querySelector(".time-remaining");
currentsong.addEventListener("timeupdate", () => {
    

    const currentTime = currentsong.currentTime;
    const duration = currentsong.duration;

    // Update time and progress bar width
    if (!isNaN(duration)) {
        timeElapsed.textContent = formatTime(currentTime);
        timeRemaining.textContent = formatTime(duration - currentTime);
        progressBar.style.width = `${(currentTime / duration) * 100}%`;
    }
});

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
}


currentsong.addEventListener("ended", () => {
    const songUL = document.querySelector(".left ol");
    const songs = Array.from(songUL.getElementsByTagName("li"));
    const currentSongName = document.querySelector(".song-title").textContent.trim();

    let nextSongIndex = songs.findIndex(
        (song) => song.querySelector(".Info-song").firstElementChild.textContent.trim() === currentSongName
    ) + 1;

    if (nextSongIndex < songs.length) {
        const nextSongName = songs[nextSongIndex].querySelector(".Info-song").firstElementChild.textContent.trim();
        playmusic(nextSongName);
    }
});


const playPauseBtn = document.getElementById("play-pause-btn");
const playPauseImg = playPauseBtn.querySelector("img");

playPauseBtn.addEventListener("click", () => {
  if (currentsong.paused) {
    currentsong.play();
    isPlaying = true;
    playPauseImg.src = "pause.svg"; // Switch to pause icon
  } else {
    currentsong.pause();
    isPlaying = false;
    playPauseImg.src = "play.svg"; // Switch to play icon
  }
});



document.addEventListener('DOMContentLoaded', function () {
    const previousBtn = document.getElementById("previous-btn");
    const nextBtn = document.getElementById("next-btn");

    if (previousBtn && nextBtn) {
      previousBtn.addEventListener("click", playPrevious);
      nextBtn.addEventListener("click", playNext);
    }
  });

// Functions for navigation
const playNext = () => {
  const songUL = document.querySelector(".left ol");
  const songs = Array.from(songUL.getElementsByTagName("li"));
  const currentSongName = document.querySelector(".song-title").textContent.trim();

  let nextSongIndex = songs.findIndex(
    (song) => song.querySelector(".Info-song").firstElementChild.textContent.trim() === currentSongName
  ) + 1;

  if (nextSongIndex < songs.length) {
    const nextSongName = songs[nextSongIndex].querySelector(".Info-song").firstElementChild.textContent.trim();
    playmusic(nextSongName);
  }
};

const playPrevious = () => {
  const songUL = document.querySelector(".left ol");
  const songs = Array.from(songUL.getElementsByTagName("li"));
  const currentSongName = document.querySelector(".song-title").textContent.trim();

  let prevSongIndex = songs.findIndex(
    (song) => song.querySelector(".Info-song").firstElementChild.textContent.trim() === currentSongName
  ) - 1;

  if (prevSongIndex >= 0) {
    const prevSongName = songs[prevSongIndex].querySelector(".Info-song").firstElementChild.textContent.trim();
    playmusic(prevSongName);
  }
};




const volumeSlider = document.getElementById("volume-slider");
const muteBtn = document.getElementById("mute-btn");
const volumeBtn = document.getElementById("volume-btn");

volumeSlider.addEventListener("input", (event) => {
  currentsong.volume = event.target.value;
});

muteBtn.addEventListener("click", () => {
  if (currentsong.muted) {
    currentsong.muted = false;
    muteBtn.querySelector("img").src = "mute.svg"; // Switch to mute icon
  } else {
    currentsong.muted = true;
    muteBtn.querySelector("img").src = "volume.svg"; // Switch to unmute icon
  }
});





async function getsongs()
{
    let a= await fetch("http://127.0.0.1:3000/Project/Spotify-clone/Songs/")
    let response = await a.text();
    console.log(response)
    let div =document.createElement("div")
    div.innerHTML =response;
    let as=div.getElementsByTagName("a")

    let songs=[];
    for(const ele of as)
    {   
        if(ele.href.endsWith(".mp3"))
        songs.push(ele);
    }
    return(songs)
}



async function main()
{



    let songs = []
    songs = await getsongs()
    console.log(songs)


    let songUL = document.querySelector(".left").getElementsByTagName("ol")[0]

    for (const song of songs)
    {
        songUL.innerHTML = songUL.innerHTML + `<li class="songlist">
                        <div class="info">
                        <img src="music.svg" height="30">
                        <div class="Info-song"><div class="songinfo">${song.href.replaceAll("http://127.0.0.1:3000/Project/Spotify-clone/Songs/","").replaceAll("%20"," ")}</div>
                      <div class="artist">Ayan</div></div>
                      </div>
                      <button><img src="play-button.png" height="25" alt=""></button>
                    </li>`;
    }

    Array.from(document.querySelector(".left").getElementsByTagName("li")).forEach(e => {
        const playButton = e.querySelector("button");
        playButton.addEventListener("click", (event) => {
            event.stopPropagation(); // Prevent the parent `<li>` click event
            const songName = e.querySelector(".Info-song").firstElementChild.textContent.trim();
            playmusic(songName);
        });
    });


    Array.from(document.querySelector(".left").getElementsByTagName("li")).forEach(e=>{
        e.addEventListener("click",element=>{
            console.log(e.querySelector(".Info-song").firstElementChild.innerHTML)
            playmusic(e.querySelector(".Info-song").firstElementChild.innerHTML.trim())
            
            
        })
        
    })

}

main()