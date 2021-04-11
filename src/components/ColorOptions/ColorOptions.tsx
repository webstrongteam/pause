import React, { useState } from 'react'
import { View, TouchableOpacity } from 'react-native'
import { ViewType } from '../../types/styles'
import styles from './ColorOptions.scss'
import { addBackgroundColor } from '../../utils/helpers'

type Props = {
	color: string
}

const ColorOptions = ({ color }: Props) => {
	const [selectedColor, setSelectedColor] = useState(color)

	const colors = (colorArr: string[]) => (
		<View style={styles.colorsContainer as ViewType}>
			{colorArr.map((val, index) => (
				<TouchableOpacity key={index} onPress={() => setSelectedColor(val)}>
					<View style={addBackgroundColor(styles.colors, val)} />
				</TouchableOpacity>
			))}
		</View>
	)

	return (
		<View style={styles.container as ViewType}>
			<View style={addBackgroundColor(styles.changingColor, selectedColor)} />
			{colors([
				'#1A6A73',
				'#FFFFFF',
				'#C5D1D9',
				'#F2B077',
				'#723147',
				'#8653C9',
				'#1D2326',
				'#A72929',
				'#63CCCA',
				'#BA0B0B',
				'#1CA63A',
				'#D87316',
				'#F35BC9',
				'#1774C9',
				'#84FF4A',
			])}
		</View>
	)
}

export default ColorOptions
