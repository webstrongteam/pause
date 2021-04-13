import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import styles from './ColorButton.scss'

//Contexts
import { useSettingsContext } from '../../utils/context/SettingsContext'
import { useThemeContext } from '../../utils/context/ThemeContext'

//Types
import { TextType, ViewType } from '../../types/styles'
import { ColorType } from '../../types/theme'

//Utils
import { addBackgroundColor } from '../../utils/helpers'

type Props = {
	name: ColorType
	onPress: () => void
}

const ColorButton = ({ name, onPress }: Props) => {
	//Contexts
	const settingsContext = useSettingsContext()
	const themeContext = useThemeContext()

	//Subscribes
	const translations = settingsContext.useSubscribe((s) => s.translations)
	const theme = themeContext.useSubscribe((t) => t)

	return (
		<View style={styles.container as ViewType}>
			<Text style={styles.name as TextType}>{translations.Profile[name]}</Text>
			<TouchableOpacity onPress={onPress}>
				<View style={addBackgroundColor(styles.colorButton, theme[name])} />
			</TouchableOpacity>
		</View>
	)
}

export default ColorButton
