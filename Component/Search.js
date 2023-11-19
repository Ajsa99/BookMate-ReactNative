import axios from "axios";
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, Image } from 'react-native';
import Card from "./Card";
import Ionicons from 'react-native-vector-icons/Ionicons';

const Search = ({ navigation }) => {
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

    const handleSearch = () => {
        let apiUrl = '';

        switch (searchType) {
            case 'user':
                apiUrl = `https://localhost:7124/api/User/search?searchTerm=${searchText}`;
                break;
            case 'bookTitle':
                apiUrl = `https://localhost:7124/api/Post/SearchByBookTitle/${searchText}`;
                break;
            case 'author':
                apiUrl = `https://localhost:7124/api/Post/SearchByAuthor/${searchText}`;
                break;
            case 'genre':
                apiUrl = `https://localhost:7124/api/Post/SearchByGenre/${searchText}`;
                break;
            default:
                break;
        }

        axios.get(apiUrl)
            .then((response) => {
                setSearchResults(response.data.reverse());
            })
            .catch((error) => {
                if (error) {
                    console.log('Nema rezultata.');
                    setSearchResults([]);
                }
            });
    };


    return (
        <View style={styles.container}>

            <View style={styles.optionsContainer}>
                {searchOptions.map((item) => (
                    <TouchableOpacity
                        key={item.value}
                        onPress={() => setSearchType(item.value)}
                        style={[styles.optionButton, searchType === item.value && styles.selectedOption]}
                    >
                        <Text style={[styles.optionText, searchType === item.value && styles.selectedText]}>{item.label}</Text>
                    </TouchableOpacity>
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
                            <TouchableOpacity
                                onPress={() => navigation.navigate('Profil1', { item })}
                                keyExtractor={(item) => item.id.toString()}
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
                            </TouchableOpacity>

                        ) : (
                            <Card post={item} />
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
        paddingHorizontal: 10,
    },
    optionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
        width: '100%',
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
        width: '100%',
        borderBottomWidth: 1,
        borderColor: '#ccc',
        padding: 8,
        marginBottom: 12,
        borderRadius: 8,
        textAlign: 'start',
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
