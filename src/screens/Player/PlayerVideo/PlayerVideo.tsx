import { Video } from 'expo-av'
import React from 'react'

const PlayerVideo = () => (
		<Video
			source={{
				uri: require('../../../../assets/exercises/1.mp4'),
			}}
			useNativeControls
			resizeMode='contain'
			isLooping
			onPlaybackStatusUpdate={(status) => console.log(status)}
		/>
	)

export default PlayerVideo
