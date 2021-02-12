import React, { PropsWithChildren } from 'react'
import { StatusBar, View } from 'react-native'
import styles from './Template.styles'

type Props = {
	children: PropsWithChildren<{}>
}

const Template = ({ children }: Props) => {
	const [loading] = useState<boolean>(false)

	// load settings to context

	return (
		<View style={styles.container}>
			{loading ? (
				<Spinner size={64} />
			) : (
				<>
					<View style={styles.statusBar}>
						<StatusBar barStyle='dark-content' backgroundColor='rgba(0, 0, 0, 0.2)' translucent />
					</View>
					{children}
				</>
			)}
		</View>
	)
}

export default Template
