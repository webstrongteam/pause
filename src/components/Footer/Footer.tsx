import React, { PropsWithChildren } from 'react'
import { View, Animated } from 'react-native'
import { ViewType } from '../../types/styles'
import ProgressBar from '../ProgressBar/ProgressBar'
import { addBackgroundColor } from '../../utils/helpers'
import styles from './Footer.scss'

type Props = PropsWithChildren<{
	animate?: boolean
	animateConfig?: Animated.TimingAnimationConfig | undefined
	maxValue: number
	currentValue: number
	barColor: string
	backgroundColor: string
}>

const Footer = ({
	animate = true,
	animateConfig = undefined,
	children,
	maxValue,
	currentValue,
	barColor,
	backgroundColor,
}: Props) => (
	<View style={addBackgroundColor(styles.footer, backgroundColor)}>
		<ProgressBar
			animate={animate}
			animateConfig={animateConfig}
			maxValue={maxValue}
			currentValue={currentValue}
			barColor={barColor}
		/>
		<View style={styles.footerInfo as ViewType}>{children}</View>
	</View>
)

export default Footer
