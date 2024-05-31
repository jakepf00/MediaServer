import json
import os
import sqlite3
from mutagen.id3 import ID3NoHeaderError
from mutagen.id3 import ID3

directory = []
if os.path.exists("settings.json"):
    with open("settings.json", "r") as settingsFile:
        settingsJson = json.load(settingsFile)
        if "media-directory" in settingsJson.keys():
            directory.append(settingsJson["media-directory"])

results = []

while len(directory) > 0:
    for path in os.listdir(directory[0]):
        full_path = os.path.join(directory[0], path)
        if os.path.isfile(full_path):
            # Pull existing id3 tags or create new ones
            try: 
                tags = ID3(full_path)
            except ID3NoHeaderError:
                print("Adding ID3 header to " + full_path)
                tags = ID3()
            # Pull specific tag data
            title = tags["TIT2"].text[0] if "TIT2" in tags else ""
            album = tags["TALB"].text[0] if "TALB" in tags else ""
            artist = tags["TPE1"].text[0] if "TPE1" in tags else ""
            band = tags["TPE2"].text[0] if "TPE2" in tags else ""
            conductor = tags["TPE3"].text[0] if "TPE3" in tags else ""
            composer = tags["TCOM"].text[0] if "TCOM" in tags else ""
            track = tags["TRCK"].text[0] if "TRCK" in tags else ""
            
            new_data = (full_path, title, album, artist, band, conductor, composer, track)
            results.append(new_data)
        else:
            directory.append(full_path)
    directory.pop(0)
print(results)


connection = sqlite3.connect("media.db")
with connection:
    connection.execute("""CREATE TABLE IF NOT EXISTS files (
                            id INTEGER PRIMARY KEY,
                            file_path TEXT,
                            title TEXT,
                            album TEXT,
                            artist TEXT,
                            band TEXT,
                            conductor TEXT,
                            composer TEXT,
                            track TEXT
                        );""")
for data in results:
    connection.executemany("INSERT INTO files (file_path, title, album, artist, band, conductor, composer, track) VALUES (?, ?, ?, ?, ?, ?, ?, ?);", (data,))
    connection.commit()