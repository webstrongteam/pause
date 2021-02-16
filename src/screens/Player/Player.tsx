import React from 'react'
import { View, Text } from 'react-native'
import { Icon } from 'react-native-elements'
import WavyHeader from '../../components/WavyHeader/WavyHeader'
import { TextType, ViewType } from '../../types/styles'
import styles from './Player.scss'
import ProgressBar from '../../components/ProgressBar/ProgressBar'
import CloseIcon from '../../components/UI/CloseIcon/CloseIcon'
import { NavigationScreenType } from '../../types/navigation'

type Props = {
	navigation: NavigationScreenType
}

const Player = ({ navigation }: Props) => (
	<View style={styles.container as ViewType}>
		<WavyHeader color='#1a6a73' />

		<View style={styles.headerContainer as ViewType}>
			<View style={styles.header as ViewType}>
				<CloseIcon color='#fff' onPress={() => navigation.goBack()} />
				<View style={styles.counter as ViewType}>
					<Text style={styles.breakIn as TextType}>Przerwa za:</Text>
					<Text style={styles.counterText as TextType}>48s</Text>
				</View>
			</View>
		</View>
		<View style={styles.footer as ViewType}>
			<ProgressBar currentValue={300} maxValue={1000} barColor='#F2B077' />
			<View style={styles.playerInfo as ViewType}>
				<View>
					<Text style={styles.infoText as TextType}>WallSit</Text>
					<Text style={styles.infoText as TextType}>Sea</Text>
				</View>
				<Text style={styles.playerCounter as TextType}>48s</Text>
				<Icon name='pause' type='antdesign' color='#fff' size={50} />
			</View>
		</View>
	</View>
)

export default Player
