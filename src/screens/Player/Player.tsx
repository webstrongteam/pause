import React, { useState, useEffect } from 'react'
import { View, BackHandler } from 'react-native'
import { Audio, Video } from 'expo-av'
import useAsyncEffect from '../../utils/hooks/useAsyncEffect'
import styles from './Player.scss'
import { timeout } from '../../utils/helpers'

//Types
import { ViewType } from '../../types/styles'
import { NavigationScreenType } from '../../types/navigation'

//Contexts
import { useSettingsContext } from '../../utils/context/SettingsContext'
import { usePauseContext } from '../../utils/context/PauseContext'
import { useThemeContext } from '../../utils/context/ThemeContext'

import StatusBar from '../../components/UI/StatusBar/StatusBar'
import { sentryError } from '../../utils/sentryEvent'
import logEvent from '../../utils/logEvent'
import PlayerModals from './PlayerModals/PlayerModals'
import PlayerFooter from './PlayerFooter/PlayerFooter'
import PlayerVideo from './PlayerVideo/PlayerVideo'
import { PlayerContextProvider, usePlayerContext } from './PlayerContext'

type Props = {
	navigation: NavigationScreenType
}

type MethodType = 'playAsync' | 'pauseAsync' | 'replayAsync' | 'unloadAsync'

const Player = ({ navigation }: Props) => {
	//Contexts
	const playerContext = usePlayerContext()
	const settingsContext = useSettingsContext()
	const pauseContext = usePauseContext()
	const themeContext = useThemeContext()

	//Subscribes
	const player = playerContext.useSubscribe((s) => s)
	const time = settingsContext.useSubscribe((s) => s.settings?.time)
	const exercise = pauseContext.useSubscribe((s) => s.exercise)
	const theme = themeContext.useSubscribe((s) => s)

	if (!exercise || !time) {
		sentryError('Missing data from context in Player')
		return <></>
	}

	const [shouldIncrementTime, setShouldIncrementTime] = useState(false)

	const loadSoundEffects = async () => {
		// eslint-disable-next-line @typescript-eslint/no-var-requires
		const pause = await Audio.Sound.createAsync(require('../../../assets/soundEffects/pause.mp3'), {
			shouldPlay: true,
		})
		// eslint-disable-next-line @typescript-eslint/no-var-requires
		const finish = await Audio.Sound.createAsync(require('../../../assets/soundEffects/finish.mp3'))

		playerContext.setPlayer({ pauseEffect: pause.sound, finishEffect: finish.sound })
	}

	const assetControl = async (methodName: MethodType, sound: Audio.Sound | Video) => {
		await sound[methodName]()
	}

	// Load sound effects
	useAsyncEffect(async () => {
		await loadSoundEffects()
	}, [])

	useAsyncEffect(async () => {
		if (player.status === 'exercising' || player.status === 'pause') {
			await assetControl('replayAsync', player.pauseEffect!)
			playerContext.setPlayer({ fullTime: exercise.time[time].totalTime })
		}

		if (player.status === 'stop' || player.status === 'pause') {
			setShouldIncrementTime(false)
			if (player.videoRef) await assetControl('pauseAsync', player.videoRef)

			if (player.status === 'stop') {
				playerContext.setPlayer({modalType: 'leaveModal', openModal: true})
			}
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

		if (player.fullTime === 0) {
			playerContext.setPlayer({ status: 'finish' })
			return
		}

		if (!(player.status === 'exercising' || player.status === 'pause')) {
			return
		}

		if (shouldIncrementTime) {
			setShouldIncrementTime(false)

			if (player.status === 'exercising' && player.exerciseTime === 1) {
				playerContext.setPlayer({
					status: 'pause',
					fullTime: player.fullTime - 1,
					exerciseTime: 0,
					pauseTime: exercise.time[time].pauseTime,
				})
				return
			}

			if (player.status === 'pause' && player.exerciseTime === 1) {
				playerContext.setPlayer({
					status: 'exercising',
					fullTime: player.fullTime - 1,
					exerciseTime: exercise.time[time].exerciseTime,
					pauseTime: 0,
				})
				return
			}

			playerContext.setPlayer({ fullTime: player.fullTime - 1 })
			return
		}

		setShouldIncrementTime(true)
	}, [player.fullTime, player.status, shouldIncrementTime])

	useEffect(() => {
		// TODO: handle iOS back action
		BackHandler.addEventListener('hardwareBackPress', () => {
			playerContext.setPlayer({ status: 'stop' })
			return true
		})

		return () => {
			BackHandler.removeEventListener('hardwareBackPress', () => {
				playerContext.setPlayer({ status: 'stop' })
				return true
			})
		}
	}, [])

	return (
		<PlayerContextProvider>
			<View style={styles.container as ViewType}>
				<StatusBar bgColor={theme.secondary} />
				<PlayerModals />
				<PlayerVideo />
				<PlayerFooter />
			</View>
		</PlayerContextProvider>
	)
}

export default Player
