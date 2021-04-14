import React from 'react'
import { Icon } from 'react-native-elements'
import { useThemeContext } from '../../../utils/context/ThemeContext'

type Props = {
	onPress: () => void
	color?: string
}

const CloseIcon = ({ onPress, color }: Props) => {
	const { useSubscribe } = useThemeContext()
	const theme = useSubscribe((t) => t)

	return <Icon name='x' type='feather' color={color ?? theme.primary} size={40} onPress={onPress} />
}

export default CloseIcon
