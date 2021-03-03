import { useCallback } from 'react'
import { showMessage } from 'react-native-flash-message'
import { useSettingsContext } from '../context/SettingsContext'

const useShowFailureMessage = (title?: string, description?: string) => {
	const { useSubscribe } = useSettingsContext()
	const translation = useSubscribe((t) => t.translations.common)

	return useCallback(() => {
		showMessage({
			message: title || translation.errorTitle,
			description: description || translation.errorDescription,
			type: 'danger',
			icon: { icon: 'danger', position: 'left' },
			duration: 2500,
		})
	}, [translation])
}

export default useShowFailureMessage
