import React from "react";
import { View, Text, StyleSheet } from 'react-native';

export default function Chat() {
    return (
        <View style={styles.container}>
            <Text>Chat</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: '#fff'
    }
});