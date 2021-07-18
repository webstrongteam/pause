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
import DownloadVideoScreen from '../components/DownloadVideoScreen/DownloadVideoScreen'
import styles from './PlayerVideo.scss'

const playButtonSize = height * 0.08

const playerSize = {
	width: width * 0.75,
	height: height * 0.55,
}

const drawButtonPosition = {
	top: -(height * 0.025),
	right: width * 0.3,
}

const videoShadowOpt: BoxShadowType = {
	width: playerSize.width,
	height: playerSize.height,
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
		if (!player.videoRef) return

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
						playerContext.setPlayer({ openModal: true, modalType: 'leaveModal', status: 'stop' })
					}
				/>

				{!player.videoUri && (
					<DownloadVideoScreen playerHeight={playerSize.height} playerWidth={playerSize.width} />
				)}
				{showPauseScreen && (
					<PauseVideo playerHeight={playerSize.height} playerWidth={playerSize.width} />
				)}

				{player.videoUri && (
					<BoxShadow setting={videoShadowOpt}>
						<Video
							ref={video}
							source={{ uri: player.videoUri }}
							style={playerSize}
							onLoadStart={() => video.current?.playAsync()}
							resizeMode='cover'
							isLooping
							isMuted
						/>
					</BoxShadow>
				)}
			</View>

			<View style={styles.playerButtons as ViewStyle}>
				<View
					style={[
						styles.drawButton as ViewStyle,
						{ right: drawButtonPosition.right, top: drawButtonPosition.top },
					]}
				>
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
					size={playButtonSize}
					shadowSize={playButtonSize * 2}
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
