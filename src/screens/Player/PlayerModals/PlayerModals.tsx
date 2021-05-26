import { Text, View } from 'react-native'
import React from 'react'
import Modal from '../../../components/Modal/Modal'
import styles from '../Player.scss'
import { TextType, ViewType } from '../../../types/styles'
import { Translations } from '../../../types/settings'

type Props = {
	modalVisible: boolean
	translations: Translations
	setModalVisible: (visible: boolean) => void
	quitHandler: () => Promise<void>
}

const PlayerModals = ({ modalVisible, translations, setModalVisible, quitHandler }: Props) => (
		<Modal
			visible={modalVisible}
			title={translations.Player.leaveExercise}
			toggleModal={() => setModalVisible(false)}
			buttons={[
				{
					text: translations.common.no,
					onPress: () => setModalVisible(false),
				},
				{
					text: translations.common.yes,
					onPress: async () => {
						setModalVisible(false)
						await quitHandler()
					},
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

export default PlayerModals
