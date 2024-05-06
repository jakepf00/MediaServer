function loadSong(songId, filePath, songName) {
    // Update audio player source - load the new song and play it
    audioSource = document.getElementById("audioSource");
    audio = document.getElementById("player");
    audioSource.setAttribute("src", filePath);
    audio.load();
    audio.play();

    // Update song name in media controls area
    songName = songName == "" ? filePath : songName;
    songTitle = document.getElementById("currentSongTitle");
    songTitle.innerHTML = songName;

    // Update URL to match song that is now playing
    newUrl = window.location.origin + "/index?song=" + songId;
    history.pushState({}, songName, newUrl);
}

function filterTracks() {
    var input, filter, ul, li, a, i, txtValue;
    input = document.getElementById('trackFilterInput');
    filter = input.value.toUpperCase();
    ul = document.getElementById("trackList");
    li = ul.getElementsByTagName('li');

    for (i = 0; i < li.length; i++) {
        a = li[i].getElementsByTagName("a")[0];
        txtValue = a.textContent || a.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "";
        } else {
            li[i].style.display = "none";
        }
    }
}

function sortTracks(sortBy) {
    var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
    table = document.getElementById("trackList");
    switching = true;
    // Set the sorting direction to ascending:
    dir = "asc";
    /* Make a loop that will continue until
    no switching has been done: */
    while (switching) {
        // Start by saying: no switching is done:
        switching = false;
        rows = table.rows;
        /* Loop through all table rows (except the
        first, which contains table headers): */
        for (i = 1; i < (rows.length - 1); i++) {
            // Start by saying there should be no switching:
            shouldSwitch = false;
            /* Get the two elements you want to compare,
            one from current row and one from the next: */
            x = rows[i].getElementsByTagName("TD")[sortBy];
            y = rows[i + 1].getElementsByTagName("TD")[sortBy];
            /* Check if the two rows should switch place,
            based on the direction, asc or desc: */
            if (dir == "asc") {
                if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                    // If so, mark as a switch and break the loop:
                    shouldSwitch = true;
                    break;
                }
            } else if (dir == "desc") {
                if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
                    // If so, mark as a switch and break the loop:
                    shouldSwitch = true;
                    break;
                }
            }
        }
        if (shouldSwitch) {
            /* If a switch has been marked, make the switch
            and mark that a switch has been done: */
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
            // Each time a switch is done, increase this count by 1:
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

var isPlaying = false;
function playAudio() {
    player = document.getElementById("player");
    player.paused ? player.play() : player.pause();

    document.getElementById("playButton").classList.toggle("paused");
}

function adjustVolume() {
    volumeSlider = document.getElementById("volumeSlider");
    player = document.getElementById("player");
    player.volume = volumeSlider.value / 100.0;
}