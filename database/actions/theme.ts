import { ColorType, Theme } from '../../src/types/theme'
import { db } from '../db'

export const getTheme = (): Promise<Theme> =>
	new Promise((resolve, reject) => {
		db.transaction(
			(tx) => {
				tx.executeSql('select * from theme;', [], (_, { rows }) => {
					const colors = rows.item(0)

					resolve({
						primary: colors.primaryColor,
						secondary: colors.secondaryColor,
						third: colors.thirdColor,
						progress: colors.progressColor,
					})
				})
			},
			(err) => reject(err),
		)
	})

export const changeColor = (color: string, type: ColorType): Promise<Theme> =>
	new Promise((resolve, reject) => {
		db.transaction(
			(tx) => {
				tx.executeSql(`update theme set ${type}Color = ? where id = 0;`, [color], () => {
					try {
						resolve(getTheme())
					} catch (e) {
						reject(e)
					}
				})
			},
			(err) => reject(err),
		)
	})
