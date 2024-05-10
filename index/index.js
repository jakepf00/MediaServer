// Audio player
audio = document.querySelector("audio");
audioSource = document.getElementById("audioSource");
// Audio controls
audioControls = document.getElementById("audioControls");
playPauseButton = document.getElementById("playButton");
songTitle = document.getElementById("currentSongTitle");
volumeSlider = document.getElementById("volumeSlider");
// Other
body = document.querySelector("body");
trackFilterInput = document.getElementById("trackFilterInput");
trackList = document.getElementById("trackList");
trackListRows = trackList.rows;


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