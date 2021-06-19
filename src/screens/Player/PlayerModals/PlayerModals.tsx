import { Text, View } from 'react-native'
import React from 'react'
import Modal from '../../../components/Modal/Modal'
import { TextType, ViewType } from '../../../types/styles'
import { usePauseContext } from '../../../utils/context/PauseContext'
import { useSettingsContext } from '../../../utils/context/SettingsContext'
import { usePlayerContext } from '../PlayerContext'
import styles from './PlayerModals.scss'

const PlayerModals = () => {
	const playerContext = usePlayerContext()
	const settingsContext = useSettingsContext()
	const player = playerContext.useSubscribe((s) => s)
	const translations = settingsContext.useSubscribe((s) => s.translations)

	if (player.modalType === 'leaveModal') {
		return (
			<Modal
				visible={player.openModal}
				title={translations.Player.leaveExercise}
				toggleModal={() => playerContext.setPlayer({ openModal: false })}
				buttons={[
					{
						text: translations.common.no,
						onPress: () => playerContext.setPlayer({ openModal: false }),
					},
					{
						text: translations.common.yes,
						onPress: () => playerContext.setPlayer({ openModal: false }),
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
		const pauseContext = usePauseContext()
		const time = settingsContext.useSubscribe((s) => s.settings?.time)!
		const exercise = pauseContext.useSubscribe((p) => p.exercise!)

		const totalPauseTime = exercise.time[time].totalTime
		const pauseMinutes = Math.floor(totalPauseTime / 60)
		const pauseSeconds = Math.floor(totalPauseTime % 60)

		return (
			<Modal
				title={exercise.name}
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
								{translations.Pause.seriesDurationTime}
							</Text>
						</View>
						<View>
							<Text style={styles.textBold as TextType}>{exercise.time[time].exerciseTime}s</Text>
						</View>
					</View>
					<View style={styles.modalElements as ViewType}>
						<View style={styles.marginModalInfo as ViewType}>
							<Text style={styles.textLight as TextType}>{translations.Pause.numberOfReps}</Text>
						</View>
						<View>
							<Text style={styles.textBold as TextType}>{exercise.time[time].exerciseCount}</Text>
						</View>
					</View>
					<View style={styles.modalElements as ViewType}>
						<View style={styles.marginModalInfo as ViewType}>
							<Text style={styles.textLight as TextType}>
								{translations.Pause.breakDurationTime}
							</Text>
						</View>
						<View>
							<Text style={styles.textBold as TextType}>{exercise.time[time].pauseTime}s</Text>
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
		)
	}

	return <></>
}

export default PlayerModals
