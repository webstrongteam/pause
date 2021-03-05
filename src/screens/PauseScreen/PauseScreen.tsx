import React, { useState } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { Icon, IconType } from 'react-native-elements'
import { BoxShadow } from 'react-native-shadow'
import { TextType, ViewType } from '../../types/styles'
import { NavigationScreenType } from '../../types/navigation'
import { addBackgroundColor, getRandomPause, addTextColor, addBorderBottomColor } from '../../utils/helpers'

import WavyHeader from '../../components/WavyHeader/WavyHeader'
import CloseIcon from '../../components/UI/CloseIcon/CloseIcon'
import Modal from '../../components/Modal/Modal'

import styles from './PauseScreen.scss'

import { usePauseContext } from '../../utils/context/PauseContext'
import { useThemeContext } from '../../utils/context/ThemeContext'
import { useSettingsContext } from '../../utils/context/SettingsContext'

const shadowOpt = {
	width: 80,
	height: 80,
	color: '#000',
	border: 10,
	radius: 40,
	opacity: 0.2,
	x: 0,
	y: 0,
	style: { marginVertical: 0 },
}

type Props = {
	navigation: NavigationScreenType
}

const PauseScreen = ({ navigation }: Props) => {
	const [modalVisible, setModalVisible] = useState(false)
	const [minetues, setMinetues] = useState(0)
	const [seconds, setSeconds] = useState(0)

	const pauseContext = usePauseContext()
	const themeContext = useThemeContext()
	const settingsContext = useSettingsContext()

	const translations = settingsContext.useSubscribe((s) => s.translations)
	const settings = settingsContext.useSubscribe((s) => s.settings)
	const pause = pauseContext.useSubscribe((p) => p)
	const colors = themeContext.useSubscribe((c) => c.colors)

	if (!pause.music || !pause.exercise || !settings) {
		return <></>
	}

	const maxTime = pause.exercise.time[settings.time].totalTime

	const drawNewPauseHandler = () => {
		pauseContext.setPause(getRandomPause(pause, settings))
	}

	const openModal = () => {
		setModalVisible(true)
		if (maxTime !== undefined) {
			setMinetues(Math.floor(maxTime / 60))
			setSeconds(Math.floor(maxTime % 60))
		}
	}

	return (
		<View style={addBackgroundColor(styles.container, colors.primary)}>
			<Modal
				title={pause.exercise.name}
				visible={modalVisible}
				toggleModal={() => setModalVisible(false)}
				buttons={[
					{
						text: translations.common.ok,
						onPress: () => setModalVisible(false),
					},
				]}
			>
				<View style={styles.modalInfo as ViewType}>
					<Text>
						{translations.Pause.seriesDurationTime}{"  "}
						<Text style={styles.fontWeight as TextType}>
							{pause.exercise.time[settings.time].exerciseTime}s
						</Text>
					</Text>
					<Text>
						{translations.Pause.numberOfReps}{"  "}
						<Text style={styles.fontWeight as TextType}>
							{pause.exercise.time[settings.time].exerciseCount}
						</Text>
					</Text>
					<Text>
						{translations.Pause.breakDurationTime}{"  "}
						<Text style={styles.fontWeight as TextType}>
							{pause.exercise.time[settings.time].pauseTime}s
						</Text>
					</Text>
					<Text>
						{translations.Pause.totalTime}{"  "}
						<Text style={styles.fontWeight as TextType}>
							{minetues} min {seconds}s
						</Text>
					</Text>
				</View>
			</Modal>
			<View style={styles.header as ViewType}>
				<WavyHeader variant='centered'>
					<View style={styles.closeIcon as ViewType}>
						<CloseIcon onPress={() => navigation.goBack()} />
					</View>
					<View style={styles.headerData as ViewType}>
						<View style={styles.exerciseTitle as ViewType}>
							<Text style={addTextColor(styles.text, colors.primary)}>
								{translations.Pause.exercise}
							</Text>
							<Text style={addTextColor(styles.exerciseStyle, colors.primary)}>
								{pause.exercise?.name}
							</Text>
						</View>
					</View>
				</WavyHeader>
			</View>

			<View style={styles.centreInfo as ViewType}>
				<View style={styles.exerciseInfo as ViewType}>
					<Text style={styles.firstInfo as TextType}>{translations.Pause.durationTime}</Text>
					<View style={styles.secondInfo as ViewType}>
						<Text style={styles.secondInfoIcon as TextType}>{pause.exercise.time[settings.time].exerciseTime}s </Text>
						<Text style={styles.secondInfoIcon as TextType}> x{pause.exercise.time[settings.time].exerciseCount}</Text>
						<View><Icon name='info' type='feather' color='#fff' size={20} onPress={openModal} /></View>
					</View>
				</View>

				<View style={styles.exerciseInfo as ViewType}>
					<Text style={styles.firstInfo as TextType}>{translations.Pause.music}</Text>
					<Text style={styles.secondInfo as TextType}>{pause.music.name}</Text>
				</View>
			</View>

			<View style={styles.bottomIcons as ViewType}>
				<BoxShadow setting={shadowOpt}>
					<TouchableOpacity onPress={drawNewPauseHandler}>
						<View style={addBackgroundColor(styles.Icon, colors.primary)}>
							<Icon name='random' type='font-awesome' color='#fff' size={35} />
						</View>
					</TouchableOpacity>
				</BoxShadow>

				<BoxShadow setting={shadowOpt}>
					<TouchableOpacity>
						<View style={addBackgroundColor(styles.Icon, colors.primary)}>
							<Icon name='play' type='feather' color='#fff' size={35} />
						</View>
					</TouchableOpacity>
				</BoxShadow>
			</View>
		</View>
	)
}
export default PauseScreen
