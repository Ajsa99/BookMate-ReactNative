import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, Picker, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Yup from 'yup';

const AddPost = ({ navigation }) => {
    const [idUser, setIdUser] = useState(0);
    const [Genre, setGenre] = useState('');
    const [Author, setAuthor] = useState('');
    const [Title, setTitle] = useState('');
    const [Experience, setExperience] = useState('');

    const [errors, setErrors] = useState({});

    const genres = ['Action', 'Adventure', 'Sci - Fi', 'Mystery', 'Fantasy', 'Triler'];


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

                axios.post("https://localhost:7124/api/Post/AddPost", data)
                    .then((response) => {
                        if (response) {
                            console.log(response.data);
                            navigation.navigate('BookMate');
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
            <Text style={styles.label}>Zanr:</Text>
            <Picker
                selectedValue={Genre}
                style={styles.picker}
                onValueChange={(itemValue) => setGenre(itemValue)}
            >
                {genres.map((g) => (
                    <Picker.Item key={g} label={g || 'Izaberite zanr'} value={g} />
                ))}
            </Picker>
            <Text style={{ color: 'red' }}>{errors.Genre}</Text>

            <Text style={styles.label}>Autor:</Text>
            <TextInput
                style={styles.input}
                onChangeText={(text) => setAuthor(text)}
                placeholder="Unesite autora"
                placeholderTextColor='#333'
            />
            <Text style={{ color: 'red' }}>{errors.Author}</Text>

            <Text style={styles.label}>Naziv knjige:</Text>
            <TextInput
                style={styles.input}
                onChangeText={(text) => setTitle(text)}
                placeholder='Unesite naziv knjige'
                placeholderTextColor='#333'
            />
            <Text style={{ color: 'red' }}>{errors.Title}</Text>

            <Text style={styles.label}>Vaš doživljaj:</Text>
            <TextInput
                style={styles.input}
                onChangeText={(text) => setExperience(text)}
                multiline
                numberOfLines={4}
                placeholder='Moj dozivljaj...'
                placeholderTextColor='#333'
            />
            <Text style={{ color: 'red' }}>{errors.Experience}</Text>

            <TouchableOpacity
                onPress={onSubmit}
                style={styles.button}>
                <Text
                    style={styles.buttonText}>
                    Dodaj post
                </Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 16,
        backgroundColor: '#fff'
    },
    label: {
        fontSize: 16,
        marginBottom: 6,
    },
    picker: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        marginBottom: 12,
    },
    input: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 8,
        marginBottom: 12,
        borderRadius: 8,
        textAlign: 'start'
    },
    button: {
        backgroundColor: '#0060DB',
        padding: 10,
        borderRadius: 10,
        marginBottom: 30,
        width: '100%',
    },
    buttonText: {
        textAlign: 'center',
        fontWeight: '600',
        fontSize: 16,
        color: '#fff',
    }
});

export default AddPost;
