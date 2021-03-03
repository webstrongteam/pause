import React, { PropsWithChildren } from 'react'
import { View } from 'react-native'
import { ViewType } from '../../types/styles'
import ProgressBar from '../ProgressBar/ProgressBar'
import { addBackgroundColor } from '../../utils/helpers'
import styles from './Footer.scss'

type Props = PropsWithChildren<{
	maxValue: number
	currentValue: number
	barColor: string
	backgroundColor: string
}>

const Footer = ({ children, maxValue, currentValue, barColor, backgroundColor }: Props) => (
	<View style={addBackgroundColor(styles.footer, backgroundColor)}>
		<ProgressBar maxValue={maxValue} currentValue={currentValue} barColor={barColor} />
		<View style={styles.footerInfo as ViewType}>{children}</View>
	</View>
)

export default Footer
