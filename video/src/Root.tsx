import { Composition } from 'remotion'
import './style.css'
import './fonts'
import { NirmaanVideo, type VideoProps } from './Video'
import { FPS, HEIGHT, TOTAL_FRAMES, WIDTH } from './timeline'

const defaults: VideoProps = { voiceover: true, captions: true, music: false, sfx: true }

export function RemotionRoot() {
  return (
    <Composition
      id="NirmaanDemo"
      component={NirmaanVideo}
      durationInFrames={TOTAL_FRAMES}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
      defaultProps={defaults}
    />
  )
}
