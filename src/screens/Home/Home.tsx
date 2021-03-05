import React, { useState } from 'react'
import { View, Text } from 'react-native'
import { Icon } from 'react-native-elements'
import { showMessage } from 'react-native-flash-message'
import { TextType, ViewType } from '../../types/styles'
import { NavigationScreenType } from '../../types/navigation'
import { addBackgroundColor, getPointsToLevelUp, getRandomPause } from '../../utils/helpers'
import useAsyncEffect from '../../utils/hooks/useAsyncEffect'

import styles from './Home.scss'

import WavyHeader from '../../components/WavyHeader/WavyHeader'
import PauseButton from '../../components/PauseButton/PauseButton'
import Footer from '../../components/Footer/Footer'

import { useSettingsContext } from '../../utils/context/SettingsContext'
import { useThemeContext } from '../../utils/context/ThemeContext'
import { usePauseContext } from '../../utils/context/PauseContext'
import { changeLevelAndPoints } from '../../../database/actions/settings'

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

	const [animate, setAnimate] = useState(true)
	const [currentValue, setCurrentValue] = useState(
		settings.points - getPointsToLevelUp(settings.level - 1),
	)
	const [maxValue, setMaxValue] = useState(
		getPointsToLevelUp(settings.level) - getPointsToLevelUp(settings.level - 1),
	)
	const [currentLevel, setCurrentLevel] = useState(settings.level)

	const pauseHandler = () => {
		pauseContext.setPause(getRandomPause(pause, settings))
		navigation.navigate('Player')
	}

	const finishExercise = async () => {
		const finished = navigation.getParam('finished', false)
		if (finished) {
			showMessage({
				message: `${translations.common.breakEnded} +${pause.points}p`,
				type: 'success',
				backgroundColor: theme.primary,
				duration: 2500,
			})
			if (!pause.points) {
				return <></>
			}
			const newPoints = settings.points + pause.points
			if (getPointsToLevelUp(settings.level) < newPoints) {
				setCurrentValue(maxValue)
				setTimeout(() => {
					setAnimate(false)
					setCurrentValue(0)
				}, 5000)
				setTimeout(async () => {
					setAnimate(true)
					settingsContext.setSettings(await changeLevelAndPoints(settings.level + 1, newPoints))
					setCurrentValue(newPoints - getPointsToLevelUp(settings.level))
					setMaxValue(getPointsToLevelUp(settings.level) - getPointsToLevelUp(settings.level - 1))
					setCurrentLevel(settings.level + 1)
					navigation.setParams({ finished: false })
				}, 5100)
			} else {
				settingsContext.setSettings(await changeLevelAndPoints(settings.level, newPoints))
				setCurrentValue(newPoints - getPointsToLevelUp(settings.level - 1))
				navigation.setParams({ finished: false })
			}
		}
	}

	useAsyncEffect(async () => {
		await finishExercise()
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
				animate={animate}
				currentValue={currentValue}
				maxValue={maxValue}
				barColor={theme.progress}
				backgroundColor={theme.primary}
				animateConfig={{
					toValue:
						settings.level > 1
							? settings.points - getPointsToLevelUp(settings.level - 1)
							: settings.points,
					duration: 5000,
					useNativeDriver: false,
				}}
			>
				<Icon
					name='account'
					onPress={() => navigation.navigate('Profile')}
					type='material-community'
					color='#fff'
					size={42}
				/>
				<Text style={styles.levelText as TextType}>
					{translations.common.level}&nbsp;{currentLevel}
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
