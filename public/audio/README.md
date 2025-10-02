# Audio Files for Birthday Card

## MP3 Setup Instructions

To use a real MP3 file for the Happy Birthday song:

1. **Add your MP3 file** to this directory and name it: `happy-birthday.mp3`

2. **MP3 Requirements**:
   - Format: MP3
   - Duration: 30-60 seconds recommended (will loop automatically)
   - Quality: 128kbps or higher for good quality
   - Volume: Pre-normalized to avoid being too loud/quiet

3. **File Path**: The birthday card will automatically look for:
   ```
   /app/public/audio/happy-birthday.mp3
   ```

4. **Fallback System**: 
   - If the MP3 file is not found or fails to load, the card will automatically use the enhanced synthesized version
   - No error will be shown to the user - it will gracefully fallback

## Alternative Audio Files

You can also add:
- `confetti-sound.mp3` - For confetti particle sounds
- `envelope-open.mp3` - For envelope opening sound effect

## Audio Implementation Features

✅ **Auto-play**: Starts when envelope opens  
✅ **Looping**: Continuous playback during card viewing  
✅ **Volume Control**: Mute/unmute button available  
✅ **Mobile Support**: Works on mobile devices  
✅ **Graceful Fallback**: Uses synthesized audio if MP3 fails  

## Browser Compatibility

Modern browsers support:
- Chrome/Edge: Full support
- Firefox: Full support  
- Safari: Full support
- Mobile browsers: Full support (user interaction required for autoplay)

## Legal Note

Since this is for private, personal use for Uncle Rajendra Regmi's birthday card, you can use any Happy Birthday recording you have legally acquired.