import { ColorType, Theme } from '../../src/types/theme'
import { db } from '../db'
import { defaultTheme } from '../../src/utils/consts'
import { sentryError } from '../../src/utils/sentryEvent'
import logEvent from '../../src/utils/logEvent'

export const getTheme = (): Promise<Theme> =>
	new Promise((resolve, reject) => {
		db.transaction(
			(tx) => {
				tx.executeSql('select * from theme;', [], (_, { rows }) => {
					const colors = rows.item(0)

					if (!colors) {
						sentryError('Missing colors in theme table!')
					}

					resolve({
						primary: colors.primaryColor,
						secondary: colors.secondaryColor,
						third: colors.thirdColor,
						progress: colors.progressColor,
					})
				})
			},
			(err) => {
				sentryError(err)
				reject(err)
			},
		)
	})

export const changeColor = (color: string, type: ColorType): Promise<Theme> =>
	new Promise((resolve, reject) => {
		db.transaction(
			(tx) => {
				tx.executeSql(`update theme set ${type}Color = ? where id = 0;`, [color], () => {
					try {
						logEvent('Change color', {
							component: 'actions',
							color,
						})

						resolve(getTheme())
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

export const restartTheme = (): Promise<Theme> =>
	new Promise((resolve, reject) => {
		db.transaction(
			(tx) => {
				tx.executeSql(
					'update theme set primaryColor = ?, secondaryColor = ?, thirdColor = ?, progressColor = ? where id = 0;',
					defaultTheme,
					() => {
						try {
							resolve(getTheme())
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
