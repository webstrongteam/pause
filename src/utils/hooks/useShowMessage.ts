import { useCallback } from 'react'
import { MessageOptions, showMessage } from 'react-native-flash-message'
import { useThemeContext } from '../context/ThemeContext'

const useShowMessage = (options: MessageOptions) => {
	const { useSubscribe } = useThemeContext()
	const primaryColor = useSubscribe((t) => t.colors.primary)

	return useCallback(() => {
		showMessage({
			type: 'success',
			icon: { icon: 'success', position: 'left' },
			duration: 2500,
			backgroundColor: primaryColor,
			...options,
		})
	}, [primaryColor])
}

export default useShowMessage
