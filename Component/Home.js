import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { StyleSheet, FlatList } from 'react-native';
import Card from './Card';
import { Header } from 'react-native-elements';
import { RefreshControl } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Home = ({ navigation }) => {

    const [Id, setId] = useState('');
    const [data, setData] = useState([]);
    const [refreshing, setRefreshing] = useState(false);

    const [notifications, setNotifications] = useState(0);


        const fetchData = async () => {
            const IdUser = await AsyncStorage.getItem('Id');

            setId(IdUser);

            axios.get(`http://bookmate00-001-site1.atempurl.com/api/Post/GetPostsUsersFollowover/${IdUser}`)
                .then((response) => {
                    setData(response.data);
                })
                .catch((error) => {
                    console.error('Error fetching data:', error);
                })
                .finally(() => {
                    setRefreshing(false);
                });
            
            axios.get(`http://bookmate00-001-site1.atempurl.com/api/Followover/GetNotificationsCountAsync/${IdUser}`)
            .then((response) => {            
            
                setNotifications(response.data);
                console.log(response.data)

                })
            .catch((error) => {
                console.error('Error fetching data:', error);
            })
            .finally(() => {
                setRefreshing(false);
            });

        }

    
    useEffect(() => {
        fetchData();
    }, []);

    return (
        <>
            <Header
                leftComponent={{
                    icon: 'search', color: '#333',                    
                    onPress: () => navigation.replace('TabNavigator', { screen: 'Search' }),
                }}
                centerComponent={{ text: 'BookMate', style: { color: '#333', fontWeight: 'bold' } }}
                rightComponent={{
                    icon: notifications > 0 ? 'notifications-active' : 'notifications',
                    color: notifications > 0 ?  '#E14848' : '#333', 
                    onPress: () => navigation.navigate('Notifications'),
                }}
                containerStyle={{ backgroundColor: '#fff' }}
            />
            <FlatList
                data={data}
                keyExtractor={(item) => item.postId.toString()}
                renderItem={({ item }) => (
                    <Card post={item} iduser={Id} screen="Home" />
                )}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={() => {
                            setRefreshing(true);
                            fetchData();
                        }}
                    />
                }
                contentContainerStyle={styles.container}
            />
        </>
    );
}

export default Home;

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FBFBFB'
    }
});

