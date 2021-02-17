import { NativeModules, Platform } from 'react-native'
import { Exercise, Music, Pause } from '../types/pause'
import {
	baseLevelPoints,
	basePoints,
	easyDifficultyMultiplier,
	hardDifficultyMultiplier,
	longMultiplier,
	mediumDifficultyMultiplier,
	mediumTimeMultiplier,
	shortTimeMultiplier,
} from './consts'
import musics from '../config/music.json'
import exercises from '../config/exercises.json'
import { Difficulty, Settings, Time } from '../types/settings'

const getRandomIndex = (length: number): number => Math.floor(Math.random() * length)

export const getLocale = () => {
	const locale =
		Platform.OS === 'ios'
			? NativeModules.SettingsManager.settings.AppleLocale
			: NativeModules.I18nManager.localeIdentifier
	if (locale === 'pl_PL') {
		return 'pl'
	}
	return 'en'
}

export const getRandomPause = (settings: Settings): Pause => ({
	music: getRandomMusic(settings.level),
	exercise: getRandomExercises(settings.level, settings.difficulty),
	points: basePoints * getPointsMultiplier(settings.time, settings.difficulty),
})

export const getRequiredPointsToLevelUp = (level: number, points: number): number =>
	baseLevelPoints * level + level * 20 - points

const getRandomMusic = (level: number): Music => {
	const availableMusics = (musics as Music[]).filter((music) => music.requiredLevel <= level)
	const randomIndex = getRandomIndex(availableMusics.length)

	return availableMusics[randomIndex]
}

const getRandomExercises = (level: number, difficulty: Difficulty): Exercise => {
	const availableExercises = (exercises as Exercise[]).filter(
		(exercise) => exercise.requiredLevel <= level && exercise.difficulty === difficulty,
	)
	const randomIndex = getRandomIndex(availableExercises.length)

	return availableExercises[randomIndex]
}

const timeMultiplierMapper: Record<Time, number> = {
	short: shortTimeMultiplier,
	medium: mediumTimeMultiplier,
	long: longMultiplier,
}

const difficultyMultiplierMapper: Record<Difficulty, number> = {
	easy: easyDifficultyMultiplier,
	medium: mediumDifficultyMultiplier,
	hard: hardDifficultyMultiplier,
}

const getPointsMultiplier = (time: Time, difficulty: Difficulty) =>
	timeMultiplierMapper[time] + difficultyMultiplierMapper[difficulty]
