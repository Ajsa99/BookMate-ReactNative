import React, { useState, useEffect } from 'react'
import {
    View,
    Image,
    StyleSheet,
    Text,
    Pressable,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Start = ({ navigation }) => {

    const [NickName, setNickName] = useState('');

    useEffect(() => {

        async function fetchData() {
            try {
                const nickname = await AsyncStorage.getItem('NickName');
                setNickName(nickname);
            } catch (error) {
                console.error('Greška prilikom čitanja iz AsyncStorage:', error);
            }
        }
        
        fetchData();

    }, []);


    return (
        <View style={styles.container}>
            <View style={styles.imageView}>
                <Image
                    resizeMode='center'
                    source={require('../assets/images/books.png')}
                />
            </View>

            <View style={styles.titleView}>
                <View style={{ alignItems: 'center' }}>
                    <Text style={styles.title}>BookMate</Text>
                    <Text>Kontaktirajte sa kolegama ljubiteljima knjiga</Text>
                </View>

                <Pressable
                    onPress={() => {
                        !NickName ? navigation.navigate('Login') : navigation.replace('TabNavigator');
                    }}
                    style={styles.circle}
                >
                    <MaterialCommunityIcons name="redo" size={60} color="#fff" />
                </Pressable>
            </View>

        </View>
    )
}

export default Start;


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: '#fff',
        
    },
    imageView: {
        justifyContent:'center',
        alignItems:'center',
        height: '55%',
    },
    titleView: {
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '20%',
    },
    title: {
        fontSize: 40,
        fontWeight: 'bold'
    },
    circle: {
        width: 70,
        height: 70,
        backgroundColor: '#EEBE68',
        borderRadius: 35,
        justifyContent: 'center',
        alignItems: 'center',
    },
});