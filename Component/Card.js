import React, { useEffect, useState } from 'react'
import { View, Text, Image, StyleSheet } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import Comment from './Comment';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

export default function Card({ post, iduser, screen }) {

    const navigation = useNavigation();

    console.log({ post })

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

    const [liked, setLiked] = useState(false);
    const [disliked, setDisLiked] = useState(false);
    const [bookMark, setBookMark] = useState(false);
    const [likedCount, setLikedCount] = useState(0);
    const [dislikedCount, setDisLikedCount] = useState(0);
    const [commentCount, setcommentCount] = useState(0);

    useEffect(() => {

        const fetchData = async () => {
            const id = parseInt(iduser, 10);
            setIdLoggedInUser(id);

            //Liked
            axios.get(`https://localhost:7124/api/Like/IsLiked/${IdLoggedInUser}/${post.postId}`)
                .then((response) => {
                    setLiked(response.data)
                })
                .catch((error) => {
                    console.error('Error fetching data:', error);
                })
                
            axios.get(`https://localhost:7124/api/Like/GetLikeCountByPostId/${post.postId}`)
                .then((response) => {
                    setLikedCount(response.data)
                })
                .catch((error) => {
                    console.error('Error fetching data:', error);
                })
            //DisLiked
            axios.get(`https://localhost:7124/api/DisLike/IsDisLiked/${IdLoggedInUser}/${post.postId}`)
                .then((response) => {
                    setDisLiked(response.data)
                })
                .catch((error) => {
                    console.error('Error fetching data:', error);
                })
            axios.get(`https://localhost:7124/api/DisLike/GetDisLikeCountByPostId/${post.postId}`)
                .then((response) => {
                    setDisLikedCount(response.data)
                })
                .catch((error) => {
                    console.error('Error fetching data:', error);
                })
            //Comment
            axios.get(`https://localhost:7124/api/Comment/GetCommentCountByPostId/${post.postId}`)
                .then((response) => {
                    setcommentCount(response.data)
                })
                .catch((error) => {
                    console.error('Error fetching data:', error);
                })

            //BookMark
            axios.get(`https://localhost:7124/api/BookMark/IsBookMark/${IdLoggedInUser}/${post.postId}`)
                .then((response) => {
                    setBookMark(response.data)
                    console.log(response.data)
                    console.log(IdLoggedInUser)
                    console.log(post.postId)

                })
                .catch((error) => {
                    console.error('Error fetching data:', error);
                })
        }

        fetchData();
    }, [post.postId])

    const onDelete = (idPost) => {
        axios.delete(`https://localhost:7124/api/Post/DeletePost/${idPost}`)
            .then((response) => {
                console.log(response.data)
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

    const onDisLike = () => {

        const data = {
            idUser: IdLoggedInUser,
            idPost: postId
        }

        axios.post(`https://localhost:7124/api/DisLike/AddDisLike`, data)
            .then((response) => {
                console.log(response);
                setDisLiked(true);
                setDisLikedCount((prevDisLikedCount) => prevDisLikedCount + 1);
            })
            .catch((error) => {
                console.error(error);
            });
    }

    const unDisLike = () => {

        axios.delete(`https://localhost:7124/api/DisLike/unDisLike/${IdLoggedInUser}/${postId}`)
            .then((response) => {
                console.log(response);
                setDisLiked(false);
                setDisLikedCount((prevLikedCount) => prevLikedCount - 1);
            })
            .catch((error) => {
                console.error(error);
            });
    }

    const AddBookMark = () => {

        const data = {
            idUser: IdLoggedInUser,
            idPost: postId
        }

        axios.post(`https://localhost:7124/api/BookMark/AddBookMark/`, data)
            .then((response) => {
                console.log(response.data);
                setBookMark(true);
            })
            .catch((error) => {
                console.error(error);
            });
    }

    const unBookMark = () => {

        axios.delete(`https://localhost:7124/api/BookMark/unBookMark/${IdLoggedInUser}/${postId}`)
            .then((response) => {
                console.log(response);
                setBookMark(false);
            })
            .catch((error) => {
                console.error(error);
            });
    }

    return (
        <View>
            <View style={styles.card}>
                {/* <View style={{ width: '100%', alignItems: 'flex-end' }}>
                    {iduser == post.userId ? (
                        <MaterialCommunityIcons name="delete" color="#ccc" size={20} onPress={() => onDelete(postId)} />
                    ) : null}
                </View> */}
                <View style={styles.cardHeader}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', width: '60%' }}>

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
                    </View>

                    <View style={{ width: '40%' }}>
                        <View style={styles.infoLabel}>
                            <Text style={{ color: 'gray', fontSize:13 }}>Žanr: </Text>
                            <Text style={{ color: 'black',  fontSize:13 }}>{zanr}</Text>
                        </View>
                        <View style={styles.infoLabel}>
                            <Text style={{ color: 'gray',  fontSize:13 }}>Autor: </Text>
                            <Text style={{ color: 'black',  fontSize:13 }}>{autor}</Text>
                        </View>
                    </View>

                </View>

                <View style={styles.cardBody}>

                    <Text style={styles.infoLabel}>
                        <View style={{ textAlign: 'start', width: '100%' }}>
                            <Text style={{ color: 'black', fontSize: 16,  fontWeight: 'bold' }}>{naziv}</Text>
                        </View>
                    </Text>

                    <Text style={styles.infoLabel}>
                        <Text style={{ color: 'gray',  fontSize:13 }}>Moj dozivljaj: </Text>
                        <Text style={{ color: 'black', fontSize:13 }}>{opis}</Text>
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
                            <>
                                <MaterialCommunityIcons name="thumb-up" color="#DCAF5A" size={20} onPress={unLike} />
                                <Text style={{ color: '#000', fontSize:12, marginRight:5  }}>{likedCount}</Text>
                                <MaterialCommunityIcons name="thumb-down-outline" color="#DCAF5A" size={20} />
                                <Text style={{ color: '#000', fontSize:12, marginRight:5  }}>{dislikedCount}</Text>
                            </>

                        ):disliked ? (
                        <>
                            <MaterialCommunityIcons name="thumb-up-outline" color="#DCAF5A" size={20} />
                            <Text style={{ color: '#000', fontSize:12, marginRight:5  }}>{likedCount}</Text>
                            <MaterialCommunityIcons name="thumb-down" color="#DCAF5A" size={20} onPress={unDisLike} />
                            <Text style={{ color: '#000', fontSize:12, marginRight:5  }}>{dislikedCount}</Text>
                        </>
                        )
                        :(
                        <>
                            <MaterialCommunityIcons name="thumb-up-outline" color="#DCAF5A" size={20} onPress={onLike} />
                            <Text style={{ color: '#000', fontSize:12, marginRight:5  }}>{likedCount}</Text>
                            <MaterialCommunityIcons name="thumb-down-outline" color="#DCAF5A" size={20} onPress={onDisLike} />
                            <Text style={{ color: '#000', fontSize:12, marginRight:5  }}>{dislikedCount}</Text>                        
                        </>
                        )}
                        {/* <MaterialCommunityIcons name="heart" color="#F44336" size={30} onPress={unLike} /> */}
                        <MaterialCommunityIcons name="comment-multiple" color="#DCAF5A" size={20} 
                        onPress={() => navigation.replace('TabNavigator', { screen: 'Post', params: { postId: postId, screen: screen } })} />
                        <Text style={{ color: '#000', fontSize:12  }}>{commentCount}</Text>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        {
                            iduser != post.userId ? (
                                bookMark ? (
                                    <MaterialCommunityIcons name="bookmark-check" color="#323232" size={20} onPress={unBookMark} />
                                ) : (
                                    <MaterialCommunityIcons name="bookmark-multiple" color="#323232" size={20} onPress={AddBookMark} />
                                )
                            ) : null  
                        }
                        {iduser == post.userId ? (
                                <MaterialCommunityIcons name="delete" color="#aaa" size={20} onPress={() => onDelete(postId)} />
                            ) : null}
                    </View>
                </View>
            </View>
        </View >
    )
}


const styles = StyleSheet.create({
    card: {
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop:10,
        marginBottom: 30,
        borderRadius:10,
        position: 'relative',
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        width: '100%',
        paddingHorizontal:20,
    },
    cardBody: {
        marginBottom: 15,
        width: '100%',
        paddingHorizontal: 20,
        paddingBottom:10
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
        margin: 2
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
        width: '96%',
        height: 40,
        borderRadius: 50,
        // backgroundColor: '#788B96',
        backgroundColor:'#fff',
        borderWidth:2,
        borderColor:'#EEBE68',
        position: 'absolute',
        bottom: -20,
    },
});
