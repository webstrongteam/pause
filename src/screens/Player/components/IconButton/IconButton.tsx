import React from 'react'
import { TouchableOpacity, View, ViewStyle } from 'react-native'
import { Icon, IconProps } from 'react-native-elements'
import { BoxShadow } from 'react-native-shadow'
import { addBackgroundColor, getShadowOpt, pickTextColor } from '../../../../utils/helpers'
import styles from './IconButton.scss'

type IconButtonProps = {
	shadowSize: number
	color: string
	onPress: () => void
	wrapperStyle?: ViewStyle
} & IconProps

const IconButton = ({
	shadowSize,
	color,
	wrapperStyle,
	onPress,
	...iconProps
}: IconButtonProps) => (
	<View style={wrapperStyle}>
		<BoxShadow setting={getShadowOpt(shadowSize)}>
			<TouchableOpacity onPress={onPress}>
				<View
					style={[addBackgroundColor(styles.icon, color), { borderColor: pickTextColor(color) }]}
				>
					<Icon {...iconProps} color={pickTextColor(color)} />
				</View>
			</TouchableOpacity>
		</BoxShadow>
	</View>
)

export default IconButton
