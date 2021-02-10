import React from 'react'
import { Icon } from 'react-native-elements'

type Props = {
	onPress: () => void
}

const CloseIcon = ({ onPress }: Props) => (
	<Icon name='x' type='feather' color='#1A6A73' size={40} onPress={onPress} />
)

export default CloseIcon
