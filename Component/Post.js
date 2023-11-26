import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, ScrollView, Image, ImageBackground } from 'react-native';
import { Header } from 'react-native-elements';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import moment from 'moment';
import Comment from './Comment';

const Post = ({ navigation, route }) => {

    const { postId, screen } = route.params;

    console.log({postId})

    const [post, setPost] = useState([]);

    const [IdLoggedInUser, setIdLoggedInUser] = useState(0);
    const [createdAt, setCreatedAt] = useState(null);

    const [liked, setLiked] = useState(false);
    const [disliked, setDisLiked] = useState(false);
    const [bookMark, setBookMark] = useState(false);
    const [likedCount, setLikedCount] = useState(0);
    const [dislikedCount, setDisLikedCount] = useState(0);
    const [commentCount, setcommentCount] = useState(0);

    useEffect(() => {

        const fetchData = async () => {
            const IdUser = await AsyncStorage.getItem('Id');
            const idLogged = parseInt(IdUser, 10);
            console.log(IdUser)
            setIdLoggedInUser(idLogged);

            //Post
            axios.get(`https://localhost:7124/api/Post/GetPostsUsers/${postId}`)
                .then((response) => {
                    console.log(response.data);
                    setPost(response.data);
                    setCreatedAt(
                        moment(response.data.createdAt).fromNow()
                    );
                })
                .catch((error) => {
                    console.error('Error fetching data:', error);
                })
            //Like
            axios.get(`https://localhost:7124/api/Like/IsLiked/${idLogged}/${postId}`)
                .then((response) => {
                    setLiked(response.data)
                })
                .catch((error) => {
                    console.error('Error fetching data:', error);
                })
            axios.get(`https://localhost:7124/api/Like/GetLikeCountByPostId/${postId}`)
                .then((response) => {
                    setLikedCount(response.data)
                })
                .catch((error) => {
                    console.error('Error fetching data:', error);
                })
            //DisLike
            axios.get(`https://localhost:7124/api/DisLike/IsDisLiked/${idLogged}/${postId}`)
                .then((response) => {
                    setDisLiked(response.data)
                })
                .catch((error) => {
                    console.error('Error fetching data:', error);
                })
            axios.get(`https://localhost:7124/api/DisLike/GetDisLikeCountByPostId/${postId}`)
                .then((response) => {
                    setDisLikedCount(response.data)
                })
                .catch((error) => {
                        console.error('Error fetching data:', error);
                })
            //Comment
            axios.get(`https://localhost:7124/api/Comment/GetCommentCountByPostId/${postId}`)
                .then((response) => {
                    setcommentCount(response.data)
                })
                .catch((error) => {
                    console.error('Error fetching data:', error);
                })
            //BookMark
            axios.get(`https://localhost:7124/api/BookMark/IsBookMark/${idLogged}/${postId}`)
                .then((response) => {
                    setBookMark(response.data)
                    console.log()
                    console.log(response.data)
                    console.log(id)
                    console.log(postId)

                })
                .catch((error) => {
                    console.error('Error fetching data:', error);
                })


        }

        fetchData();
    }, [postId]);

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

    return (
        <ScrollView contentContainerStyle={styles.scroll}>

            <ImageBackground
                style={styles.backgroundImage}
                source={require('../assets/images/CrimeGenre.png')}
            ></ImageBackground>
           <View style={styles.overlay}>
           <Text style={styles.textGenre}>{post.genre}</Text>
                {/* <MaterialCommunityIcons name="bookmark-check" color="#FFF" size={20} style={{position:'absolute', right:20}}/> */}
                {
                    IdLoggedInUser != post.userId ? (
                        bookMark ? (
                            <MaterialCommunityIcons name="bookmark-check" color="#fff" size={20} style={{position:'absolute', right:20}} onPress={unBookMark} />
                            
                        ) : (
                            <MaterialCommunityIcons name="bookmark-multiple" color="#fff" size={20} style={{position:'absolute', right:20}} onPress={AddBookMark} />
                        )
                    ) : null  
                }
           </View>

            <Header
                placement="left"
                leftComponent={
                    <>
                        <MaterialCommunityIcons name="chevron-left" color="#333" size={18}
                        onPress={() => navigation.replace('TabNavigator', { screen: screen, params: { id: post.userId, screen: screen } })} />
                    </>
                    
                }
                centerComponent={
                    <View style={{ flexDirection: 'row', alignItems:'flex-end' }}>

                    {/* <MaterialCommunityIcons name="thumb-up" color="#DCAF5A" size={20} />
                    <Text style={{ fontSize: 13, marginRight: 5 }}>{likedCount}</Text>
                    <MaterialCommunityIcons name="thumb-down-outline" color="#DCAF5A" size={20} />
                    <Text style={{ fontSize: 13, marginRight: 5 }}>{dislikedCount}</Text> */}
                    
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
                        <Text style={{ color: '#000', fontSize:12, marginRight: 5  }}>{dislikedCount}</Text>
                    </>
                    )
                    :(
                    <>
                        <MaterialCommunityIcons name="thumb-up-outline" color="#DCAF5A" size={20} onPress={onLike} />
                        <Text style={{ color: '#000', fontSize:12, marginRight:5  }}>{likedCount}</Text>
                        <MaterialCommunityIcons name="thumb-down-outline" color="#DCAF5A" size={20} onPress={onDisLike} />
                        <Text style={{ color: '#000', fontSize:12, marginRight:5  }}>{dislikedCount}</Text>                        </>
                    )}


                    <MaterialCommunityIcons name="comment" color="#DCAF5A" size={20} />
                    <Text style={{ fontSize: 12 }}>{commentCount}</Text>
                </View>
                }
                rightComponent={
                    <Text style={{ color: 'gray', fontSize: 12, paddingRight:10 }}>{createdAt}</Text>
                }
                containerStyle={{ backgroundColor: '#fff' }} />    
                
            <View style={styles.container}>

            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', paddingVertical:20}}>
                {post.image ? (
                    <Image
                        source={{ uri: post.image }}
                        style={styles.slika}
                    />
                ) : (
                    <View
                        style={styles.icon}>
                        <Ionicons name="person-outline" size={25} color="#666" />
                    </View>
                )}
                <View style={{ flexDirection: 'column', paddingLeft:10 }}>
                    <Text style={styles.ime}>{post.firstName} {post.lastName}</Text>
                    <Text style={{ fontSize: 13, color: '#9F8F8F' }}>{post.nickName}</Text>
                </View>
            </View>

            <View>
                <Text style={{ fontSize: 25, fontWeight: 'bold' }}>Preporuke knjige</Text>
                <Text style={{ fontSize: 16, marginTop:10 }}>{post.bookTitle}</Text>
                <Text style={{ fontSize: 16, color:'#656565',marginTop:5 }}>{post.author}</Text>
                <Text style={{ marginVertical: 20, fontSize: 14, color:'#656565' }}>{post.experience}</Text>
                <Text 
                style={{ fontSize: 12, color:'#1b5ca1'}} 
                onPress={() => navigation.replace('TabNavigator', { screen: 'LikedList', params: { postId: post.postId, screen: screen } })}
                >view {likedCount} likes</Text>
                {/* <Comment postId={post.postId} iduser={IdLoggedInUser} setcommentCount={setcommentCount} screen={screen}  /> */}
                {post && post.postId && (
                <Comment postId={post.postId} iduser={IdLoggedInUser} setcommentCount={setcommentCount} screen={screen} />
                )}

            </View>
            </View>
        </ScrollView >
    )
}

export default Post


const styles = StyleSheet.create({
    scroll: {
        flex: 1,
        justifyContent: 'flex-start',
        backgroundColor: '#fff',
        position:'relative'
    },
    container: {
        paddingHorizontal: 20,
        backgroundColor:'white'
    },
    slika: {
        width: 60,
        height: 60,
        borderRadius: 30,
    },
    icon: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#EEBE68',
        alignItems: 'center',
        justifyContent: 'center'
    },
    ime: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    backgroundImage: {
        width: '100%',
        height:'40vh',
        resizeMode: 'cover',
    },
    overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        width: '100%',
        height:'40vh',
        position:'absolute',
        justifyContent:'center',
        alignItems:'center',
    },
    textGenre:{
        color:'#fff',
        fontSize:25,
        fontWeight:'bold'
    }
});