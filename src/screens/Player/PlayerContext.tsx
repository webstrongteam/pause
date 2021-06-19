import React, { PropsWithChildren } from 'react'
import { Player } from '../../types/player'
import { createStateContext } from '../../utils/createStateContext'

const playerInitialState: Player = {
	status: 'preview',
	exerciseProgress: 0,
	openModal: false,
	fullTime: 0,
	pauseTime: 0,
	exerciseTime: 0,
	modalType: 'exerciseInfoModal',
}

const PlayerContext = createStateContext(playerInitialState, (setStore) => ({
	setPlayer(player: Partial<Player>) {
		setStore((store) => ({ ...store, player }))
	},
}))

export const PlayerContextProvider = ({ children }: PropsWithChildren<{}>) => (
	<PlayerContext.Provider>{children}</PlayerContext.Provider>
)

export const usePlayerContext = PlayerContext.useContext
