import { Difficulty, Time } from './settings'

export interface Pause {
	music?: Music
	exercise?: Exercise
	points?: number
}

export interface Music {
	name: string
	requiredLevel: number
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

export interface Theme {
	requiredLevel: number
	colors: {
		primary: string
		secondary: string
		third: string
		optional: string
		progress: string
	}
}
