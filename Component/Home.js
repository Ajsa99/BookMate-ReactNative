import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { View, Text, TextInput, Button, StyleSheet, Image } from 'react-native';
import { ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { TabNavigator } from './TabNavigator';
import Card from './Card';
import { Header } from 'react-native-elements';
import { RefreshControl } from 'react-native';

export default function Home() {

    const [data, setData] = useState([]);
    const [refreshing, setRefreshing] = useState(false);

    const fetchData = () => {
        axios.get(`https://localhost:7124/api/Post/GetPostsUsers`)
            .then((response) => {
                console.log(response.data);
                setData(response.data.reverse());
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            })
            .finally(() => {
                setRefreshing(false);
            });
    };

    useEffect(() => {
        fetchData();
    }, []);


    return (
        <ScrollView
            contentContainerStyle={styles.container}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={() => {
                        setRefreshing(true);
                        // Ovde pozovi funkciju za ponovno preuzimanje podataka
                        fetchData();
                    }}
                />
            }
        >
            <Header
                leftComponent={{ icon: 'search', color: '#333' }}
                centerComponent={{ text: 'BookMate', style: { color: '#333', fontWeight: 'bold' } }}
                rightComponent={{ icon: 'chat', color: '#333' }}
                containerStyle={{ backgroundColor: '#fff' }}
            />
            {data.map((post) => (
                <Card key={post.postId} post={post} />
            ))}
        </ScrollView >
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
    },
    card: {
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        margin: 20,
        borderColor: '#E31F1F',
        borderWidth: 1,
        borderRadius: 20,
        elevation: 3,
        shadowOffset: { width: 1, height: 1 },
        shadowColor: 'black',
        shadowOpacity: 0.3,
        shadowRadius: 2,
        position: 'relative',
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        width: '100%',
    },
    cardBody: {
        marginBottom: 15,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        padding: 10,
    },
    slika: {
        width: 60,
        height: 60,
        borderRadius: 30,
        margin: 10,
    },
    ime: {
        fontSize: 18,
        fontWeight: 'bold',

    },
    infoLabel: {
        fontSize: 15,
        marginTop: 10,
    },
    bottomLine: {
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        paddingLeft: 20,
        paddingRight: 20,
        width: '100%',
        height: 45,
        borderRadius: 50,
        backgroundColor: '#788B96',
        position: 'absolute',
        bottom: -20,
    },
});

