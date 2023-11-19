import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Home from './Home';
import { StyleSheet, View, Text } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Profil from './Profil';
import AddPost from './AddPost';
import Profil1 from './Profil1';
import Search from './Search';
import Chat from './Chat';
import FollowingList from './FollowingList';

const Tab = createBottomTabNavigator();

export const TabNavigator = ({ navigation }) => {

    return (
        <Tab.Navigator>
            <Tab.Screen
                name="BookMate"
                component={Home}
                options={{
                    tabBarLabel: '',
                    tabBarIcon: ({ focused }) => (
                        <View style={styles.iconContainer}>
                            <View style={styles.circle}>
                                <MaterialCommunityIcons name="book-open" color="white" size={focused ? 35 : 25} />
                            </View>
                        </View>
                    ),
                    headerShown: false,
                }}
            />

            <Tab.Screen
                name="Add Post"
                component={AddPost}
                options={{
                    tabBarLabel: '',
                    tabBarIcon: ({ focused }) => (
                        <View style={styles.iconContainer}>
                            <View style={styles.circle}>
                                <MaterialCommunityIcons name="plus" color="white" size={focused ? 35 : 25} />
                            </View>
                        </View>
                    ),
                }}
            />

            <Tab.Screen
                name="Profil"
                component={Profil}
                options={{
                    tabBarLabel: '',
                    tabBarIcon: ({ focused }) => (
                        <View style={styles.iconContainer}>
                            <View style={styles.circle}>
                                <MaterialCommunityIcons name="account" color="white" size={focused ? 35 : 25} />
                            </View>
                        </View>
                    ),
                    headerShown: false
                }}
            />
            <Tab.Screen
                name="Profil1"
                component={Profil1}
                options={{
                    headerLeft: () => (
                        <Ionicons name="ios-arrow-back"
                            size={25}
                            color="#333"
                            style={{ paddingLeft: 5 }}
                            onPress={() => navigation.navigate('Search')} />
                    ),
                    headerStyle: {
                        backgroundColor: '#FBFBFB'
                    },
                    tabBarButton: () => null
                }}
            />
            < Tab.Screen
                name="Search"
                component={Search}
                options={{
                    headerLeft: () => (
                        <Ionicons name="ios-arrow-back"
                            size={25}
                            color="#333"
                            style={{ paddingLeft: 5 }}
                            onPress={() => navigation.navigate('BookMate')} />
                    ),
                    tabBarButton: () => null
                }}
            />
            < Tab.Screen
                name="Chat"
                component={Chat}
                options={{
                    headerLeft: () => (
                        <Ionicons name="ios-arrow-back"
                            size={25}
                            color="#333"
                            style={{ paddingLeft: 5 }}
                            onPress={() => navigation.navigate('BookMate')} />
                    ),
                    tabBarButton: () => null
                }}
            />
            < Tab.Screen
                name="Following"
                component={FollowingList}
                options={{
                    headerLeft: () => (
                        <Ionicons name="ios-arrow-back"
                            size={25}
                            color="#333"
                            style={{ paddingLeft: 5 }}
                            onPress={() => navigation.navigate('Profil')} />
                    ),
                    tabBarButton: () => null
                }}
            />
        </Tab.Navigator >
    )
}


const styles = StyleSheet.create({
    iconContainer: {
        alignItems: 'center',
    },
    circle: {
        width: 50,
        height: 50,
        backgroundColor: '#EEBE68', // Boja kruga
        borderRadius: 25, // Poluprečnik radi ravne ivice
        justifyContent: 'center',
        alignItems: 'center',
    },
});