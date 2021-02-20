import { NativeModules, Platform } from 'react-native'
import { Exercise, Music, Pause, Theme } from '../types/pause'
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
import { Difficulty, NextLevelBenefits, Settings, Time } from '../types/settings'

import music from '../config/music.json'
import exercises from '../config/exercises.json'
import themes from '../config/themes.json'

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
	points: +(basePoints * getPointsMultiplier(settings.time, settings.difficulty)).toFixed(0),
})

export const getRequiredPointsToLevelUp = (level: number, points: number): number =>
	+(baseLevelPoints * level + level * progressMultiplier - points).toFixed(0)

export const getNextLevelBenefits = (level: number): NextLevelBenefits => {
	const nextLevelMusic = (music as Music[]).filter((m) => m.requiredLevel === level + 1)
	const nextLevelExercises = (exercises as Exercise[]).filter(
		(exercise) => exercise.requiredLevel === level + 1,
	)
	const nextLevelThemes = (themes as Theme[]).filter((theme) => theme.requiredLevel === level + 1)

	return {
		music: nextLevelMusic.length,
		exercises: nextLevelExercises.length,
		themes: nextLevelThemes.length,
	}
}

const getRandomIndex = (length: number): number => Math.floor(Math.random() * length)

const getRandomMusic = (level: number): Music => {
	const availableMusic = (music as Music[]).filter((m) => +m.requiredLevel <= level)
	const randomIndex = getRandomIndex(availableMusic.length)

	return availableMusic[randomIndex]
}

const getRandomExercises = (level: number, difficulty: Difficulty): Exercise => {
	const availableExercises = (exercises as Exercise[]).filter(
		(exercise) => +exercise.requiredLevel <= level && exercise.difficulty === difficulty,
	)
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
