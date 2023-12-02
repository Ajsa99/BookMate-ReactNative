import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Pressable, Image, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Header } from 'react-native-elements';

export default function FollowingList({ navigation, route }) {

    const { id, initialOption, screen } = route.params || {};

    const [Id, setId] = useState(id);

    const [followingUsers, setFollowingUsers] = useState([]);
    const [followersUsers, setFollowersUsers] = useState([]);

    const [followersCount, setFollowersCount] = useState('');
    const [followingCount, setFollowingCount] = useState('');

    const [searchType, setSearchType] = useState('');

    const searchOptions = [
        { label: 'Followers', value: 'followers' },
        { label: 'Following', value: 'following' },
    ];

    useEffect(() => {
        // Postavi početnu vrednost prema `initialOption`
        if (initialOption) {
            setSearchType(initialOption);
        }
    }, [initialOption]);

    useEffect(() => {

        const fetchData = async () => {
            try {
                await axios.get(`http://bookmate00-001-site1.atempurl.com/api/User/GetFollowersUsers/${Id}`)
                    .then((response) => {
                        setFollowersUsers(response.data);
                        setFollowersCount(response.data.length)
                    })
                await axios.get(`http://bookmate00-001-site1.atempurl.com/api/User/GetFollowingUsers/${Id}`)
                    .then((response) => {
                        setFollowingUsers(response.data);
                        setFollowingCount(response.data.length);
                    })

            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchData();
    }, [searchType, id]);

    const dataToRender = searchType === 'following' ? followingUsers : followersUsers;

    return (
        <View style={styles.container}>
            <Header
                placement="left"
                leftComponent={
                    <>
                        <Ionicons
                            name='arrow-back'
                            color='#333'
                            size={23}
                            onPress={() => navigation.navigate('TabNavigator', { screen: screen, params: { id: Id, screen: screen } })}
                        />
                    </>
                }
                containerStyle={{ backgroundColor: '#fff' }}
            />
            <View style={styles.optionsContainer}>
                {searchOptions.map((item) => (
                    <Pressable
                        key={item.value}
                        onPress={() => setSearchType(item.value)}
                        style={[styles.optionButton, searchType === item.value && styles.selectedOption]}
                    >
                        <Text style={[styles.optionText, searchType === item.value && styles.selectedText]}>
                            {item.label} ({item.value === 'followers' ? followersCount : followingCount})
                        </Text>
                    </Pressable>
                ))}
            </View>
            <FlatList
                data={dataToRender}
                keyExtractor={(item) => (item && item.id ? item.id.toString() : 'default')}
                renderItem={({ item, index }) => (
                    <Pressable
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
                    </Pressable>
                )}
            />
        </View>
    );
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