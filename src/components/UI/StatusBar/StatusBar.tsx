import React from 'react'
import { StatusBar as StatusBarBase, StatusBarStyle } from 'react-native'
import { getColorGrayscale } from '../../../utils/helpers'

type Props = {
	bgColor: string
}

const StatusBar = ({ bgColor }: Props) => {
	const statusBarStyle: StatusBarStyle =
		getColorGrayscale(bgColor) > 120 ? 'dark-content' : 'light-content'

	return (
		<StatusBarBase barStyle={statusBarStyle} backgroundColor='rgba(0, 0, 0, 0.2)' translucent />
	)
}

export default StatusBar
