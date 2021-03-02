import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { Icon } from 'react-native-elements'
import { BoxShadow } from 'react-native-shadow'
import { TextType, ViewType } from '../../types/styles'
import { NavigationScreenType } from '../../types/navigation'
import { addBackgroundColor, getRandomPause, addTextColor } from '../../utils/helpers'

import WavyHeader from '../../components/WavyHeader/WavyHeader'
import CloseIcon from '../../components/UI/CloseIcon/CloseIcon'

import styles from './PauseScreen.scss'

import { usePauseContext } from '../../utils/context/PauseContext'
import { useThemeContext } from '../../utils/context/ThemeContext'
import { useSettingsContext } from '../../utils/context/SettingsContext'

const shadowOpt = {
	width: 90,
	height: 90,
	color: '#000',
	border: 10,
	radius: 45,
	opacity: 0.2,
	x: 0,
	y: 0,
	style: { marginVertical: 0 },
}

type Props = {
	navigation: NavigationScreenType
}

const PauseScreen = ({ navigation }: Props) => {
	const pauseContext = usePauseContext()
	const themeContext = useThemeContext()
	const settingsContext = useSettingsContext()

	const translations = settingsContext.useSubscribe((s) => s.translations)
	const settings = settingsContext.useSubscribe((s) => s.settings)
	const pause = pauseContext.useSubscribe((p) => p)
	const colors = themeContext.useSubscribe((c) => c.colors)

	if (!pause || !settings) {
		return <></>
	}

	const drawNewPauseHandler = () => {
		pauseContext.setPause(getRandomPause(pause, settings))
	}

	return (
		<View style={addBackgroundColor(styles.container, colors.primary)}>
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
					<Text style={styles.secondInfo as TextType}>
						{pause.exercise?.time[settings.time].exerciseTime}s x
						{pause.exercise?.time[settings.time].exerciseCount}
					</Text>
				</View>

				<View style={styles.exerciseInfo as ViewType}>
					<Text style={styles.firstInfo as TextType}>{translations.Pause.music}</Text>
					<Text style={styles.secondInfo as TextType}>{pause.music?.name}</Text>
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
