import React from 'react'
import { View, StyleSheet } from 'react-native'
import Svg, { Path } from 'react-native-svg'
import { ViewType } from '../../types/styles'
import styles from './WavyHeader.scss'

type Props = {
	height: number
	color: string
}

const WavyHeader = ({ height = 120, color = '#fff' }: Props) => {
	const styleWavyHeader = StyleSheet.create({
		style: {
			backgroundColor: color,
			height,
			position: 'absolute',
			top: 0,
			left: 0,
			right: 0,
		},
	})

	return (
		<View style={styleWavyHeader.style}>
			<Svg
				height='100%'
				width='100%'
				viewBox='0 0 1440 320'
				style={styles.WavyHeaderOutline as ViewType}
			>
				<Path
					fill='#fff'
					d='M0,128L60,106.7C120,85,240,43,360,48C480,53,600,107,720,154.7C840,203,960,245,1080,240C1200,235,1320,181,1380,154.7L1440,128L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z'
				/>
			</Svg>
			<Svg
				height='100%'
				width='100%'
				viewBox='0 0 1440 320'
				style={styles.WavyHeaderSvg as ViewType}
			>
				<Path
					fill={color}
					d='M0,128L60,106.7C120,85,240,43,360,48C480,53,600,107,720,154.7C840,203,960,245,1080,240C1200,235,1320,181,1380,154.7L1440,128L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z'
				/>
			</Svg>
		</View>
	)
}

export default WavyHeader
