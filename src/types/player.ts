import { Sound } from 'expo-av/build/Audio'
import { Video } from 'expo-av'

export interface Player {
	status: 'exercising' | 'pause' | 'stop' | 'preview' | 'exit' | 'finish'
	exerciseProgress: number
	openModal: boolean
	modalType: 'leaveModal' | 'exerciseInfoModal'
	fullTime?: number
	exerciseTime: number
	pauseTime: number
	pauseEffect?: Sound
	finishEffect?: Sound
	videoRef?: Video
}
