# Nirmaan demo video

A ~2:20 motion-graphics product demo, built with [Remotion](https://www.remotion.dev) (React → MP4) in the same visual language as the site. Scenes are timed from the voiceover, so swapping the voice re-fits the whole video automatically.

## Make the video

```bash
npm install
npm run sfx                      # synthesise the sound effects (once)
node scripts/vo.mjs              # voiceover: macOS scratch voice by default
npx tsx scripts/export-script.ts # SCRIPT.md + out/nirmaan-demo.srt
npx remotion render src/index.ts NirmaanDemo out/nirmaan-demo.mp4 --crf=18
```

Preview and scrub in the browser with `npm run studio`.

## Voiceover options

| Voice | How |
|---|---|
| ElevenLabs | Put `ELEVENLABS_API_KEY` and `ELEVENLABS_VOICE_ID` in `video/.env` (git-ignored), then `node scripts/vo.mjs`. Library voices need a paid ElevenLabs plan. |
| Your own voice | Record one file per line (ids in `SCRIPT.md`) into `public/vo/<id>.wav` (or .mp3/.m4a), then `node scripts/vo.mjs --measure`. |
| No voice | Render with `--props='{"voiceover":false,"captions":true,"music":false,"sfx":true}'`. |

Background music: drop a royalty-free track at `public/music.mp3` and render with `"music":true` (it ducks under the voice automatically).

## Where things live

- `src/timeline.ts`: scene order, which line plays where, and timing
- `src/scenes/*`: one component per scene
- `src/vo-lines.json`: the script (spoken text, caption text, captions on/off)
- `src/config.ts`: name, contact details, site URL on the end cards
