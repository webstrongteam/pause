import React, { PropsWithChildren } from 'react'
import { StatusBar, View } from 'react-native'
import styles from './Template.styles'

type Props = {
	children: PropsWithChildren<{}>
}

const Template = ({ children }: Props) => (
	<View style={styles.container}>
		<View style={styles.statusBar}>
			<StatusBar backgroundColor='rgba(0, 0, 0, 0.2)' translucent />
		</View>
		{children}
	</View>
)

export default Template
