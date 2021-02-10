import { Settings } from '../../src/types/settings'
import { db } from '../db'

export const getSettings = (): Promise<Settings> =>
	new Promise((resolve, reject) => {
		db.transaction(
			(tx) => {
				tx.executeSql('select * from settings;', [], (_, { rows }) => {
					resolve(rows.item(0))
				})
			},
			// eslint-disable-next-line no-console
			(err) => reject(err),
		)
	})
