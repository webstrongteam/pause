import React, { PropsWithChildren } from 'react'
import { View } from 'react-native'
import Svg, { Path } from 'react-native-svg'
import styles from './WavyHeader.scss'

//Types
import { ViewType } from '../../types/styles'

//Contexts
import { useThemeContext } from '../../utils/context/ThemeContext'

//Utils
import { centerHeight, headerHeight } from '../../utils/consts'

type Props = PropsWithChildren<{
	outline?: boolean
	bgColor?: string
	variant?: 'header' | 'centered'
}>

const WavyHeader = ({
	outline = false,
	bgColor,
	// bgColor = theme.secondary,
	variant = 'header',
	children,
}: Props) => {
	const variantHeaderHeight = variant === 'header' ? headerHeight : centerHeight
	const { useSubscribe } = useThemeContext()
	const theme = useSubscribe((t) => t)

	return (
		<>
			<View style={{ height: variantHeaderHeight, backgroundColor: bgColor ?? theme.secondary }}>
				{children}
			</View>
			{outline ? (
				<View
					style={{
						...(styles.aspectRatio as {}),
						...(styles.outline as {}),
						top: variantHeaderHeight + 2,
					}}
				>
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

			<View style={styles.aspectRatio as ViewType}>
				<Svg height='100%' width='100%' viewBox='0 0 1440 320'>
					<Path
						fill={bgColor ?? theme.secondary}
						d='M0,128l60,-21.3c60,-21.7,180,-63.7,300,-58.7c120,5,240,59,360,106.7c120,48.3,240,90.3,360,85.3c120,-5,240,-59,300,-85.3l60,-26.7l0,-128l-60,0c-60,0,-180,0,-300,0c-120,0,-240,0,-360,0c-120,0,-240,0,-360,0c-120,0,-240,0,-300,0l-60,0z'
					/>
				</Svg>
			</View>
		</>
	)
}

export default WavyHeader
