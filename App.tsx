import React, { useEffect, useState } from 'react'
import FlashMessage from 'react-native-flash-message'
import { useFonts } from 'expo-font'
import { setCustomText } from 'react-native-global-props'
import Router from './src/router'
import Spinner from './src/components/Spinner/Spinner'
import Template from './src/components/Template/Template'
import { setupDatabase } from './database/db'
import { SettingsContextProvider } from './src/utils/context/SettingsContext'
import { PauseContextProvider } from './src/utils/context/PauseContext'
import { ThemeContextProvider } from './src/utils/context/ThemeContext'
import sentryConfig from './src/config/sentry'
import { logConfigStatus } from './src/utils/helpers'
import logEvent from './src/utils/logEvent'

export default function App() {
	const [loading, setLoading] = useState<boolean>(true)

	const [loaded] = useFonts({
		'Lato-Light': require('./assets/fonts/Lato-Light.ttf'),
		'Lato-Regular': require('./assets/fonts/Lato-Regular.ttf'),
		'Lato-Bold': require('./assets/fonts/Lato-Bold.ttf'),
	})

	useEffect(() => {
		if (loaded) {
			initApp()
		}
	}, [loaded])

	const initApp = () => {
		// Set default styles for all Text components.
		const customTextProps = {
			style: { fontFamily: 'Lato-Regular' },
		}
		setCustomText(customTextProps)

		sentryConfig()
		logConfigStatus()

		setupDatabase(() => {
			logEvent('successStartedApp', {
				name: 'startedApp',
			})

			setLoading(false)
		})
	}

	if (loading) {
		return <Spinner color='#000' size={64} />
	}

	return (
		<SettingsContextProvider>
			<ThemeContextProvider>
				<PauseContextProvider>
					<Template>
						<Router />
						<FlashMessage style={{ zIndex: 1000 }} position='top' animated />
					</Template>
				</PauseContextProvider>
			</ThemeContextProvider>
		</SettingsContextProvider>
	)
}
