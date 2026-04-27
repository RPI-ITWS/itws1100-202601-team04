"""
fetch_previews.py

This script retrieves audio preview URLs for songs using the iTunes Search API.
It reads from songs.json, queries the API using song title and artist,
and updates the dataset with previewUrl values.

Used during development to populate missing audio previews.
"""
import json
import urllib.request
import urllib.parse
import time

INPUT_FILE = "data/songs.json"
OUTPUT_FILE = "data/songs.json"

def get_preview_url(title, artist):
    query = urllib.parse.quote(f"{artist} {title}")
    url = f"https://itunes.apple.com/search?term={query}&limit=1&entity=song"

    try:
        with urllib.request.urlopen(url, timeout=5) as response:
            data = json.loads(response.read().decode())
            results = data.get("results", [])
            if results:
                return results[0].get("previewUrl", "")
    except Exception as e:
        print(f"  ERROR fetching '{title}' by {artist}: {e}")

    return ""

def main():
    with open(INPUT_FILE, "r", encoding="utf-8") as f:
        songs = json.load(f)

    total = len(songs)
    found = 0
    not_found = []

    for i, song in enumerate(songs):
        title = song.get("title", "")
        artist = song.get("artist", "")

        print(f"[{i+1}/{total}] {title} — {artist}")

        preview = get_preview_url(title, artist)

        if preview:
            song["previewUrl"] = preview
            found += 1
            print(f"  ✓ Found preview")
        else:
            song["previewUrl"] = ""
            not_found.append(f"{title} by {artist}")
            print(f"  ✗ No preview found")

        # Be polite to the API — don't hammer it
        time.sleep(0.3)

    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(songs, f, indent=2, ensure_ascii=False)

    print(f"\nDone. {found}/{total} songs got preview URLs.")

    if not_found:
        print(f"\nSongs with no preview ({len(not_found)}):")
        for s in not_found:
            print(f"  - {s}")

if __name__ == "__main__":
    main()