import { Difficulty, Settings } from '../src/types/settings'
import { Pause } from '../src/types/pause'

export const defaultSettings: Settings = {
	id: 1,
	lang: 'en',
	level: 1,
	points: 0,
	difficulty: 'easy',
	time: 'medium',
	version: '1.0.0',
}

export const musicExample = {
	name: 'Sea',
	requiredLevel: 1,
}

export const exerciseExample = {
	name: 'Wall Sit',
	difficulty: 'easy' as Difficulty,
	iconName: 'wall_sit',
	requiredLevel: 1,
	time: {
		short: {
			pauseTime: 20,
			exerciseCount: 3,
			exerciseTime: 40,
			totalTime: 160,
		},
		medium: {
			pauseTime: 20,
			exerciseCount: 4,
			exerciseTime: 50,
			totalTime: 260,
		},
		long: {
			pauseTime: 20,
			exerciseCount: 6,
			exerciseTime: 70,
			totalTime: 460,
		},
	},
}

export const themeExample = {
	requiredLevel: 1,
	colors: {
		primary: '#1A6A73',
		secondary: '#FFFFFF',
		third: '#C5D1D9',
		optional: '#5A5A5A',
		progress: '#F2B077',
	},
}

export const pauseExample: Pause = {
	music: musicExample,
	exercise: exerciseExample,
}
