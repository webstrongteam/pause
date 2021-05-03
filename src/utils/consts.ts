import { Dimensions, StatusBar } from 'react-native'
import colors from '../config/colors.json'

export const optionalColor = '#5A5A5A'

export const { width, height } = Dimensions.get('window')
export const STATUS_BAR_HEIGHT = StatusBar.currentHeight ?? 20

export const headerHeight = height / 7
export const centerHeight = height * 0.4

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

export const defaultTheme = [colors[0].color, colors[1].color, colors[2].color, colors[3].color]

// Assets maps
export const imageMap: Record<string, number> = {
	Sea: require('../../assets/pause/music/sea/sea.jpg'),
}

export const musicMap: Record<string, number> = {
	Sea: require('../../assets/pause/music/sea/sea.mp3'),
}

export const exerciseMap: Record<string, number> = {
	wall_sit: require('../../assets/pause/exercises/wall_sit.png'),
}
