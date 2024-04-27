import sqlite3
import sys
from yattag import Doc

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
        doc.stag('link', rel='stylesheet', href='index.css')
        with tag('script', src='index.js'):
            text('')
    with tag('body'):
        with tag('h1'):
            text('Media Server')
        if 'song' in queries:
            with tag('audio', controls=''):
                curSong = cur.execute("SELECT * FROM files WHERE id={0}".format(queries['song'])).fetchone()
                doc.stag('source', src='{0}'.format(str(curSong[1])))
        with tag('h2'):
            text('Tracks')
        doc.stag('input', type="text", id="trackFilterInput", onkeyup="filterTracks()", plackholder="Search for track...")
        with tag('ul', id='tracksUL'):
            for row in cur.execute("SELECT * FROM files").fetchall():
                with tag('li'):
                    with tag('a', href='index.py?song='+str(row[0])):
                        text(row[1])

# Returning HTML results
print(doc.getvalue())
