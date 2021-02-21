import React from 'react';
import { View, Text } from 'react-native'
import { Icon } from 'react-native-elements'
import { TextType, ViewType } from '../../types/styles'

import WavyHeader from '../../components/WavyHeader/WavyHeader';
import CloseIcon from '../../components/UI/CloseIcon/CloseIcon';

import styles from './PauseScreen.scss';
 
const PauseScreen = () => {
    return ( 
        <View style={styles.container as ViewType}>
            <WavyHeader/>
            <Text>
                <Text style={{fontSize:'30px'}}>ćwiczenie</Text>
                <Text>Wall Sit</Text>
            </Text>
            <Text>
                <Text>
                    <Text>Czas trwania</Text>
                    <Text>30s x4</Text>
                </Text>
                <Text>
                    <Text>Muzyka</Text>
                    <Text>Sea</Text>
                </Text>                             
            </Text>
            <View>
                <View style={styles.randomIcon as ViewType}>
                    <Icon name='random' type='FontAwsome' color='#fff' size={80} />
                </View>
                <View style={styles.playIcon as ViewType}>
                    <Icon name='play' type='Feather' color='#fff' size={80} />
                </View>                             
            </View>
        </View>
    );
}
 
export default PauseScreen;