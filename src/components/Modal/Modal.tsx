import React, { useEffect } from 'react'
import { BackHandler, Dimensions, Keyboard } from 'react-native'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler'
import ModalBase, { ModalButton, ModalContent, ModalFooter, ModalTitle } from 'react-native-modals'
import { TextType } from '../../types/styles'
import styles from './Modal.scss'

type Props = {
	toggleModal: () => void
	visible: boolean
	title: string
	buttons?: {
		text: string
		onPress: () => void
	}[]
	bgColor?: string
	children: React.ReactNode
}

const Modal = ({
	toggleModal,
	visible,
	title,
	buttons = [],
	bgColor = '#fff',
	children,
}: Props) => {
	const backAction = () => {
		if (visible) {
			toggleModal()
			return true
		}
		return false
	}

	useEffect(() => {
		BackHandler.addEventListener('hardwareBackPress', backAction)

		return () => {
			BackHandler.removeEventListener('hardwareBackPress', backAction)
		}
	}, [visible])

	return (
		<>
			<ModalBase
				width={Dimensions.get('window').width - 50}
				visible={visible}
				onSwipeOut={toggleModal}
				onTouchOutside={toggleModal}
				modalStyle={{ backgroundColor: bgColor }}
				modalTitle={
					<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
						<ModalTitle textStyle={styles.ModalTitleText as TextType} title={title} />
					</TouchableWithoutFeedback>
				}
				footer={
					<ModalFooter>
						{buttons.map((item, i) => (
							<ModalButton
								textStyle={styles.ModalButtonText as TextType}
								key={i}
								text={item.text}
								onPress={item.onPress}
							/>
						))}
					</ModalFooter>
				}
			>
				<ModalContent>{children}</ModalContent>
			</ModalBase>
		</>
	)
}

export default Modal
