import React, { PropsWithChildren, useEffect } from 'react'
import { createStateContext } from '../createStateContext'
import { Pause } from '../../types/pause'
import { useSettingsContext } from './SettingsContext'
import { getRandomPause } from '../helpers'

const settingsInitialState: Pause = {}

const PauseContext = createStateContext(settingsInitialState, (setStore) => ({
	setPause(pause: Pause) {
		setStore(() => pause)
	},
}))

const PauseHandler = () => {
	const pauseContext = usePauseContext()
	const settingsContext = useSettingsContext()
	const pause = pauseContext.useSubscribe((s) => s)
	const settings = settingsContext.useSubscribe((s) => s.settings)

	useEffect(() => {
		if (!settings) {
			return
		}

		pauseContext.setPause(getRandomPause(pause, settings))
	}, [settings])

	return <></>
}

export const PauseContextProvider = ({ children }: PropsWithChildren<{}>) => (
	<PauseContext.Provider>
		<PauseHandler />
		{children}
	</PauseContext.Provider>
)

export const usePauseContext = PauseContext.useContext
