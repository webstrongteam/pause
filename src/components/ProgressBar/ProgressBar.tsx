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
<<<<<<< HEAD
		style={{ height: 1 }}
=======
		style={concatStyles(styles.progressBar, className)}
>>>>>>> master
		thumbStyle={{ width: 0, height: 0 }}
	/>
)

export default ProgressBar
