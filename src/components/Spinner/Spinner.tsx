import React from 'react'
import { ActivityIndicator, Platform, View } from 'react-native'
import { addBackgroundColor } from '../../utils/helpers'
import styles from './Spinner.scss'

type Props = {
	size?: number | 'small' | 'large'
	color?: string
	bgColor?: string
}

const Spinner = ({ size = 32, color = '#FFFFFF', bgColor = '#1A6A73' }: Props) => {
	const getSize = (): number | 'small' | 'large' => {
		if (Platform.OS === 'ios') {
			if (size > 32) {
				return 'large'
			}
			return 'small'
		}
		return size
	}

	return (
		<View style={addBackgroundColor(styles.spinner, bgColor)}>
			<ActivityIndicator size={getSize()} color={color} />
		</View>
	)
}

export default Spinner
