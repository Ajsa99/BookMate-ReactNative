import React, { useState } from 'react';
import axios from 'axios';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert
} from 'react-native';
import * as Yup from 'yup';
import InputField from './InputField';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';

import CustomButton from './CustomButton';

const Register = ({ navigation }) => {


  const [FirstName, setFirstName] = useState('');
  const [LastName, setLastName] = useState('');
  const [NickName, setNickName] = useState('');
  const [Email, setEmail] = useState('');
  const [Password, setPassword] = useState('');
  const [PPassword, setPPassword] = useState('');

  const [errors, setErrors] = useState({});


  const schema = Yup.object().shape({
    FirstName: Yup.string()
      .required('First Name is required')
      .min(3, 'First Name must be at least 3 characters')
      .max(10, 'First Name must be at most 20 characters'),
    LastName: Yup.string()
      .required('Last Name is required')
      .min(3, 'Last Name must be at least 3 characters')
      .max(20, 'Last Name must be at most 20 characters'),
    NickName: Yup.string()
      .required('Nick Name is required')
      .min(3, 'Nick Name must be at least 3 characters')
      .max(20, 'First Name must be at most 20 characters'),
    Email: Yup.string().email('Invalid email').required('Email is required'),
    Password: Yup.string()
      .required('Password is required')
      .min(3, 'Password must be at least 3 characters'),
    PPassword: Yup.string().oneOf([Yup.ref('Password'), null], 'Passwords must match'),
  });


  const onSubmit = () => {

    schema.validate(
      {
        FirstName,
        LastName,
        NickName,
        Email,
        Password,
        PPassword,
      },
      { abortEarly: false }
    )
      .then(() => {
        // Ukoliko nema grešaka, možete izvršiti registraciju
        const data = {
          firstName: FirstName,
          lastName: LastName,
          nickName: NickName,
          email: Email,
          password: Password,
        };

        console.log(data);

        axios
          .post('https://localhost:7124/register', data)
          .then((response) => {
            Alert.alert("Successful registration!");
            navigation.navigate('Login');
          }).catch((error) => {
            if (error.response) {
              alert(error.response.data);
            }
          });

      }).catch((validationErrors) => {
        // Ukoliko postoje greške, postavite ih u stanje i prikažite korisniku
        const errorObj = {};
        validationErrors.inner.forEach((err) => {
          errorObj[err.path] = err.message;
        });
        setErrors(errorObj);
      });

  };

  return (
    <SafeAreaView style={{ flex: 1, justifyContent: 'center', backgroundColor: '#fff' }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ paddingHorizontal: 25 }}>
        <View style={{ alignItems: 'center' }}>
          <Image
            style={{
              resizeMode: 'center',
              height: 200,
              width: 300,
            }}
            source={require('../assets/images/create.png')}
          />
        </View>

        <Text
          style={{
            textAlign: 'center',
            fontSize: 28,
            fontWeight: '500',
            color: '#333',
            margin: 30,
          }}>
          Register
        </Text>


        <InputField
          label={'First Name'}
          icon={
            <Ionicons
              name="person-outline"
              size={20}
              color="#666"
              style={{ marginRight: 5 }}
            />
          }
          value={FirstName}
          onChangeText={(text) => setFirstName(text)}
          errorMessage={errors.FirstName}
        />

        <InputField
          label={'Last Name'}
          icon={
            <Ionicons
              name="person-outline"
              size={20}
              color="#666"
              style={{ marginRight: 5 }}
            />
          }
          value={LastName}
          onChangeText={(text) => setLastName(text)}
          errorMessage={errors.LastName}
        />

        <InputField
          label={'Nick Name'}
          icon={
            <Ionicons
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
          label={'Email'}
          icon={
            <MaterialIcons
              name="alternate-email"
              size={20}
              color="#666"
              style={{ marginRight: 5 }}
            />
          }
          keyboardType="email-address"
          value={Email}
          onChangeText={(text) => setEmail(text)}
          errorMessage={errors.Email}
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
          value={Password}
          onChangeText={(text) => setPassword(text)}
          errorMessage={errors.Password}
        />

        <InputField
          label={'Confirm Password'}
          icon={
            <Ionicons
              name="ios-lock-closed-outline"
              size={20}
              color="#666"
              style={{ marginRight: 5 }}
            />
          }
          inputType="password"
          value={PPassword}
          onChangeText={(text) => setPPassword(text)}
          errorMessage={errors.PPassword}
        />

        <CustomButton label={'Register'} onPress={onSubmit} />

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginBottom: 30,
          }}>
          <Text>Already registered?</Text>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={{ color: '#EEBE68', fontWeight: '700' }}> Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Register;


