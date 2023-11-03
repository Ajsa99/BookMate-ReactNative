import React from 'react'
import {
    View,
    Text,
    StyleSheet,
    Image,
    FlatList,
    TouchableOpacity,
    SectionList
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Card from './Card';
import { ScrollView } from 'react-native';
import { Header } from 'react-native-elements';
import Home from './Home';

const Profil = () => {

    const dataActivities = [
        { key: 'active', value: '123', name: "book-open" },
        { key: 'likes', value: '456', name: "heart" },
        { key: 'following', value: '789', name: "star" },
        { key: 'followers', value: '987', name: "star-outline" },
    ];

    const activities = ({ item }) => (
        <View style={styles.activityItem}>
            <View style={{ marginRight: 10 }}>
                <MaterialCommunityIcons name={item.name} color="#EEBE68" size={23} />
            </View>
            <Text style={styles.activityValue}>{item.value} </Text>
            <Text style={styles.activityLabel}>{item.key}</Text>

        </View>
    );


    return (
        <ScrollView style={styles.container}>
            <Header
                placement="left"
                leftComponent={{ icon: 'menu', color: '#fff' }}
                centerComponent={{ text: 'MY TITLE', style: { color: '#fff' } }}
                rightComponent={{ icon: 'home', color: '#fff' }}
            />
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
                    <Text style={{ fontSize: 25, color: '#333' }}>Ajsa Alibasic</Text>
                    <Text style={{ color: '#9F8F8F' }}>Novi Pazar, Srbija</Text>
                </View>
                <TouchableOpacity
                    onPress={() => { }}
                    style={styles.buttonfollow}
                >
                    <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
                        <MaterialCommunityIcons name="star-outline" color="white" size={28} />
                        <Text style={{ color: 'white', fontSize: '17' }}>Zaprati</Text>
                    </View>

                </TouchableOpacity>
            </View>


            <View style={{ alignItems: 'center' }}>
                <View style={styles.menuList}>
                    <View style={styles.cell}>
                        <MaterialCommunityIcons name="book-open" color="#FAFAFA" size={23} />
                    </View>
                    <View style={styles.cell}>
                        <MaterialCommunityIcons name="book" color="#FAFAFA" size={23} />
                    </View>
                    <View style={styles.cell1} >
                        <MaterialCommunityIcons name="bookmark" color="#FAFAFA" size={23} />
                    </View>
                </View>
                <View style={styles.viewList}>
                    <Card />
                    <Card />
                    <Card />
                </View>
            </View>


        </ScrollView>
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
        fontSize: 13,
        fontWeight: 'bold',
        color: '#EEBE68'
    },
    activityValue: {
        fontSize: 20,
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