import React from 'react'
import { ActivityIndicator, Platform, View } from 'react-native'

type Props = {
	size?: number | 'small' | 'large'
	color?: string
	bgColor?: string
}

const Spinner = ({ size = 32, color = '#fff', bgColor = '#fff' }: Props) => {
	let setSize: number | 'small' | 'large'
	if (size) {
		if (size > 32 && Platform.OS === 'ios') setSize = 'large'
		else setSize = size
	} else setSize = 18

	return (
		<View
			style={{
				flex: 1,
				alignItems: 'center',
				justifyContent: 'center',
				backgroundColor: bgColor,
			}}
		>
			<ActivityIndicator size={setSize} color={color} />
		</View>
	)
}

export default Spinner
