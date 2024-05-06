# Media Server

Python media server built for classical music.

# Features

Media Scanner
- mp3 id3v2 metadata scanning using mutagen
- SQLite database to manage music data

Web Server
- URL parsing using urllib
- Common Gateway Interface implementation to run python scripts


# Usage

Place all media in a folder named 'media' at the root of the project (next to MediaScan.py and Server.py). Media can be organized in folders in any way you'd like, as all metadata is read from id3v2 tags on the files. Currently, only mp3 files are supported. Scan the media by running 'python MediaScan.py'<br>

Once media is scanned, start the server by running 'python Server.py'<br>

Navigate to localhost:8080/index in a web browser to access your music library.

# Planned Features/Fixes

- Allow spaces in filename<br>
- Song time slider in media controls<br>
- MediaScan.py - split up reading directories, id3 tagging, and database into functions<br>
- Album view, artist view...<br>
- Album covers<br>
- Media controls - more...<br>
- Cookies? Remember song played...<br>
- Playlist/queue<br>
- Play non mp3 music<br>
- Add song duration data to db