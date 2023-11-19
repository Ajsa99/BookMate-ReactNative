import React, { useState } from 'react';
import axios from 'axios';
import {
    SafeAreaView,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import * as Yup from 'yup';
import AsyncStorage from '@react-native-async-storage/async-storage';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';

import CustomButton from './CustomButton';
import InputField from './InputField';


const Login = ({ navigation }) => {

    const [NickName, setNickName] = useState('');
    const [Password, setPassword] = useState('');

    const [errors, setErrors] = useState({});

    const schema = Yup.object().shape({
        NickName: Yup.string().required('Nick Name is required'),
        Password: Yup.string().required('Password is required'),
    });

    const onSubmit = () => {


        schema.validate(
            {
                NickName,
                Password,
            },
            { abortEarly: false }
        )
            .then(() => {
                // Ukoliko nema grešaka, možete izvršiti registraciju 

                const data = {
                    nickName: NickName,
                    password: Password,
                };

                axios
                    .post('https://localhost:7124/login', data)
                    .then((response) => {
                        console.log(response.data);
                        // Sačuvajte podatke u AsyncStorage
                        AsyncStorage.setItem('Id', response.data.id);
                        AsyncStorage.setItem('NickName', response.data.nickName);
                        AsyncStorage.setItem('userToken', response.data.token);
                        AsyncStorage.setItem('Image', response.data.image);

                        navigation.replace('TabNavigator');
                    }).catch((error) => {
                        alert('Wrong Nick Name or Password!')
                    });

            }).catch((validationErrors) => {
                // Ukoliko postoje greške, postavite ih u stanje i prikažite korisniku
                const errorObj = {};
                validationErrors.inner.forEach((err) => {
                    errorObj[err.path] = err.message;
                });
                setErrors(errorObj);
            });

    }

    return (
        <SafeAreaView style={{ flex: 1, justifyContent: 'center', backgroundColor: '#fff' }}>
            <View style={{ paddingHorizontal: 25 }}>
                <View style={styles.titleView}>
                    <Text style={styles.title}>BookMate</Text>
                </View>

                <Text
                    style={{
                        fontSize: 28,
                        fontWeight: '500',
                        color: '#333',
                        marginBottom: 30,
                    }}>
                    Login
                </Text>

                <InputField
                    label={'Nick Name'}
                    icon={
                        <MaterialIcons
                            name="person-outline"
                            size={20}
                            color="#666"
                            style={{ marginRight: 5 }}
                        />
                    }
                    value={NickName}
                    onChangeText={(text) => setNickName(text)}
                    errorMessage={errors.NickName}
                />

                <InputField
                    label={'Password'}
                    icon={
                        <Ionicons
                            name="ios-lock-closed-outline"
                            size={20}
                            color="#666"
                            style={{ marginRight: 5 }}
                        />
                    }
                    value={Password}
                    inputType="password"
                    onChangeText={(text) => setPassword(text)}
                    fieldButtonLabel={"Forgot?"}
                    fieldButtonFunction={() => { }}
                    errorMessage={errors.Password}
                />


                {/* <CustomButton label={"Login"} onPress={() => { navigation.navigate('TabNavigator') }} /> */}
                <CustomButton label={"Login"} onPress={onSubmit} />

                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        marginBottom: 30,
                    }}>
                    <Text>New to the app?</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                        <Text style={{ color: '#EEBE68', fontWeight: '700' }}> Register</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView >
    );
};

export default Login;

const styles = StyleSheet.create({
    titleView: {
        alignItems: 'center',
        marginBottom: 100
    },
    title: {
        fontSize: 50,
        fontWeight: 'bold'
    }
});