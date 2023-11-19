import axios from "axios";
import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, TextInput, Image } from "react-native";
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TouchableOpacity } from 'react-native-gesture-handler';
import moment from 'moment';

export default function Comment({ post, iduser, setcommentCount }) {

    const [Id, setId] = useState(iduser);
    const [nickName, setNickName] = useState('');
    const [image, setImage] = useState('');
    const [data, setData] = useState([]);

    const [text, setText] = useState('');

    console.log({ post })

    console.log(data.length)
    useEffect(() => {

        async function fetchData() {

            const id = parseInt(iduser, 10);
            const nickname = await AsyncStorage.getItem('NickName');
            const image = await AsyncStorage.getItem('Image');

            setId(id);
            setImage(image);
            setNickName(nickname);

            axios.get(`https://localhost:7124/api/Comment/GetCommentsByPostId/${post.postId}`)
                .then((response) => {
                    console.log(response.data);
                    setData(response.data);
                })
        }

        fetchData()
    }, [])


    const submitComment = async (idPost) => {
        const data = {
            idUser: Id,
            idPost: idPost,
            text: text,
        }

        try {
            const response = await axios.post('https://localhost:7124/api/Comment/AddComment', data);
            console.log(response);

            // Povećaj commentCount kada se doda novi komentar
            setcommentCount((prevCommentCount) => prevCommentCount + 1);

            // Dobijanje novog ID-a komentara iz odgovora servera
            const newCommentId = response.data.id;

            // Dodajte novi komentar u lokalno stanje
            const newComment = {
                id: newCommentId,
                idUser: Id,
                idPost: idPost,
                text: text,
                nickName: nickName,
                image: image
            };

            console.log(newComment.id)
            console.log(data)

            setData(prevData => Array.isArray(prevData) ? [...prevData, newComment] : [newComment]);

            setText('');
        } catch (error) {
            console.error('Greška prilikom dodavanja komentara', error);
        }
    };

    const DeleteComment = async (idPost) => {

        try {
            await axios.delete(`https://localhost:7124/api/Comment/DeleteComment/${idPost}`);

            setData((prevData) => prevData.filter((comment) => comment.id !== idPost));
            console.log(`Komentar sa ID-jem ${idPost} je obrisan.`);
            setcommentCount((prevCommentCount) => prevCommentCount - 1);


        } catch (error) {
            console.error('Greška prilikom brisanja komentara', error);
        }
    }

    return (
        <View style={styles.comment}>
            <Text style={styles.commentHeading}>Komentari...</Text>
            {data.map((comment) => (
                <View key={comment.id} style={styles.userComm}>
                    {comment.image ? (
                        <Image
                            source={{ uri: comment.image }}
                            style={styles.slika} />
                    ) : (
                        <View style={styles.iconComm}>
                            <Ionicons name="person-outline" size={15} color="#666" />
                        </View>
                    )}
                    <View style={styles.commentText}>
                        <Text style={styles.commentUser}>{comment.nickName}</Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text>{comment.text}</Text>
                            <View style={{ flexDirection: 'column', alignItems: 'end' }}>
                                {comment.idUser == Id ? (
                                    <TouchableOpacity onPress={() => DeleteComment(comment.id)}>
                                        <Text style={{ fontSize: 10, color: '#1b5ca1' }}>Delete</Text>
                                    </TouchableOpacity>
                                ) : null}
                                <Text style={{ fontSize: 10, color: '#aaa' }}>{moment(comment.createdAt).fromNow()}</Text>

                            </View>

                        </View>

                    </View>
                </View>
            ))}
            <View style={styles.userComm}>
                {image ? (
                    <Image
                        source={{ uri: image }}
                        style={styles.slika} />
                ) : (
                    <View style={styles.iconComm}>
                        <Ionicons name="person-outline" size={15} color="#666" />
                    </View>
                )}

                <View style={styles.commentText}>

                    <Text style={styles.commentUser}>{nickName}</Text>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            onChangeText={(text) => setText(text)}
                            placeholder="Dodaj komentar..."
                            placeholderTextColor='#aaa'
                        />
                        <TouchableOpacity onPress={() => submitComment(post.postId)}>
                            <Ionicons name="paper-plane" size={15} color="#555" />
                        </TouchableOpacity>
                    </View>

                </View>


            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    comment: {
        paddingVertical: 20,
        paddingHorizontal: 10,
        borderRadius: 20,
        flexDirection: 'column',
        backgroundColor: 'white',
        marginHorizontal: 20,
        borderColor: '#aaa',
        borderWidth: 1,
        borderRadius: 20,
        elevation: 3,
        shadowOffset: { width: 1, height: 1 },
        shadowColor: 'black',
        shadowOpacity: 0.3,
        shadowRadius: 2,
        position: 'relative',
    },
    commentHeading: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    userComm: {
        flex: 1,
        paddingVertical: 10,
        borderTopWidth: 1,
        borderTopColor: '#aaa',
        flexDirection: 'row',
        alignItems: 'center',
    },
    slika: {
        width: 40,
        height: 40,
        borderRadius: 50,
    },
    iconComm: {
        width: 40,
        height: 40,
        borderRadius: 50,
        backgroundColor: '#EEBE68',
        alignItems: 'center',
        justifyContent: 'center',
    },
    commentText: {
        flex: 1,
        paddingHorizontal: 10,
    },
    commentUser: {
        fontWeight: 'bold',
        marginBottom: 5,
    },
    inputContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 20,
        paddingRight: 5
    },
    input: {
        width: '100%',
        padding: 5,
        fontSize: 12,
        textAlign: 'start',
    },

});
