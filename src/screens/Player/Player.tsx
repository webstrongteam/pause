import React, { useState, useRef, useEffect } from 'react'
import { Animated, View, BackHandler } from 'react-native'
import { Sound } from 'expo-av/build/Audio'
import useAsyncEffect from '../../utils/hooks/useAsyncEffect'
import styles from './Player.scss'
import { musicMap } from '../../utils/consts'
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

type Props = {
	navigation: NavigationScreenType
}

type MethodType = 'playAsync' | 'pauseAsync' | 'replayAsync' | 'unloadAsync'

const Player = ({ navigation }: Props) => {
	//Contexts
	const settingsContext = useSettingsContext()
	const pauseContext = usePauseContext()
	const themeContext = useThemeContext()

	//Subscribes
	const translations = settingsContext.useSubscribe((s) => s.translations)
	const time = settingsContext.useSubscribe((t) => t.settings?.time)
	const exercise = pauseContext.useSubscribe((e) => e.exercise)
	const music = pauseContext.useSubscribe((m) => m.music)
	const theme = themeContext.useSubscribe((t) => t)

	if (!music || !exercise || !time) {
		sentryError('Missing data from context in Player')
		return <></>
	}

	//States
	const [modalVisible, setModalVisible] = useState(false)
	const [isAnimating, setIsAnimating] = useState(false)

	const [startCounter, setStartCounter] = useState(5)

	const [audio, setAudio] = useState<Sound>()
	const [pauseEffect, setPauseEffect] = useState<Sound>()
	const [finishEffect, setFinishEffect] = useState<Sound>()
	const [isMuted, setIsMuted] = useState(false)
	const [playing, setPlaying] = useState(true)
	const [showPauseIcon, setShowPauseIcon] = useState(false)
	const [stopTimer, setStopTimer] = useState(false)

	const [fullTime, setFullTime] = useState(exercise.time[time].totalTime)
	const [isExercising, setIsExercising] = useState(true)
	const [series, setSeries] = useState(exercise.time[time].exerciseCount - 1)
	const [shouldIncrementTime, setShouldIncrementTime] = useState(false)

	//Sound Functions
	const loadMusic = async () => {
		const { sound } = await Audio.Sound.createAsync(musicMap[music.name], {
			shouldPlay: true,
			isLooping: true,
		})

		setAudio(sound)
	}

	const loadSoundEffects = async () => {
		// eslint-disable-next-line @typescript-eslint/no-var-requires
		const pause = await Audio.Sound.createAsync(require('../../../assets/soundEffects/pause.mp3'), {
			shouldPlay: true,
		})
		// eslint-disable-next-line @typescript-eslint/no-var-requires
		const finish = await Audio.Sound.createAsync(require('../../../assets/soundEffects/finish.mp3'))
		setPauseEffect(pause.sound)
		setFinishEffect(finish.sound)
	}

	const soundControl = async (methodName: MethodType, sound: Audio.Sound) => {
		await sound[methodName]()
	}

	//Animation
	const fadeAnim = useRef(new Animated.Value(1)).current

	const fadeIn = () => {
		Animated.timing(fadeAnim, {
			toValue: 1,
			duration: 300,
			useNativeDriver: true,
		}).start(() => setIsAnimating(false))
	}

	const fadeOut = () => {
		Animated.timing(fadeAnim, {
			toValue: 0,
			duration: 300,
			useNativeDriver: true,
		}).start(() => {
			setShowPauseIcon(!showPauseIcon)
			fadeIn()
		})
	}

	//Timer Const
	const exerciseTime =
		fullTime - (series * exercise.time[time].exerciseTime + series * exercise.time[time].pauseTime)
	const pauseTime =
		fullTime -
		(series * exercise.time[time].exerciseTime + (series - 1) * exercise.time[time].pauseTime)
	const progress = exercise.time[time].totalTime - fullTime

	//Handlers and functions
	const closeIconPressHandler = async () => {
		setModalVisible(true)
		if (audio) await soundControl('pauseAsync', audio)
		setPlaying(false)
		setShowPauseIcon(true)
	}

	const quitHandler = async (finished: boolean) => {
		setStopTimer(true)
		if (pauseEffect) await soundControl('unloadAsync', pauseEffect)
		if (finishEffect) await soundControl('unloadAsync', finishEffect)
		if (audio) await soundControl('unloadAsync', audio)

		if (!finished) {
			logEvent('Exit from pending pause', {
				component: 'Player',
				currentPause: { music, exercise, time },
			})
		}

		navigation.replace('Home', { finished })
	}

	const pauseHandler = () => {
		if (!isAnimating) {
			setIsAnimating(true)
			setShouldIncrementTime(false)
			setPlaying(!playing)
			fadeOut()
		}
	}

	const startCounterFunction = async () => {
		if (playing && startCounter >= 1 && pauseEffect && finishEffect) {
			setStartCounter(startCounter - 1)
			if (startCounter > 1) await soundControl('replayAsync', pauseEffect)
			else await soundControl('replayAsync', finishEffect)
		}
	}

	const muteSoundHandler = async () => {
		if (audio) {
			if (!isMuted) {
				logEvent('Mute music', {
					component: 'Player',
					music,
				})
			}

			await audio.setIsMutedAsync(!isMuted)
			setIsMuted(!isMuted)
		}
	}

	const shouldCounting = fullTime > 0 && playing && startCounter === 0
	const shouldShowExerciseImage =
		(!showPauseIcon && isExercising && startCounter === 0) || fullTime === 0

	//Loading sound effects
	useAsyncEffect(async () => {
		await loadSoundEffects()
	}, [])

	//Loading and playing music
	useAsyncEffect(async () => {
		if (!audio && startCounter === 0 && playing) {
			await loadMusic()
			return
		}
		if (!playing && audio) {
			await soundControl('pauseAsync', audio)
			return
		}
		if (audio) {
			await soundControl('playAsync', audio)
		}
	}, [playing, startCounter])

	//Counters
	useAsyncEffect(async () => {
		await timeout(500)
		if (stopTimer) return

		if (shouldIncrementTime) {
			setShouldIncrementTime(false)
			await startCounterFunction()

			if (shouldCounting) {
				setFullTime(fullTime - 1)
				if (isExercising) {
					if (exerciseTime === 1) {
						setIsExercising(false)
						if (pauseEffect && fullTime > 1) await soundControl('replayAsync', pauseEffect)
					}
				} else if (pauseTime === 1) {
					setSeries(series - 1)
					if (pauseEffect) await soundControl('replayAsync', pauseEffect)
					setIsExercising(true)
				}
			} else if (fullTime === 0) {
				if (finishEffect) await soundControl('replayAsync', finishEffect)
				await quitHandler(true)
			}
			return
		}

		setShouldIncrementTime(true)
	}, [fullTime, playing, startCounter, pauseEffect, finishEffect, shouldIncrementTime])

	useEffect(() => {
		// TODO: handle iOS back action
		BackHandler.addEventListener('hardwareBackPress', () => {
			// eslint-disable-next-line @typescript-eslint/no-floating-promises
			closeIconPressHandler().then((r) => r)
			return true
		})

		return () => {
			BackHandler.removeEventListener('hardwareBackPress', () => {
				// eslint-disable-next-line @typescript-eslint/no-floating-promises
				closeIconPressHandler().then((r) => r)
				return true
			})
		}
	}, [])

	return (
		<View style={styles.container as ViewType}>
			<StatusBar bgColor={theme.secondary} />
			<PlayerModals
				modalVisible={modalVisible}
				translations={translations}
				setModalVisible={setModalVisible}
				quitHandler={() => quitHandler(false)}
			/>
			<PlayerVideo />
			<PlayerFooter />
		</View>
	)
}

export default Player
