import sqlite3
from yattag import Doc

# Establish database connection
con = sqlite3.connect("media.db")
cur = con.cursor()

# Yattag document setup
doc, tag, text = Doc().tagtext()

# HTML definition
with tag('h1'):
    text('Media Server')
with tag('h2'):
    text('Tracks')
for row in cur.execute("SELECT * FROM files").fetchall():
	with tag('ul'):
		text(row[1])

# Returning HTML results
print(doc.getvalue())
