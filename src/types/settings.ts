export interface Settings {
	id: number
	points: number
	lang: Lang
	difficulty: Difficulty
	time: Time
	version: string
}

export type Lang = 'pl' | 'en'
export type Difficulty = 'easy' | 'medium' | 'hard'
export type Time = 'short' | 'medium' | 'long'

export type Translations = Record<string, Record<string, string>>
