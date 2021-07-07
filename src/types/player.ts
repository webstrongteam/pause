import { Sound } from 'expo-av/build/Audio'
import { Video } from 'expo-av'

export interface Player {
	status: PlayerStatus
	openModal: boolean
	modalType: 'leaveModal' | 'exerciseInfoModal' | 'ratingsModal'
	fullTime?: number
	exerciseTime: number
	pauseTime: number
	videoUri?: string
	pauseEffect?: Sound
	finishEffect?: Sound
	videoRef?: Video
}

export type Ratings = Partial<Record<RatingType, number>>
export type RatingType = 'general' | 'difficulty' | 'time'

export type PlayerStatus = 'exercising' | 'pause' | 'stop' | 'preview' | 'exit' | 'finish'
