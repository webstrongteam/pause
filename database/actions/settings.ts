import { Difficulty, Lang, Settings, Time } from '../../src/types/settings'
import { db } from '../db'
import { sentryError } from '../../src/utils/sentryEvent'
import logEvent from '../../src/utils/logEvent'

export const getSettings = (): Promise<Settings> =>
	new Promise((resolve, reject) => {
		db.transaction(
			(tx) => {
				tx.executeSql('select * from settings;', [], (_, { rows }) => {
					resolve(rows.item(0))
				})
			},
			(err) => {
				sentryError(err)
				reject(err)
			},
		)
	})

export const changeLanguage = (lang: Lang): Promise<Settings> =>
	new Promise((resolve, reject) => {
		db.transaction(
			(tx) => {
				tx.executeSql('update settings set lang = ? where id = 0;', [lang], () => {
					try {
						logEvent('Change language', {
							component: 'actions',
						})

						resolve(getSettings())
					} catch (e) {
						sentryError(e)
						reject(e)
					}
				})
			},
			(err) => {
				sentryError(err)
				reject(err)
			},
		)
	})

export const changeLevelAndPoints = (level: number, points: number): Promise<Settings> =>
	new Promise((resolve, reject) => {
		db.transaction(
			(tx) => {
				tx.executeSql(
					'update settings set level = ?, points = ? where id = 0;',
					[level, points],
					() => {
						try {
							logEvent('Change level and points', {
								component: 'actions',
								level,
								points,
							})

							resolve(getSettings())
						} catch (e) {
							sentryError(e)
							reject(e)
						}
					},
				)
			},
			(err) => {
				sentryError(err)
				reject(err)
			},
		)
	})

export const changeDifficulty = (difficulty: Difficulty): Promise<Settings> =>
	new Promise((resolve, reject) => {
		db.transaction(
			(tx) => {
				tx.executeSql('update settings set difficulty = ? where id = 0;', [difficulty], () => {
					try {
						logEvent('Change difficulty', {
							component: 'actions',
						})

						resolve(getSettings())
					} catch (e) {
						sentryError(e)
						reject(e)
					}
				})
			},
			(err) => {
				sentryError(err)
				reject(err)
			},
		)
	})

export const changeTime = (time: Time): Promise<Settings> =>
	new Promise((resolve, reject) => {
		db.transaction(
			(tx) => {
				tx.executeSql('update settings set time = ? where id = 0;', [time], () => {
					try {
						logEvent('Change time', {
							component: 'actions',
						})

						resolve(getSettings())
					} catch (e) {
						sentryError(e)
						reject(e)
					}
				})
			},
			(err) => {
				sentryError(err)
				reject(err)
			},
		)
	})

export const restartSettings = (): Promise<Settings> =>
	new Promise((resolve, reject) => {
		db.transaction(
			(tx) => {
				tx.executeSql(
					'update settings set level = ?, points = ?, difficulty = ?, time = ? where id = 0;',
					[1, 0, 'easy', 'medium'],
					() => {
						try {
							resolve(getSettings())
						} catch (e) {
							sentryError(e)
							reject(e)
						}
					},
				)
			},
			(err) => {
				sentryError(err)
				reject(err)
			},
		)
	})
