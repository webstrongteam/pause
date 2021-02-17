import React, { useState } from 'react'
import { View, Text } from 'react-native'
import { Icon } from 'react-native-elements'
import WavyHeader from '../../components/WavyHeader/WavyHeader'
import { TextType, ViewType } from '../../types/styles'
import styles from './Player.scss'
import ProgressBar from '../../components/ProgressBar/ProgressBar'
import CloseIcon from '../../components/UI/CloseIcon/CloseIcon'
import { NavigationScreenType } from '../../types/navigation'
import { useSettingsContext } from '../../utils/context/SettingsContext'
import Modal from '../../components/Modal/Modal'

type Props = {
	navigation: NavigationScreenType
}

const Player = ({ navigation }: Props) => {
	const [modalVisible, setModalVisible] = useState(false)
	const { useSubscribe } = useSettingsContext()
	const translations = useSubscribe((s) => s.translations)

	return (
		<View style={styles.container as ViewType}>
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
						onPress: () => {
							setModalVisible(false)
							navigation.navigate('Home')
						},
					},
				]}
			>
				<View style={styles.Modal as ViewType}>
					<Text style={styles.ModalText as TextType}>
						{translations.Player.leaveExerciseDescription}
					</Text>
				</View>
			</Modal>
			<WavyHeader bgColor='#1A6A73' outline>
				<View style={styles.headerContainer as ViewType}>
					<View style={styles.header as ViewType}>
						<CloseIcon color='#fff' onPress={() => setModalVisible(true)} />
						<View style={styles.counter as ViewType}>
							<Text style={styles.breakIn as TextType}>{translations.Player.breakIn}</Text>
							<Text style={styles.counterText as TextType}>48s</Text>
						</View>
					</View>
				</View>
			</WavyHeader>

			<View style={styles.footer as ViewType}>
				<ProgressBar currentValue={300} maxValue={1000} barColor='#F2B077' />
				<View style={styles.playerInfo as ViewType}>
					<View>
						<Text style={styles.infoText as TextType}>WallSit</Text>
						<View style={styles.musicInfo as ViewType}>
							<Text style={styles.infoText as TextType}>Sea</Text>
							<Icon name='music' type='material-community' color='#fff' size={15} />
						</View>
					</View>
					<Text style={styles.playerCounter as TextType}>48s</Text>
					<Icon name='pause' type='antdesign' color='#fff' size={50} />
				</View>
			</View>
		</View>
	)
}

export default Player
