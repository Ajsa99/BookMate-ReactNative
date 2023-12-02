import React, { useState, useEffect } from 'react'
import {
    View,
    Text,
    StyleSheet,
    Image,
    Pressable
} from 'react-native';
import axios from 'axios';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Card from './Card';
import { ScrollView } from 'react-native';
import { Header } from 'react-native-elements';
import { Menu, MenuOption, MenuOptions, MenuTrigger } from 'react-native-popup-menu';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MenuProvider } from 'react-native-popup-menu';
import { RefreshControl } from 'react-native';

const Profil = ({ navigation }) => {

    const [id, setId] = useState('');
    const [NickName, setNickname] = useState('');
    const [FirstName, setFirstName] = useState('');
    const [LastName, setLastName] = useState('');
    const [image, setImage] = useState('');
    const [refreshing, setRefreshing] = useState(false);

    const [data, setData] = useState([]);
    const [followersCount, setFollowersCount] = useState('');
    const [followingCount, setFollowingCount] = useState('');
    const [postCount, setPostCount] = useState('');

    const [dataBookMark, setDataBookMark] = useState([]);
    const [menuOption, setMenuOption] = useState('Post');

    const fetchData = async () => {
        const Id = await AsyncStorage.getItem('Id');
        const nickname = await AsyncStorage.getItem('NickName');

        setId(Id);
        setNickname(nickname);


        axios.get(`http://bookmate00-001-site1.atempurl.com/api/User/${Id}`)
            .then((response) => {
                setFirstName(response.data.firstName);
                setLastName(response.data.lastName)
                setImage(response.data.image);

                //postovi
                axios.get(`http://bookmate00-001-site1.atempurl.com/api/Post/GetPostsUsersidUser/${Id}`)
                    .then((res) => {
                        console.log({ res })
                        setData(res.data);
                        setPostCount(res.data.length);
                    })
                    .catch((error) => {
                        console.error('Error fetching data:', error);
                    });

                //korisnici koji me prate
                axios.get(`http://bookmate00-001-site1.atempurl.com/api/Followover/GetFollowersCountAsync/${Id}`)
                    .then((res) => {
                        setFollowersCount(res.data)
                    })
                    .catch((error) => {
                        console.error('Error fetching data:', error);
                    });

                //korisnici koje pratim
                axios.get(`http://bookmate00-001-site1.atempurl.com/api/Followover/GetFollowingCountAsync/${Id}`)
                    .then((res) => {
                        setFollowingCount(res.data)
                    })
                    .catch((error) => {
                        console.error('Error fetching data:', error);
                    });

                //sacuvani postovi(Book Mark)
                axios.get(`http://bookmate00-001-site1.atempurl.com/api/BookMark/GetSavedPosts/${Id}`)
                    .then((res) => {
                        setDataBookMark(res.data);
                    })
                    .catch((error) => {
                        console.error('Error fetching data:', error);
                    });
            })
      };

    useEffect(() => {

        fetchData();

    }, [postCount, followingCount, followersCount]);

    const onRefresh = () => {
        setRefreshing(true);
        fetchData();
        setRefreshing(false);
    };

    const removeNickname = async () => {
        try {
            await AsyncStorage.removeItem('NickName');
            navigation.replace('Login');
        } catch (error) {
            console.error('Greška pri brisanju nickName:', error);
        }
    };

    return (
        <MenuProvider>
            <View style={{ flex: 1 }}>
                <Header
                    leftComponent={{ text: NickName, style: { color: '#333', fontWeight: 'bold', fontSize:18 } }}
                    rightComponent={
                        <Menu>
                            <MenuTrigger>
                                <Ionicons
                                    name="menu"
                                    color="#333"
                                    size={25}
                                />
                            </MenuTrigger>

                            <MenuOptions>
                                <MenuOption onSelect={()=> navigation.replace('EditProfile')}>
                                    <Text>Izmeni profil</Text>
                                </MenuOption>
                                <MenuOption onSelect={removeNickname}>
                                    <Text>Odjavi se</Text>
                                </MenuOption>
                            </MenuOptions>
                        </Menu>
                    }
                    containerStyle={{ backgroundColor: '#FBFBFB' }}
                />
                <ScrollView
                    style={styles.container}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                        />
                    }
                >

                    <View style={styles.hederView}>
                        {image ? (<View>
                            <Image
                                source={{ uri: image }}
                                style={styles.slika}
                            />
                        </View>
                        ) : (
                            < View
                                style={styles.icon}>
                                <Ionicons name="person-outline" size={90} color="#666" />
                            </View>
                        )}

                        <View style={{flexDirection:'column'}}>
                            <View style={styles.activityItem}>
                                <View style={{ marginRight: 10 }}>
                                    <MaterialCommunityIcons name="book-open" color="#EEBE68" size={20} />
                                </View>
                                <Text style={styles.activityValue}>{postCount} </Text>
                                <Pressable>
                                    <Text style={styles.activityLabel}>active</Text>
                                </Pressable>
                            </View>
                            <View style={styles.activityItem}>
                                <View style={{ marginRight: 10 }}>
                                    <MaterialCommunityIcons name="star" color="#EEBE68" size={20} />
                                </View>
                                <Text style={styles.activityValue}>{followingCount} </Text>
                                <Pressable onPress={() => navigation.replace('TabNavigator', { screen: 'Followover', params: { id, initialOption: 'following', screen: 'Profil' } })}>
                                    <Text style={styles.activityLabel}>following</Text>
                                </Pressable>
                            </View>
                            <View style={styles.activityItem}>
                                <View style={{ marginRight: 10 }}>
                                    <MaterialCommunityIcons name="star-outline" color="#EEBE68" size={20} />
                                </View>
                                <Text style={styles.activityValue}>{followersCount} </Text>
                                <Pressable onPress={() => navigation.replace('TabNavigator', { screen: 'Followover', params: { id, initialOption: 'followers', screen: 'Profil' } })}>
                                    <Text style={styles.activityLabel}>followers</Text>
                                </Pressable>
                            </View>
                        </View>
                    </View>

                    <View style={styles.hrLine}></View>

                    <View style={styles.body}>
                        <View style={styles.info}>
                            <Text style={{ fontSize: 25, color: '#333' }}>{FirstName} {LastName}</Text>
                            <Text style={{ color: '#9F8F8F' }}>Novi Pazar, Srbija</Text>
                        </View>
                    </View>

                    <View style={{ alignItems: 'center' }}>
                        <View style={styles.menuList}>
                            <Pressable
                                onPress={() => setMenuOption('Post')}
                                style={styles.cell}> 
                                <MaterialCommunityIcons name="book-open-page-variant" color="#EEBE68" size={23} />
                            </Pressable>
                            <Pressable
                                onPress={() => { navigation.replace('TabNavigator', { screen: 'Add Book' }) }}
                                style={styles.cell}>
                                <MaterialCommunityIcons name="book-plus" color="#EEBE68" size={23} />
                            </Pressable>
                            <Pressable
                                onPress={() => setMenuOption('BookMark')}
                                style={styles.cell1} >
                                <MaterialCommunityIcons name="bookshelf" color="#EEBE68" size={23} />
                            </Pressable>
                        </View>
                        <View style={styles.viewList}>
                            {menuOption == 'Post' ? (
                                data.map((post) => (
                                    <Card key={post.postId} post={post} iduser={id} screen="Profil" />))
                            ) : menuOption == 'BookMark' ? (
                                dataBookMark.map((post) => (
                                    <Card key={post.postId} post={post} iduser={id} screen="Profil" />))
                            ) : null
                            }
                        </View>
                    </View>
                </ScrollView>
            </View>
        </MenuProvider >
    );
}

export default Profil;

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FBFBFB'
    },
    hederView: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 20
    },
    slika: {
        width: 160,
        height: 160,
        borderRadius: 80,
        margin: 10,
    },
    icon: {
        width: 160,
        height: 160,
        borderRadius: 80,
        margin: 10,
        backgroundColor: '#EEBE68',
        alignItems: 'center',
        justifyContent: 'center',
    },
    activityItem: {
        margin: 10,
        flexDirection: 'row',
        alignItems:'flex-end'
    },
    activityLabel: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#EEBE68'
    },
    activityValue: {
        fontSize: 16,
        color: '#EEBE68'
    },
    hrLine: {
        width: '90%',
        marginHorizontal: '5%',
        marginVertical: 15,
        height: 0.5,
        backgroundColor: '#ddd',
    },
    body: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    info: {
        width: '82%',
        flexDirection: 'column',
        alignItems: 'flex-start',
    },
    buttonfollow: {
        width: 120,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#0060DB',
        paddingVertical: 10,
        borderRadius: 30,
    },
    menuList: {
        width:'100%',
        justifyContent: 'center',
        flexDirection: 'row',
        backgroundColor:'#fff',
        marginTop: 30,
        borderTopWidth:2,
        borderBottomWidth:2,
        borderTopColor:'#EEBE68',
        borderBottomColor:'#EEBE68',
        color:'#EEBE68'
    },
    cell: {
        width: '32%',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 5,
    },
    cell1: {
        width: '30%',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 5,
    },
    viewList: {
        width:'100%',
        paddingBottom: 25,
    },
    scroll: {
        backgroundColor: 'red',
    }
});