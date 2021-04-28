import React from 'react'
import { View, TouchableOpacity, Text } from 'react-native'
import { Icon } from 'react-native-elements'
import styles from './RenderColors.scss'

//Types
import { Color, ColorType } from '../../types/theme'
import { ViewType } from '../../types/styles'

//Contexts
import { useSettingsContext } from '../../utils/context/SettingsContext'
import { useThemeContext } from '../../utils/context/ThemeContext'

//Helpers and actions
import { addBackgroundColor, addTextColor, pickTextColor } from '../../utils/helpers'
import { changeColor } from '../../../database/actions/theme'

//Config
import colors from '../../config/colors.json'

type Props = {
	type: ColorType
}

const RenderColors = ({ type }: Props) => {
	//Contexts
	const settingsContext = useSettingsContext()
	const themeContext = useThemeContext()

	//Subscribes
	const currentLevel = settingsContext.useSubscribe((s) => s.settings?.level)!
	const theme = themeContext.useSubscribe((t) => t)

	//Functions
	const changeColorHandler = async (color: string) => {
		themeContext.setTheme(await changeColor(color, type))
	}
	return (
		<View style={styles.colorsContainer as ViewType}>
			{colors.map((colorVal: Color) => (
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
								<Text style={addTextColor(styles.levelText, pickTextColor(colorVal.color))}>
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
}
export default RenderColors
