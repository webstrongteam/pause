import React from 'react'
import { ActivityIndicator, Platform, View } from 'react-native'

type Props = {
  size?: number | 'small' | 'large'
  color?: string
  bgColor?: string
}

const Spinner = ({ size, color, bgColor }: Props) => {
  let setSize: number | 'small' | 'large'
  if (size) {
    if (size > 32 && Platform.OS === 'ios') setSize = 'large'
    else setSize = size
  } else setSize = 18

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: bgColor ? bgColor : '#fff',
      }}
    >
      <ActivityIndicator size={setSize} color={color ? color : '#fff'} />
    </View>
  )
}

export default Spinner