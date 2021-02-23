import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native'
import { Icon } from 'react-native-elements'
import { TextType, ViewType } from '../../types/styles'
import { NavigationScreenType } from '../../types/navigation'

import WavyHeader from '../../components/WavyHeader/WavyHeader';
import CloseIcon from '../../components/UI/CloseIcon/CloseIcon';

import styles from './PauseScreen.scss';

type Props = {
	navigation: NavigationScreenType
}
 
const PauseScreen = ({ navigation }: Props) => {
    return ( 
        <View style={styles.container as ViewType}>
            <View style={{position:"absolute", top:-40, width:"100%"}}>
                <WavyHeader variant="centered">
                    <CloseIcon onPress={() => navigation.goBack()}/>          
                    <View style={styles.exerciseTitle as ViewType}>
                        <Text style={{ fontSize:15, textTransform:'uppercase', color:'#1a6a73' }}>ćwiczenie</Text>
                        <Text style={{ fontSize:40, textTransform:'uppercase', textDecorationLine:'underline', color:'#1a6a73' }}>Wall Sit</Text>
                    </View>
                </WavyHeader>
            </View>
            

            <View style={{ position:'absolute', top:'50%', width:'100%' }}>

                <View style={styles.exerciseInfo as ViewType}>
                    <Text style={styles.firstInfo as TextType}>Czas trwania</Text>
                    <Text style={[styles.firstInfo, styles.secondInfo] as TextType}>30s x4</Text>
                </View>

                <View style={styles.exerciseInfo as ViewType}>
                    <Text style={styles.firstInfo as TextType}>Muzyka</Text>
                    <Text style={[styles.firstInfo, styles.secondInfo] as TextType}>Sea</Text>
                </View> 

            </View>

            <View style={styles.bottomIcons as ViewType}>

                <View style={styles.Icon as ViewType}>
                    <TouchableOpacity>
                        <Icon name='random' type='font-awesome' color='#fff' size={50} />
                    </TouchableOpacity>
                </View>

                <View style={styles.Icon as ViewType}>
                    <TouchableOpacity>
                        <Icon name='play' type='feather' color='#fff' size={50} />
                    </TouchableOpacity>
                </View>

            </View>
        </View>
    );
}
 
export default PauseScreen;