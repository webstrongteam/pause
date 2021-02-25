import React from 'react'
import { View, TouchableOpacity } from 'react-native'
import { Icon } from 'react-native-elements'
import {BoxShadow} from 'react-native-shadow'
import { ViewType } from '../../types/styles'

import styles from './PauseButton.scss'

const shadowOpt = {
	width:190,
	height:190,
	color:"#000",
	border:25,
	radius:95,
	opacity:0.2,
	x:5,
	y:6,
	style:{marginVertical:0}
}

const PauseButton = () => (
	<TouchableOpacity style={styles.pauseButton as ViewType}>
		<BoxShadow setting={shadowOpt}>
			<View style={styles.box as ViewType}>
				<Icon 
					name='pause' 
					type='antdesign' 
					color='#fff' 
					size={100} 
				/>
			</View>
		</BoxShadow>		
	</TouchableOpacity>	
)

export default PauseButton