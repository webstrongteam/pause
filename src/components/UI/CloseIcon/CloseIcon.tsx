import React from 'react'
import { Icon } from 'react-native-elements'

const CloseIcon = ({goBack}:any) =>{
    return(
        <Icon name='x' type='feather' color='#1A6A73' size={40} onPress={goBack} />
    )
}

export default CloseIcon