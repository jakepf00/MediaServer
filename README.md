# Media Server

Python media server built for classical music.

# Features

Media Scanner
- mp3 id3v2 metadata scanning using mutagen
- SQLite database to manage music data

Web Server
- URL parsing using urllib
- Common Gateway Interface implementation to run python scripts
- Support for byte-range requests to seek specific times in songs


# Usage

Place all media in a folder named 'media' at the root of the project (next to MediaScan.py and Server.py). Media can be organized in folders in any way you'd like, as all metadata is read from id3v2 tags on the files. Currently, only mp3 files are supported. Scan the media by running 'python MediaScan.py'<br>

Once media is scanned, start the server by running 'python Server.py'<br>

Navigate to localhost:8080/index in a web browser to access your music library.

# Planned Features/Fixes

### Media Controls
- Better play/pause button
- Better volume slider
- Seek slider - fix
- Seek slider - display buffered amount

### Media Scanning
- Allow spaces in filename
- MediaScan.py - split up reading directories, id3 tagging, and database into functions
- Add song duration data to db?
- Use file structure/naming to help with music tagging in DB

### Admin
- File upload from website
- id3 metadata editing from website
- Allow spaces in media directory path
- Allow rescanning files/metadata

### Other
- Album view, artist view...
- Album covers
- Cookies? Remember song played...
- Playlist/queue
- Play non mp3 music
- Media Session API
- HTTPS?
- CSS - extract duplicate into central file?
- Gitignore
- Refactor server code - get/post methods handling too much
