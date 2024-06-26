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
import { RefreshControl } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Header } from 'react-native-elements';

const Profil1 = ({ navigation, route }) => {

    const { id, screen } = route?.params || {};

    const [Id, setId] = useState(id);
    const [NickName, setNickname] = useState('');
    const [FirstName, setFirstName] = useState('');
    const [LastName, setLastName] = useState('');
    const [image, setImage] = useState('');
    const [refreshing, setRefreshing] = useState(false);

    const [data, setData] = useState([]);

    const [IdLoggedInUser, setIdLoggedInUser] = useState(0);
    const [followers, setFollowers] = useState(false);


    const [followersCount, setFollowersCount] = useState('');
    const [followingCount, setFollowingCount] = useState('');
    const [postCount, setPostCount] = useState('');

    useEffect(() => {

        async function fetchData() {

            const IdUser = await AsyncStorage.getItem('Id');

            setIdLoggedInUser(IdUser)
            setId(id);


            axios.get(`http://bookmate00-001-site1.atempurl.com/api/User/${Id}`)
                .then((response) => {
                    setFirstName(response.data.firstName);
                    setLastName(response.data.lastName)
                    setNickname(response.data.nickName)
                    setImage(response.data.image)

                    navigation.setOptions({ headerTitle: response.data.nickName });

                    axios.get(`http://bookmate00-001-site1.atempurl.com/api/Post/GetPostsUsersidUser/${Id}`)
                        .then((res) => {

                            setData(res.data);
                            setPostCount(res.data.length);
                        })
                })

            axios.get(`http://bookmate00-001-site1.atempurl.com/api/Followover/IsFollowing/${IdUser}/${Id}`)
                .then((response) => {
                    setFollowers(response.data);
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

        }

        fetchData();

    }, [postCount, followingCount, followersCount]);

    const onRefresh = () => {
        setRefreshing(true);

        fetchData();

        setRefreshing(false);
    };


    const Following = () => {

        const data = {
            followers: IdLoggedInUser,
            following: Id,
            notification: false
        };

        axios.post('http://bookmate00-001-site1.atempurl.com/api/Followover/AddFollowover', data)
            .then((response) => {

                console.log(response.data);
                setFollowers(true);
                setFollowersCount((prev) => prev + 1);

            })
    }

    const UnFollowing = () => {

        axios.delete(`http://bookmate00-001-site1.atempurl.com/api/Followover/Unfollow/${IdLoggedInUser}/${Id}`)
            .then((response) => {
                console.log(response.data);
                setFollowers(false)
                setFollowersCount((prev) => prev - 1);
            })
    }

    return (
            <View style={{ flex: 1 }}>
                <Header
                    placement="left"
                    leftComponent={
                        <Ionicons
                            name='arrow-back'
                            color='#333'
                            size={25}
                            onPress={() => navigation.navigate('TabNavigator', { id: IdLoggedInUser, screen: screen })} />
                    }
                    centerComponent={{ text: NickName, style: { color: '#333', fontWeight: 'bold', fontSize:18 } }}
                    containerStyle={{ backgroundColor: '#FBFBFB' }}
                />
                <ScrollView
                    style={styles.container}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                        />
                    }
                >

                    <View style={styles.hederView}>
                        <View>
                            {image ? (
                                <Image
                                    source={{ uri: image }}
                                    style={styles.slika} />

                            ) : (
                                <View
                                    style={styles.icon}>
                                    <Ionicons name="person-outline" size={90} color="#666" />
                                </View>
                            )}
                        </View>
                        
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
                                <Pressable onPress={() => navigation.replace('TabNavigator', { screen: 'Followover', params: { id, initialOption: 'following', screen: 'Profil1' } })}>
                                    <Text style={styles.activityLabel}>following</Text>
                                </Pressable>
                            </View>
                            <View style={styles.activityItem}>
                                <View style={{ marginRight: 10 }}>
                                    <MaterialCommunityIcons name="star-outline" color="#EEBE68" size={20} />
                                </View>
                                <Text style={styles.activityValue}>{followersCount} </Text>
                                <Pressable onPress={() => navigation.replace('TabNavigator', { screen: 'Followover', params: { id, initialOption: 'following', screen: 'Profil1' } })}>
                                    <Text style={styles.activityLabel}>followers</Text>
                                </Pressable>
                            </View>
                        </View>
                    </View>

                    <View style={styles.hrLine}></View>

                    {IdLoggedInUser != Id ? (

                        <View style={styles.body}>
                            <View style={styles.info}>
                                <Text style={{ fontSize: 25, color: '#333' }}>{FirstName} {LastName}</Text>
                            </View>

                            {followers == false ? (
                                <Pressable
                                    onPress={Following}
                                    style={styles.buttonfollow}
                                >
                                    <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
                                        <MaterialCommunityIcons name="star-outline" color="white" size={22} />
                                        <Text style={{ color: 'white', fontSize: 15, fontWeight:'bold' }}>Follow</Text>
                                    </View>

                                </Pressable>
                            ) : followers == true ? (
                                <Pressable
                                    onPress={UnFollowing}
                                    style={styles.buttonfollow1}
                                >
                                    <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
                                        <MaterialCommunityIcons name="star" color="#EEBE68" size={22} />
                                        <Text style={{ color: '#EEBE68', fontSize: 15, fontWeight:'bold' }}>Following</Text>
                                    </View>

                                </Pressable>
                            ) : null}
                        </View>
                    ) : (

                        <View style={styles.body1}>
                            <View style={styles.info1}>
                                <Text style={{ fontSize: 25, color: '#333' }}>{FirstName} {LastName}</Text>
                            </View>
                        </View>
                    )}

                    <View style={{ alignItems: 'center' }}>
                        <View style={styles.menuList}>
                            <Pressable
                                style={styles.cell}
                            >
                                <MaterialCommunityIcons name="book-open-page-variant" color="#EEBE68" size={23} />
                            </Pressable>
                        </View>
                        <View style={styles.viewList}>
                            {Array.isArray(data) && data.map((post) => (
                                <Card key={post.postId} post={post} iduser={IdLoggedInUser} screen="Profil1" />
                            ))}
                        </View>
                    </View>
                </ScrollView>
            </View >
    )
}

export default Profil1;

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FBFBFB'
    },
    hederView: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 20,
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
        justifyContent: 'center'
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
        flexDirection:'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginTop: 10,
    },
    info: {
        alignItems: 'flex-start',
    },
    body1: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    info1: {
        width: '82%',
        flexDirection: 'column',
        alignItems: 'flex-start',
    },
    buttonfollow: {
        width: 120,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#EEBE68',
        paddingVertical: 10,
        borderRadius: 30,
    },
    buttonfollow1: {
        width: 120,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FBFBFB',
        paddingVertical: 10,
        borderRadius: 30,
        borderWidth: 2,
        borderColor: '#EEBE68'
    },
    menuList: {
        width:'100%',
        justifyContent: 'center',
        flexDirection: 'row',
        backgroundColor:'#FBFBFB',
        marginTop: 30,
        borderTopWidth:2,
        borderBottomWidth:2,
        borderTopColor:'#EEBE68',
        borderBottomColor:'#EEBE68',
        color:'#EEBE68'
    },
    cell: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 5,
    },
    viewList: {
        width:'100%',
        backgroundColor: '#FBFBFB',
        paddingBottom: 25
    },
});


