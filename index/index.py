import sqlite3
import sys
from yattag import Doc

# Establish database connection
con = sqlite3.connect("media.db")
cur = con.cursor()

def getSongName(id):
    song = cur.execute("SELECT title, file_path FROM files WHERE id={0}".format(id)).fetchone()
    # Use song name if it exists, else use filename
    if (song[0] != ""):
        return song[0]
    else:
        return song[1]

# Parse URL
queries = {}
for query in sys.argv[1:]:
    query_split = query.split('=')
    queries[query_split[0]] = query_split[1]

# Yattag document setup
doc, tag, text = Doc().tagtext()

# HTML definition
doc.stag('!DOCTYPE', html='')
with tag('html'):
    with tag('head'):
        doc.stag('link', rel='stylesheet', href='index/index.css')
        with tag('script', src='index/index.js'):
            text('')
    with tag('body'):
        with tag('h1'):
            text('Media Server')
        with tag('h2'):
            text('Tracks')
        doc.stag('input', type="text", id="trackFilterInput", onkeyup="filterTracks()", placeholder="Search for track...")
        text('Sort by:')
        with tag('button', onclick="sortTracks()"):
            text('Title')
        with tag('ul', id='tracksUL'):
            for song in cur.execute("SELECT id, file_path, title FROM files").fetchall():
                with tag('li'):
                    songId = song[0]
                    filePath = str(song[1]).replace("\\", "\\\\")
                    songName = song[2]
                    with tag('a', onclick='loadSong(\"{0}\",\"{1}\",\"{2}\")'.format(songId, filePath, songName)):
                        text(str(getSongName(song[0])))
        with tag('div', klass="footer"):
            if 'song' in queries:
                curSong = cur.execute("SELECT file_path FROM files WHERE id={0}".format(queries['song'])).fetchone()
                with tag('audio', id="player"):
                    doc.stag('source', id='audioSource', src='{0}'.format(str(curSong[0])))
                with tag('h3', id="currentSongTitle"):
                    text(getSongName(queries['song']))
                with tag('div', id="audioControls"):
                    with tag('button', id="playButton", onclick="playAudio()"):
                        text('Play/Pause')
                    doc.stag('input', type="range", min="0", max="100", value="100", klass="volumeSlider", id="volumeSlider", oninput="adjustVolume()")

# Returning HTML results
print(doc.getvalue())