import React from 'react'
import { View, ViewStyle } from 'react-native'
import { Video } from 'expo-av'
import { playerInitialState, usePlayerContext } from '../PlayerContext'
import { useThemeContext } from '../../../utils/context/ThemeContext'
import { getRandomPause } from '../../../utils/helpers'
import { ViewType } from '../../../types/styles'
import logEvent from '../../../utils/logEvent'
import { usePauseContext } from '../../../utils/context/PauseContext'
import { useSettingsContext } from '../../../utils/context/SettingsContext'
import { height, width } from '../../../utils/consts'
import useAsyncEffect from '../../../utils/hooks/useAsyncEffect'
import PauseVideo from '../components/PauseVideo/PauseVideo'
import IconButton from '../components/IconButton/IconButton'
import styles from './PlayerVideo.scss'

const playerWidth = width * 0.75
const playerHeight = height * 0.5

const PlayerVideo = () => {
	const video = React.useRef<Video>(null)
	const playerContext = usePlayerContext()
	const pauseContext = usePauseContext()
	const themeContext = useThemeContext()
	const settingsContext = useSettingsContext()

	const player = playerContext.useSubscribe((s) => s)
	const theme = themeContext.useSubscribe((s) => s)
	const pause = pauseContext.useSubscribe((p) => p)
	const settings = settingsContext.useSubscribe((s) => s.settings!)

	const stopExercising = player.status === 'stop' || player.status === 'preview'
	const pauseExercising =
		(player.fullTime !== undefined && player.status === 'stop') || player.status === 'pause'

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

	useAsyncEffect(async () => {
		if (video.current) {
			await video.current.playAsync()
			playerContext.setPlayer({ videoRef: video.current })
		}
	}, [video.current])

	return (
		<View style={styles.container as ViewType}>
			<View style={styles.videoWrapper as ViewType}>
				<IconButton
					wrapperStyle={styles.exitIcon as ViewStyle}
					size={30}
					shadowSize={60}
					color={theme.primary}
					type='feather'
					name='x'
					onPress={() =>
						playerContext.setPlayer({ openModal: true, modalType: 'leaveModal', status: 'stop' })}
				/>

				{pauseExercising && <PauseVideo playerHeight={playerHeight} playerWidth={playerWidth} />}

				<Video
					ref={video}
					source={require('../../../../assets/exercises/1.mp4')}
					style={{ width: playerWidth, height: playerHeight }}
					resizeMode='cover'
					isLooping
					isMuted
				/>
			</View>

			<View style={styles.playerButtons as ViewStyle}>
				{stopExercising && (
					<IconButton
						size={25}
						shadowSize={60}
						wrapperStyle={styles.randomButton as ViewStyle}
						color={theme.primary}
						name='random'
						type='font-awesome'
						onPress={drawNewPauseHandler}
					/>
				)}

				<IconButton
					size={stopExercising ? 60 : 65}
					shadowSize={120}
					color={theme.primary}
					type={stopExercising ? 'foundation' : 'antdesign'}
					name={stopExercising ? 'play' : 'pause'}
					onPress={managePlayer}
				/>
			</View>
		</View>
	)
}

export default PlayerVideo
