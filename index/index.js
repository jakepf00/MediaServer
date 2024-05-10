// Audio player
const audio = document.querySelector("audio");
const audioSource = document.getElementById("audioSource");
// Audio controls
const audioControls = document.getElementById("audioControls");
const audioPlayerContainer = document.getElementById("audio-player-container");
const currentTimeContainer = document.getElementById("current-time");
const durationContainer = document.getElementById("duration");
const playPauseButton = document.getElementById("playButton");
const seekSlider = document.getElementById("seek-slider");
const songTitle = document.getElementById("currentSongTitle");
const volumeSlider = document.getElementById("volumeSlider");
// Other
const body = document.querySelector("body");
const trackFilterInput = document.getElementById("trackFilterInput");
const trackList = document.getElementById("trackList");
const trackListRows = trackList.rows;


function loadSong() {
    songId = this.getAttribute("song_id");
    filePath = this.getAttribute("file_path");
    songName = this.getAttribute("song_name");

    // Update audio player source - load the new song and play it
    audioSource.setAttribute("src", filePath);
    audio.load();
    audio.play();

    // Update song name in media controls area
    songName = songName == "" ? filePath : songName;
    songTitle.innerHTML = songName;

    // Make media controls visible
    audioControls.style.display = "";

    // Update URL to match song that is now playing
    newUrl = window.location.origin + "/index?song=" + songId;
    history.pushState({}, songName, newUrl);
}
document.querySelectorAll('#trackList tr:not(.header)').forEach(e => e.addEventListener("click", loadSong));

trackFilterInput.addEventListener("keyup", () => {
    filter = trackFilterInput.value.toUpperCase();

    for (i = 0; i < trackListRows.length; i++) {
        td = trackListRows[i].getElementsByTagName("td")[0];
        if (td) {
            txtValue = td.textContent || td.innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                trackListRows[i].style.display = "";
            } else {
                trackListRows[i].style.display = "none";
            }
        }
    }
});

function sortTracks() {
    sortBy = this.getAttribute("sort_by")
    switchcount = 0;
    switching = true;
    dir = "asc";

    while (switching) {
        switching = false;
        // Loop through all rows except header
        for (i = 1; i < (trackListRows.length - 1); i++) {
            shouldSwitch = false;
            x = trackListRows[i].getElementsByTagName("TD")[sortBy];
            y = trackListRows[i + 1].getElementsByTagName("TD")[sortBy];

            if (dir == "asc" && x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                shouldSwitch = true;
                break;
            } else if (dir == "desc" && x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
                shouldSwitch = true;
                break;
            }
        }
        if (shouldSwitch) {
            trackListRows[i].parentNode.insertBefore(trackListRows[i + 1], trackListRows[i]);
            switching = true;
            switchcount++;
        } else {
            /* If no switching has been done AND the direction is "asc",
            set the direction to "desc" and run the while loop again. */
            if (switchcount == 0 && dir == "asc") {
                dir = "desc";
                switching = true;
            }
        }
    }
}
document.querySelectorAll('tr.header th').forEach(e => e.addEventListener("click", sortTracks));

playPauseButton.addEventListener("click", () => {
    if (audio.paused) {
        audio.play();
        playPauseButton.setAttribute("class", "");
    }
    else {
        audio.pause();
        playPauseButton.setAttribute("class", "paused");
    }
});

volumeSlider.addEventListener("input", () => {
    audio.volume = volumeSlider.value / 100.0;
});

// Load first song
songToLoad = body.getAttribute("song_to_load");
if (songToLoad != "") {
    for (i = 1; i < trackListRows.length; i++) {
        if (songToLoad == trackListRows[i].getAttribute("song_id")) {
            songId = trackListRows[i].getAttribute("song_id");
            filePath = trackListRows[i].getAttribute("file_path");
            songName = trackListRows[i].getAttribute("song_name");
            break;
        }
    }

    // Update audio player source - load the new song (don't play it)
    audioSource.setAttribute("src", filePath);
    audio.load();

    // Update song name in media controls area
    songName = songName == "" ? filePath : songName;
    songTitle.innerHTML = songName;

    // Make media controls visible
    audioControls.style.display = "";
}

const calculateTime = (secs) => {
    const minutes = Math.floor(secs / 60);
    const seconds = Math.floor(secs % 60);
    const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
    return `${minutes}:${returnedSeconds}`;
}

const displayDuration = () => {
    durationContainer.textContent = calculateTime(audio.duration);
}

const setSliderMax = () => {
    seekSlider.max = Math.floor(audio.duration);
}

if (audio.readyState > 0) {
    displayDuration();
    setSliderMax();
} else {
    audio.addEventListener("loadedmetadata", () => {
        displayDuration();
        setSliderMax();
    });
}

seekSlider.addEventListener('input', () => {
    currentTimeContainer.textContent = calculateTime(seekSlider.value);
});

seekSlider.addEventListener('change', () => {
    audio.currentTime = seekSlider.value;
});

audio.addEventListener('timeupdate', () => {
    seekSlider.value = Math.floor(audio.currentTime);
});