import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Header } from 'react-native-elements';
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import moment from 'moment'

export default function Notifications({ navigation }) {

    const [notifications, setNotifications] = useState([]);

    useEffect(()=>{

        async function fetchData() {

            const Id = await AsyncStorage.getItem('Id');

            console.log(Id)

            axios.get(`https://localhost:7124/api/User/GetFollowersUsers/${Id}`)
            .then((response) => {
                    console.log(response.data);

                    const reversedData = response.data.reverse();
                    setNotifications(reversedData);
                })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
        }
        
        fetchData();

    },[])
    

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
                data={notifications}
                keyExtractor={(item, index) => (item && item.id ? item.id.toString() : index.toString())}
                renderItem={({ item, index }) => (
                    <TouchableOpacity
                        onPress={() => navigation.replace('TabNavigator', { screen: 'Notifications' })}
                        key={item && item.id ? item.id.toString() : 'default'}
                        style={[styles.resultItem, index % 2 === 1 && styles.evenResultItem]}
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
                                    <Text>Pocinje vas pratiti</Text>
                                    <Text style={{color: '#555'}}>{item.nickName}</Text>
                           </View>
                           </View>
                           <Text style={{ color: '#aaa', fontSize:12 }}>{moment(item.createdAt).fromNow()}</Text>

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
        alignItems: 'flex-end',
        justifyContent:'space-between',
        width:'100%',
    },
    resultLeft:{
        flexDirection: 'row',
        alignItems:'center'
    },
        textContainer: {
        marginLeft: 10,
        flexDirection: 'column',
        alignItems: 'flex-start',
    },

});


