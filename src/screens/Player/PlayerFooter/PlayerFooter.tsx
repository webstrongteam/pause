import React, { useEffect, useRef, useState } from 'react'
import { Icon } from 'react-native-elements'
import { Animated, Text, TouchableOpacity, View } from 'react-native'
import Footer from '../../../components/Footer/Footer'
import {
	addTextColor,
	getPauseTotalTime,
	pickTextColor,
	setAnimation,
} from '../../../utils/helpers'
import { ViewType } from '../../../types/styles'
import { usePauseContext } from '../../../utils/context/PauseContext'
import { useThemeContext } from '../../../utils/context/ThemeContext'
import { useSettingsContext } from '../../../utils/context/SettingsContext'
import { usePlayerContext } from '../PlayerContext'
import { sentryError } from '../../../utils/sentryEvent'
import styles from './PlayerFooter.scss'

const PlayerFooter = () => {
	const pauseContext = usePauseContext()
	const settingsContext = useSettingsContext()
	const themeContext = useThemeContext()
	const playerContext = usePlayerContext()

	const player = playerContext.useSubscribe((s) => s)
	const theme = themeContext.useSubscribe((s) => s)
	const exercise = pauseContext.useSubscribe((s) => s.exercise)
	const time = settingsContext.useSubscribe((s) => s.settings?.time)
	const translations = settingsContext.useSubscribe((s) => s.translations)

	if (!time || !exercise) {
		sentryError('Missing data from context in PlayerFooter')
		return <></>
	}

	const [unmountExerciseInfo, setUnmountExerciseInfo] = useState(false)

	const moveExerciseInfoAnim = useRef(new Animated.Value(0)).current
	const moveProgressBarAnim = useRef(new Animated.Value(-100)).current

	useEffect(() => {
		if (player.status !== 'preview' && player.fullTime !== undefined) {
			setAnimation(-100, 150, moveExerciseInfoAnim, () => {
				setUnmountExerciseInfo(true)
				setAnimation(0, 250, moveProgressBarAnim)
			})
		} else if (player.status === 'preview') {
			setAnimation(-100, 250, moveProgressBarAnim, () => {
				setUnmountExerciseInfo(false)
				setAnimation(0, 150, moveExerciseInfoAnim)
			})
		}
	}, [player.status, player.fullTime])

	if (unmountExerciseInfo) {
		const isExercising = player.exerciseTime > 0
		const totalTime = getPauseTotalTime(exercise.time[time])

		return (
			<Animated.View style={{ bottom: moveProgressBarAnim }}>
				<Footer
					currentValue={totalTime - (player.fullTime ?? 0)}
					maxValue={totalTime}
					barColor={theme.progress}
					backgroundColor={theme.primary}
				>
					<View style={styles.counter as ViewType}>
						<Text style={addTextColor(styles.breakIn, pickTextColor(theme.primary))}>
							{isExercising ? translations.Player.breakIn : translations.Player.nextSeriesIn}
						</Text>
						<Text style={addTextColor(styles.counterText, pickTextColor(theme.primary))}>
							{isExercising ? player.exerciseTime : player.pauseTime}s
						</Text>
					</View>
				</Footer>
			</Animated.View>
		)
	}

	return (
		<Animated.View style={{ bottom: moveExerciseInfoAnim }}>
			<View style={styles.exerciseInfo as ViewType}>
				<Text style={addTextColor(styles.exerciseInfoHeading, pickTextColor(theme.primary))}>
					{translations.Player.durationTime}
				</Text>

				<TouchableOpacity
					onPress={() =>
						playerContext.setPlayer({ openModal: true, modalType: 'exerciseInfoModal' })
					}
				>
					<View style={styles.exerciseInfoElement as ViewType}>
						<Text style={addTextColor(styles.exerciseInfoText, pickTextColor(theme.primary))}>
							{exercise.time[time].exerciseTime}s
						</Text>
						<Text style={addTextColor(styles.exerciseInfoText, pickTextColor(theme.primary))}>
							&nbsp;&nbsp;&nbsp;x
							{exercise.time[time].exerciseCount}
						</Text>
						<Icon name='info' type='feather' color={pickTextColor(theme.primary)} size={18} />
					</View>
				</TouchableOpacity>
			</View>
		</Animated.View>
	)
}

export default PlayerFooter
