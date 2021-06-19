import React, { PropsWithChildren } from 'react'
import { View } from 'react-native'
import Svg, { Path } from 'react-native-svg'
import { ViewType } from '../../types/styles'
import { useThemeContext } from '../../utils/context/ThemeContext'
import { centerHeight, footerHeight, headerHeight } from '../../utils/consts'
import styles from './Wavy.scss'

type Props = PropsWithChildren<{
	outline?: boolean
	bgColor?: string
	position?: 'header' | 'centered' | 'footer'
}>

const Wavy = ({ outline = false, bgColor, position = 'header', children }: Props) => {
	const { useSubscribe } = useThemeContext()
	const theme = useSubscribe((t) => t)

	const getContentHeight = () => {
		if (position === 'header') {
			return headerHeight
		}
		if (position === 'centered') {
			return centerHeight
		}
		return footerHeight
	}

	const contentHeight = getContentHeight()

	return (
		<>
			<View style={{ height: contentHeight, backgroundColor: bgColor ?? theme.secondary }}>
				{children}
			</View>
			{outline ? (
				<View
					style={{
						...(styles.aspectRatio as {}),
						...(styles.outline as {}),
						top: contentHeight + 2,
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

export default Wavy
