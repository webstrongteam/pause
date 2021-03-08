import React, { PropsWithChildren } from 'react'
import { View } from 'react-native'
import CloseIcon from '../UI/CloseIcon/CloseIcon'
import { useThemeContext } from '../../utils/context/ThemeContext'
import { ViewType } from '../../types/styles'
import { concatStyles } from '../../utils/helpers'
import { headerHeight } from '../../utils/consts'
import styles from './Header.scss'

type Props = PropsWithChildren<{
	hideCloseIcon?: boolean
	closeIconColor?: string
	closeIconHandler: () => void
}>

const Header = ({ closeIconHandler, children, closeIconColor, hideCloseIcon }: Props) => {
	const themeContext = useThemeContext()
	const theme = themeContext.useSubscribe((t) => t.colors)

	return (
		<View style={concatStyles(styles.headerContainer, { height: headerHeight })}>
			<View style={styles.header as ViewType}>
				{!hideCloseIcon ? (
					<CloseIcon color={closeIconColor ?? theme.primary} onPress={closeIconHandler} />
				) : (
					<View />
				)}

				{children}
			</View>
		</View>
	)
}

export default Header
