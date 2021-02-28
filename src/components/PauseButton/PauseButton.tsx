import React from 'react'
import { View, TouchableOpacity, Dimensions } from 'react-native'
import { Icon } from 'react-native-elements'
import { BoxShadow } from 'react-native-shadow'
import { ViewType } from '../../types/styles'
import { useThemeContext } from '../../utils/context/ThemeContext'

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

type Props = {
	onPress: () => void
}

const PauseButton = ({ onPress }: Props) => {
	const { useSubscribe } = useThemeContext()
	const color = useSubscribe((c) => c.colors)

	return (
		<TouchableOpacity
			style={[styles.pauseButton, { top: Dimensions.get('screen').height * 0.4 - 60 }] as ViewType}
			/*We take the height of the screen, multiply it by the distance we want to set and subtract half the height of the element from it*/
			onPress={onPress}
		>
			<BoxShadow setting={shadowOpt}>
				<View style={[styles.box, { backgroundColor: color.primary }] as ViewType}>
					<Icon name='pause' type='antdesign' color='#fff' size={112} />
				</View>
			</BoxShadow>
		</TouchableOpacity>
	)
}

export default PauseButton
