import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Home from './Home';
import { StyleSheet, View } from 'react-native';
import Start from './Start';
import Profil from './Profil';

const Tab = createBottomTabNavigator();

export const TabNavigator = () => {
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
                }}

            />
            <Tab.Screen
                name="Add"
                component={Home}
                options={{
                    tabBarLabel: '',
                    tabBarIcon: ({ focused }) => (
                        <View style={styles.iconContainer}>
                            <View style={styles.circle}>
                                <MaterialCommunityIcons name="book" color="white" size={focused ? 35 : 25} />
                            </View>
                        </View>
                    ),
                    // headerShown: false // Možete dodati ovo da se takođe sakrije zaglavlje
                }}
            />

            <Tab.Screen
                name="Chat"
                component={Start}
                options={{
                    tabBarLabel: '',
                    tabBarIcon: ({ focused }) => (
                        <View style={styles.iconContainer}>
                            <View style={styles.circle}>
                                <MaterialCommunityIcons name="forum" color="white" size={focused ? 35 : 25} />
                            </View>
                        </View>
                    ),
                    // headerShown: false
                }}
            />

            <Tab.Screen
                name="ajsa__a"
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
                }}
            />

            <Tab.Screen
                name="Search"
                component={Home}
                options={{
                    tabBarLabel: '',
                    tabBarIcon: ({ focused }) => (
                        <View style={styles.iconContainer}>
                            <View style={styles.circle}>
                                <MaterialCommunityIcons name="magnify" color="white" size={focused ? 35 : 25} />
                            </View>
                        </View>
                    ),
                    // headerShown: false
                }}
            />
        </Tab.Navigator>
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