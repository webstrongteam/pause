import React from 'react'
import { Slider } from 'react-native-elements'

type LevelBarProps = {
	maxXp: number
	currentXp: number
}

const LevelBar = ({ maxXp, currentXp }: LevelBarProps) => (
	<Slider
		animateTransitions
		maximumValue={maxXp}
		value={currentXp}
		disabled
		minimumTrackTintColor='#F2B077'
		thumbStyle={{ width: 0, height: 0 }}
	/>
)

export default LevelBar
