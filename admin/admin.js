const selectRootFolderButton = document.getElementById("selectRootFolderButton");
const currentDir = document.getElementById("currentDir");
const selectButton = document.getElementById("selectButton");
const cancelButton = document.getElementById("cancelButton");

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
            document.getElementById("fileSelector").style.display = "block";
        });
}

selectRootFolderButton.addEventListener("click", fetchFiles);

function selectFile(file) {
    currentDir.innerText += file + '/';
    fetchFiles();
}

selectButton.addEventListener("click", () => {
    alert('You selected: ' + currentDir.innerText);
    currentDir.innerText = "";
    document.getElementById("fileSelector").style.display = "none";
});

cancelButton.addEventListener("click", () => {
    currentDir.innerText = "";
    document.getElementById("fileSelector").style.display = "none";
});