import React, { useEffect } from 'react'
import { View, Text } from 'react-native'
import { Icon } from 'react-native-elements'
import { TextType, ViewType } from '../../types/styles'
import { NavigationScreenType } from '../../types/navigation'
import { addBackgroundColor, getPointsToLevelUp, getRandomPause } from '../../utils/helpers'
import { showMessage } from 'react-native-flash-message'

import styles from './Home.scss'

import WavyHeader from '../../components/WavyHeader/WavyHeader'
import PauseButton from '../../components/PauseButton/PauseButton'
import Footer from '../../components/Footer/Footer'

import { useSettingsContext } from '../../utils/context/SettingsContext'
import { useThemeContext } from '../../utils/context/ThemeContext'
import { usePauseContext } from '../../utils/context/PauseContext'

type Props = {
	navigation: NavigationScreenType
}

const Home = ({ navigation }: Props) => {
	const settingsContext = useSettingsContext()
	const pauseContext = usePauseContext()
	const themeContext = useThemeContext()

	const translations = settingsContext.useSubscribe((s) => s.translations)
	const settings = settingsContext.useSubscribe((s) => s.settings)
	const theme = themeContext.useSubscribe((c) => c.colors)
	const pause = pauseContext.useSubscribe((p) => p)

	if (!settings) {
		return <></>
	}


	const pauseHandler = () => {
		pauseContext.setPause(getRandomPause(pause, settings))
		navigation.navigate('Player')
	}

	const finishExercise = () => {
		const finished = navigation.getParam('finished', false)
		if(finished){
			showMessage({
				message: "elo"+pause.points,
				type: 'success',
				backgroundColor: theme.primary,
				icon: { icon: 'success', position: 'left' },
				duration: 2500,
			})
		}
	}

	useEffect( () => {
		finishExercise()
	}, [])

	return (
		<View style={addBackgroundColor(styles.container, theme.primary)}>
			<View style={styles.header as ViewType}>
				<WavyHeader variant='centered' />
			</View>
			<View>
				<PauseButton onPress={pauseHandler} />
			</View>

			<Footer
				currentValue={settings.points}
				maxValue={getPointsToLevelUp(settings.level)}
				barColor={theme.progress}
				backgroundColor={theme.primary}
			>
				<Icon
					name='account'
					onPress={() => navigation.navigate('Profile')}
					type='material-community'
					color='#fff'
					size={42}
				/>
				<Text style={styles.levelText as TextType}>
					{translations.common.level}&nbsp;{settings.level}
				</Text>
				<Icon
					name='cog-outline'
					onPress={() => navigation.navigate('Settings')}
					type='material-community'
					color='#fff'
					size={40}
				/>
			</Footer>
		</View>
	)
}

export default Home
