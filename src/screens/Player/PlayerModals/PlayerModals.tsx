import React from 'react'
import { Text, View } from 'react-native'
import Modal from '../../../components/Modal/Modal'
import { TextType, ViewType } from '../../../types/styles'
import { usePauseContext } from '../../../utils/context/PauseContext'
import { useSettingsContext } from '../../../utils/context/SettingsContext'
import { usePlayerContext } from '../PlayerContext'
import { sentryError } from '../../../utils/sentryEvent'
import styles from './PlayerModals.scss'

const PlayerModals = () => {
	const playerContext = usePlayerContext()
	const settingsContext = useSettingsContext()
	const pauseContext = usePauseContext()

	const player = playerContext.useSubscribe((s) => s)
	const time = settingsContext.useSubscribe((s) => s.settings?.time)
	const exercise = pauseContext.useSubscribe((s) => s.exercise)
	const translations = settingsContext.useSubscribe((s) => s.translations)

	if (!time || !exercise) {
		sentryError('Missing data from context in PlayerModals')
		return <></>
	}

	if (player.modalType === 'leaveModal') {
		const closeModalHandler = () => {
			playerContext.setPlayer({ openModal: false, status: player.fullTime ? 'stop' : 'preview' })
		}

		return (
			<Modal
				visible={player.openModal}
				title={translations.Player.leaveExercise}
				toggleModal={closeModalHandler}
				buttons={[
					{
						text: translations.common.no,
						onPress: closeModalHandler,
					},
					{
						text: translations.common.yes,
						onPress: () => playerContext.setPlayer({ openModal: false, status: 'exit' }),
					},
				]}
			>
				<View style={styles.modal as ViewType}>
					<Text style={styles.modalText as TextType}>
						{translations.Player.leaveExerciseDescription}
					</Text>
				</View>
			</Modal>
		)
	}

	if (player.modalType === 'exerciseInfoModal') {
		const totalPauseTime = exercise.time[time].totalTime
		const pauseMinutes = Math.floor(totalPauseTime / 60)
		const pauseSeconds = Math.floor(totalPauseTime % 60)

		return (
			<Modal
				title={translations.Player.exercise}
				visible={player.openModal}
				toggleModal={() => playerContext.setPlayer({ openModal: false })}
				buttons={[
					{
						text: translations.common.ok,
						onPress: () => playerContext.setPlayer({ openModal: false }),
					},
				]}
			>
				<View style={styles.modalInfo as ViewType}>
					<View style={styles.modalElements as ViewType}>
						<View style={styles.marginModalInfo as ViewType}>
							<Text style={styles.textLight as TextType}>
								{translations.Player.seriesDurationTime}
							</Text>
						</View>
						<View>
							<Text style={styles.textBold as TextType}>{exercise.time[time].exerciseTime}s</Text>
						</View>
					</View>
					<View style={styles.modalElements as ViewType}>
						<View style={styles.marginModalInfo as ViewType}>
							<Text style={styles.textLight as TextType}>{translations.Player.numberOfReps}</Text>
						</View>
						<View>
							<Text style={styles.textBold as TextType}>{exercise.time[time].exerciseCount}</Text>
						</View>
					</View>
					<View style={styles.modalElements as ViewType}>
						<View style={styles.marginModalInfo as ViewType}>
							<Text style={styles.textLight as TextType}>
								{translations.Player.breakDurationTime}
							</Text>
						</View>
						<View>
							<Text style={styles.textBold as TextType}>{exercise.time[time].pauseTime}s</Text>
						</View>
					</View>
					<View style={styles.modalElements as ViewType}>
						<View style={styles.marginModalInfo as ViewType}>
							<Text style={styles.textLight as TextType}>{translations.Player.totalTime}</Text>
						</View>
						<View>
							<Text style={styles.textBold as TextType}>
								{pauseMinutes} min {pauseSeconds}s
							</Text>
						</View>
					</View>
				</View>
			</Modal>
		)
	}

	return <></>
}

export default PlayerModals
