import React, { useEffect, useState } from 'react'
import { View, Text, Image, StyleSheet } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import Comment from './Comment';
import axios from 'axios';

export default function Card({ post, iduser }) {

    const [IdLoggedInUser, setIdLoggedInUser] = useState(iduser);
    const [NickName, setNickName] = useState(post.nickName);
    const [image, setImage] = useState(post.image);
    const [postId, setIdPost] = useState(post.postId);

    const [zanr, setZanr] = useState(post.genre);
    const [naziv, setNaziv] = useState(post.bookTitle);
    const [autor, setAutor] = useState(post.author);
    const [opis, setOpis] = useState(post.experience);
    const [createdAt, setCreatedAt] = useState(
        moment(post.createdAt).fromNow()
    );

    console.log({ post })


    const [commentOpen, setCommentOpen] = useState(false);
    const [liked, setLiked] = useState(false);
    const [likedCount, setLikedCount] = useState(0);
    const [commentCount, setcommentCount] = useState(0);

    useEffect(() => {

        const fetchData = () => {
            const id = parseInt(iduser, 10);
            setIdLoggedInUser(id);

            axios.get(`https://localhost:7124/api/Like/IsLiked/${IdLoggedInUser}/${post.postId}`)
                .then((response) => {
                    console.log(response.data);
                    setLiked(response.data)
                })
                .catch((error) => {
                    console.error('Error fetching data:', error);
                })

            axios.get(`https://localhost:7124/api/Like/GetLikeCountByPostId/${post.postId}`)
                .then((response) => {
                    setLikedCount(response.data)
                    console.log(response.data)
                })
                .catch((error) => {
                    console.error('Error fetching data:', error);
                })

            axios.get(`https://localhost:7124/api/Comment/GetCommentCountByPostId/${post.postId}`)
                .then((response) => {
                    setcommentCount(response.data)
                })
                .catch((error) => {
                    console.error('Error fetching data:', error);
                })

        }

        fetchData();
    }, [])

    const onDelete = (idPost) => {
        axios.delete(`https://localhost:7124/api/Post/DeletePost/${idPost}`)
            .then((response) => {
                alert(response.data)
            })
    }

    const onLike = () => {

        const data = {
            idUser: IdLoggedInUser,
            idPost: postId
        }

        axios.post(`https://localhost:7124/api/Like/AddLike`, data)
            .then((response) => {
                console.log(response);
                setLiked(true);
                setLikedCount((prevLikedCount) => prevLikedCount + 1);
            })
            .catch((error) => {
                console.error(error);
            });
    }

    const unLike = () => {

        axios.delete(`https://localhost:7124/api/Like/unLike/${IdLoggedInUser}/${postId}`)
            .then((response) => {
                console.log(response);
                setLiked(false);
                setLikedCount((prevLikedCount) => prevLikedCount - 1);
            })
            .catch((error) => {
                console.error(error);
            });
    }

    return (

        <View>
            <View style={styles.card}>
                <View style={{ width: '100%', alignItems: 'flex-end' }}>
                    {iduser == post.userId ? (
                        <MaterialCommunityIcons name="delete" color="#ccc" size={20} onPress={() => onDelete(postId)} />
                    ) : null}
                </View>
                <View style={styles.cardHeader}>

                    {image ? (
                        <Image
                            source={{ uri: image }}
                            style={styles.slika}
                        />
                    ) : (
                        <View
                            style={styles.icon}>
                            <Ionicons name="person-outline" size={25} color="#666" />
                        </View>
                    )}
                    <Text style={styles.ime}>{NickName}</Text>

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

                    <View style={styles.hrLine}></View>


                    <Text style={styles.infoLabel}>
                        <Text style={{ color: 'gray' }}>Naziv: </Text>
                        <View style={{ textAlign: 'center', width: '100%' }}>
                            <Text style={{ color: 'black', fontSize: 18 }}>{naziv}</Text>
                        </View>
                    </Text>

                    <View style={styles.hrLine}></View>


                    <Text style={styles.infoLabel}>
                        <Text style={{ color: 'gray' }}>Moj dozivljaj: </Text>
                        <Text style={{ color: 'black' }}>{opis}</Text>
                    </Text>
                    <Text style={styles.time}>
                        <Text style={{ color: 'gray' }}>{createdAt}</Text>
                    </Text>
                </View>

                <View style={styles.bottomLine}>
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-around',
                        alignItems: 'flex-end'
                    }}>
                        {liked ? (
                            <MaterialCommunityIcons name="heart" color="#F44336" size={30} onPress={unLike} />

                        ) : (
                            <MaterialCommunityIcons name="heart" color="#fff" size={30} onPress={onLike} />
                        )}
                        <Text style={{ color: '#fff' }}>{likedCount}</Text>
                        <MaterialCommunityIcons name="comment" color="#EEBE68" size={30} onPress={() => setCommentOpen(!commentOpen)} />
                        <Text style={{ color: '#fff' }}>{commentCount}</Text>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <MaterialCommunityIcons name="bookmark" color="#323232" size={30} />
                    </View>

                </View>
            </View>

            {
                commentOpen && (
                    <Comment post={post} iduser={iduser} setcommentCount={setcommentCount} />
                )
            }
        </View >
    )
}


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
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        width: '100%',
    },
    cardBody: {
        marginBottom: 15,
        width: '100%'
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
    icon: {
        width: 60,
        height: 60,
        borderRadius: 30,
        margin: 10,
        backgroundColor: '#EEBE68',
        alignItems: 'center',
        justifyContent: 'center'
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
    time: {
        fontSize: 13,
        textAlign: 'end'
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
    hrLine: {
        width: '100%',
        marginVertical: 15,
        height: 0.5,
        backgroundColor: '#ddd',
    },
});
