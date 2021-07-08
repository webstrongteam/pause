import React, { useState } from 'react'
import { View, Text } from 'react-native'
import { Icon } from 'react-native-elements'
import { ViewType } from '../../types/styles'
import { NavigationScreenType } from '../../types/navigation'
import styles from './Home.scss'

// Components
import Wavy from '../../components/Wavy/Wavy'
import PauseButton from '../../components/PauseButton/PauseButton'
import Footer from '../../components/Footer/Footer'
import Modal from '../../components/Modal/Modal'
import NextLevelBenefits from '../../components/NextLevelInfo/NextLevelInfo'

// Contexts
import { useSettingsContext } from '../../utils/context/SettingsContext'
import { useThemeContext } from '../../utils/context/ThemeContext'
import { usePauseContext } from '../../utils/context/PauseContext'

// Functions
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

const PROGRESS_ANIMATION_DURATION = 2500

const Home = ({ navigation }: Props) => {
	// Contexts
	const settingsContext = useSettingsContext()
	const pauseContext = usePauseContext()
	const themeContext = useThemeContext()

	// Subscribes
	const translations = settingsContext.useSubscribe((s) => s.translations)
	const settings = settingsContext.useSubscribe((s) => s.settings)
	const theme = themeContext.useSubscribe((t) => t)
	const pause = pauseContext.useSubscribe((p) => p)

	if (!settings || !pause.points) {
		sentryError('Missing data from context in Home')
		return <></>
	}

	const getMaxPointsForLevel = (level: number): number =>
		getPointsToLevelUp(level) - getPointsToLevelUp(level - 1)

	const [animate, setAnimate] = useState<boolean>(true)
	const [modalVisible, setModalVisible] = useState<boolean>(false)
	const [levelForModal, setLevelForModal] = useState<number>(0)

	const [maxPoints, setMaxPoints] = useState<number>(getMaxPointsForLevel(settings.level))
	const [currentLevel, setCurrentLevel] = useState<number>(settings.level)
	const [currentPoints, setCurrentPoints] = useState<number>(
		settings.points - getPointsToLevelUp(settings.level - 1),
	)

	const showFinishedExerciseMessage = useShowMessage({
		message: `${translations.common.breakEnded} +${pause.points}p`,
		backgroundColor: theme.primary,
	})

	// Handlers and functions
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

		const pointsAfterFinishExercise: number = settings.points + pause.points!
		const levelUpAfterFinishExercise: boolean =
			pointsAfterFinishExercise >= getPointsToLevelUp(settings.level)

		if (levelUpAfterFinishExercise) {
			await logEvent(`Level up - ${settings.level + 1}`, {
				component: 'Home',
			})

			setCurrentPoints(getMaxPointsForLevel(settings.level))
			settingsContext.setSettings(
				await changeLevelAndPoints(settings.level + 1, pointsAfterFinishExercise),
			)

			await timeout(100) // Wait to close modal with ratings

			setLevelForModal(settings.level)
			setModalVisible(true)

			await timeout(PROGRESS_ANIMATION_DURATION)

			setAnimate(false)
			setCurrentPoints(0)
			setMaxPoints(getMaxPointsForLevel(settings.level + 1))

			await timeout(100) // Wait to change level in progress bar

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
					level={levelForModal}
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
				maxValue={maxPoints}
				barColor={theme.progress}
				backgroundColor={theme.primary}
				animateConfig={{
					toValue: currentPoints,
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
					{translations.common.level}
					&nbsp;
					{currentLevel}
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
