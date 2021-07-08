import React from 'react'
import { Text, View } from 'react-native'
import Modal from '../../../../../components/Modal/Modal'
import { TextType, ViewType } from '../../../../../types/styles'
import { getPauseTotalTime } from '../../../../../utils/helpers'
import { usePlayerContext } from '../../../PlayerContext'
import { useSettingsContext } from '../../../../../utils/context/SettingsContext'
import { usePauseContext } from '../../../../../utils/context/PauseContext'
import { sentryError } from '../../../../../utils/sentryEvent'
import styles from './ExerciseInfoModal.scss'

const ExerciseInfoModal = () => {
	const playerContext = usePlayerContext()
	const settingsContext = useSettingsContext()
	const pauseContext = usePauseContext()

	const player = playerContext.useSubscribe((s) => s)
	const time = settingsContext.useSubscribe((s) => s.settings?.time)
	const exercise = pauseContext.useSubscribe((s) => s.exercise)
	const translations = settingsContext.useSubscribe((s) => s.translations)

	if (!time || !exercise) {
		sentryError('Missing data from context in ExerciseInfoModal')
		return <></>
	}

	const totalPauseTime = getPauseTotalTime(exercise.time[time])
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
							{pauseMinutes} min
							{pauseSeconds}s
						</Text>
					</View>
				</View>
			</View>
		</Modal>
	)
}

export default ExerciseInfoModal
