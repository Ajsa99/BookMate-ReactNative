import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Pressable } from 'react-native';
import axios from 'axios';
import { Header } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import InputField from './InputField';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import * as Yup from 'yup';

const ChangeProfile = ({navigation}) => {

  const [id, setId] = useState('');
  const [FirstName, setFirstName] = useState('');
  const [LastName, setLastName] = useState('');
  const [Email, setEmail] = useState('');
  const [NickName, setNickName] = useState('');

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
    });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const userId = await AsyncStorage.getItem('Id');
      setId(userId);
      const response = await axios.get(`http://bookmate00-001-site1.atempurl.com/api/User/${userId}`);
      const userData = response.data;

      setFirstName(userData.firstName);
      setLastName(userData.lastName);
      setEmail(userData.email);
      setNickName(userData.nickName);
    } catch (error) {
      console.error('Greška prilikom dobijanja podataka:', error);
    }
  };

  const saveChanges = async () => {
    try {
      await schema.validate({
        FirstName,
        LastName,
        NickName,
      }, { abortEarly: false });
  
      const data = {
        id: id,
        firstName: FirstName,
        lastName: LastName,
        nickName: NickName,
      };
  
      const response = await axios.put(`http://bookmate00-001-site1.atempurl.com/api/User/UpdateUser`, data);
  
      // Provera status koda odgovora
      if (response.status === 200) {
        Alert.alert('Uspešno sačuvane promene');
        // Opciono: možete izvršiti navigaciju na drugi ekran nakon čuvanja promena
        navigation.replace('TabNavigator', { screen: 'Profil' });
      } else {
        Alert.alert('Greška prilikom čuvanja promena');
      }
    } catch (validationErrors) {
      // Obrada grešaka
      const errorObj = {};
      validationErrors.inner.forEach((err) => {
        errorObj[err.path] = err.message;
      });
      setErrors(errorObj);
    }
  };
  

  return (
    <View>
        <Header
            placement="left"
            leftComponent={

                <Ionicons
                    name='arrow-back'
                    color='#333'
                    size={25}
                    onPress={() => navigation.navigate('TabNavigator', { screen:'Profil' })} />
            }
            centerComponent={{ text: 'Edit Profile', style: { color: '#333', fontWeight: 'bold' } }}
            containerStyle={{ backgroundColor: '#fff' }}
        />
        <View style={styles.container}>

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
            value={Email}
        />

        <Pressable
            onPress={saveChanges}
            style={styles.button}>
            <Text
                style={styles.buttonText}>    
                Save changes
            </Text>
        </Pressable>
        </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height:'100%',
    padding: 20,
    backgroundColor:'#fff'
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    marginBottom: 15,
    padding: 10,
    borderRadius: 8,
  },
  button: {
    borderWidth: 1,
    borderBottomWidth:2,
    borderColor:'#eee',
    borderBottomColor:'#EEBE68',
    borderRadius: 10,
    width: '100%',
    padding: 20,
    marginTop:20
    },
    buttonText: {
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 16,
    color: '#EEBE68',
    }
});

export default ChangeProfile;
