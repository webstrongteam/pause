import React, { useState, useRef } from 'react'
import { Animated, View, Text, Image } from 'react-native'
import { Icon } from 'react-native-elements'
import { Audio } from 'expo-av'

import { Sound } from 'expo-av/build/Audio'
import useAsyncEffect from '../../utils/hooks/useAsyncEffect'
import styles from './Player.scss'
import { imageMap, musicMap, exerciseMap } from '../../utils/consts'
import { timeout } from '../../utils/helpers'

//Components
import WavyHeader from '../../components/WavyHeader/WavyHeader'
import Footer from '../../components/Footer/Footer'
import Modal from '../../components/Modal/Modal'

//Types
import { TextType, ViewType, ImageType } from '../../types/styles'
import { NavigationScreenType } from '../../types/navigation'

//Contexts
import { useSettingsContext } from '../../utils/context/SettingsContext'
import { usePauseContext } from '../../utils/context/PauseContext'
import { useThemeContext } from '../../utils/context/ThemeContext'
import Header from '../../components/Header/Header'

type Props = {
	navigation: NavigationScreenType
}

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
	const theme = themeContext.useSubscribe((t) => t.colors)

	if (!music || !exercise || !time) {
		return <></>
	}

	//States
	const [modalVisible, setModalVisible] = useState(false)
	const [isAnimating, setIsAnimating] = useState(false)

	const [audio, setAudio] = useState<Sound>()
	const [pauseEffect, setPauseEffect] = useState<Sound>()
	const [finishEffect, setFinishEffect] = useState<Sound>()
	const [playing, setPlaying] = useState(true)

	const [fullTime, setFullTime] = useState(exercise.time[time].totalTime)
	const [isExercising, setIsExercising] = useState(true)
	const [series, setSeries] = useState(exercise.time[time].exerciseCount - 1)

	//Sound Functions
	const loadSound = async () => {
		const { sound } = await Audio.Sound.createAsync(musicMap[music.name], {
			shouldPlay: true,
			isLooping: true,
		})
		// eslint-disable-next-line @typescript-eslint/no-var-requires
		const pause = await Audio.Sound.createAsync(require('../../../assets/soundEffects/pause.mp3'))
		// eslint-disable-next-line @typescript-eslint/no-var-requires
		const finish = await Audio.Sound.createAsync(require('../../../assets/soundEffects/finish.mp3'))
		setAudio(sound)
		setPauseEffect(pause.sound)
		setFinishEffect(finish.sound)
	}
	const playSound = async (sound: Audio.Sound) => {
		await sound.playAsync()
	}
	const replaySound = async (sound: Audio.Sound) => {
		await sound.replayAsync()
	}
	const pauseSound = async (sound: Audio.Sound) => {
		await sound.pauseAsync()
	}
	const unloadSound = async (sound: Audio.Sound) => {
		await sound.unloadAsync()
	}

	//Amimation
	const fadeAnim = useRef(new Animated.Value(1)).current

	const fadeIn = () => {
		Animated.timing(fadeAnim, {
			toValue: 1,
			duration: 250,
			useNativeDriver: true,
		}).start(() => setIsAnimating(false))
	}

	const fadeOut = () => {
		Animated.timing(fadeAnim, {
			toValue: 0,
			duration: 250,
			useNativeDriver: true,
		}).start(() => {
			setPlaying(!playing)
			fadeIn()
		})
	}

	//Timer Consts
	const exerciseTime =
		fullTime - (series * exercise.time[time].exerciseTime + series * exercise.time[time].pauseTime)
	const pauseTime =
		fullTime -
		(series * exercise.time[time].exerciseTime + (series - 1) * exercise.time[time].pauseTime)
	const progress = exercise.time[time].totalTime - fullTime

	//Handlers
	const closeIconPressHandler = async () => {
		if (audio) {
			setModalVisible(true)
			await pauseSound(audio)
			setPlaying(false)
		}
	}
	const quitHandler = async (finished: boolean) => {
		if (audio && pauseEffect && finishEffect) {
			await unloadSound(pauseEffect)
			await unloadSound(audio)
			navigation.replace('Home', { finished })
		}
	}
	const pauseHandler = () => {
		if (!isAnimating) {
			setIsAnimating(true)
			fadeOut()
		}
	}

	useAsyncEffect(async () => {
		if (!audio) {
			await loadSound()
		} else if (!playing) {
			await pauseSound(audio)
		} else {
			await playSound(audio)
		}
	}, [playing])

	useAsyncEffect(async () => {
		await timeout(100)
		if (fullTime > 0 && playing) {
			setFullTime(fullTime - 1)
			if (isExercising) {
				if (exerciseTime === 1) {
					setIsExercising(false)
					if (pauseEffect && fullTime > 1) await replaySound(pauseEffect)
				}
			} else if (pauseTime === 1) {
				setSeries(series - 1)
				if (pauseEffect) await replaySound(pauseEffect)
				setIsExercising(true)
			}
		} else if (fullTime === 0) {
			if (finishEffect) await playSound(finishEffect)
			await quitHandler(true)
		}
	}, [fullTime, playing])

	return (
		<View style={styles.container as ViewType}>
			<Image style={styles.image as ImageType} source={imageMap[music.name]} />

			<Modal
				visible={modalVisible}
				title={translations.Player.leaveExercise}
				toggleModal={() => setModalVisible(false)}
				buttons={[
					{
						text: translations.common.no,
						onPress: () => setModalVisible(false),
					},
					{
						text: translations.common.yes,
						onPress: async () => {
							setModalVisible(false)
							await quitHandler(false)
						},
					},
				]}
			>
				<View style={styles.modal as ViewType}>
					<Text style={styles.modalText as TextType}>
						{translations.Player.leaveExerciseDescription}
					</Text>
				</View>
			</Modal>

			<WavyHeader bgColor={theme.primary} outline>
				<Header closeIconColor='#fff' closeIconHandler={closeIconPressHandler}>
					{fullTime > exercise.time[time].exerciseTime && (
						<View style={styles.counter as ViewType}>
							<Text style={styles.breakIn as TextType}>
								{isExercising ? translations.Player.breakIn : translations.Player.nextSeriesIn}
							</Text>
							<Text style={styles.counterText as TextType}>
								{isExercising ? exerciseTime : pauseTime}s
							</Text>
						</View>
					)}
				</Header>
			</WavyHeader>

			<Animated.View style={[styles.exerciseInfo, { opacity: fadeAnim }] as ViewType}>
				{((playing && isExercising) || fullTime === 0) && (
					<Image
						style={styles.exerciseIcon as ImageType}
						source={exerciseMap[exercise.iconName]}
						resizeMode='contain'
					/>
				)}
				{playing && !isExercising && fullTime > 0 && (
					<>
						<Text style={styles.breakText as TextType}>{translations.Player.break}</Text>
						<Icon name='pause-outline' type='ionicon' color='#fff' size={200} />
					</>
				)}
				{!playing && <Icon name='pause-outline' type='ionicon' color='#fff' size={236} />}
			</Animated.View>

			<Footer
				currentValue={progress}
				maxValue={exercise.time[time].totalTime}
				barColor={theme.progress}
				backgroundColor={theme.primary}
			>
				<View>
					<Text style={styles.infoText as TextType}>{exercise.name}</Text>
					<View style={styles.musicInfo as ViewType}>
						<Text style={styles.infoText as TextType}>{music.name}</Text>
						<Icon name='music' type='material-community' color='#fff' size={15} />
					</View>
				</View>
				<Text style={styles.playerCounter as TextType}>{fullTime}s</Text>
				<Icon
					name={playing ? 'pause-outline' : 'play-outline'}
					type='ionicon'
					color='#fff'
					size={42}
					onPress={pauseHandler}
				/>
			</Footer>
		</View>
	)
}

export default Player
