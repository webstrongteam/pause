import React, { useState } from 'react'
import { View, Text } from 'react-native'
import { Icon } from 'react-native-elements'

//Styles and types
import styles from './Home.scss'
import { ViewType } from '../../types/styles'
import { NavigationScreenType } from '../../types/navigation'

//Components
import Wavy from '../../components/Wavy/Wavy'
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
import {
	addBackgroundColor,
	addTextColor,
	pickTextColor,
	getPointsToLevelUp,
	getRandomPause,
	timeout,
} from '../../utils/helpers'

// Hooks
import useAsyncEffect from '../../utils/hooks/useAsyncEffect'
import useShowMessage from '../../utils/hooks/useShowMessage'
import { sentryError } from '../../utils/sentryEvent'
import logEvent from '../../utils/logEvent'

type Props = {
	navigation: NavigationScreenType
}

const PROGRESS_ANIMATION_DURATION = 4000

const Home = ({ navigation }: Props) => {
	//Contexts
	const settingsContext = useSettingsContext()
	const pauseContext = usePauseContext()
	const themeContext = useThemeContext()

	//Subscribes
	const translations = settingsContext.useSubscribe((s) => s.translations)
	const settings = settingsContext.useSubscribe((s) => s.settings)
	const theme = themeContext.useSubscribe((t) => t)
	const pause = pauseContext.useSubscribe((p) => p)

	if (!settings || !pause.points) {
		sentryError('Missing data from context in Home')
		return <></>
	}

	//States
	const [animate, setAnimate] = useState(true)
	const [currentPoints, setCurrentPoints] = useState(
		settings.points - getPointsToLevelUp(settings.level - 1),
	)

	const [currentLevel, setCurrentLevel] = useState(settings.level)
	const [modalVisible, setModalVisible] = useState(false)

	const pointsAfterFinishExercise: number = settings.points + pause.points
	const levelUpAfterFinishExercise: boolean =
		pointsAfterFinishExercise >= getPointsToLevelUp(settings.level)
	const pointsToLevelUp =
		getPointsToLevelUp(settings.level) - getPointsToLevelUp(settings.level - 1)

	const showFinishedExerciseMessage = useShowMessage({
		message: `${translations.common.breakEnded} +${pause.points}p`,
		backgroundColor: theme.primary,
	})

	//Handlers and functions
	const pauseHandler = () => {
		logEvent('Move to pause screen', {
			component: 'Home',
		})

		pauseContext.setPause(getRandomPause(pause, settings))
		navigation.navigate('Player')
	}

	const finishExercise = async () => {
		const finished = navigation.getParam('finished', false)
		if (!finished) return

		await logEvent('Finish pause', {
			component: 'Home',
		})

		showFinishedExerciseMessage()

		if (levelUpAfterFinishExercise) {
			await logEvent(`Level up - ${settings.level + 1}`, {
				component: 'Home',
			})

			setCurrentPoints(pointsToLevelUp)
			settingsContext.setSettings(
				await changeLevelAndPoints(settings.level + 1, pointsAfterFinishExercise),
			)
			setModalVisible(true)

			await timeout(PROGRESS_ANIMATION_DURATION)

			setAnimate(false)
			setCurrentPoints(0)

			await timeout(100)

			setAnimate(true)
			setCurrentPoints(pointsAfterFinishExercise - getPointsToLevelUp(settings.level))
			setCurrentLevel(settings.level + 1)
		} else {
			settingsContext.setSettings(
				await changeLevelAndPoints(settings.level, pointsAfterFinishExercise),
			)
			setCurrentPoints(pointsAfterFinishExercise - getPointsToLevelUp(settings.level - 1))
		}

		navigation.setParams({ finished: false })
	}

	useAsyncEffect(async () => {
		await finishExercise()
	}, [])

	return (
		<View style={addBackgroundColor(styles.container, theme.primary)}>
			<Modal
				visible={modalVisible}
				toggleModal={() => setModalVisible(false)}
				title={`${translations.Level.newLevel} ${settings.level}`}
				buttons={[
					{
						text: translations.common.ok,
						onPress: () => setModalVisible(false),
					},
				]}
			>
				<NextLevelBenefits
					color={theme.primary}
					emptyBenefitsText={translations.common.congratulations}
					titleClassName={styles.getBenefitsTitle}
					title={translations.Level.benefitsTitle}
					textColor='#fff'
				/>
			</Modal>

			<View style={styles.header as ViewType}>
				<Wavy position='centered' />
			</View>

			<PauseButton onPress={pauseHandler} />

			<Footer
				animate={animate}
				currentValue={currentPoints}
				maxValue={pointsToLevelUp}
				barColor={theme.progress}
				backgroundColor={theme.primary}
				animateConfig={{
					toValue:
						settings.level > 1
							? settings.points - getPointsToLevelUp(settings.level - 1)
							: settings.points,
					duration: PROGRESS_ANIMATION_DURATION,
					useNativeDriver: false,
				}}
			>
				<Icon
					name='account'
					onPress={() => navigation.navigate('Profile')}
					type='material-community'
					color={pickTextColor(theme.primary)}
					size={42}
				/>
				<Text style={addTextColor(styles.levelText, pickTextColor(theme.primary))}>
					{translations.common.level}&nbsp;{currentLevel}
				</Text>
				<Icon
					name='cog-outline'
					onPress={() => navigation.navigate('Settings')}
					type='material-community'
					color={pickTextColor(theme.primary)}
					size={40}
				/>
			</Footer>
		</View>
	)
}

export default Home
