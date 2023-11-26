import axios from "axios";
import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, TextInput, Image, FlatList } from "react-native";
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TouchableOpacity } from 'react-native-gesture-handler';
import moment from 'moment';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function Comment({ postId, iduser, setcommentCount, screen }) {

    console.log('comment')
    console.log({postId})
    const [nickName, setNickName] = useState('');
    const [image, setImage] = useState('');
    const [data, setData] = useState([]);

    const [likedComment, setLikedComment] = useState(false);
    const [likedCommentCount, setLikedCommentCount] = useState(0);

    const [text, setText] = useState('');

    useEffect(() => {

        async function fetchData() {

            const nickname = await AsyncStorage.getItem('NickName');
            const image = await AsyncStorage.getItem('Image');

            setImage(image);
            setNickName(nickname);

            await axios.get(`https://localhost:7124/api/Comment/GetCommentsByPostId/${postId}`)
                .then((response) => {
                    setData(response.data.reverse());
                    console.log('GetCommentsByPostId');

                    response.data.map(comment => {
                        //LikeComment
                        axios.get(`https://localhost:7124/api/LikeComment/IsLikedComment/${iduser}/${comment.id}`)
                            .then((res) => {
                                // setLikedComment(res.data)
                                console.log('IsLikedComment')
                                console.log(res.data)
                            })
                            .catch((error) => {
                                console.error('Error fetching data:', error);
                            })
                        axios.get(`https://localhost:7124/api/LikeComment/GetLikeCommentCountByCommentId/${comment.id}`)
                            .then((res) => {
                                // setLikedCommentCount(res.data)
                                console.log('GetLikeCommentCountByCommentId')
                            })
                            .catch((error) => {
                                console.error('Error fetching data:', error);
                            })


                    });
                })
            }

        fetchData()
    }, [postId])

    // useEffect(() => {
    //     async function fetchData() {
    //         try {
    //             const commentsResponse = await axios.get(`https://localhost:7124/api/Comment/GetCommentsByPostId/${postId}`);
    //             const comments = commentsResponse.data.reverse();
    
    //             // Napravite niz obećanja za lajkove i brojanje lajkova
    //             const likePromises = comments.map(async (comment) => {
    //                 try {
    //                     const isLikedCommentResponse = await axios.get(`https://localhost:7124/api/LikeComment/IsLikedComment/${iduser}/${comment.id}`);
    //                     const likecommentCountResponse = await axios.get(`https://localhost:7124/api/LikeComment/GetLikeCommentCountByCommentId/${comment.id}`);
    
    //                     // Dodajte likeCount u objekat komentara
    //                     const updatedComment = {
    //                         ...comment,
    //                         isLikedComment: isLikedCommentResponse.data,
    //                         likeCommentCount: likecommentCountResponse.data
    //                     };
    
    //                     return updatedComment;
    //                 } catch (error) {
    //                     console.error('Error fetching data:', error);
    //                 }
    //             });
    
    //             // Sačekajte da se sva obećanja završe pre nego što ažurirate stanje
    //             const updatedComments = await Promise.all(likePromises);
    
    //             // Ažurirajte stanje sa svim ažuriranim komentarima
    //             setData(updatedComments);
    //         } catch (error) {
    //             console.error('Error fetching data:', error);
    //         }
    //     }
    
    //     fetchData();
    // }, [postId]);
    

    const submitComment = async (idPost) => {
        const data = {
            idUser: iduser,
            idPost: idPost,
            text: text,
        }

        try {
            const response = await axios.post('https://localhost:7124/api/Comment/AddComment', data);

            // // Povećaj commentCount kada se doda novi komentar
            setcommentCount((prevCommentCount) => prevCommentCount + 1);

            // // Dobijanje novog ID-a komentara iz odgovora servera
            const newCommentId = response.data.id;

            // // Dodajte novi komentar u lokalno stanje
            const newComment = {
                id: newCommentId,
                idUser: iduser,
                idPost: idPost,
                text: text,
                nickName: nickName,
                image: image
            };

            console.log({newComment})

            setData(prevData => Array.isArray(prevData) ? [newComment, ...prevData] : [newComment]);

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

    const onLikeComment = async (idComment) => {

        const data = {
            idUser: iduser,
            idComment: idComment
        }

        try {
        await axios.post(`https://localhost:7124/api/LikeComment/AddLikeComment`, data)
            .then((response) => {
                console.log(response);
                // setLiked(true);
                // setLikedCount((prevLikedCount) => prevLikedCount + 1);
                setData((prevData) =>
                prevData.map((comment) =>
                    comment.id === idComment
                        ? { ...comment, isLikedComment: true, likeCommentCount: comment.likeCommentCount + 1 }
                        : comment
                )
            );
            })
            .catch((error) => {
                console.error(error);
            });
        } catch (error) {
            console.error('Greška prilikom lajkovanja komentara', error);
        }
    }

    const unLikeComment = async (idComment) => {

        try {
            await axios.delete(`https://localhost:7124/api/LikeComment/unLikeComment/${iduser}/${idComment}`)
            .then((response) => {
                console.log(response);
                // setLiked(false);
                // setLikedCount((prevLikedCount) => prevLikedCount - 1);
                setData((prevData) =>
                prevData.map((comment) =>
                    comment.id === idComment
                        ? { ...comment, isLikedComment: false, likeCommentCount: comment.likeCommentCount - 1 }
                        : comment
                )
            );
            })
            .catch((error) => {
                console.error(error);
            });
        } catch (error) {
            console.error('Greška prilikom lajkovanja komentara', error);
        }
    }

    return (
        <View style={styles.comment}>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    onChangeText={(text) => setText(text)}
                    placeholder="Dodaj komentar..."
                    placeholderTextColor='#aaa'
                    multiline={true} // Postavka za više redova
                    numberOfLines={4} // Možete postaviti broj redova koje želite prikazati unapred
                />
                <TouchableOpacity onPress={() => submitComment(post.postId)}>
                    {/* <Ionicons name="paper-plane" size={15} color="#555" /> */}
                    <MaterialCommunityIcons name="lightbulb-on-outline" color="#1b5ca1" size={20} />
                </TouchableOpacity>
            </View>

            {data.length !== 0 ? (
                <Text style={styles.commentHeading}>Komentari</Text>
            ):null}  

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
                        <View style={{ flexDirection:'row', alignItems:'center' ,justifyContent:'space-between'}}>
                            <Text style={styles.commentUser}>{comment.nickName}</Text>
                            <Text style={{ fontSize: 10, color: '#aaa'}}>{moment(comment.createdAt).fromNow()}</Text>
                            <View style={{alignItems:'center',justifyContent:'center', flexDirection:'row'}}>
                              {/* {comment.isLikedComment ? ( 
                              <>
                                <MaterialCommunityIcons name="thumb-up" color="#333" size={15} onPress={unLikeComment(comment.id)} />
                                <Text  style={{ fontSize: 10, marginRight: 5 }}>{comment.likeCommentCount}</Text>
                              </>
                              ) :(
                              <>
                                <MaterialCommunityIcons name="thumb-up-outline" color="#333" size={15} onPress={onLikeComment(comment.id)} />
                                <Text  style={{ fontSize: 10, marginRight: 5 }}>{comment.likeCommentCount}</Text>
                              </>  
                              )} */}
                                <MaterialCommunityIcons name="thumb-down-outline" color="#333" size={15} />
                                <Text  style={{ fontSize: 10 }}>12</Text>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={{ color:'#656565', fontSize:13}}>{comment.text}</Text>
                        </View>
                        {comment.idUser == iduser ? (
                        <View style={{ alignItems: 'end' }}>
                            <TouchableOpacity onPress={() => DeleteComment(comment.id)}>
                                <Text style={{ fontSize: 10, color: '#1b5ca1' }}>Delete</Text>
                            </TouchableOpacity>
                        </View>
                         ) : null}
                         
                    </View>
                </View>
            ))}
        </View>
    )
}

const styles = StyleSheet.create({
    comment: {
        flexDirection: 'column',
        backgroundColor: '#fff',
    },
    commentHeading: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    userComm: {
        width:'100%',
        marginVertical: 10,
        flexDirection: 'row',
        alignItems: 'flex-start',

    },
    commentText: {
        flex: 1,
        paddingHorizontal: 10,
    },
    slika: {
        width: 40,
        height: 40,
        borderRadius: 50,
        marginTop:5
    },
    iconComm: {
        width: 40,
        height: 40,
        borderRadius: 50,
        backgroundColor: '#EEBE68',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop:5
    },
    inputContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-start',
        width: '100%',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        paddingRight: 5,
        paddingTop:5,
        marginVertical:5
    },
    input: {
        width: '100%',
        padding: 5,
        fontSize: 10,
        textAlign: 'start',
    },

});


