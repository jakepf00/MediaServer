function filterTracks() {
    var input, filter, ul, li, a, i, txtValue;
    input = document.getElementById('trackFilterInput');
    filter = input.value.toUpperCase();
    ul = document.getElementById("tracksUL");
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

function sortTracks() {
    var list, i, switching, b, shouldSwitch, dir, switchcount = 0;
    list = document.getElementById("tracksUL");
    switching = true;
    dir = "asc";
    while (switching) {
        switching = false;
        b = list.getElementsByTagName("LI");
        for (i = 0; i < (b.length - 1); i++) {
            shouldSwitch = false;
            if (dir == "asc") {
                if (b[i].innerHTML.toLowerCase() > b[i + 1].innerHTML.toLowerCase()) {
                    shouldSwitch = true;
                    break;
                }
            } else if (dir == "desc") {
                if (b[i].innerHTML.toLowerCase() < b[i + 1].innerHTML.toLowerCase()) {
                    shouldSwitch = true;
                    break;
                }
            }
        }
        if (shouldSwitch) {
            b[i].parentNode.insertBefore(b[i + 1], b[i]);
            switching = true;
            switchcount++;
        } else {
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