import { NativeModules, Platform } from 'react-native'
import { Exercise, Music, Pause } from '../types/pause'
import { Difficulty, NextLevelBenefits, Settings, Time } from '../types/settings'
import { Color } from '../types/theme'
import { TextType, ViewType } from '../types/styles'
import {
	baseLevelPoints,
	basePoints,
	easyDifficultyMultiplier,
	hardDifficultyMultiplier,
	longMultiplier,
	mediumDifficultyMultiplier,
	mediumTimeMultiplier,
	progressMultiplier,
	shortTimeMultiplier,
} from './consts'

import music from '../config/music.json'
import exercises from '../config/exercises.json'
import colors from '../config/colors.json'

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

export const getRandomPause = (pause: Pause, settings: Settings): Pause => ({
	music: getRandomMusic(pause.music, settings.level),
	exercise: getRandomExercises(pause.exercise, settings.level, settings.difficulty),
	points: +(basePoints * getPointsMultiplier(settings.time, settings.difficulty)).toFixed(0),
})

export const getPointsToLevelUp = (level: number): number =>
	+(baseLevelPoints * level + level * progressMultiplier).toFixed(0)

export const getNextLevelBenefits = (level: number): NextLevelBenefits => {
	const nextLevelMusic = (music as Music[]).filter((m) => m.requiredLevel === level + 1)
	const nextLevelExercises = (exercises as Exercise[]).filter(
		(exercise) => exercise.requiredLevel === level + 1,
	)
	const nextLevelThemes = (colors as Color[]).filter((color) => color.requiredLevel === level + 1)

	return {
		music: nextLevelMusic.length,
		exercises: nextLevelExercises.length,
		themes: nextLevelThemes.length,
	}
}

export const addBackgroundColor = (baseStyles: {}, backgroundColor: string): ViewType => ({
	...baseStyles,
	backgroundColor,
})

export const addTextColor = (baseStyles: {}, textColor: string): TextType => ({
	...baseStyles,
	color: textColor,
})

export const pickTextColor = (bgColor: string) => {
	const color = bgColor.substring(1, 7)
	const r = parseInt(color.substring(0, 2), 16) // Red intensity
	const g = parseInt(color.substring(2, 4), 16) // Green intensity
	const b = parseInt(color.substring(4, 6), 16) // Blue intensity

	//Convert RGB to greyscale and check overall intensity
	return r * 0.299 + g * 0.587 + b * 0.114 > 120 ? '#383838' : '#efefef'
}

export const timeout = async (time: number) => new Promise((resolve) => setTimeout(resolve, time))

export const concatStyles = (firstStyles = {}, secondStyles = {}): {} => ({
	...firstStyles,
	...secondStyles,
})

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

const getRandomMusic = (actualMusic: Music | undefined, level: number): Music => {
	if (actualMusic && music.length === 1) {
		return actualMusic
	}

	let availableMusic
	if (!actualMusic) {
		availableMusic = (music as Music[]).filter((m) => +m.requiredLevel <= level)
	} else {
		availableMusic = (music as Music[]).filter(
			(m) => actualMusic.name !== m.name && +m.requiredLevel <= level,
		)
	}

	const randomIndex = getRandomIndex(availableMusic.length)
	return availableMusic[randomIndex]
}

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
