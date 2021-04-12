import React from 'react'
import { View, TouchableOpacity } from 'react-native'
import { ViewType } from '../../types/styles'
import styles from './ColorOptions.scss'
import { addBackgroundColor } from '../../utils/helpers'
import { useThemeContext } from '../../utils/context/ThemeContext'
import { changeColor } from '../../../database/actions/theme'
import { ColorType } from '../../types/theme'

type Props = {
	type: ColorType
}

const ColorOptions = ({ type }: Props) => {
	const { setTheme, useSubscribe } = useThemeContext()
	const theme = useSubscribe((t) => t)

	const changeColorHandler = async (color: string) => {
		setTheme(await changeColor(color, type))
	}

	const renderColors = (colorArr: string[]) => (
		<View style={styles.colorsContainer as ViewType}>
			{colorArr.map((color) => (
				<TouchableOpacity key={color} onPress={() => changeColorHandler(color)}>
					<View style={addBackgroundColor(styles.colors, color)} />
				</TouchableOpacity>
			))}
		</View>
	)

	return (
		<View style={styles.container as ViewType}>
			<View style={addBackgroundColor(styles.changingColor, theme[type])} />
			{renderColors([
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
