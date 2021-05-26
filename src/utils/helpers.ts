import { NativeModules, Platform } from 'react-native'
import { Exercise, Pause } from '../types/pause'
import { Difficulty, NextLevelBenefits, Settings, Time } from '../types/settings'
import { Color } from '../types/theme'
import { TextType, ViewType } from '../types/styles'
import config from '../config/config'
import {
	baseExercisePoints,
	baseLevelPoints,
	easyDifficultyMultiplier,
	hardDifficultyMultiplier,
	longMultiplier,
	mediumDifficultyMultiplier,
	mediumTimeMultiplier,
	progressSqrt,
	shortTimeMultiplier,
} from './consts'

import exercises from '../resources/exercises.json'
import colors from '../resources/colors.json'

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

export const getShadowOpt = (size: number) => ({
	width: size,
	height: size,
	color: '#000',
	border: size * 0.2,
	radius: size / 2,
	opacity: 0.1,
	x: 0,
	y: 0,
	style: { marginVertical: 0 },
})

export const getRandomPause = (pause: Pause, settings: Settings): Pause => ({
	exercise: getRandomExercises(pause.exercise, settings.level, settings.difficulty),
	points: +(baseExercisePoints * getPointsMultiplier(settings.time, settings.difficulty)).toFixed(
		0,
	),
})

export const getPointsToLevelUp = (level: number): number => {
	if (!level) return 0

	const nextLevel = level + 1
	return +(baseLevelPoints * nextLevel * (nextLevel * Math.sqrt(progressSqrt))).toFixed(0)
}

export const getNextLevelBenefits = (level: number): NextLevelBenefits => {
	const nextLevelExercises = (exercises as Exercise[]).filter(
		(exercise) => exercise.requiredLevel === level + 1,
	)
	const nextLevelColors = (colors as Color[]).filter((color) => color.requiredLevel === level + 1)

	return {
		exercises: nextLevelExercises.length,
		colors: nextLevelColors.length,
	}
}

export const addBackgroundColor = (baseStyles: {}, backgroundColor: string): ViewType => [
	baseStyles,
	{ backgroundColor },
]

export const addTextColor = (baseStyles: {}, textColor: string): TextType => [
	baseStyles,
	{ color: textColor },
]

export const getColorGrayscale = (color: string): number => {
	const preparedColor = color.substring(1, 7)
	const r = parseInt(preparedColor.substring(0, 2), 16) // Red intensity
	const g = parseInt(preparedColor.substring(2, 4), 16) // Green intensity
	const b = parseInt(preparedColor.substring(4, 6), 16) // Blue intensity

	// Convert RGB to greyscale
	return r * 0.299 + g * 0.587 + b * 0.114
}

export const pickTextColor = (bgColor: string) =>
	// Check overall intensity
	getColorGrayscale(bgColor) > 120 ? '#292b2c' : '#efefef'

export const timeout = async (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const getVariety = (value: number, singular: string, plural: string, genitive?: string) =>
	`${getVarietyOption(value, singular, plural, genitive)}`

const getVarietyOption = (
	value: number,
	singular: string,
	plural: string,
	genitive?: string,
): string => {
	if (value === 1) {
		return singular
	}

	if ([2, 3, 4].includes(value % 10) && ![12, 13, 14].includes(value % 100)) {
		return plural
	}

	return genitive || plural
}

const getRandomIndex = (length: number): number => Math.floor(Math.random() * length)

const getRandomExercises = (
	actualExercise: Exercise | undefined,
	level: number,
	difficulty: Difficulty,
): Exercise => {
	if (actualExercise && exercises.length === 1) {
		return actualExercise
	}

	let availableExercises
	if (!actualExercise) {
		availableExercises = (exercises as Exercise[]).filter(
			(exercise) => +exercise.requiredLevel <= level && exercise.difficulty === difficulty,
		)
	} else {
		availableExercises = (exercises as Exercise[]).filter(
			(exercise) =>
				actualExercise.name !== exercise.name &&
				+exercise.requiredLevel <= level &&
				exercise.difficulty === difficulty,
		)
	}

	const randomIndex = getRandomIndex(availableExercises.length)
	return availableExercises[randomIndex]
}

const timeMultiplierMap: Record<Time, number> = {
	short: shortTimeMultiplier,
	medium: mediumTimeMultiplier,
	long: longMultiplier,
}

const difficultyMultiplierMap: Record<Difficulty, number> = {
	easy: easyDifficultyMultiplier,
	medium: mediumDifficultyMultiplier,
	hard: hardDifficultyMultiplier,
}

const getPointsMultiplier = (time: Time, difficulty: Difficulty) =>
	timeMultiplierMap[time] + difficultyMultiplierMap[difficulty]

export const logConfigStatus = () => {
	/* eslint-disable no-console */
	console.info(`Sentry: ${config.SETUP_SENTRY}`)
	console.info(`Google Analytics: ${config.SETUP_ANALYTICS}`)
	console.info('To change this setup, edit config.ts file.')
}
