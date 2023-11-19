// FollowingList.js

import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';

export default function FollowingList({ route }) {

    const { id } = route.params;

    console.log(id)

    useEffect(() => {
        axios.get(`https://localhost:7124/api/Followover/GetFollowingUsers/${id}`)
            .then((res) => {
                console.log(res.data)
            })
    })
    return (
        <View>
            <Text>Lista korisnika koje pratite:</Text>

        </View>
    );
};


