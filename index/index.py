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
    songToLoad = queries['song'] if 'song' in queries else ''
    with tag('body', song_to_load=songToLoad):
        with tag('div', klass="header"):
            with tag('a', href="#", klass="logo"):
                text("Media Server")
            with tag('div', klass="header-right"):
                with tag('a', href="#"):
                    text("Settings")
        with tag('h2'):
            text('Tracks')
        doc.stag('input', type="text", id="trackFilterInput", placeholder="Search for track...")
        with tag('table', id='trackList'):
            with tag('tr', klass='header'):
                with tag('th', sort_by="0"):
                    text("Title")
                with tag('th', sort_by="1"):
                    text("Artist")
                with tag('th', sort_by="2"):
                    text("Album")
            for song in cur.execute("SELECT id, file_path, title, artist, album FROM files").fetchall():
                songId = song[0]
                filePath = str(song[1]).replace("\\", "\\\\")
                songName = song[2]
                with tag('tr', song_id=songId, file_path=filePath, song_name=songName):
                    with tag('td'):
                        text(str(getSongName(song[0])))
                    with tag('td'):
                        text(song[3])
                    with tag('td'):
                        text(song[4])
        with tag('div', klass="footer", id="audio-player-container"):
            with tag('audio', preload="metadata"):
                doc.stag('source', id='audioSource')
            with tag('h3', id="currentSongTitle"):
                text('')
            with tag('div', id="audioControls", style="display: none;"):
                with tag('button', id="playButton"):
                    text('Play/Pause')
                with tag('span', id="current-time", klass="time"):
                    text("0:00")
                doc.stag('input', type="range", min="0", max="100", value="0", id="seek-slider")
                with tag('span', id="duration", klass="time"):
                    text("0:00")
                doc.stag('input', type="range", min="0", max="100", value="100", klass="volumeSlider", id="volumeSlider")
        with tag('script', src='index/index.js'):
            text('')

# Returning HTML results
print(doc.getvalue())