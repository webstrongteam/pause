import React from 'react'
import { View, TouchableOpacity, Dimensions } from 'react-native'
import { Icon } from 'react-native-elements'
import { BoxShadow } from 'react-native-shadow'
import { ViewType } from '../../types/styles'

import styles from './PauseButton.scss'

const shadowOpt = {
	width: 190,
	height: 190,
	color: '#000',
	border: 25,
	radius: 95,
	opacity: 0.2,
	x: 5,
	y: 6,
	style: { marginVertical: 0 },
}

type Props={
	onPress: () => void
}

const PauseButton = ({onPress}:Props) => (
	<TouchableOpacity style={[styles.pauseButton, {top:Dimensions.get('screen').height*0.4-60}] as ViewType} onPress={onPress}>
		<BoxShadow setting={shadowOpt}>
			<View style={styles.box as ViewType}>
				<Icon name='pause' type='antdesign' color='#fff' size={100} />
			</View>
		</BoxShadow>
	</TouchableOpacity>
)

export default PauseButton
