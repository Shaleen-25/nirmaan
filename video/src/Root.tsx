import { Composition } from 'remotion'
import './style.css'
import './fonts'
import { NirmaanVideo, type VideoProps } from './Video'
import { FPS, HEIGHT, TOTAL_FRAMES, WIDTH } from './timeline'
import { NirmaanStory, type StoryProps } from './story/Story'
import { STORY_HEIGHT, STORY_TOTAL_FRAMES, STORY_WIDTH } from './story/timeline'

const defaults: VideoProps = { voiceover: true, captions: true, music: true, sfx: true }
const storyDefaults: StoryProps = { voiceover: true, captions: true, music: true, sfx: true }

export function RemotionRoot() {
  return (
    <>
      <Composition
        id="NirmaanDemo"
        component={NirmaanVideo}
        durationInFrames={TOTAL_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
        defaultProps={defaults}
      />
      {/* 9:16 Instagram story */}
      <Composition
        id="NirmaanStory"
        component={NirmaanStory}
        durationInFrames={STORY_TOTAL_FRAMES}
        fps={FPS}
        width={STORY_WIDTH}
        height={STORY_HEIGHT}
        defaultProps={storyDefaults}
      />
    </>
  )
}
