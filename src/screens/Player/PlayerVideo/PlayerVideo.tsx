import React from 'react'
import { TouchableOpacity, View, ViewStyle } from 'react-native'
import { BoxShadow } from 'react-native-shadow'
import { Icon, IconProps } from 'react-native-elements'
import { Video } from 'expo-av'
import { playerInitialState, usePlayerContext } from '../PlayerContext'
import { useThemeContext } from '../../../utils/context/ThemeContext'
import {
	addBackgroundColor,
	getRandomPause,
	getShadowOpt,
	pickTextColor,
} from '../../../utils/helpers'
import { ViewType } from '../../../types/styles'
import logEvent from '../../../utils/logEvent'
import { usePauseContext } from '../../../utils/context/PauseContext'
import { useSettingsContext } from '../../../utils/context/SettingsContext'
import { height, width } from '../../../utils/consts'
import useAsyncEffect from '../../../utils/hooks/useAsyncEffect'
import styles from './PlayerVideo.scss'

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
					size={60}
					color={theme.primary}
					type='feather'
					name='x'
					onPress={() =>
						playerContext.setPlayer({ openModal: true, modalType: 'leaveModal', status: 'stop' })}
				/>

				<Video
					ref={video}
					source={require('../../../../assets/exercises/1.mp4')}
					style={{ width: width - 100, height: height * 0.5 }}
					resizeMode='cover'
					isLooping
				/>
			</View>

			<View style={styles.playerButtons as ViewStyle}>
				{stopExercising && (
					<IconButton
						size={60}
						wrapperStyle={styles.randomButton as ViewStyle}
						color={theme.primary}
						name='random'
						type='font-awesome'
						onPress={drawNewPauseHandler}
					/>
				)}

				<IconButton
					size={120}
					color={theme.primary}
					type='feather'
					name={stopExercising ? 'play' : 'pause'}
					onPress={managePlayer}
				/>
			</View>
		</View>
	)
}

type IconButtonProps = {
	size: number
	color: string
	onPress: () => void
	wrapperStyle?: ViewStyle
} & IconProps

const IconButton = ({ size, color, wrapperStyle, onPress, ...iconProps }: IconButtonProps) => (
	<View style={wrapperStyle}>
		<BoxShadow setting={getShadowOpt(size)}>
			<TouchableOpacity onPress={onPress}>
				<View
					style={[addBackgroundColor(styles.icon, color), { borderColor: pickTextColor(color) }]}
				>
					<Icon {...iconProps} color={pickTextColor(color)} size={size / 2} />
				</View>
			</TouchableOpacity>
		</BoxShadow>
	</View>
)

export default PlayerVideo
