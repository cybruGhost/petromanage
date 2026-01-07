 🎵 **Made with ❤️ by a learner** [cybruGhost](https://github.com/cybruGhost)

**⭐ Don't forget to star and follow for updates! 🚀**

---

## 📋 **Supported Playlist Formats**

### 🧩 **1. Compatible App Format (Native Format)**
```csv
PlaylistBrowseId,PlaylistName,MediaId,Title,Artists,Duration,ThumbnailUrl
,Swipefy,1pEe7-tWv2M,Good Grief,Jenna Raine,160,https://inv.perditum.com/vi/1pEe7-tWv2M/hqdefault.jpg
,Swipefy,yuPIdLtcqf0,Elastic Heart,Lauren Spencer Smith,270,https://inv.perditum.com/vi/yuPIdLtcqf0/hqdefault.jpg
,Swipefy,s5vP_JVJ524,empty room,Isaac Levi,167,https://inv.perditum.com/vi/s5vP_JVJ524/hqdefault.jpg
Required Columns:

PlaylistBrowseId (optional)

PlaylistName

MediaId (YouTube video ID, e.g., 1pEe7-tWv2M)

Title

Artists

Duration (in seconds)

ThumbnailUrl

🧱 2. Extended App Format (With Album Info)
csv
PlaylistBrowseId,PlaylistName,MediaId,Title,Artists,Duration,ThumbnailUrl,AlbumId,AlbumTitle,ArtistIds
,MyPlaylist,abc123,Song Title,Artist Name,180,https://example.com/thumb.jpg,album123,Album Name,artist123
Required Columns:

PlaylistBrowseId

PlaylistName

MediaId

Title

Artists

Duration

ThumbnailUrl

AlbumId

AlbumTitle

ArtistIds

🎧 3. Spotify Export Format
csv
Track Name,Artist Name(s),Track Duration (ms),Album Name,Album Image URL,Explicit
Blinding Lights,The Weeknd,200040,After Hours,https://i.scdn.co/image/ab67616d0000b273,false
Dance Monkey,Tones and I,209320,The Kids Are Coming,https://i.scdn.co/image/ab67616d0000b273,false
Required Columns:

Track Name

Artist Name(s)

Track Duration (ms) (milliseconds)

Album Name

Album Image URL

Explicit (true/false)

💽 4. Exportify Format (Enhanced Spotify Export)
csv
Track URI,Track Name,Artist Name(s),Album Name,Album Image URL,Track Duration (ms),Explicit,Playlist Name
spotify:track:123,Blinding Lights,The Weeknd,After Hours,https://i.scdn.co/image/ab67616d0000b273,200040,false,My Spotify Playlist
spotify:track:456,Dance Monkey,Tones and I,The Kids Are Coming,https://i.scdn.co/image/ab67616d0000b273,209320,false,My Spotify Playlist
Required Columns:

Track URI

Track Name

Artist Name(s)

Album Name

Album Image URL

Track Duration (ms)

Explicit

Playlist Name

🪶 5. Custom Format (Minimal)
csv
PlaylistBrowseId,PlaylistName,MediaId,Title,Artists,Duration
,MyPlaylist,abc123,Song Title,Artist Name,180
,MyPlaylist,def456,Another Song,Another Artist,240
Required Columns:

PlaylistBrowseId

PlaylistName

MediaId

Title

Artists

Duration

⚙️ How Cubic Music Handles Each Format
✅ Compatible Formats (No Conversion Needed)
These formats are imported directly using the exact MediaId values:

App Format

Extended App Format

Custom Format

🔄 Conversion Formats (YouTube API Conversion)
These formats are converted to playable YouTube tracks:

Spotify Export

Exportify

📦 Expected Output Format After Import
All imported playlists are standardized into this format:

csv
PlaylistBrowseId,PlaylistName,MediaId,Title,Artists,Duration,ThumbnailUrl
,Imported Playlist,1pEe7-tWv2M,Good Grief,Jenna Raine,160,https://yt.omada.cafe/vi/1pEe7-tWv2M/hqdefault.jpg
Key Points:

MediaId → raw YouTube video ID (no prefixes)

Duration → in seconds

ThumbnailUrl → Invidious format (https://yt.omada.cafe//vi/<MediaId>/hqdefault.jpg)

PlaylistName → derived from CSV or filename

All songs are playable immediately after import
