import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { StyleSheet, ScrollView } from 'react-native';
import Card from './Card';
import { Header } from 'react-native-elements';
import { RefreshControl } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Home = ({ navigation }) => {

    const [Id, setId] = useState('');
    const [data, setData] = useState([]);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {

        const fetchData = async () => {
            const IdUser = await AsyncStorage.getItem('Id');

            setId(IdUser);

            axios.get(`https://localhost:7124/api/Post/GetPostsUsersFollowover/${IdUser}`)
                .then((response) => {
                    setData(response.data);
                })
                .catch((error) => {
                    console.error('Error fetching data:', error);
                })
                .finally(() => {
                    setRefreshing(false);
                });

        }

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

                        fetchData();
                    }}
                />
            }
        >
            <Header
                leftComponent={
                    {
                        icon: 'search', color: '#333',
                        onPress: () => navigation.replace('TabNavigator', { screen: 'Search' }),
                    }}
                centerComponent={{ text: 'BookMate', style: { color: '#333', fontWeight: 'bold' } }}
                rightComponent={{
                    icon: 'notifications', // Korišćenje ikone za obaveštenja
                    color: '#333', color: '#333',
                    onPress: () => navigation.replace('TabNavigator', { screen: 'Notifications' }) // Navigacija na ekran za obaveštenja
                }}
                containerStyle={{ backgroundColor: '#fff' }}
            />
            {data.map((post) => (
                <Card key={post.postId} post={post} iduser={Id} screen="Home" />
            ))}
        </ScrollView >
    );
}

export default Home;

const styles = StyleSheet.create({
    container: {
        // backgroundColor: 'rgb(254, 254, 246)',
        // backgroundColor:'#fff'
        backgroundColor: '#FBFBFB'

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

