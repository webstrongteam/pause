import React, { useState } from 'react'
import { View, Text } from 'react-native'
import { Icon } from 'react-native-elements'
import { showMessage } from 'react-native-flash-message'

//Styles and types
import styles from './Home.scss'
import { TextType, ViewType } from '../../types/styles'
import { NavigationScreenType } from '../../types/navigation'

//Components
import WavyHeader from '../../components/WavyHeader/WavyHeader'
import PauseButton from '../../components/PauseButton/PauseButton'
import Footer from '../../components/Footer/Footer'
import Modal from '../../components/Modal/Modal'
import NextLevelBenefits from '../../components/NextLevelInfo/NextLevelInfo'

//Contexts
import { useSettingsContext } from '../../utils/context/SettingsContext'
import { useThemeContext } from '../../utils/context/ThemeContext'
import { usePauseContext } from '../../utils/context/PauseContext'

//Functions
import { changeLevelAndPoints } from '../../../database/actions/settings'
import { addBackgroundColor, getPointsToLevelUp, getRandomPause } from '../../utils/helpers'
import useAsyncEffect from '../../utils/hooks/useAsyncEffect'

type Props = {
	navigation: NavigationScreenType
}

const Home = ({ navigation }: Props) => {
	//Contexts
	const settingsContext = useSettingsContext()
	const pauseContext = usePauseContext()
	const themeContext = useThemeContext()

	//Subscribes
	const translations = settingsContext.useSubscribe((s) => s.translations)
	const settings = settingsContext.useSubscribe((s) => s.settings)
	const theme = themeContext.useSubscribe((c) => c.colors)
	const pause = pauseContext.useSubscribe((p) => p)

	if (!settings) {
		return <></>
	}

	//States
	const [animate, setAnimate] = useState(true)
	const [currentValue, setCurrentValue] = useState(
		settings.points - getPointsToLevelUp(settings.level - 1),
	)
	const [maxValue, setMaxValue] = useState(
		getPointsToLevelUp(settings.level) - getPointsToLevelUp(settings.level - 1),
	)
	const [currentLevel, setCurrentLevel] = useState(settings.level)
	const [modalVisible, setModalVisible] = useState(false)

	//Handlers and functions
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
					setModalVisible(true)
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
			<Modal
				visible={modalVisible}
				toggleModal={() => setModalVisible(false)}
				buttons={[
					{
						text: translations.common.ok,
						onPress: () => setModalVisible(false),
					},
				]}
			>
				<View style={styles.modal as ViewType}>
					<Text style={styles.newLevel as TextType}>{translations.Level.newLevel}</Text>
					<Text style={styles.fontBold as TextType}>{currentLevel}</Text>
					<Text style={styles.youGet as TextType}>{translations.Level.youGet}</Text>
					<NextLevelBenefits color={theme.primary} textColor='#fff' />
				</View>
			</Modal>

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
