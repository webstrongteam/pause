import React, { PropsWithChildren } from 'react'
import { View } from 'react-native'
import { useThemeContext } from '../../utils/context/ThemeContext'
import Spinner from '../Spinner/Spinner'
import { ViewType } from '../../types/styles'
import StatusBar from '../UI/StatusBar/StatusBar'
import styles from './Template.scss'

const Template = ({ children }: PropsWithChildren<{}>) => {
	const { useSubscribe } = useThemeContext()
	const theme = useSubscribe((t) => t)

	// If primary color is not '', it means that the settings and themes have been loaded.
	if (theme.primary === '') {
		return <Spinner size={64} />
	}

	return (
		<View style={styles.container as ViewType}>
			<StatusBar bgColor={theme.secondary} />
			{children}
		</View>
	)
}

export default Template
