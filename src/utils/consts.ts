// Levels
export const basePoints = 75
export const baseLevelPoints = 220
export const progressMultiplier = 10

// Times
export const shortTimeMultiplier = 1
export const mediumTimeMultiplier = 1.5
export const longMultiplier = 1.8

// Difficulty
export const easyDifficultyMultiplier = 1
export const mediumDifficultyMultiplier = 2
export const hardDifficultyMultiplier = 2.5

// Assets maps
export const imageMap: Record<string, number> = {
	Sea: require('../../assets/pause/music/sea/sea.jpg'),
}

export const musicMap: Record<string, number> = {
	Sea: require('../../assets/pause/music/sea/sea.mp3'),
}

export const exerciseMap: Record<string, number> = {
	wall_sit: require('../../assets/pause/exercises/wall_sit.svg'),
}
