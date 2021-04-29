import React, { useState } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { Icon } from 'react-native-elements'
import { BoxShadow } from 'react-native-shadow'
import { TextType, ViewType } from '../../types/styles'
import { NavigationScreenType } from '../../types/navigation'
import {
	addBackgroundColor,
	pickTextColor,
	getRandomPause,
	addTextColor,
} from '../../utils/helpers'

import WavyHeader from '../../components/WavyHeader/WavyHeader'
import Modal from '../../components/Modal/Modal'

import styles from './Pause.scss'

import { usePauseContext } from '../../utils/context/PauseContext'
import { useThemeContext } from '../../utils/context/ThemeContext'
import { useSettingsContext } from '../../utils/context/SettingsContext'
import Header from '../../components/Header/Header'

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

const Pause = ({ navigation }: Props) => {
	const [modalVisible, setModalVisible] = useState(false)
	const [minutes, setMinutes] = useState(0)
	const [seconds, setSeconds] = useState(0)

	const pauseContext = usePauseContext()
	const themeContext = useThemeContext()
	const settingsContext = useSettingsContext()

	const translations = settingsContext.useSubscribe((s) => s.translations)
	const settings = settingsContext.useSubscribe((s) => s.settings)!
	const pause = pauseContext.useSubscribe((p) => p)
	const theme = themeContext.useSubscribe((t) => t)

	if (!pause.music || !pause.exercise) {
		return <></>
	}

	const maxTime = pause.exercise.time[settings.time].totalTime

	const drawNewPauseHandler = () => {
		pauseContext.setPause(getRandomPause(pause, settings))
	}

	const openModal = () => {
		setModalVisible(true)
		setMinutes(Math.floor(maxTime / 60))
		setSeconds(Math.floor(maxTime % 60))
	}

	return (
		<View style={addBackgroundColor(styles.container, theme.primary)}>
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
					<View style={styles.modalElements as ViewType}>
						<View style={styles.marginModalInfo as ViewType}>
							<Text style={styles.fontLight as TextType}>
								{translations.Pause.seriesDurationTime}
							</Text>
						</View>
						<View>
							<Text style={styles.fontWeight as TextType}>
								{pause.exercise.time[settings.time].exerciseTime}s
							</Text>
						</View>
					</View>
					<View style={styles.modalElements as ViewType}>
						<View style={styles.marginModalInfo as ViewType}>
							<Text style={styles.fontLight as TextType}>{translations.Pause.numberOfReps}</Text>
						</View>
						<View>
							<Text style={styles.fontWeight as TextType}>
								{pause.exercise.time[settings.time].exerciseCount}
							</Text>
						</View>
					</View>
					<View style={styles.modalElements as ViewType}>
						<View style={styles.marginModalInfo as ViewType}>
							<Text style={styles.fontLight as TextType}>
								{translations.Pause.breakDurationTime}
							</Text>
						</View>
						<View>
							<Text style={styles.fontWeight as TextType}>
								{pause.exercise.time[settings.time].pauseTime}s
							</Text>
						</View>
					</View>
					<View style={styles.modalElements as ViewType}>
						<View style={styles.marginModalInfo as ViewType}>
							<Text style={styles.fontLight as TextType}>{translations.Pause.totalTime}</Text>
						</View>
						<View>
							<Text style={styles.fontWeight as TextType}>
								{minutes} min {seconds}s
							</Text>
						</View>
					</View>
				</View>
			</Modal>

			<WavyHeader variant='centered'>
				<Header closeIconHandler={() => navigation.goBack()} />

				<View style={styles.headerContainer as ViewType}>
					<Text style={addTextColor(styles.text, theme.primary)}>
						{translations.Pause.exercise}
					</Text>
					<Text style={addTextColor(styles.exerciseStyle, theme.primary)}>
						{pause.exercise?.name}
					</Text>
				</View>
			</WavyHeader>

			<View style={styles.centreInfo as ViewType}>
				<View style={styles.exerciseInfo as ViewType}>
					<Text style={addTextColor(styles.firstInfo, pickTextColor(theme.primary))}>
						{translations.Pause.durationTime}
					</Text>
					<TouchableOpacity onPress={openModal}>
						<View style={styles.secondInfo as ViewType}>
							<Text style={addTextColor(styles.secondInfoIcon, pickTextColor(theme.primary))}>
								{pause.exercise.time[settings.time].exerciseTime}s
							</Text>
							<Text style={addTextColor(styles.secondInfoIcon, pickTextColor(theme.primary))}>
								x{pause.exercise.time[settings.time].exerciseCount}
							</Text>
							<View>
								<Icon name='info' type='feather' color={pickTextColor(theme.primary)} size={20} />
							</View>
						</View>
					</TouchableOpacity>
				</View>

				<View style={styles.exerciseInfo as ViewType}>
					<Text style={addTextColor(styles.firstInfo, pickTextColor(theme.primary))}>
						{translations.Pause.music}
					</Text>
					<Text style={addTextColor(styles.secondInfo, pickTextColor(theme.primary))}>
						{pause.music.name}
					</Text>
				</View>
			</View>

			<View style={styles.bottomIcons as ViewType}>
				<BoxShadow setting={shadowOpt}>
					<TouchableOpacity onPress={drawNewPauseHandler}>
						<View
							style={[
								addBackgroundColor(styles.icon, theme.primary),
								{ borderColor: pickTextColor(theme.primary) },
							]}
						>
							<Icon
								name='random'
								type='font-awesome'
								color={pickTextColor(theme.primary)}
								size={35}
							/>
						</View>
					</TouchableOpacity>
				</BoxShadow>

				<BoxShadow setting={shadowOpt}>
					<TouchableOpacity onPress={() => navigation.navigate('Player')}>
						<View
							style={[
								addBackgroundColor(styles.icon, theme.primary),
								{ borderColor: pickTextColor(theme.primary) },
							]}
						>
							<Icon name='play' type='feather' color={pickTextColor(theme.primary)} size={35} />
						</View>
					</TouchableOpacity>
				</BoxShadow>
			</View>
		</View>
	)
}
export default Pause
