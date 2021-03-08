import React, { PropsWithChildren } from 'react'
import { View } from 'react-native'
import { ViewType } from '../../types/styles'
import ProgressBar, { ProgressBarProps } from '../ProgressBar/ProgressBar'
import { addBackgroundColor } from '../../utils/helpers'
import styles from './Footer.scss'

type Props = PropsWithChildren<{
	backgroundColor: string
}> &
	Omit<ProgressBarProps, 'className'>

const Footer = ({
	animate = true,
	animateConfig,
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
