import React, { PropsWithChildren, useEffect } from 'react'
import { createStateContext } from '../createStateContext'
import { useSettingsContext } from './SettingsContext'
import { getTheme } from '../helpers'
import { Theme } from '../../types/theme'

const themeInitialState: Theme = {
	requiredLevel: 0,
	colors: {
		primary: '#FFF',
		secondary: '#FFF',
		third: '#FFF',
		optional: '#FFF',
		progress: '#FFF',
	},
}

const ThemeContext = createStateContext(themeInitialState, (setStore) => ({
	setTheme(theme: Theme) {
		setStore(() => theme)
	},
}))

const ThemeHandler = () => {
	const { setTheme } = useThemeContext()
	const { useSubscribe } = useSettingsContext()
	const settings = useSubscribe((s) => s.settings)

	useEffect(() => {
		if (!settings) {
			return
		}

		setTheme(getTheme(settings.level))
	}, [settings?.level])

	return <></>
}

export const ThemeContextProvider = ({ children }: PropsWithChildren<{}>) => (
	<ThemeContext.Provider>
		<ThemeHandler />
		{children}
	</ThemeContext.Provider>
)

export const useThemeContext = ThemeContext.useContext
