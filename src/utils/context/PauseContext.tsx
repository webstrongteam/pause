import React, { PropsWithChildren, useEffect } from 'react'
import { createStateContext } from '../createStateContext'
import { Pause } from '../../types/pause'
import { useSettingsContext } from './SettingsContext'
import { getRandomPause } from '../helpers'

const PauseContext = createStateContext({}, (setStore) => ({
	setPause(pause: Pause) {
		setStore(() => pause)
	},
}))

const PauseHandler = () => {
	const { setPause } = usePauseContext()
	const { useSubscribe } = useSettingsContext()
	const settings = useSubscribe((s) => s.settings)

	useEffect(() => {
		if (!settings) {
			return
		}

		setPause(getRandomPause(settings))
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
