
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity, ScrollView } from 'react-native'
import { useNavigation } from '@react-navigation/native';
import { Header } from 'react-native-elements';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function LikedList({ route }) {

    const navigation = useNavigation();

    const { postId, screen } = route.params || {};

    const [usersLiked, setUsersLiked] = useState([]);

    useEffect(() => {

        axios.get(`https://localhost:7124/api/Like/GetUsersLikeByPostId/${postId}`)
            .then((response) => {
                setUsersLiked(response.data)
                console.log(response.data)
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            })
    }, [])


    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Header
                placement="left"
                leftComponent={

                    <Ionicons
                        name='arrow-back'
                        color='#333'
                        size={18}
                        onPress={() => navigation.replace('TabNavigator', { screen: 'Post', params: { postId, screen: screen } })} />
                }
                containerStyle={{ backgroundColor: '#fff' }}
            />

            <FlatList
                data={usersLiked}
                keyExtractor={(item, index) => (item && item.id ? item.id.toString() : index.toString())}
                renderItem={({ item, index }) => (
                    <TouchableOpacity
                        onPress={() => navigation.replace('TabNavigator', { screen: 'Profil1', params: { id: item.id, screen: screen } })}
                        key={item && item.id ? item.id.toString() : 'default'}
                        style={[styles.resultItem, index % 2 === 1 && styles.evenResultItem]}
                    >
                        <View style={styles.resultContainer}>
                            {item.image ? (
                                <Image source={{ uri: item.image }} style={styles.slika} />
                            ) : (
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
                )}
            />
        </ScrollView>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
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