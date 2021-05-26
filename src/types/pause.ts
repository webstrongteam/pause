import { Difficulty, Time } from './settings'

export interface Pause {
	exercise?: Exercise
	points?: number
}

export interface Exercise {
	name: string
	difficulty: Difficulty
	iconName: string
	requiredLevel: number
	time: Record<
		Time,
		{
			pauseTime: number
			exerciseCount: number
			exerciseTime: number
			totalTime: number
		}
	>
}
