import React from 'react';
import {
    SafeAreaView,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';

import CustomButton from './CustomButton';
import InputField from './InputField';

const Login = ({ navigation }) => {
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
                    inputType="password"
                    fieldButtonLabel={"Forgot?"}
                    fieldButtonFunction={() => { }}
                />


                <CustomButton label={"Login"} onPress={() => { navigation.navigate('TabNavigator') }} />

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