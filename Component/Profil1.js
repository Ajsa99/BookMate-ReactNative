import React, { useState, useEffect } from 'react'
import {
    View,
    Text,
    StyleSheet,
    Image,
    FlatList,
    TouchableOpacity
} from 'react-native';
import axios from 'axios';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Card from './Card';
import { ScrollView } from 'react-native';
import { MenuProvider } from 'react-native-popup-menu';
import { RefreshControl } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Profil1 = ({ navigation, route }) => {

    const { item } = route.params;

    const dataActivities = [
        { key: 'active', value: '123', name: "book-open" },
        { key: 'following', value: '789', name: "star" },
        { key: 'followers', value: '987', name: "star-outline" },
    ];

    const activities = ({ item }) => (
        <View style={styles.activityItem}>
            <View style={{ marginRight: 10 }}>
                <MaterialCommunityIcons name={item.name} color="#EEBE68" size={20} />
            </View>
            <Text style={styles.activityValue}>{item.value} </Text>
            <Text style={styles.activityLabel}>{item.key}</Text>

        </View>
    );

    const [Id, setId] = useState(item.id);
    const [NickName, setNickname] = useState(item.nickName);
    const [FirstName, setFirstName] = useState('');
    const [LastName, setLastName] = useState('');
    const [image, setImage] = useState('');
    const [refreshing, setRefreshing] = useState(false);

    const [data, setData] = useState([]);

    const [IdLoggedInUser, setIdLoggedInUser] = useState(0);
    const [followers, setFollowers] = useState(false);

    useEffect(() => {

        async function fetchData() {

            navigation.setOptions({ headerTitle: item.nickName });

            const IdUser = await AsyncStorage.getItem('Id');

            setIdLoggedInUser(IdUser)
            console.log(IdLoggedInUser);

            axios.get(`https://localhost:7124/api/User/${Id}`)
                .then((response) => {
                    setFirstName(response.data.firstName);
                    setLastName(response.data.lastName)
                    setImage(response.data.image)

                    console.log(response.data)
                    axios.get(`https://localhost:7124/api/Post/GetPostIdUser/${Id}`)
                        .then((res) => {

                            // Pretvori u niz ako nije
                            const postData = Array.isArray(res.data) ? res.data : [res.data];

                            // Loguj response.data pre mapiranja
                            console.log(postData);

                            const updatedData = postData.map(item => ({
                                ...item,
                                postId: item.id,
                                userId: item.idUser,
                                nickName: NickName,
                                image: response.data.image,
                            }));
                            setData(updatedData);
                            console.log(updatedData);

                        })
                })



            // axios.get(`https://localhost:7124/api/Followover/GetFollowers/${IdUser}`)
            //     .then((response) => {
            //         if (response) {
            //             console.log(response.data);

            //             // Prolazak kroz sve brojeve pratilaca i prikazivanje svakog od njih
            //             response.data.forEach(user => {
            //                 console.log(`Follower: ${user.followers}`);
            //                 if (user.followers == Id) {
            //                     console.log(`Follower: ${user.followers} ${Id}`);
            //                 }
            //             });
            //         }
            //     })

            axios.get(`https://localhost:7124/api/Followover/IsFollowing/${IdUser}/${Id}`)
                .then((response) => {
                    console.log(response.data);
                    setFollowers(response.data);
                })


        }

        fetchData();


    }, []);

    const onRefresh = () => {
        setRefreshing(true);

        fetchData();

        setRefreshing(false);
    };


    const Following = () => {

        const data = {
            followers: IdLoggedInUser,
            following: Id,
        };

        axios.post('https://localhost:7124/api/Followover/AddFollowover', data)
            .then((response) => {
                console.log(response.data);
                setFollowers(true)
            })
    }

    const UnFollowing = () => {

        // Alert.alert(
        //     'Potvrda',
        //     'Da li ste sigurni da želite da otpratite korisnika?',
        //     [
        //         {
        //             text: 'Ne',
        //             onPress: () => console.log('Otpracivanje otkazano'),
        //             style: 'cancel',
        //         },
        //         {
        //             text: 'Da',
        //             onPress: () => {
        //                 console.log(IdLoggedInUser);
        //                 console.log(Id);

        //                 // Pozovi Axios kada korisnik pritisne "Da" u Alert-u
        //                 axios.delete(`https://localhost:7124/api/Followover/Unfollow/${IdLoggedInUser}/${Id}`)
        //                     .then((response) => {
        //                         console.log(response.data);
        //                         setFollowers(false);
        //                     });
        //             },
        //         },
        //     ]
        // );

        axios.delete(`https://localhost:7124/api/Followover/Unfollow/${IdLoggedInUser}/${Id}`)
            .then((response) => {
                console.log(response.data);
                setFollowers(false)
            })
    }

    return (
        <MenuProvider>
            <View style={{ flex: 1 }}>
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
                        <View>
                            <FlatList
                                data={dataActivities}
                                renderItem={activities}
                            />
                        </View>
                    </View>

                    <View style={styles.hrLine}></View>


                    <View style={styles.body}>
                        <View style={styles.info}>
                            <Text style={{ fontSize: 25, color: '#333' }}>{FirstName} {LastName}</Text>
                            <Text style={{ color: '#9F8F8F' }}>Novi Pazar, Srbija</Text>
                        </View>
                        {followers == false ? (
                            <TouchableOpacity
                                onPress={Following}
                                style={styles.buttonfollow}
                            >
                                <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
                                    <MaterialCommunityIcons name="star-outline" color="white" size={22} />
                                    <Text style={{ color: 'white', fontSize: '15' }}>Zaprati</Text>
                                </View>

                            </TouchableOpacity>
                        ) : followers == true ? (
                            <TouchableOpacity
                                onPress={UnFollowing}
                                style={styles.buttonfollow1}
                            >
                                <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
                                    <MaterialCommunityIcons name="star" color="#0060DB" size={22} />
                                    <Text style={{ color: '#0060DB', fontSize: '15' }}>Pratim</Text>
                                </View>

                            </TouchableOpacity>
                        ) : (<></>)}
                    </View>



                    <View style={{ alignItems: 'center' }}>
                        <View style={styles.menuList}>
                            <TouchableOpacity
                                onPress={() => { }}
                                style={styles.cell}
                            >
                                <MaterialCommunityIcons name="book-open" color="#FAFAFA" size={23} />

                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => { }}
                                style={styles.cell}>
                                <MaterialCommunityIcons name="book" color="#FAFAFA" size={23} />
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => { }}
                                style={styles.cell1} >
                                <MaterialCommunityIcons name="bookmark" color="#FAFAFA" size={23} />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.viewList}>
                            {Array.isArray(data) && data.map((post) => (
                                <Card key={post.id} post={post} iduser={IdLoggedInUser} />
                            ))}
                        </View>
                    </View>
                </ScrollView>
            </View >
        </MenuProvider >
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
        justifyContent: 'center'
    },
    activityItem: {
        flex: 1,
        alignItems: 'flex-end',
        margin: 10,
        flexDirection: 'row',
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
        alignItems: 'center',
        justifyContent: 'space-around',
        flexDirection: 'row',
        marginTop: 10,
    },
    info: {
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
    buttonfollow1: {
        width: 120,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingVertical: 10,
        borderRadius: 30,
        borderWidth: 1,
        borderColor: '#0060DB'
    },
    menuList: {
        width: '96%',
        justifyContent: 'center',
        flexDirection: 'row',
        backgroundColor: '#EEBE68',
        borderRadius: 20,
        marginTop: 30,
        borderWidth: 1,
        borderColor: '#9F8F8F'

    },
    cell: {
        width: '32%',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 8,
        borderEndWidth: 1,
        borderRightColor: '#9F8F8F'
    },
    cell1: {
        width: '30%',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 8,
        borderRightColor: '#9F8F8F'
    },
    viewList: {
        width: '96%',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#9F8F8F',
        borderRadius: 20,
        paddingTop: 10,
        paddingBottom: 25
    },
    scroll: {
        backgroundColor: 'red',
    }
});