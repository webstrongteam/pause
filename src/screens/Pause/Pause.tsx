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
	getShadowOpt,
} from '../../utils/helpers'
import WavyHeader from '../../components/WavyHeader/WavyHeader'
import Modal from '../../components/Modal/Modal'
import { usePauseContext } from '../../utils/context/PauseContext'
import { useThemeContext } from '../../utils/context/ThemeContext'
import { useSettingsContext } from '../../utils/context/SettingsContext'
import Header from '../../components/Header/Header'
import styles from './Pause.scss'
import { sentryError } from '../../utils/sentryEvent'
import logEvent from '../../utils/logEvent'

type Props = {
	navigation: NavigationScreenType
}

const Pause = ({ navigation }: Props) => {
	const [modalVisible, setModalVisible] = useState(false)

	const pauseContext = usePauseContext()
	const themeContext = useThemeContext()
	const settingsContext = useSettingsContext()

	const translations = settingsContext.useSubscribe((s) => s.translations)
	const settings = settingsContext.useSubscribe((s) => s.settings)!
	const pause = pauseContext.useSubscribe((p) => p)
	const theme = themeContext.useSubscribe((t) => t)

	if (!pause.music || !pause.exercise) {
		sentryError('Missing data from context in Pause')
		return <></>
	}

	const totalPauseTime = pause.exercise.time[settings.time].totalTime
	const pauseMinutes = Math.floor(totalPauseTime / 60)
	const pauseSeconds = Math.floor(totalPauseTime % 60)

	const drawNewPauseHandler = () => {
		logEvent('Draw new pause', {
			component: 'Pause',
			pauseBeforeDraw: pause,
		})

		pauseContext.setPause(getRandomPause(pause, settings))
	}

	const openModal = () => {
		setModalVisible(true)
	}

	const moveToPlayer = () => {
		logEvent('Move to player', {
			component: 'Player',
			pause,
		})

		navigation.navigate('Player')
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
							<Text style={styles.textLight as TextType}>
								{translations.Pause.seriesDurationTime}
							</Text>
						</View>
						<View>
							<Text style={styles.textBold as TextType}>
								{pause.exercise.time[settings.time].exerciseTime}s
							</Text>
						</View>
					</View>
					<View style={styles.modalElements as ViewType}>
						<View style={styles.marginModalInfo as ViewType}>
							<Text style={styles.textLight as TextType}>{translations.Pause.numberOfReps}</Text>
						</View>
						<View>
							<Text style={styles.textBold as TextType}>
								{pause.exercise.time[settings.time].exerciseCount}
							</Text>
						</View>
					</View>
					<View style={styles.modalElements as ViewType}>
						<View style={styles.marginModalInfo as ViewType}>
							<Text style={styles.textLight as TextType}>
								{translations.Pause.breakDurationTime}
							</Text>
						</View>
						<View>
							<Text style={styles.textBold as TextType}>
								{pause.exercise.time[settings.time].pauseTime}s
							</Text>
						</View>
					</View>
					<View style={styles.modalElements as ViewType}>
						<View style={styles.marginModalInfo as ViewType}>
							<Text style={styles.textLight as TextType}>{translations.Pause.totalTime}</Text>
						</View>
						<View>
							<Text style={styles.textBold as TextType}>
								{pauseMinutes} min {pauseSeconds}s
							</Text>
						</View>
					</View>
				</View>
			</Modal>

			<WavyHeader variant='centered'>
				<Header closeIconHandler={() => navigation.goBack()} />

				<View style={styles.headerContainer as ViewType}>
					<Text style={addTextColor(styles.exerciseHeading, theme.primary)}>
						{translations.Pause.exercise}
					</Text>
					<Text style={addTextColor(styles.exerciseName, theme.primary)}>
						{pause.exercise?.name}
					</Text>
				</View>
			</WavyHeader>

			<View style={styles.exerciseInfoWrapper as ViewType}>
				<View style={styles.exerciseInfo as ViewType}>
					<Text style={addTextColor(styles.exerciseInfoHeading, pickTextColor(theme.primary))}>
						{translations.Pause.durationTime}
					</Text>
					<TouchableOpacity onPress={openModal}>
						<View style={styles.exerciseInfoElement as ViewType}>
							<Text style={addTextColor(styles.exerciseInfoText, pickTextColor(theme.primary))}>
								{pause.exercise.time[settings.time].exerciseTime}s
							</Text>
							<Text style={addTextColor(styles.exerciseInfoText, pickTextColor(theme.primary))}>
								&nbsp;&nbsp;&nbsp;x{pause.exercise.time[settings.time].exerciseCount}
							</Text>
							<View>
								<Icon name='info' type='feather' color={pickTextColor(theme.primary)} size={20} />
							</View>
						</View>
					</TouchableOpacity>
				</View>

				<View style={styles.exerciseInfo as ViewType}>
					<Text style={addTextColor(styles.exerciseInfoHeading, pickTextColor(theme.primary))}>
						{translations.Pause.music}
					</Text>
					<Text style={addTextColor(styles.exerciseInfoText, pickTextColor(theme.primary))}>
						{pause.music.name}
					</Text>
				</View>
			</View>

			<View style={styles.bottomIcons as ViewType}>
				<BoxShadow setting={getShadowOpt(80)}>
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

				<BoxShadow setting={getShadowOpt(80)}>
					<TouchableOpacity onPress={moveToPlayer}>
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
