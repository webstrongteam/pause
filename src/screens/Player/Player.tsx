import React, { useEffect, useState } from 'react'
import { View, Text, Image } from 'react-native'
import { Icon } from 'react-native-elements'
import { Audio } from 'expo-av'
import { Sound } from 'expo-av/build/Audio'
import styles from './Player.scss'
import { imageMap, musicMap, exerciseMap } from '../../utils/consts'

//Components
import WavyHeader from '../../components/WavyHeader/WavyHeader'
import Footer from '../../components/Footer/Footer'
import Modal from '../../components/Modal/Modal'
import CloseIcon from '../../components/UI/CloseIcon/CloseIcon'

//Types
import { TextType, ViewType, ImageType } from '../../types/styles'
import { NavigationScreenType } from '../../types/navigation'

//Contexts
import { useSettingsContext } from '../../utils/context/SettingsContext'
import { usePauseContext } from '../../utils/context/PauseContext'

type Props = {
	navigation: NavigationScreenType
}

const Player = ({ navigation }: Props) => {
	//States
	const [modalVisible, setModalVisible] = useState(false)
	const [audio, setAudio] = useState<Sound>()
	const [playing, setPlaying] = useState(true)

	//Contexts
	const settingsContext = useSettingsContext()
	const pauseContext = usePauseContext()

	//Subscribes
	const translations = settingsContext.useSubscribe((s) => s.translations)
	const exercise = pauseContext.useSubscribe((e) => e.exercise)
	const music = pauseContext.useSubscribe((m) => m.music)
	// const points = pauseContext.useSubscribe((p) => p.points)

	if (!music || !exercise) {
		return <></>
	}

	//Sound Functions
	const loadSound = async () => {
		const { sound } = await Audio.Sound.createAsync(musicMap[music.name], {
			shouldPlay: false,
			isLooping: true,
		})
		setAudio(sound)
	}
	const playSound = async (sound: Audio.Sound) => {
		await sound.playAsync()
	}
	const pauseSound = async (sound: Audio.Sound) => {
		await sound.pauseAsync()
	}

	useEffect(() => {
		if (!audio) {
			// eslint-disable-next-line @typescript-eslint/no-floating-promises
			loadSound()
		} else if (!playing) {
			// eslint-disable-next-line @typescript-eslint/no-floating-promises
			pauseSound(audio)
		} else {
			// eslint-disable-next-line @typescript-eslint/no-floating-promises
			playSound(audio)
		}
	})

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
						onPress: () => {
							setModalVisible(false)
							navigation.navigate('Home')
						},
					},
				]}
			>
				<View style={styles.Modal as ViewType}>
					<Text style={styles.ModalText as TextType}>
						{translations.Player.leaveExerciseDescription}
					</Text>
				</View>
			</Modal>

			<WavyHeader bgColor='#1A6A73' outline>
				<View style={styles.headerContainer as ViewType}>
					<View style={styles.header as ViewType}>
						<CloseIcon color='#fff' onPress={() => setModalVisible(true)} />
						<View style={styles.counter as ViewType}>
							<Text style={styles.breakIn as TextType}>{translations.Player.breakIn}</Text>
							<Text style={styles.counterText as TextType}>48s</Text>
						</View>
					</View>
				</View>
			</WavyHeader>

			<View style={styles.exerciseInfo as ViewType}>
				<Text style={styles.exerciseName as TextType}>{exercise.name}</Text>
				<Image
					style={styles.exerciseIcon as ImageType}
					source={exerciseMap[exercise.iconName]}
					resizeMode='contain'
				/>
			</View>

			<Footer currentValue={300} maxValue={1000} barColor='#F2B077'>
				<View>
					<Text style={styles.infoText as TextType}>{exercise.name}</Text>
					<View style={styles.musicInfo as ViewType}>
						<Text style={styles.infoText as TextType}>{music.name}</Text>
						<Icon name='music' type='material-community' color='#fff' size={15} />
					</View>
				</View>
				<Text style={styles.playerCounter as TextType}>48s</Text>
				<Icon
					name='pause'
					type='antdesign'
					color='#fff'
					size={50}
					onPress={() => setPlaying(!playing)}
				/>
			</Footer>
		</View>
	)
}

export default Player
