import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, Picker, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomButton from './CustomButton';

const AddPost = ({ navigation }) => {
    const [idUser, setIdUser] = useState(0);
    const [genre, setGenre] = useState('');
    const [author, setAuthor] = useState('');
    const [title, setTitle] = useState('');
    const [experience, setExperience] = useState('');

    const genres = ['', 'Action', 'Adventure', 'Sci - Fi', 'Mystery', 'Fantasy', 'Triler'];

    useEffect(() => {

        async function fetchData() {

            const Id = await AsyncStorage.getItem('Id');

            setIdUser(Id);
        }
        fetchData();
    })


    const onSubmit = () => {

        const data = {
            genre: genre,
            author: author,
            bookTitle: title,
            experience: experience,
            idUser: idUser,
        };

        axios.post("https://localhost:7124/api/Post/AddPost", data)
            .then((response) => {
                if (response) {
                    navigation.navigate('BookMate');
                }
            })
    };



    return (
        <View style={styles.container}>
            <Text style={styles.label}>Zanr:</Text>
            <Picker
                selectedValue={genre}
                style={styles.picker}
                onValueChange={(itemValue) => setGenre(itemValue)}
            >
                {genres.map((g) => (
                    <Picker.Item key={g} label={g} value={g} />
                ))}
            </Picker>

            <Text style={styles.label}>Autor:</Text>
            <TextInput
                style={styles.input}
                onChangeText={(text) => setAuthor(text)}
                placeholder="Unesite autora"
                placeholderTextColor='#333'
            />

            <Text style={styles.label}>Naziv knjige:</Text>
            <TextInput
                style={styles.input}
                onChangeText={(text) => setTitle(text)}
                placeholder='Unesite naziv knjige'
                placeholderTextColor='#333'
            />

            <Text style={styles.label}>Vaš doživljaj:</Text>
            <TextInput
                style={styles.input}
                onChangeText={(text) => setExperience(text)}
                multiline
                numberOfLines={4}
                placeholder='Moj dozivljaj...'
                placeholderTextColor='#333'
            />

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
