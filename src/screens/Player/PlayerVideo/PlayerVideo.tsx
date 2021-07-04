import React, { useEffect, useRef } from 'react'
import { Animated, View, ViewStyle } from 'react-native'
import { Video } from 'expo-av'
import { BoxShadow, BoxShadowType } from 'react-native-shadow'
import { playerInitialState, usePlayerContext } from '../PlayerContext'
import { useThemeContext } from '../../../utils/context/ThemeContext'
import { getRandomPause, setAnimation } from '../../../utils/helpers'
import { ViewType } from '../../../types/styles'
import logEvent from '../../../utils/logEvent'
import { usePauseContext } from '../../../utils/context/PauseContext'
import { useSettingsContext } from '../../../utils/context/SettingsContext'
import { height, width } from '../../../utils/consts'
import PauseVideo from '../components/PauseVideo/PauseVideo'
import IconButton from '../components/IconButton/IconButton'
import DownloadVideo from '../components/DownloadVideo/DownloadVideo'
import styles from './PlayerVideo.scss'

const playerWidth = width * 0.75
const playerHeight = height * 0.5

const videoShadowOpt: BoxShadowType = {
	width: playerWidth,
	height: playerHeight,
	border: 6,
	opacity: 0.1,
	color: '#000',
	radius: 0,
	x: 0,
	y: 0,
	style: { marginVertical: 0 },
}

const PlayerVideo = () => {
	const playerContext = usePlayerContext()
	const pauseContext = usePauseContext()
	const settingsContext = useSettingsContext()
	const themeContext = useThemeContext()

	const { primary } = themeContext.useSubscribe((s) => s)
	const player = playerContext.useSubscribe((s) => s)
	const pause = pauseContext.useSubscribe((p) => p)
	const settings = settingsContext.useSubscribe((s) => s.settings!)

	const video = useRef<Video>(null)
	const scaleRandomExerciseButton = useRef(new Animated.Value(0)).current

	const stopExercising = player.status === 'stop' || player.status === 'preview'
	const showPauseScreen =
		player.videoUri &&
		((player.fullTime !== undefined && player.status === 'stop') || player.status === 'pause')

	const drawNewPauseHandler = () => {
		logEvent('Draw new pause', {
			component: 'Pause',
			pauseBeforeDraw: pause,
		})

		pauseContext.setPause(getRandomPause(pause, settings))
		playerContext.setPlayer(playerInitialState)
	}

	const managePlayer = () => {
		if (player.status === 'stop' && player.pauseTime > 0) {
			playerContext.setPlayer({ status: 'pause' })
			return
		}

		if (stopExercising) {
			playerContext.setPlayer({ status: 'exercising' })
		} else {
			playerContext.setPlayer({ status: 'stop' })
		}
	}

	useEffect(() => {
		if (stopExercising) {
			setAnimation(1, 200, scaleRandomExerciseButton)
		} else {
			setAnimation(0, 200, scaleRandomExerciseButton)
		}
	}, [stopExercising])

	useEffect(() => {
		if (video.current) {
			playerContext.setPlayer({ videoRef: video.current })
		}
	}, [video.current])

	return (
		<View style={styles.container as ViewType}>
			<View style={styles.videoWrapper as ViewType}>
				<IconButton
					wrapperStyle={styles.exitIcon as ViewStyle}
					size={25}
					shadowSize={55}
					color={primary}
					type='feather'
					name='x'
					onPress={() =>
						playerContext.setPlayer({ openModal: true, modalType: 'leaveModal', status: 'stop' })}
				/>

				{!player.videoUri && (
					<DownloadVideo playerHeight={playerHeight} playerWidth={playerWidth} />
				)}
				{showPauseScreen && <PauseVideo playerHeight={playerHeight} playerWidth={playerWidth} />}

				{player.videoUri && (
					<BoxShadow setting={videoShadowOpt}>
						<Video
							ref={video}
							source={{ uri: player.videoUri }}
							style={{ width: playerWidth, height: playerHeight }}
							onLoadStart={() => video.current?.playAsync()}
							resizeMode='cover'
							isLooping
							isMuted
						/>
					</BoxShadow>
				)}
			</View>

			<View style={styles.playerButtons as ViewStyle}>
				<View style={styles.randomButton as ViewStyle}>
					<Animated.View style={{ transform: [{ scale: scaleRandomExerciseButton }] }}>
						<IconButton
							size={25}
							shadowSize={60}
							color={primary}
							name='random'
							type='font-awesome'
							onPress={drawNewPauseHandler}
						/>
					</Animated.View>
				</View>

				<IconButton
					size={70}
					shadowSize={120}
					color={primary}
					type={stopExercising ? 'foundation' : 'antdesign'}
					name={stopExercising ? 'play' : 'pause'}
					onPress={managePlayer}
				/>
			</View>
		</View>
	)
}

export default PlayerVideo
