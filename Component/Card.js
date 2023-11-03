import React, { useState } from 'react'
import { View, Text, Image, StyleSheet } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons';

const Card = () => {

    const [zanr, setZanr] = useState('Fantazija');
    const [naziv, setNaziv] = useState('Gospodar Prstenova');
    const [autor, setAutor] = useState('J.R.R. Tolkien');
    const [opis, setOpis] = useState('Lorem ipsum dolor sit amet consectetur. In pretium metus nulla lobortis diam urna vel mus et.Sed purus urna ullamcorper.');

    return (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <Image
                    source={{ uri: 'https://document360.com/wp-content/uploads/2022/01/Ultimate-guide-to-writing-instructions-for-a-user-manual-Document360.png' }}
                    style={styles.slika}
                />
                <Text style={styles.ime}>ajsa__a</Text>

                <View style={{ paddingStart: 15 }}>
                    <View style={styles.infoLabel}>
                        <Text style={{ color: 'gray' }}>Žanr: </Text>
                        <Text style={{ color: 'black' }}>{zanr}</Text>
                    </View>
                    <View style={styles.infoLabel}>
                        <Text style={{ color: 'gray' }}>Autor: </Text>
                        <Text style={{ color: 'black' }}>{autor}</Text>
                    </View>
                </View>
            </View>

            <View style={styles.cardBody}>
                <View style={{ borderColor: '#9F8F8F', borderWidth: 0.5, marginBottom: 15 }} />

                <Text style={styles.infoLabel}>
                    <Text style={{ color: 'gray' }}>Naziv: </Text>
                    <View style={{ textAlign: 'center', width: '100%' }}>
                        <Text style={{ color: 'black', fontSize: 18 }}>{naziv}</Text>
                    </View>
                </Text>
                <View style={{ borderColor: '#9F8F8F', borderWidth: 0.5, marginTop: 15 }} />

                <Text style={styles.infoLabel}>
                    <Text style={{ color: 'gray' }}>Moj dozivljaj: </Text>
                    <Text style={{ color: 'black' }}>{opis}</Text>
                </Text>
            </View>
            <View style={styles.bottomLine}>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                }}>
                    <MaterialCommunityIcons name="heart" color="#F44336" size={30} />
                    <MaterialCommunityIcons name="comment" color="#EEBE68" size={30} />
                </View>
                <View>
                    <MaterialCommunityIcons name="bookmark" color="black" size={30} />
                </View>
            </View>
        </View>
    )
}

export default Card;


const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
    },
    card: {
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        margin: 20,
        borderColor: '#E31F1F',
        borderWidth: 1,
        borderRadius: 20,
        elevation: 3,
        shadowOffset: { width: 1, height: 1 },
        shadowColor: 'black',
        shadowOpacity: 0.3,
        shadowRadius: 2,
        position: 'relative',
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        width: '100%',
    },
    cardBody: {
        marginBottom: 15,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        padding: 10,
    },
    slika: {
        width: 60,
        height: 60,
        borderRadius: 30,
        margin: 10,
    },
    ime: {
        fontSize: 18,
        fontWeight: 'bold',

    },
    infoLabel: {
        fontSize: 13,
        flexDirection: 'row',
        margin: 5
    },
    bottomLine: {
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        paddingLeft: 20,
        paddingRight: 20,
        width: '100%',
        height: 45,
        borderRadius: 50,
        backgroundColor: '#788B96',
        position: 'absolute',
        bottom: -20,
    },
});
