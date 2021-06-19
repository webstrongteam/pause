import React, { useEffect } from 'react'
import { View } from 'react-native'
import { Video } from 'expo-av'
import { usePlayerContext } from '../PlayerContext'

const PlayerVideo = () => {
	const video = React.useRef(null)
	const playerContext = usePlayerContext()

	useEffect(() => {
		if (video.current) {
			playerContext.setPlayer({ videoRef: video.current! })
		}
	}, [video.current])

	return (
		<View>
			<Video
				ref={video}
				source={{
					uri: require('../../../../assets/exercises/1.mp4'),
				}}
				useNativeControls
				resizeMode='contain'
				isLooping
			/>
		</View>
	)
}

export default PlayerVideo
