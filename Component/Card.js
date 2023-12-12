import React, { useEffect, useState } from 'react'
import { View, Text, Image, StyleSheet, Pressable } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { Alert } from 'react-native';

export default function Card({ post, iduser, screen }) {

    const navigation = useNavigation();

    const [IdLoggedInUser, setIdLoggedInUser] = useState(iduser);
    const [NickName, setNickName] = useState(post.nickName);
    const [image, setImage] = useState(post.image);
    const [postId, setIdPost] = useState(post.postId);

    const [genre, setGenre] = useState(post.genre);
    const [name, setName] = useState(post.bookTitle);
    const [author, setAuthor] = useState(post.author);
    const [description, setDescription] = useState(post.experience);
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
            axios.get(`http://bookmate00-001-site1.atempurl.com/api/Like/IsLiked/${IdLoggedInUser}/${post.postId}`)
                .then((response) => {
                    setLiked(response.data)
                })
                .catch((error) => {
                    console.error('Error fetching data:', error);
                })
                
            axios.get(`http://bookmate00-001-site1.atempurl.com/api/Like/GetLikeCountByPostId/${post.postId}`)
                .then((response) => {
                    setLikedCount(response.data)
                })
                .catch((error) => {
                    console.error('Error fetching data:', error);
                })
            //DisLiked
            axios.get(`http://bookmate00-001-site1.atempurl.com/api/DisLike/IsDisLiked/${IdLoggedInUser}/${post.postId}`)
                .then((response) => {
                    setDisLiked(response.data)
                })
                .catch((error) => {
                    console.error('Error fetching data:', error);
                })
            axios.get(`http://bookmate00-001-site1.atempurl.com/api/DisLike/GetDisLikeCountByPostId/${post.postId}`)
                .then((response) => {
                    setDisLikedCount(response.data)
                })
                .catch((error) => {
                    console.error('Error fetching data:', error);
                })
            //Comment
            axios.get(`http://bookmate00-001-site1.atempurl.com/api/Comment/GetCommentCountByPostId/${post.postId}`)
                .then((response) => {
                    setcommentCount(response.data)
                })
                .catch((error) => {
                    console.error('Error fetching data:', error);
                })

            //BookMark
            axios.get(`http://bookmate00-001-site1.atempurl.com/api/BookMark/IsBookMark/${IdLoggedInUser}/${post.postId}`)
                .then((response) => {
                    setBookMark(response.data)
                })
                .catch((error) => {
                    console.error('Error fetching data:', error);
                })
        }

        fetchData();
    }, [post.postId])


    const onDelete = (idPost) => {

        Alert.alert(
            "Confirmation",
            "Are you sure you want to delete this post?",
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Post deletion canceled."),
                    style: "cancel"
                },
                {
                    text: "OK",
                    onPress: () => {

                        axios.delete(`http://bookmate00-001-site1.atempurl.com/api/Post/DeletePost/${idPost}`)
                            .then((response) => {
                                console.log(response.data);
                            })
                            .catch((error) => {
                                console.error(error);
                            });
                    }
                }
            ],
            { cancelable: false }
        );
    };


    const onLike = () => {

        const data = {
            idUser: IdLoggedInUser,
            idPost: postId
        }

        axios.post(`http://bookmate00-001-site1.atempurl.com/api/Like/AddLike`, data)
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

        axios.delete(`http://bookmate00-001-site1.atempurl.com/api/Like/unLike/${IdLoggedInUser}/${postId}`)
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

        axios.post(`http://bookmate00-001-site1.atempurl.com/api/DisLike/AddDisLike`, data)
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

        axios.delete(`http://bookmate00-001-site1.atempurl.com/api/DisLike/unDisLike/${IdLoggedInUser}/${postId}`)
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

        axios.post(`http://bookmate00-001-site1.atempurl.com/api/BookMark/AddBookMark/`, data)
            .then((response) => {
                console.log(response.data);
                setBookMark(true);
            })
            .catch((error) => {
                console.error(error);
            });
    }

    const unBookMark = () => {

        axios.delete(`http://bookmate00-001-site1.atempurl.com/api/BookMark/unBookMark/${IdLoggedInUser}/${postId}`)
            .then((response) => {
                console.log(response);
                setBookMark(false);
            })
            .catch((error) => {
                console.error(error);
            });
    }
    

    return (
            <View style={styles.card}>
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
                            <Text style={{ color: 'gray', fontSize:12 }}>Genre: </Text>
                            <Text style={{ color: 'black',  fontSize:14 }}>{genre}</Text>
                        </View>
                        <View style={styles.infoLabel}>
                            <Text style={{ color: 'gray',  fontSize:12 }}>Author: </Text>
                            <Text style={{ color: 'black',  fontSize:14 }}>{author}</Text>
                        </View>
                    </View>

                </View>

                <View style={styles.cardBody}>

                    <Text style={styles.infoLabel}>
                        <View style={{ textAlign: 'start', width: '100%' }}>
                            <Text style={{ color: 'black', fontSize: 16,  fontWeight: 'bold' }}>{name}</Text>
                        </View>
                    </Text>

                    <Text style={styles.infoLabel}>
                        <Text style={{ color: 'gray',  fontSize:12 }}>My impression: </Text>
                        <Text style={{ color: 'black', fontSize:14 }}>{description}</Text>
                    </Text>
                    <Text style={styles.time}>
                        <Text style={{ color: 'gray', fontSize:12 }}>{createdAt}</Text>
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
                                <Pressable onPress={unLike} >
                                <MaterialCommunityIcons name="thumb-up" color="#DCAF5A" size={20} />
                                </Pressable>
                                <Text style={{ color: '#000', fontSize:12, marginRight:10  }}>{likedCount}</Text>
                                <MaterialCommunityIcons name="thumb-down-outline" color="#DCAF5A" size={20} />
                                <Text style={{ color: '#000', fontSize:12, marginRight:10  }}>{dislikedCount}</Text>
                            </>

                        ):disliked ? (
                        <>
                            <MaterialCommunityIcons name="thumb-up-outline" color="#DCAF5A" size={20} />
                            <Text style={{ color: '#000', fontSize:12, marginRight:10  }}>{likedCount}</Text>
                            <Pressable onPress={unDisLike} >
                            <MaterialCommunityIcons name="thumb-down" color="#DCAF5A" size={20}/>
                            </Pressable>
                            <Text style={{ color: '#000', fontSize:12, marginRight:10  }}>{dislikedCount}</Text>
                        </>
                        )
                        :(
                        <>
                            <Pressable onPress={onLike}>
                                <MaterialCommunityIcons name="thumb-up-outline" color="#DCAF5A" size={20} />
                            </Pressable>
                            <Text style={{ color: '#000', fontSize:12, marginRight:10  }}>{likedCount}</Text>
                            <Pressable onPress={onDisLike}>
                            <MaterialCommunityIcons name="thumb-down-outline" color="#DCAF5A" size={20} />
                            </Pressable>
                            <Text style={{ color: '#000', fontSize:12, marginRight:10  }}>{dislikedCount}</Text>                        
                        </>
                        )}
                        <Pressable onPress={() => navigation.replace('TabNavigator', { screen: 'Post', params: { postId: postId, screen: screen } })} >
                            <MaterialCommunityIcons name="comment-multiple" color="#DCAF5A" size={20} />
                        </Pressable>
                        <Text style={{ color: '#000', fontSize:12  }}>{commentCount}</Text>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        {
                            iduser != post.userId ? (
                                bookMark ? (
                                    <Pressable onPress={unBookMark}>
                                        <MaterialCommunityIcons name="bookmark-check" color="#323232" size={20} />
                                    </Pressable>
                                ) : (
                                    <Pressable onPress={AddBookMark}>
                                        <MaterialCommunityIcons name="bookmark-multiple" color="#323232" size={20} />
                                    </Pressable>
                                )
                            ) : null  
                        }
                        {iduser == post.userId ? (
                                <MaterialCommunityIcons name="delete" color="#aaa" size={20} onPress={() => onDelete(postId)} />
                            ) : null}
                    </View>
                </View>
            </View>
    )
}


const styles = StyleSheet.create({
    card: {
        borderBottomWidth:2,
        borderBottomColor:'#EEBE68',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop:10,
        marginBottom: 25,
        position: 'relative',
        backgroundColor:'#fff'
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
        fontSize: 16,
        fontWeight: 'bold',

    },
    infoLabel: {
        fontSize: 13,
        flexDirection: 'row',
        marginVertical: 5,
        alignItems:'flex-end'

    },
    time: {
        textAlign: 'right'
    },
    bottomLine: {
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        paddingLeft: 20,
        paddingRight: 20,
        width: '96%',
        height: 30,
        borderRadius: 50,
        backgroundColor:'#fff',
        borderWidth:2,
        borderColor:'#EEBE68',
        position: 'absolute',
        bottom: -15,
    },
});
