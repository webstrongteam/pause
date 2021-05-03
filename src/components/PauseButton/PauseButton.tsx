import React from 'react'
import { View, TouchableOpacity } from 'react-native'
import { Icon } from 'react-native-elements'
import { BoxShadow } from 'react-native-shadow'
import { ViewType } from '../../types/styles'
import { useThemeContext } from '../../utils/context/ThemeContext'
import { addBackgroundColor, getShadowOpt, pickTextColor } from '../../utils/helpers'
import { centerHeight, width } from '../../utils/consts'
import styles from './PauseButton.scss'

type Props = {
	onPress: () => void
}

const pauseButtonSize = width * 0.5
const pauseIconSize = pauseButtonSize * 0.65

const PauseButton = ({ onPress }: Props) => {
	const { useSubscribe } = useThemeContext()
	const primaryColor = useSubscribe((t) => t.primary)

	return (
		<TouchableOpacity
			// We take the height of the screen, multiply it by the distance we want to set and subtract half the height of the element from it
			style={[styles.pauseButton, { top: centerHeight - 60 }] as ViewType}
			onPress={onPress}
		>
			<BoxShadow setting={getShadowOpt(pauseButtonSize)}>
				<View
					style={[
						addBackgroundColor(styles.box, primaryColor),
						{
							borderColor: pickTextColor(primaryColor),
							width: pauseButtonSize,
							height: pauseButtonSize,
							borderRadius: pauseButtonSize / 2,
						},
					]}
				>
					<Icon
						name='pause'
						type='antdesign'
						color={pickTextColor(primaryColor)}
						size={pauseIconSize}
					/>
				</View>
			</BoxShadow>
		</TouchableOpacity>
	)
}

export default PauseButton
