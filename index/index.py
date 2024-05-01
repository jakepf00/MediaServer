import sqlite3
import sys
from yattag import Doc
from enum import IntEnum

class SongData(IntEnum):
    id = 0
    file_path = 1
    title = 2
    album = 3
    artist = 4
    band = 5
    conductor = 6
    composer = 7
    track = 8

# Parse URL
queries = {}
for query in sys.argv[1:]:
    query_split = query.split('=')
    queries[query_split[0]] = query_split[1]

# Establish database connection
con = sqlite3.connect("media.db")
cur = con.cursor()

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
            for row in cur.execute("SELECT * FROM files").fetchall():
                with tag('li'):
                    with tag('a', href='index?song='+str(row[0])):
                        # Use song name if it exists, else use filename
                        # TODO: function to generate song name from title or filename (use later in footer)
                        if (row[SongData.title] != ""):
                            text(row[SongData.title])
                        else:
                            text(row[SongData.file_path])
        with tag('div', klass="footer"):
            if 'song' in queries:
                curSong = cur.execute("SELECT * FROM files WHERE id={0}".format(queries['song'])).fetchone()
                with tag('audio', id="player"):
                    doc.stag('source', src='{0}'.format(str(curSong[1])))
                with tag('h3'):
                    if (curSong[SongData.title] != ""):
                        text(curSong[SongData.title])
                    else:
                        text(curSong[SongData.file_path])
                with tag('div', id="audioControls"):
                    with tag('button', id="playButton", onclick="playAudio()"):
                        text('Play/Pause')
                    doc.stag('input', type="range", min="0", max="100", value="100", klass="volumeSlider", id="volumeSlider", oninput="adjustVolume()")

# Returning HTML results
print(doc.getvalue())
