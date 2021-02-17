import { Difficulty, Time } from './settings'

export interface Pause {
	music: Music
	exercise: Exercise
	points: number
}

export type Music = {
	name: string
	src: string
	photoSrc: string
	requiredLevel: number
}

export type Exercise = {
	name: string
	difficulty: Difficulty
	iconSrc: string
	basePoints: number
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
