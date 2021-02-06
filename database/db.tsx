import {NativeModules, Platform} from 'react-native'
import {openDatabase} from 'expo-sqlite'
import app from '../app.json'

export const VERSION = app.expo.version
const db = openDatabase('pause.db', VERSION)

const getLocale = () => {
  const locale =
    Platform.OS === 'ios'
      ? NativeModules.SettingsManager.settings.AppleLocale
      : NativeModules.I18nManager.localeIdentifier
  if (locale === 'pl_PL') {
    return 'pl'
  }
  return 'en'
}

export const initDatabase = (callback: () => void) => {
  db.transaction(
    (tx) => {
      // tx.executeSql(
      //     'DROP TABLE IF EXISTS wasted_food;'
      // );
      tx.executeSql(
        'create table if not exists settings (id integer primary key not null, points number, lang text, difficulty text, time text, version text);',
      )
      tx.executeSql(
        'INSERT OR IGNORE INTO settings (id, lang, points, difficulty, time, version) values (0, ?, ?, ?, ?, ?);',
        [getLocale(), 0, 'easy', 'medium', VERSION + '_INIT'],
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
  db.transaction(
    (tx) => {
      // CHECK CORRECTION APP VERSION AND UPDATE DB
      tx.executeSql(
        'select * from settings',
        [],
        (_, {rows}) => {
          const {version} = rows.item(0)

          if (version !== VERSION) {
            if (version.includes('_INIT')) {
              tx.executeSql(
                'UPDATE settings SET version = ? WHERE id = 0;',
                [VERSION],
                () => {
                  callback()
                },
              )
            } else {
              // const versionID = +version.split('.').join("");
              tx.executeSql('UPDATE settings SET version = ? WHERE id = 0;', [VERSION], () => {
                callback()
              })
            }
          } else callback()
        },
      )
    },
    // eslint-disable-next-line no-console
    (err) => {
      console.info(err)
      initDatabase(callback)
    },
  )
}