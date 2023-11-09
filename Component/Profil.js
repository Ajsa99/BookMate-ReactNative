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
import { Header } from 'react-native-elements';
import { Menu, MenuOption, MenuOptions, MenuTrigger } from 'react-native-popup-menu';
// import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MenuProvider } from 'react-native-popup-menu';
import { RefreshControl } from 'react-native';

const Profil = ({ navigation }) => {

    const dataActivities = [
        { key: 'active', value: '123', name: "book-open" },
        { key: 'likes', value: '456', name: "heart" },
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

    const [Id, setId] = useState('');
    const [NickName, setNickname] = useState('');
    const [FirstName, setFirstName] = useState('');
    const [LastName, setLastName] = useState('');
    const [refreshing, setRefreshing] = useState(false);

    const [data, setData] = useState([]);

    useEffect(() => {

        async function fetchData() {

            const Id = await AsyncStorage.getItem('Id');
            const nickname = await AsyncStorage.getItem('NickName');

            setId(Id);
            setNickname(nickname);


            axios.get(`https://localhost:7124/api/User/${Id}`)
                .then((response) => {
                    setFirstName(response.data.firstName);
                    setLastName(response.data.lastName)

                })

            axios.get(`https://localhost:7124/api/Post/GetPostIdUser/${Id}`)
                .then((response) => {
                    console.log(response.data);

                    // Pretvori u niz ako nije
                    const postData = Array.isArray(response.data) ? response.data : [response.data];

                    // Loguj response.data pre mapiranja
                    console.log(postData);

                    const updatedData = postData.map(item => ({
                        ...item,
                        nickName: nickname,
                    }));
                    setData(updatedData.reverse());
                    console.log(updatedData);

                })
                .catch((error) => {
                    console.error('Error fetching data:', error);
                });
        }


        fetchData();

    }, []);

    const onRefresh = () => {
        setRefreshing(true);

        fetchData();

        setRefreshing(false);
    };

    const removeNickname = async () => {
        try {
            await AsyncStorage.removeItem('NickName');
            console.log('Nadimak obrisan.');
            navigation.navigate('Login');
        } catch (error) {
            console.error('Greška pri brisanju nadimka:', error);
        }
    };

    const Following = () => {

        const data = {
            following: Id,
            followers: 3
        };

        axios.post('https://localhost:7124/api/Followover/AddFollowover', data)
            .then((response) => {
                console.log("Uspelo je")
            })
    }

    return (
        <MenuProvider>

            <View style={{ flex: 1 }}>
                <Header
                    leftComponent={{ text: NickName, style: { color: '#333', fontWeight: 'bold' } }}
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
                                <MenuOption onSelect={() => console.log('Opcija 1')}>
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
                        <View>
                            <Image
                                source={{ uri: 'https://document360.com/wp-content/uploads/2022/01/Ultimate-guide-to-writing-instructions-for-a-user-manual-Document360.png' }}
                                style={styles.slika}
                            />
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
                        <TouchableOpacity
                            onPress={Following}
                            style={styles.buttonfollow}
                        >
                            <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
                                <MaterialCommunityIcons name="star-outline" color="white" size={22} />
                                <Text style={{ color: 'white', fontSize: '15' }}>Zaprati</Text>
                            </View>

                        </TouchableOpacity>
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
                                <Card key={post.id} post={post} />
                            ))}
                        </View>
                    </View>
                </ScrollView>
            </View>
        </MenuProvider>

    )
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
        backgroundColor: '#9F8F8F',
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