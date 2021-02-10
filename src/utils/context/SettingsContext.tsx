import React, { PropsWithChildren } from 'react'
import { createStateContext } from '../createStateContext'
import { Settings, Translations } from '../../types/settings'
import { getSettings } from '../../../database/actions/settings'
import useAsyncEffect from '../hooks/useAsyncEffect'

import pl from '../../../translations/pl.json'
import en from '../../../translations/en.json'

const settingsInitialState: {
	settings?: Settings
	translations: Translations
} = {
	translations: en,
}

const SettingsContext = createStateContext(settingsInitialState, (setStore) => ({
	setSettings(settings: Settings) {
		setStore((store) => ({ ...store, settings }))
	},
	setTranslations(translations: Translations) {
		setStore((store) => ({ ...store, translations }))
	},
}))

const SettingsHandler = () => {
	const { setSettings, setTranslations } = useSettingsContext()

	const fetchSettings = async () => {
		const settings: Settings = await getSettings()

		setSettings(settings)
		setTranslations(settings.lang === 'pl' ? pl : en)
	}

	useAsyncEffect(async () => {
		await fetchSettings()
	}, [])

	return <></>
}

export const SettingsContextProvider = ({ children }: PropsWithChildren<{}>) => (
	<SettingsContext.Provider>
		<SettingsHandler />
		{children}
	</SettingsContext.Provider>
)

export const useSettingsContext = SettingsContext.useContext
