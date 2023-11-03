import React from 'react'
import {
    View,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';


const Start = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <View style={styles.imageView}>
                <Image
                    style={{
                        resizeMode: 'center',
                    }}
                    source={require('../assets/images/start.png')}
                />
            </View>

            <View style={styles.titleView}>
                <View style={{ alignItems: 'center' }}>
                    <Text style={styles.title}>BookMate</Text>
                    <Text>Kontaktirajte sa kolegama ljubiteljima knjiga</Text>
                </View>

                <TouchableOpacity
                    onPress={() => navigation.navigate('Login')} // Navigacija na stranicu "Login"
                    style={styles.circle}
                >
                    <MaterialCommunityIcons name="redo" size={60} color="#fff" />
                </TouchableOpacity>
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
        backgroundColor: '#fff'
    },
    imageView: {
        height: '55%',
    },
    titleView: {
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '25%',
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