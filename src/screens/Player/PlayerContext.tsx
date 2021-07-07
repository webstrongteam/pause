import React, { PropsWithChildren, useEffect, useRef, useState } from 'react'
import { BackHandler } from 'react-native'
import { Audio, Video } from 'expo-av'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Player } from '../../types/player'
import { createStateContext } from '../../utils/createStateContext'
import useAsyncEffect from '../../utils/hooks/useAsyncEffect'
import { useSettingsContext } from '../../utils/context/SettingsContext'
import { usePauseContext } from '../../utils/context/PauseContext'
import { sentryError } from '../../utils/sentryEvent'
import logEvent from '../../utils/logEvent'
import { getPauseTotalTime } from '../../utils/helpers'
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
	videoUri: undefined,
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

	const [ratedExercise, setRatedExercise] = useState<boolean>(false)

	// eslint-disable-next-line no-undef
	const playerTimerId = useRef<NodeJS.Timer | null>(null)

	const loadSoundEffects = async () => {
		// eslint-disable-next-line @typescript-eslint/no-var-requires
		const pause = await Audio.Sound.createAsync(require('../../../assets/soundEffects/pause.mp3'))
		// eslint-disable-next-line @typescript-eslint/no-var-requires
		const finish = await Audio.Sound.createAsync(require('../../../assets/soundEffects/finish.mp3'))

		playerContext.setPlayer({ pauseEffect: pause.sound, finishEffect: finish.sound })
	}

	const unmountAssets = async () => {
		if (player.pauseEffect) await assetControl('unloadAsync', player.pauseEffect)
		if (player.finishEffect) await assetControl('unloadAsync', player.finishEffect)
		if (player.videoRef) await assetControl('unloadAsync', player.videoRef)
	}

	const backHandlerEvent = () => {
		BackHandler.addEventListener('hardwareBackPress', () => {
			playerContext.setPlayer({ openModal: true, modalType: 'leaveModal', status: 'stop' })
			return true
		})
	}

	const playerTimer = () => {
		const timeToEnd = player.fullTime! - 1

		if (timeToEnd === 0) {
			playerContext.setPlayer({
				status: ratedExercise ? 'finish' : 'pause',
				modalType: 'ratingsModal',
				openModal: !ratedExercise,
				fullTime: timeToEnd,
				pauseTime: exercise.time[time].pauseTime,
				exerciseTime: 0,
			})
			return
		}

		if (player.status === 'exercising') {
			if (player.exerciseTime === 1) {
				playerContext.setPlayer({
					status: 'pause',
					fullTime: timeToEnd,
					pauseTime: exercise.time[time].pauseTime,
					exerciseTime: 0,
				})
			} else {
				playerContext.setPlayer({
					fullTime: timeToEnd,
					exerciseTime: player.exerciseTime - 1,
				})
			}
		}

		if (player.status === 'pause') {
			if (player.pauseTime === 1) {
				playerContext.setPlayer({
					status: 'exercising',
					fullTime: timeToEnd,
					exerciseTime: exercise.time[time].exerciseTime,
					pauseTime: 0,
				})
			} else {
				playerContext.setPlayer({
					fullTime: player.fullTime! - 1,
					pauseTime: player.pauseTime - 1,
				})
			}
		}
	}

	const stopPlayerTimer = () => {
		if (playerTimerId.current) {
			clearTimeout(playerTimerId.current)
		}
	}

	useAsyncEffect(async () => {
		setRatedExercise(!!(await AsyncStorage.getItem(`${exercise?.videoId}${time}`)))
		await loadSoundEffects()
		backHandlerEvent()

		return () => {
			stopPlayerTimer()
			backHandlerEvent()
			unmountAssets()
		}
	}, [])

	useAsyncEffect(async () => {
		if (player.status === 'exercising' || player.status === 'pause') {
			if (player.pauseEffect) {
				await assetControl('replayAsync', player.pauseEffect)
			}
			if (player.videoRef) {
				if (player.status === 'exercising') {
					await assetControl('playAsync', player.videoRef)
				} else {
					await assetControl('pauseAsync', player.videoRef)
				}
			}

			if (player.fullTime === undefined) {
				playerContext.setPlayer({
					fullTime: getPauseTotalTime(exercise.time[time]),
					exerciseTime: exercise.time[time].exerciseTime,
				})
			}
			return
		}

		if (player.status === 'stop') {
			if (player.fullTime === undefined) return
			if (player.videoRef) {
				await assetControl('pauseAsync', player.videoRef)
			}
			return
		}

		if (player.status === 'exit' || player.status === 'finish') {
			const finished = player.status === 'finish'
			if (!finished) {
				await logEvent('Exit from pending pause', {
					component: 'Player',
					currentPause: { exercise, time },
				})
			} else if (player.finishEffect) {
				await assetControl('replayAsync', player.finishEffect)
			}

			navigation.replace('Home', { finished })
		}
	}, [player.status])

	useEffect(() => {
		if (!(player.status === 'exercising' || player.status === 'pause') || !player.fullTime) {
			stopPlayerTimer()
			return
		}

		playerTimerId.current = setTimeout(playerTimer, 1000)
	}, [player.status, player.fullTime])

	return <></>
}

const assetControl = async (methodName: MethodType, sound: Audio.Sound | Video) => {
	await sound[methodName]()
}

export const PlayerContextProvider = ({ children, navigation }: PropsWithChildren<Props>) => (
	<PlayerContext.Provider>
		<PlayerHandler navigation={navigation} />
		{children}
	</PlayerContext.Provider>
)

export const usePlayerContext = PlayerContext.useContext
