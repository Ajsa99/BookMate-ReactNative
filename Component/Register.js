import React, { useState } from 'react';
import axios from 'axios';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Image,
  Pressable
} from 'react-native';
import * as Yup from 'yup';
import InputField from './InputField';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { launchImageLibraryAsync } from 'expo-image-picker';
import CustomButton from './CustomButton';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { app } from '../config';
import { v4 as uuidv4 } from 'uuid';
import CheckBox from 'expo-checkbox';

const Register = ({ navigation }) => {

  const storage = getStorage(app);

  const [FirstName, setFirstName] = useState('');
  const [LastName, setLastName] = useState('');
  const [NickName, setNickName] = useState('');
  const [Email, setEmail] = useState('');
  const [Password, setPassword] = useState('');
  const [PPassword, setPPassword] = useState('');

  const [errors, setErrors] = useState({});

  const [profileImage, setProfileImage] = useState('');
  const [useDefaultImage, setUseDefaultImage] = useState(false);

  const pickImage = async () => {
    let result = await launchImageLibraryAsync({
      mediaTypes: 'Images',
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setProfileImage(result.uri);
      setUseDefaultImage(false);
    }
  };


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
    profileImage: Yup.string().when('useDefaultImage', {
      is: false,
      then: Yup.string().required('Profile Image is required')
    })
  });

  const uploadImageToFirebase = async (uri) => {
    try {
      // Generiši jedinstveni naziv slike koristeći UUID
      const uniqueImageName = uuidv4();

      // Kreiraj referencu ka lokaciji u Firebase Storage-u
      const storageRef = ref(storage, 'BookMate/' + uniqueImageName);

      // Preuzmi sliku iz lokalnog fajl sistema
      const response = await fetch(uri);
      const blob = await response.blob();

      // Otpremi sliku na Firebase Storage
      await uploadBytes(storageRef, blob);

      // Dobavi URL za preuzimanje otpremljene slike
      const downloadURL = await getDownloadURL(storageRef);

      return downloadURL;
    } catch (error) {
      console.error('Greška prilikom otpremanja slike na Firebase Storage:', error);
      throw error;
    }
  };


  const onSubmit = async () => {
    try {
      // Validacija podataka forme
      await schema.validate(
        {
          FirstName,
          LastName,
          NickName,
          Email,
          Password,
          PPassword,
          profileImage: useDefaultImage ? '' : profileImage || ''
        },
        { abortEarly: false }
      ).then(async () => {

        let imageUri = '';

        if (!useDefaultImage && profileImage) {
          imageUri = await uploadImageToFirebase(profileImage);
        }

        // Nastavite sa registracijom korisnika koristeći `imageUri`

        const data = {
          firstName: FirstName,
          lastName: LastName,
          nickName: NickName,
          email: Email,
          password: Password,
          image: imageUri,
        };

        console.log(data);

        axios
          .post('http://bookmate00-001-site1.atempurl.com/register', data)
          .then((response) => {
            // Alert.alert("Successful registration!");
            navigation.replace('Login');
          }).catch((error) => {
            if (error.response) {
              alert(error.response.data);
            }
          });

      }).catch((validationErrors) => {
        // Obrada grešaka prilikom validacije
        const errorObj = {};
        validationErrors.inner.forEach((err) => {
          errorObj[err.path] = err.message;
        });
        setErrors(errorObj);
      });
    } catch (error) {
      // Obrada opšte greške
      console.error('Greška:', error);
    }
  };



  return (
    <SafeAreaView style={{ flex: 1, justifyContent: 'center', backgroundColor: '#fff' }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ paddingHorizontal: 25 }}>
        <View style={{ alignItems: 'center' }}>
          <Image
            style={{
              height:200
            }}
            resizeMode="contain"
            source={require('../assets/images/booksreg.png')}
          />
        </View>

        <Text
          style={{
            textAlign: 'center',
            fontSize: 28,
            fontWeight: '500',
            color: '#333',
            marginBottom: 30,
          }}>
          Register
        </Text>

        <View style={{ alignItems: 'center' }}>
          {useDefaultImage ? (
            < View
              style={{
                width: 160,
                height: 160,
                borderRadius: 80,
                margin: 10,
                backgroundColor: '#EEBE68',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Ionicons name="person-outline" size={90} color="#666" />
            </View>
          ) : profileImage ? (
            <Image style={{
              width: 160,
              height: 160,
              borderRadius: 80,
              margin: 10,
            }} source={{ uri: profileImage }} />

          ) : null}
        </View>

        < InputField
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

        <Pressable onPress={pickImage} style={{ alignItems: 'center', flexDirection: 'row' }}>
          <View style={{ alignItems: 'start', marginBottom: 15 }} >
            <Ionicons name="ios-camera" size={40} color="#666" />
          </View>
          <Text style={{ color: 'red' }}>{errors.profileImage}</Text>
        </Pressable>

        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
          <CheckBox
            value={useDefaultImage}
            onValueChange={(newValue) => {
              setUseDefaultImage(newValue);
              setProfileImage(null); // Brisati profilnu sliku kada se prebaci na podrazumevanu
            }}
          />
          <Text> Ne želim profilnu sliku!</Text>
        </View>

        <CustomButton label={'Register'} onPress={onSubmit} />

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginBottom: 30,
          }}>
          <Text>Already registered?</Text>
          <Pressable onPress={() => navigation.goBack()}>
            <Text style={{ color: '#EEBE68', fontWeight: '700' }}> Login</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView >
  );
};

export default Register;


