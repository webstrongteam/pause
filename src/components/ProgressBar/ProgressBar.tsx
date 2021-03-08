import React from 'react'
import { Slider } from 'react-native-elements'
import { Animated } from 'react-native'
import { concatStyles } from '../../utils/helpers'
import { ViewType } from '../../types/styles'
import styles from './ProgressBar.scss'

export type ProgressBarProps = {
	animate?: boolean
	animateConfig?: Animated.TimingAnimationConfig | undefined
	maxValue: number
	currentValue: number
	barColor: string
	className?: {}
}

const ProgressBar = ({
	animate = true,
	animateConfig = undefined,
	maxValue,
	currentValue,
	barColor,
	className = {},
}: ProgressBarProps) => (
	<Slider
		animateTransitions={animate}
		animationConfig={animateConfig}
		maximumValue={maxValue}
		value={currentValue}
		disabled
		minimumTrackTintColor={barColor}
		style={concatStyles(styles.progressBar, className)}
		thumbStyle={styles.thumbStyle as ViewType}
	/>
)

export default ProgressBar
