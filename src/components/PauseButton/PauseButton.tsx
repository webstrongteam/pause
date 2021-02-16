import React from 'react'
import { View } from 'react-native'
import { Icon } from 'react-native-elements'
import { ViewType } from '../../types/styles'

import styles from './PauseButton.scss'

const PauseButton = () => (
		<View style={styles.box as ViewType}>
			<Icon name='pause' type='antdesign' color='#fff' size={100} />
		</View>
	)

export default PauseButton
