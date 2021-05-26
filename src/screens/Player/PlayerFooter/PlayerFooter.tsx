import { Icon } from 'react-native-elements'
import React, { useState } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import Footer from '../../../components/Footer/Footer'
import { addTextColor, pickTextColor } from '../../../utils/helpers'
import styles from '../Player.scss'
import { ViewType } from '../../../types/styles'

const PlayerFooter = () => {
	const [startExercise, setStartExercise] = useState(false)

	return (
		<Footer
			currentValue={progress}
			maxValue={exercise.time[time].totalTime}
			barColor={theme.progress}
			backgroundColor={theme.primary}
		>
			<View>
				<Text style={addTextColor(styles.infoText, pickTextColor(theme.primary))}>
					{exercise.name}
				</Text>
				<TouchableOpacity onPress={muteSoundHandler}>
					<View style={styles.musicInfo as ViewType}>
						<Text style={addTextColor(styles.infoText, pickTextColor(theme.primary))}>
							{music.name}
						</Text>
						<Icon
							name={isMuted ? 'volume-x' : 'volume-2'}
							type='feather'
							color={pickTextColor(theme.primary)}
							size={20}
						/>
					</View>
				</TouchableOpacity>
			</View>
			<Text style={addTextColor(styles.playerCounter, pickTextColor(theme.primary))}>
				{fullTime}s
			</Text>
			<Icon
				name={playing ? 'pause-outline' : 'play-outline'}
				type='ionicon'
				color={pickTextColor(theme.primary)}
				size={42}
				onPress={pauseHandler}
			/>
		</Footer>
	)
}

export default PlayerFooter
