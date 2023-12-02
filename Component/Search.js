import axios from "axios";
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TextInput, Pressable, FlatList, Image } from 'react-native';
import Card from "./Card";
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Search = ({ navigation }) => {

    const [Id, setId] = useState('');
    const [searchType, setSearchType] = useState('user');
    const [searchText, setSearchText] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    const searchOptions = [
        { label: 'User', value: 'user' },
        { label: 'Book Title', value: 'bookTitle' },
        { label: 'Author', value: 'author' },
        { label: 'Genre', value: 'genre' },
    ];

    useEffect(() => {
        setSearchResults([]);
    }, [searchType]);

    const handleSearch = async () => {

        const IdUser = await AsyncStorage.getItem('Id');

        setId(IdUser);

        let apiUrl = '';

        switch (searchType) {
            case 'user':
                apiUrl = `http://bookmate00-001-site1.atempurl.com/api/User/search?searchTerm=${searchText}`;
                break;
            case 'bookTitle':
                apiUrl = `http://bookmate00-001-site1.atempurl.com/api/Post/SearchByBookTitle/${searchText}`;
                break;
            case 'author':
                apiUrl = `http://bookmate00-001-site1.atempurl.com/api/Post/SearchByAuthor/${searchText}`;
                break;
            case 'genre':
                apiUrl = `http://bookmate00-001-site1.atempurl.com/api/Post/SearchByGenre/${searchText}`;
                break;
            default:
                break;
        }

        axios.get(apiUrl)
        .then((response) => {
            setSearchResults(response.data.reverse());
        })
        .catch((error)=>{
            if (error.response && error.response.status === 404) {
                // Obrada specifične 404 greške
                console.log('Nema rezultata pretrage.');
            } else {
                console.error('Došlo je do greške:', error.message);
            }
            setSearchResults([]);
        })
            
    };


    return (
        <View style={styles.container}>

            <View style={styles.optionsContainer}>
                {searchOptions.map((item) => (
                    <Pressable
                        key={item.value}
                        onPress={() => setSearchType(item.value)}
                        style={[styles.optionButton, searchType === item.value && styles.selectedOption]}
                    >
                        <Text style={[styles.optionText, searchType === item.value && styles.selectedText]}>{item.label}</Text>
                    </Pressable>
                ))}
            </View>

            <TextInput
                style={styles.input}
                onChangeText={(text) => {
                    setSearchText(text);
                    handleSearch(text);
                }}
                placeholder={`Search ${searchType === 'genre' ? 'genre' : searchType}`}
                placeholderTextColor='#aaa'
            />

            <FlatList
                style={{ width: '100%' }}
                data={searchResults}
                keyExtractor={(item) => item.id}
                ListEmptyComponent={() => (
                    <Text style={styles.noResultsText}>
                        {searchResults === '' ? searchResults : 'No results.'}
                    </Text>
                )}
                renderItem={({ item, index }) => (
                    <>
                        {searchType === 'user' ? (
                            <Pressable
                                onPress={() => navigation.replace('TabNavigator', { screen: 'Profil1', params: { id: item.id, screen: 'Search' } })}
                                key={item.id}
                                style={[styles.resultItem, index % 2 === 1 && styles.evenResultItem]}>
                                <View style={styles.resultContainer}>
                                    {item.image ? (<Image
                                        source={{ uri: item.image }}
                                        style={styles.slika}
                                    />) : (
                                        <View style={styles.icon}>
                                            <Ionicons name="person-outline" size={20} color="#666" />
                                        </View>
                                    )}
                                    <View style={styles.textContainer}>
                                        <Text>{item.nickName}</Text>
                                        <Text style={{ color: '#aaa' }}>{item.firstName} {item.lastName}</Text>
                                    </View>
                                </View>
                            </Pressable>

                        ) : (
                            <Card post={item} iduser={Id} screen="Search" />
                        )}
                    </>
                )
                }
            />

        </View >
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: '#fff',
    },
    optionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
        width: '100%',
        paddingHorizontal: 10,
    },
    optionButton: {
        flex: 1,
        paddingVertical: 8,
        paddingHorizontal: 5,
        marginVertical: 10,
        borderBottomEndRadius: 1,
        borderTopStartRadius: 1,
        borderBottomColor: '#ccc',
        borderRadius: 20,
        alignItems: 'center',
    },
    selectedOption: {
        backgroundColor: '#EEBE68',
    },
    optionText: {
        fontSize: 16,
        color: '#555',
    },
    selectedText: {
        color: '#fff',
    },
    input: {
        width: '94%',
        borderBottomWidth: 1,
        borderColor: '#ccc',
        padding: 8,
        marginBottom: 12,
        borderRadius: 8,
        textAlign: 'left',
        color: '#333',
    },
    resultItem: {
        padding: 16,
        flexDirection: 'column',
        alignItems: 'flex-start',
    },
    evenResultItem: {
        backgroundColor: '#eee',
    },
    noResultsText: {
        color: '#aaa',
        fontSize: 10,
        padding: 8,
        paddingLeft: 20,
    },
    slika: {
        width: 50,
        height: 50,
        borderRadius: 80,
    },
    icon: {
        width: 50,
        height: 50,
        borderRadius: 80,
        backgroundColor: '#EEBE68',
        alignItems: 'center',
        justifyContent: 'center'
    },
    resultContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    textContainer: {
        marginLeft: 10,
        flexDirection: 'column',
        alignItems: 'flex-start',
    },

});

export default Search;
