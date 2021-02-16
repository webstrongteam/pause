import React from 'react'
import { Slider } from 'react-native-elements'

type ProgressBarProps = {
	maxValue: number
	currentValue: number
	barColor: string
}

const ProgressBar = ({ maxValue, currentValue, barColor }: ProgressBarProps) => (
	<Slider
		animateTransitions
		maximumValue={maxValue}
		value={currentValue}
		disabled
		minimumTrackTintColor={barColor}
		thumbStyle={{ width: 0, height: 0 }}
		style={{ height: 1 }}
	/>
)

export default ProgressBar
