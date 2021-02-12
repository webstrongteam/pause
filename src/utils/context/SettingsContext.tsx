import React, { PropsWithChildren, useEffect } from 'react'
import { createStateContext } from '../createStateContext'
import { Lang, Settings, Translations } from '../../types/settings'
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
	const { setSettings, setTranslations, useSubscribe } = useSettingsContext()
	const contextSettings = useSubscribe((s) => s.settings)

	const fetchSettings = async () => {
		const settings: Settings = await getSettings()

		setSettings(settings)
		updateLanguage(settings.lang)
	}

	const updateLanguage = (lang: Lang) => {
		setTranslations(lang === 'pl' ? pl : en)
	}

	useAsyncEffect(async () => {
		await fetchSettings()
	}, [])

	useEffect(() => {
		if (contextSettings?.lang) {
			updateLanguage(contextSettings.lang)
		}
	}, [contextSettings?.lang])

	return <></>
}

export const SettingsContextProvider = ({ children }: PropsWithChildren<{}>) => (
	<SettingsContext.Provider>
		<SettingsHandler />
		{children}
	</SettingsContext.Provider>
)

export const useSettingsContext = SettingsContext.useContext
