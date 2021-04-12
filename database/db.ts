import { openDatabase } from 'expo-sqlite'
import app from '../app.json'
import { getLocale } from '../src/utils/helpers'
import colors from '../src/config/colors.json'

export const VERSION = app.expo.version
export const db = openDatabase('pause.db', VERSION)

export const initDatabase = (callback: () => void) => {
	db.transaction(
		(tx) => {
			// tx.executeSql(
			//     'DROP TABLE IF EXISTS theme;'
			// );
			tx.executeSql(
				'create table if not exists settings (id integer primary key not null, level number, points number, lang text, difficulty text, time text, version text);',
			)
			tx.executeSql(
				'create table if not exists theme (id integer primary key not null, primaryColor text, secondaryColor text, thirdColor text, progressColor text);',
			)
			tx.executeSql(
				'INSERT OR IGNORE INTO settings (id, lang, level, points, difficulty, time, version) values (0, ?, ?, ?, ?, ?, ?);',
				[getLocale(), 1, 0, 'easy', 'medium', `${VERSION}_INIT`],
			)
			tx.executeSql(
				'INSERT OR IGNORE INTO theme (id, primaryColor, secondaryColor, thirdColor, progressColor) values (0, ?, ?, ?, ?);',
				[colors[0].color, colors[1].color, colors[2].color, colors[3].color],
				() => {
					setupDatabase(callback)
				},
			)
		},
		// eslint-disable-next-line no-console
		(err) => console.log(err),
	)
}

export const setupDatabase = (callback: () => void) => {
	// initDatabase(callback)
	db.transaction(
		(tx) => {
			// CHECK CORRECTION APP VERSION AND UPDATE DB
			tx.executeSql('select * from settings', [], (_, { rows }) => {
				const { version } = rows.item(0)

				if (version !== VERSION) {
					if (version.includes('_INIT')) {
						tx.executeSql('UPDATE settings SET version = ? WHERE id = 0;', [VERSION], () => {
							callback()
						})
					} else {
						// const versionID = +version.split('.').join("");
						tx.executeSql('UPDATE settings SET version = ? WHERE id = 0;', [VERSION], () => {
							callback()
						})
					}
				} else callback()
			})
		},
		// eslint-disable-next-line no-console
		(err) => {
			// eslint-disable-next-line no-console
			console.info(err)
			initDatabase(callback)
		},
	)
}
