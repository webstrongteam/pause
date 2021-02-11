import React, {useState} from 'react'
import { ScrollView, View, Text } from 'react-native'
import { Icon, ButtonGroup } from 'react-native-elements'
import CloseIcon from '../../components/UI/CloseIcon/CloseIcon'
import WavyHeader from '../../components/WavyHeader/WavyHeader'
import styles from './Settings.scss'
import { TextType, ViewType } from '../../types/styles'
import { NavigationScreenType } from '../../types/navigation'

type Props = {
	navigation: NavigationScreenType
}

const Settings = ({ navigation }: Props) => {

    const [languageIndex, setLanguageIndex] = useState(0)

    const buttons = [['Polski', 'Angielski'], ['Łatwy', 'Średni', 'Zaawansowany'], ['Krótki','Średni','Długi']]
    const [languages, difficulty, breakTime] = buttons

    return(
        <ScrollView style={styles.container as ViewType}>
            <WavyHeader />
            <View style={styles.header as ViewType}>
                <CloseIcon onPress={() => navigation.goBack()} />
                <Text style={styles.title as TextType}>PROFIL</Text>
            </View>
            <View style={styles.settings as ViewType}>
                <Text style={styles.label as TextType}>JĘZYK</Text>
                <ButtonGroup
                    onPress={(num) => setLanguageIndex(num)} 
                    buttons={languages}
                    selectedIndex={languageIndex}
                    containerStyle={styles.buttonGroup as ViewType}
                    selectedButtonStyle={styles.selectedButton as ViewType}
                    selectedTextStyle={{color:"#1A6A73"}}
                    textStyle={{fontSize:16}}/>
            </View>
            
        </ScrollView>
    )
    
}
export default Settings