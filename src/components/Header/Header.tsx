import React, { PropsWithChildren } from 'react'
import { View } from 'react-native'
import CloseIcon from '../UI/CloseIcon/CloseIcon'
import { ViewType } from '../../types/styles'
import { headerHeight } from '../../utils/consts'
import styles from './Header.scss'

type Props = PropsWithChildren<{
	hideCloseIcon?: boolean
	closeIconColor?: string
	closeIconHandler: () => void
}>

const Header = ({ closeIconHandler, children, closeIconColor, hideCloseIcon }: Props) => (
	<View style={[styles.headerContainer as ViewType, { height: headerHeight }]}>
		<View style={styles.header as ViewType}>
			{!hideCloseIcon ? <CloseIcon color={closeIconColor} onPress={closeIconHandler} /> : <View />}

			{children}
		</View>
	</View>
)

export default Header
