import React, { PropsWithChildren, useEffect, useState } from 'react'
import { BackHandler } from 'react-native'
import { Audio, Video } from 'expo-av'
import { Player } from '../../types/player'
import { createStateContext } from '../../utils/createStateContext'
import useAsyncEffect from '../../utils/hooks/useAsyncEffect'
import { useSettingsContext } from '../../utils/context/SettingsContext'
import { usePauseContext } from '../../utils/context/PauseContext'
import { sentryError } from '../../utils/sentryEvent'
import logEvent from '../../utils/logEvent'
import { timeout } from '../../utils/helpers'
import { NavigationScreenType } from '../../types/navigation'

type Props = {
	navigation: NavigationScreenType
}

type MethodType = 'playAsync' | 'pauseAsync' | 'replayAsync' | 'unloadAsync'

export const playerInitialState: Player = {
	status: 'preview',
	fullTime: undefined,
	pauseTime: 0,
	exerciseTime: 0,
	openModal: false,
	modalType: 'exerciseInfoModal',
}

const PlayerContext = createStateContext(playerInitialState, (setStore) => ({
	setPlayer(player: Partial<Player>) {
		setStore((store) => ({ ...store, ...player }))
	},
}))

const PlayerHandler = ({ navigation }: Props) => {
	const playerContext = usePlayerContext()
	const settingsContext = useSettingsContext()
	const pauseContext = usePauseContext()

	const player = playerContext.useSubscribe((s) => s)
	const exercise = pauseContext.useSubscribe((s) => s.exercise)
	const time = settingsContext.useSubscribe((s) => s.settings?.time)

	if (!exercise || !time) {
		sentryError('Missing data from context in Player')
		return <></>
	}

	const [shouldIncrementTime, setShouldIncrementTime] = useState(false)

	const loadSoundEffects = async () => {
		// eslint-disable-next-line @typescript-eslint/no-var-requires
		const pause = await Audio.Sound.createAsync(require('../../../assets/soundEffects/pause.mp3'))
		// eslint-disable-next-line @typescript-eslint/no-var-requires
		const finish = await Audio.Sound.createAsync(require('../../../assets/soundEffects/finish.mp3'))

		playerContext.setPlayer({ pauseEffect: pause.sound, finishEffect: finish.sound })
	}

	const assetControl = async (methodName: MethodType, sound: Audio.Sound | Video) => {
		await sound[methodName]()
	}

	useAsyncEffect(async () => {
		await loadSoundEffects()
	}, [])

	useAsyncEffect(async () => {
		if (player.status === 'exercising' || player.status === 'pause') {
			if (player.pauseEffect) await assetControl('replayAsync', player.pauseEffect)
			if (player.videoRef) await assetControl('playAsync', player.videoRef)

			if (player.fullTime === undefined) {
				playerContext.setPlayer({
					fullTime: exercise.time[time].totalTime,
					exerciseTime: exercise.time[time].exerciseTime,
				})
			}
		}

		if (player.status === 'stop' || player.status === 'pause') {
			if (player.fullTime === undefined) return

			if (player.status === 'stop') setShouldIncrementTime(false)
			if (player.videoRef) await assetControl('pauseAsync', player.videoRef)
			return
		}

		if (player.status === 'exit' || player.status === 'finish') {
			if (player.pauseEffect) await assetControl('unloadAsync', player.pauseEffect)
			if (player.finishEffect) await assetControl('unloadAsync', player.finishEffect)
			if (player.videoRef) await assetControl('unloadAsync', player.videoRef)

			const finished = player.status === 'finish'
			if (!finished) {
				await logEvent('Exit from pending pause', {
					component: 'Player',
					currentPause: { exercise, time },
				})
			}

			navigation.replace('Home', { finished })
		}
	}, [player.status])

	useAsyncEffect(async () => {
		await timeout(500)

		if (
			!(player.status === 'exercising' || player.status === 'pause') ||
			player.fullTime === undefined
		) {
			return
		}

		if (player.fullTime === 0) {
			playerContext.setPlayer({ status: 'finish' })
			return
		}

		if (shouldIncrementTime) {
			if (player.status === 'exercising') {
				if (player.exerciseTime === 1) {
					playerContext.setPlayer({
						status: 'pause',
						fullTime: player.fullTime - 1,
						pauseTime: exercise.time[time].pauseTime,
						exerciseTime: 0,
					})
				} else {
					playerContext.setPlayer({
						fullTime: player.fullTime - 1,
						exerciseTime: player.exerciseTime - 1,
					})
				}
			}

			if (player.status === 'pause') {
				if (player.pauseTime === 1) {
					playerContext.setPlayer({
						status: 'exercising',
						fullTime: player.fullTime - 1,
						exerciseTime: exercise.time[time].exerciseTime,
						pauseTime: 0,
					})
				} else {
					playerContext.setPlayer({
						fullTime: player.fullTime - 1,
						pauseTime: player.pauseTime - 1,
					})
				}
			}

			setShouldIncrementTime(false)
			return
		}

		setShouldIncrementTime(true)
	}, [player.status, shouldIncrementTime])

	useEffect(() => {
		// TODO: handle iOS back action
		BackHandler.addEventListener('hardwareBackPress', () => {
			playerContext.setPlayer({ openModal: true, modalType: 'leaveModal', status: 'stop' })
			return true
		})

		return () => {
			BackHandler.removeEventListener('hardwareBackPress', () => {
				playerContext.setPlayer({ openModal: true, modalType: 'leaveModal', status: 'stop' })
				return true
			})
		}
	}, [])

	return <></>
}

export const PlayerContextProvider = ({ children, navigation }: PropsWithChildren<Props>) => (
	<PlayerContext.Provider>
		<PlayerHandler navigation={navigation} />
		{children}
	</PlayerContext.Provider>
)

export const usePlayerContext = PlayerContext.useContext
