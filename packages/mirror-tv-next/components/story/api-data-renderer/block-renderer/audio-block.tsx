'use client'
import { type ApiDataBlockBase, ApiDataBlockType } from './type'
import AudioPlayer from '~/components/shared/audio-player'

type CoverPhoto = {
  id: string
  name: string
  urlOriginal: string
}

type AudioV2_MM = {
  id: string
  name: string
  url: string
  coverPhoto: CoverPhoto
}

type ContentAudioV2_MM = AudioV2_MM

export interface ApiDataAudio extends ApiDataBlockBase {
  type: ApiDataBlockType.Audio
  content: [ContentAudioV2_MM]
  alignment: 'center'
}

const AudioBlock = ({ data }: { data: ApiDataAudio }) => {
  const audioData = data.content[0]
  return <AudioPlayer src={audioData.url} title={audioData.name} />
}

export default AudioBlock
