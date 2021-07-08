import React from 'react'
import { Text, View } from 'react-native'
import Modal from '../../../../../components/Modal/Modal'
import { TextType, ViewType } from '../../../../../types/styles'
import { usePlayerContext } from '../../../PlayerContext'
import { useSettingsContext } from '../../../../../utils/context/SettingsContext'
import styles from './LeaveModal.scss'

const LeaveModal = () => {
	const playerContext = usePlayerContext()
	const settingsContext = useSettingsContext()

	const player = playerContext.useSubscribe((s) => s)
	const translations = settingsContext.useSubscribe((s) => s.translations)

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

export default LeaveModal
