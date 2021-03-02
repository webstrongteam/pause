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

	const exercise = pauseContext.useSubscribe((p) => p.exercise)
	const music = pauseContext.useSubscribe((p) => p.music)
	const settings = settingsContext.useSubscribe((s) => s.settings)
	const pause = pauseContext.useSubscribe((p) => p)
	const time = settingsContext.useSubscribe((s) => s.settings?.time)
	const colors = themeContext.useSubscribe((c) => c.colors)

	if (!time || !settings) {
		return <></>
	}

	const pauseHandler = () => {
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
							<Text style={addTextColor(styles.text, colors.primary)}>ćwiczenie</Text>
							<Text style={addTextColor(styles.exerciseStyle, colors.primary)}>
								{exercise?.name}
							</Text>
						</View>
					</View>
				</WavyHeader>
			</View>

			<View style={styles.centreInfo as ViewType}>
				<View style={styles.exerciseInfo as ViewType}>
					<Text style={styles.info as TextType}>Czas trwania</Text>
					<Text style={[styles.info, styles.secondInfo] as TextType}>
						{exercise?.time[time].exerciseTime}s x{exercise?.time[time].exerciseCount}
					</Text>
				</View>

				<View style={styles.exerciseInfo as ViewType}>
					<Text style={styles.info as TextType}>Muzyka</Text>
					<Text style={[styles.info, styles.secondInfo] as TextType}>{music?.name}</Text>
				</View>
			</View>

			<View style={styles.bottomIcons as ViewType}>
				<BoxShadow setting={shadowOpt}>
					<TouchableOpacity onPress={pauseHandler}>
						<View style={addBackgroundColor(styles.Icon, colors.primary)}>
							<Icon name='random' type='font-awesome' color='#fff' size={40} />
						</View>
					</TouchableOpacity>
				</BoxShadow>

				<BoxShadow setting={shadowOpt}>
					<TouchableOpacity>
						<View style={addBackgroundColor(styles.Icon, colors.primary)}>
							<Icon name='play' type='feather' color='#fff' size={40} />
						</View>
					</TouchableOpacity>
				</BoxShadow>
			</View>
		</View>
	)
}
export default PauseScreen
