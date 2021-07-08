import { Difficulty, Time } from './settings'

export interface Pause {
	exercise?: Exercise
	points?: number
}

export interface Exercise {
	videoId: string
	difficulty: Difficulty
	requiredLevel: number
	time: Record<Time, ExerciseTime>
}

export type ExerciseTime = {
	pauseTime: number
	exerciseCount: number
	exerciseTime: number
}
