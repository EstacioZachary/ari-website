# 🎵 Music Folder

Add your MP3 music files here with these exact names:

## Required Files:

**For Ambient (🌌):**
- `ambient.mp3` (primary)
- `ambient-backup.mp3` (fallback)

**For Lo-Fi (🎹):**
- `lofi.mp3` (primary)
- `lofi-backup.mp3` (fallback)

**For Meditation (🧘):**
- `meditation.mp3` (primary) 
- `meditation-backup.mp3` (fallback)

**For Nature (🌿):**
- `nature.mp3` (primary)
- `nature-backup.mp3` (fallback)

## Where to find free music:

1. **Pixabay Music** - https://pixabay.com/music/
2. **Epidemic Sound** - https://www.epidemicsound.com/ (free tier)
3. **Free Music Archive** - https://freemusicarchive.org/
4. **YouTube Audio Library** - https://www.youtube.com/audiolibrary/
5. **Incompetech** - https://incompetech.com/

## Steps:
1. Download your chosen MP3 files
2. Rename them to match the names above
3. Place them in this `music` folder
4. Push changes to GitHub and Vercel will auto-deploy

The website will play files in this order: primary → fallback. If both fail, you'll see an error message.
