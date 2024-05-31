const selectRootFolderButton = document.getElementById("selectRootFolderButton");
const rescanLibraryButton = document.getElementById("rescanLibraryButton");
const currentDir = document.getElementById("currentDir");
const selectButton = document.getElementById("selectButton");
const cancelButton = document.getElementById("cancelButton");
const fileSelectorModal = document.getElementById("fileSelectorModal");

function fetchFiles() {
    if (currentDir.innerText == "") fetchUrl = "/files";
    else fetchUrl = "/files?directory=" + currentDir.innerText;

    fetch(fetchUrl)
        .then(response => response.json())
        .then(files => {
            const fileList = document.getElementById('fileList');
            fileList.innerHTML = '';
            files.forEach(file => {
                const listItem = document.createElement("li");
                listItem.textContent = file;
                listItem.onclick = () => selectFile(file);
                fileList.appendChild(listItem);
            });
            fileSelectorModal.style.display = "block";
        });
}

selectRootFolderButton.addEventListener("click", fetchFiles);

function rescanLibrary() {
    // Sending and receiving data in JSON format using POST method
    var xhr = new XMLHttpRequest();
    var url = "/rescan-library";
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    var data = JSON.stringify({ "rescan-library": "true" });
    xhr.send(data);
}

rescanLibraryButton.addEventListener("click", rescanLibrary)

function selectFile(file) {
    currentDir.innerText += file + '/';
    fetchFiles();
}

selectButton.addEventListener("click", () => {
    // Sending and receiving data in JSON format using POST method
    var xhr = new XMLHttpRequest();
    var url = "/set-media-directory";
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    var data = JSON.stringify({ "media-directory": currentDir.innerText });
    xhr.send(data);

    // Set frontend stuff
    currentDir.innerText = "";
    fileSelectorModal.style.display = "none";

    // Rescan library automatically when directory changes
    rescanLibrary();
});

cancelButton.addEventListener("click", () => {
    currentDir.innerText = "";
    fileSelectorModal.style.display = "none";
});