import React from 'react'
import { View, TouchableOpacity, Text } from 'react-native'
import { Icon } from 'react-native-elements'
import styles from './ColorOptions.scss'

//Types
import { ColorType } from '../../types/theme'
import { ViewType } from '../../types/styles'

//Contexts
import { useSettingsContext } from '../../utils/context/SettingsContext'
import { useThemeContext } from '../../utils/context/ThemeContext'

//Helpers and actions
import { addBackgroundColor } from '../../utils/helpers'
import { changeColor } from '../../../database/actions/theme'

//Config
import colors from '../../config/colors.json'

type Props = {
	type: ColorType
}

const ColorOptions = ({ type }: Props) => {
	//Contexts
	const settingsContext = useSettingsContext()
	const themeContext = useThemeContext()

	//Subscribes
	const currentLevel = settingsContext.useSubscribe((s) => s.settings?.level)
	const theme = themeContext.useSubscribe((t) => t)

	if (!currentLevel) {
		return <></>
	}

	//Functions
	const changeColorHandler = async (color: string) => {
		themeContext.setTheme(await changeColor(color, type))
	}

	const pickTextColor = (bgColor: string) => {
		const color = bgColor.charAt(0) === '#' ? bgColor.substring(1, 7) : bgColor
		const r = parseInt(color.substring(0, 2), 16)
		const g = parseInt(color.substring(2, 4), 16)
		const b = parseInt(color.substring(4, 6), 16)
		return r * 0.299 + g * 0.587 + b * 0.114 > 120 ? '#383838' : '#efefef'
	}

	const renderColors = (colorArr: object[]) => (
		<View style={styles.colorsContainer as ViewType}>
			{colorArr.map((colorVal: any) => (
				<TouchableOpacity
					disabled={
						currentLevel < colorVal.requiredLevel || Object.values(theme).includes(colorVal.color)
					}
					key={colorVal.color}
					onPress={() => changeColorHandler(colorVal.color)}
				>
					<View style={addBackgroundColor(styles.colors, colorVal.color)}>
						{currentLevel < colorVal.requiredLevel && (
							<View style={styles.lock as ViewType}>
								<Text style={{ color: pickTextColor(colorVal.color) }}>
									{colorVal.requiredLevel}
								</Text>
								<Icon
									name='lock-closed-outline'
									type='ionicon'
									size={15}
									color={pickTextColor(colorVal.color)}
								/>
							</View>
						)}

						{Object.values(theme).includes(colorVal.color) && (
							<View style={styles.lock as ViewType}>
								<Icon
									name='color-palette-outline'
									type='ionicon'
									size={20}
									color={pickTextColor(colorVal.color)}
								/>
							</View>
						)}
					</View>
				</TouchableOpacity>
			))}
		</View>
	)

	return (
		<View style={styles.container as ViewType}>
			<View style={addBackgroundColor(styles.changingColor, theme[type])} />
			{renderColors(colors)}
		</View>
	)
}

export default ColorOptions
