import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, Pressable, Image } from 'react-native';
import { Header } from 'react-native-elements';
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import { RefreshControl } from 'react-native';


export default function Notifications({ navigation }) {

    const [notifications, setNotifications] = useState([]);
    const [refreshing, setRefreshing] = useState(false);

    const [Id, setId] = useState('');

        const fetchData = async () => {

            const IdUser = await AsyncStorage.getItem('Id');
            setId(IdUser);

            axios.get(`http://bookmate00-001-site1.atempurl.com/api/User/GetFollowersUsers/${IdUser}`)
            .then((response) => {            

                    console.log(response.data);

                    const reversedData = response.data.reverse();
                    setNotifications(reversedData);
                })
            .catch((error) => {
                console.error('Error fetching data:', error);
            })
            .finally(() => {
                setRefreshing(false);
            });
        }
        
    useEffect(()=>{
        fetchData();

    },[])

    const UpdateNotifications=()=>{

        navigation.replace('TabNavigator')
            
        axios.put(`http://bookmate00-001-site1.atempurl.com/api/Followover/UpdateNotifications/${Id}`)
        .then((response) => {            
                console.log(response.data);
            })
        .catch((error) => {
            console.error('Error fetching data:', error);
        })
    }

    return (
        <View style={styles.container}>
            <Header
                placement="left"
                leftComponent={

                    <Ionicons
                        name='arrow-back'
                        color='#333'
                        size={25}
                        onPress={() => UpdateNotifications()} />
                }
                containerStyle={{ backgroundColor: '#fff' }}
            />
            <FlatList
                data={notifications}
                keyExtractor={(item, index) => (item && item.id ? item.id.toString() : index.toString())}
                renderItem={({ item }) => (
                    <Pressable
                        onPress={() => navigation.replace('TabNavigator', { screen: 'Profil1', params: { id: item.id, screen: 'Notifications' } })}
                        key={item && item.id ? item.id.toString() : 'default'}
                        style={[styles.resultItem, item.notification === false && styles.evenResultItem && styles.evenResultItem]}
                    >
                        <View style={styles.resultContainer}>
                            <View style={styles.resultLeft}>
                            {item.image ? (
                                <Image source={{ uri: item.image }} style={styles.slika} />
                            ) : (
                                <View style={styles.icon}>
                                    <Ionicons name="person-outline" size={20} color="#666" />
                                </View>
                            )}
                            <View style={styles.textContainer}>
                                    <Text>Started following you</Text>
                                    <Text style={{color: '#555'}}>{item.nickName}</Text>
                           </View>
                           </View>
                           <Text style={{ color: '#aaa', fontSize:12 }}>{moment(item.createdAt).fromNow()}</Text>

                        </View>
                    </Pressable>
                )}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchData(); }} />
                }
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'flex-start',
        backgroundColor: '#fff',
        height:'100%'
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
        alignItems: 'flex-end',
        justifyContent:'space-between',
        width:'100%',
    },
    resultLeft:{
        flexDirection: 'row',
        alignItems:'center',
    },
        textContainer: {
        marginLeft: 10,
        flexDirection: 'column',
        alignItems: 'flex-start',
    },

});


