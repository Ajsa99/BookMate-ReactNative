import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable } from 'react-native';
import {Picker} from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Yup from 'yup';

const AddPost = ({ navigation }) => {
    const [idUser, setIdUser] = useState(0);
    const [Genre, setGenre] = useState('');
    const [Author, setAuthor] = useState('');
    const [Title, setTitle] = useState('');
    const [Experience, setExperience] = useState('');

    const [errors, setErrors] = useState({});

    const genres = [
        'Action', 'Adventure', 'Art', 'Autobiography', 'Biography', 'Business',
        'Children', 'Classic', 'Comic Book', 'Contemporary', 'Cookbook', 'Crime',
        'Drama', 'Dystopian', 'Economics', 'Education', 'Fantasy', 'Graphic Novel',
        'Historical Fiction', 'History', 'Horror', 'Humor', 'Literary Fiction', 
        'Memoir', 'Mental Health', 'Mystery', 'Non-fiction', 'Philosophy', 'Poetry',
        'Political', 'Psychology', 'Romance', 'Satire', 'Science Fiction', 'Sci-Fi',
        'Self-help', 'Short Stories', 'Spirituality', 'Suspense', 'Technology',
        'Thriller', 'Travel', 'True Crime', 'Western', 'Young Adult',
      ];
      
    const schema = Yup.object().shape({
        Genre: Yup.string()
            .required('Genre is required'),
        Author: Yup.string()
            .required('Author is required')
            .min(4, 'Author must be at least 3 characters')
            .max(50, 'Author must be at most 20 characters'),
        Title: Yup.string()
            .required('Title is required')
            .min(4, 'Title must be at least 3 characters')
            .max(50, 'Title must be at most 20 characters'),
        Experience: Yup.string()
            .required('Experience is required')
            .min(10, 'Experience must be at least 3 characters')
            .max(500, 'Experience must be at most 20 characters'),
    });


    useEffect(() => {

        async function fetchData() {

            const Id = await AsyncStorage.getItem('Id');

            setIdUser(Id);
        }
        fetchData();

    }, [])


    const onSubmit = () => {

        schema.validate(
            {
                Genre,
                Author,
                Title,
                Experience,
            },
            { abortEarly: false }
        )
            .then(() => {

                const data = {
                    genre: Genre,
                    author: Author,
                    bookTitle: Title,
                    experience: Experience,
                    idUser: idUser,
                };

                axios.post("http://bookmate00-001-site1.atempurl.com/api/Post/AddPost", data)
                    .then((response) => {
                        if (response) {
                            console.log(response.data);
                            navigation.replace('TabNavigator', { screen: 'BookMate' })
                        }
                    })

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
        <View style={styles.container}>
            
            <Picker
                style={{marginBottom:5}}
                selectedValue={Genre}
                onValueChange={(itemValue) => setGenre(itemValue)}>
                {genres.map((g) => (
                    <Picker.Item key={g} label={g} value={g} />
                ))}
            </Picker>
            <Text style={{ color: 'red' }}>{errors.Genre}</Text>

            <TextInput
                style={styles.input}
                onChangeText={(text) => setAuthor(text)}
                placeholder="Author"
                placeholderTextColor='#ccc'
            />
            <Text style={{ color: 'red' }}>{errors.Author}</Text>
            
            <TextInput
                style={styles.input}
                onChangeText={(text) => setTitle(text)}
                placeholder='Book title'
                placeholderTextColor='#ccc'
            />
            <Text style={{ color: 'red' }}>{errors.Title}</Text>

            <TextInput
                style={[styles.input,{textAlignVertical: 'top',height:100, borderWidth:1 }]}
                onChangeText={(text) => setExperience(text)}
                multiline
                placeholder='My impression of the book...'
                placeholderTextColor='#ccc'
            />
            <Text style={{ color: 'red' }}>{errors.Experience}</Text>


            <Pressable
                onPress={onSubmit}
                style={styles.button}>
                <Text
                    style={styles.buttonText}>
                    Share
                </Text>
            </Pressable>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height:'100%',
        padding: 20,
        backgroundColor: '#fff',
    },
    input: {
        height: 40,
        borderColor: '#ccc',
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

export default AddPost;
