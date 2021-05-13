/* eslint-disable no-console */
import { Platform } from 'react-native'
import * as Sentry from 'sentry-expo'
import config from '../config/config'

export const sentryError = (error: any) => {
	if (config.SETUP_SENTRY && Platform.OS !== 'web') {
		try {
			Sentry.Native.captureException(error)
		} catch (err) {
			console.error(err)
		}
	} else {
		console.error(`Sentry error: ${error}`)
	}
}
