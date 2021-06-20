import React from 'react'
import { View, ViewStyle } from 'react-native'
import { Icon } from 'react-native-elements'
import styles from './PauseVideo.scss'

type Props = {
	playerHeight: number
	playerWidth: number
}

const PauseVideo = ({ playerHeight, playerWidth }: Props) => (
	<>
		<View
			style={[styles.pauseIconWrapper as ViewStyle, { width: playerWidth, height: playerHeight }]}
		>
			<Icon
				type='antdesign'
				name='pause'
				color='#fff'
				size={200}
				style={styles.pauseIcon as ViewStyle}
			/>
		</View>
		<View style={[styles.pauseScreen as ViewStyle, { width: playerWidth, height: playerHeight }]} />
	</>
)

export default PauseVideo
