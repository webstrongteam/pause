import React from 'react'
import { Slider } from 'react-native-elements'
import { concatStyles } from '../../utils/helpers'
import styles from './ProgressBar.module.scss'

type ProgressBarProps = {
	maxValue: number
	currentValue: number
	barColor: string
	className?: {}
}

const ProgressBar = ({ maxValue, currentValue, barColor, className = {} }: ProgressBarProps) => (
	<Slider
		animateTransitions
		maximumValue={maxValue}
		value={currentValue}
		disabled
		minimumTrackTintColor={barColor}
		style={concatStyles(styles.progressBar, className)}
		thumbStyle={{ width: 0, height: 0 }}
	/>
)

export default ProgressBar
