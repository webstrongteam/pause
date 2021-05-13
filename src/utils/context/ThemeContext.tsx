import React, { PropsWithChildren } from 'react'
import { createStateContext } from '../createStateContext'
import { Theme } from '../../types/theme'
import { getTheme } from '../../../database/actions/theme'
import useAsyncEffect from '../hooks/useAsyncEffect'
import colors from '../../resources/colors.json'

export const themeInitialState: Theme = {
	primary: '',
	secondary: colors[1].color,
	third: colors[2].color,
	progress: colors[3].color,
}

const ThemeContext = createStateContext(themeInitialState, (setStore) => ({
	setTheme(theme: Theme) {
		setStore(() => theme)
	},
}))

const ThemeHandler = () => {
	const { setTheme } = useThemeContext()

	useAsyncEffect(async () => {
		setTheme(await getTheme())
	}, [])

	return <></>
}

export const ThemeContextProvider = ({ children }: PropsWithChildren<{}>) => (
	<ThemeContext.Provider>
		<ThemeHandler />
		{children}
	</ThemeContext.Provider>
)

export const useThemeContext = ThemeContext.useContext
