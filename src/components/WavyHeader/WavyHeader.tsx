import React, { PropsWithChildren } from 'react'
import { Dimensions, View } from 'react-native'
import Svg, { Path } from 'react-native-svg'
import styles from './WavyHeader.styles'

type Props = PropsWithChildren<{
	outline?: boolean
	bgColor?: string
	variant?: 'header' | 'centered'
}>

const WavyHeader = ({ outline = false, bgColor = '#fff', variant = 'header', children }: Props) => {
	const headerHeight =
		variant === 'header'
			? Dimensions.get('screen').height / 8
			: Dimensions.get('screen').height * 0.4

	return (
		<>
			<View style={{ height: headerHeight, backgroundColor: bgColor }}>{children}</View>
			{outline ? (
				<View style={{ ...styles.aspectRatio, ...styles.outline, top: headerHeight + 1 }}>
					<Svg height='100%' width='100%' viewBox='0 0 1440 320'>
						<Path
							fill='#fff'
							d='M0,128l60,-21.3c60,-21.7,180,-63.7,300,-58.7c120,5,240,59,360,106.7c120,48.3,240,90.3,360,85.3c120,-5,240,-59,300,-85.3l60,-26.7l0,-128l-60,0c-60,0,-180,0,-300,0c-120,0,-240,0,-360,0c-120,0,-240,0,-360,0c-120,0,-240,0,-300,0l-60,0z'
						/>
					</Svg>
				</View>
			) : (
				<></>
			)}
			<View style={styles.aspectRatio}>
				<Svg height='100%' width='100%' viewBox='0 0 1440 320'>
					<Path
						fill={bgColor}
						d='M0,128l60,-21.3c60,-21.7,180,-63.7,300,-58.7c120,5,240,59,360,106.7c120,48.3,240,90.3,360,85.3c120,-5,240,-59,300,-85.3l60,-26.7l0,-128l-60,0c-60,0,-180,0,-300,0c-120,0,-240,0,-360,0c-120,0,-240,0,-360,0c-120,0,-240,0,-300,0l-60,0z'
					/>
				</Svg>
			</View>
		</>
	)
}

export default WavyHeader
