import React from 'react'
import { Icon } from 'react-native-elements'

type Props = {
	onPress: () => void
	color?: string
}

const CloseIcon = ({ onPress, color = '#1A6A73' }: Props) => (
	<Icon name='x' type='feather' color={color} size={40} onPress={onPress} />
)

export default CloseIcon
