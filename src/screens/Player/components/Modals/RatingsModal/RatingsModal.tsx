import React, { useState } from 'react'
import { Text, View } from 'react-native'
import { Rating } from 'react-native-elements'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Modal from '../../../../../components/Modal/Modal'
import { usePlayerContext } from '../../../PlayerContext'
import { useSettingsContext } from '../../../../../utils/context/SettingsContext'
import { ViewType } from '../../../../../types/styles'
import config from '../../../../../config/config'
import { sentryError } from '../../../../../utils/sentryEvent'
import { usePauseContext } from '../../../../../utils/context/PauseContext'
import Spinner from '../../../../../components/Spinner/Spinner'
import { useThemeContext } from '../../../../../utils/context/ThemeContext'
import styles from './RatingsModal.scss'

const RatingsModal = () => {
	const playerContext = usePlayerContext()
	const settingsContext = useSettingsContext()
	const pauseContext = usePauseContext()
	const themeContext = useThemeContext()

	const player = playerContext.useSubscribe((s) => s)
	const primaryColor = themeContext.useSubscribe((s) => s.primary)
	const exercise = pauseContext.useSubscribe((s) => s.exercise)
	const time = settingsContext.useSubscribe((s) => s.settings?.time)
	const translations = settingsContext.useSubscribe((s) => s.translations)

	if (!time || !exercise) {
		sentryError('Missing data from context in RatingsModal')
		return <></>
	}

	const [loading, setLoading] = useState<boolean>(false)
	const [ratingDifficulty, setRatingDifficulty] = useState<number>()
	const [ratingTime, setRatingTime] = useState<number>()
	const [ratingGeneral, setRatingGeneral] = useState<number>()

	const closeModalHandler = async () => {
		if (ratingDifficulty || ratingTime || ratingGeneral) {
			setLoading(true)
			try {
				await fetch(config.DATABASE_URL, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						ratings: { ratingDifficulty, ratingTime, ratingGeneral },
						exercise: {
							...exercise,
							time: exercise.time[time],
						},
					}),
				})

				await AsyncStorage.setItem(`${exercise.videoId}${time}`, 'rated')
			} catch (err) {
				sentryError(err)
			}
		}

		playerContext.setPlayer({ openModal: false, status: 'finish' })
	}

	return (
		<Modal
			title={translations.Player.ratingModalTitle}
			visible={player.openModal}
			toggleModal={closeModalHandler}
			buttons={[
				{
					text: translations.common.ok,
					onPress: closeModalHandler,
				},
			]}
		>
			{loading && (
				<View style={styles.loading as ViewType}>
					<Spinner color={primaryColor} size={48} />
				</View>
			)}

			{!loading && (
				<View style={styles.container as ViewType}>
					<Text style={styles.ratingTitle as ViewType}>{translations.Player.ratingDifficulty}</Text>
					<Rating fractions={1} imageSize={32} onFinishRating={setRatingDifficulty} />
					<Text style={styles.ratingTitle as ViewType}>{translations.Player.ratingTime}</Text>
					<Rating fractions={1} imageSize={32} onFinishRating={setRatingTime} />
					<Text style={styles.ratingTitle as ViewType}>{translations.Player.ratingGeneral}</Text>
					<Rating fractions={1} imageSize={32} onFinishRating={setRatingGeneral} />
				</View>
			)}
		</Modal>
	)
}

export default RatingsModal
