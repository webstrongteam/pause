import { Difficulty, Lang, Settings, Time } from '../../src/types/settings'
import { db } from '../db'

export const getSettings = (): Promise<Settings> =>
	new Promise((resolve, reject) => {
		db.transaction(
			(tx) => {
				tx.executeSql('select * from settings;', [], (_, { rows }) => {
					resolve(rows.item(0))
				})
			},
			(err) => reject(err),
		)
	})

export const changeLanguage = (lang: Lang): Promise<Settings> =>
	new Promise((resolve, reject) => {
		db.transaction(
			(tx) => {
				tx.executeSql('update settings set lang = ? where id = 0;', [lang], () => {
					resolve(getSettings())
				})
			},
			(err) => reject(err),
		)
	})

export const changePoints = (points: number): Promise<Settings> =>
	new Promise((resolve, reject) => {
		db.transaction(
			(tx) => {
				tx.executeSql('update settings set points = ? where id = 0;', [points], () => {
					resolve(getSettings())
				})
			},
			(err) => reject(err),
		)
	})

export const changeDifficulty = (difficulty: Difficulty): Promise<Settings> =>
	new Promise((resolve, reject) => {
		db.transaction(
			(tx) => {
				tx.executeSql('update settings set difficulty = ? where id = 0;', [difficulty], () => {
					resolve(getSettings())
				})
			},
			(err) => reject(err),
		)
	})

export const changeTime = (time: Time): Promise<Settings> =>
	new Promise((resolve, reject) => {
		db.transaction(
			(tx) => {
				tx.executeSql('update settings set time = ? where id = 0;', [time], () => {
					resolve(getSettings())
				})
			},
			(err) => reject(err),
		)
	})

export const restartSettings = (): Promise<Settings> =>
	new Promise((resolve, reject) => {
		db.transaction(
			(tx) => {
				tx.executeSql(
					'update settings set points = ?, difficulty = ?, time = ? where id = 0;',
					[0, 'easy', 'medium'],
					() => {
						resolve(getSettings())
					},
				)
			},
			(err) => reject(err),
		)
	})
