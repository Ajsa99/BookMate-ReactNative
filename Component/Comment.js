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

    const [text, setText] = useState('');


    useEffect(() => {
        async function fetchData() {
            try {

                const nickname = await AsyncStorage.getItem('NickName');
                const image = await AsyncStorage.getItem('Image');
            
                setImage(image);
                setNickName(nickname);

                const commentsResponse = await axios.get(`https://localhost:7124/api/Comment/GetCommentsByPostId/${postId}`);
                const comments = commentsResponse.data.reverse();
    
                // Napravite niz obećanja za lajkove i brojanje lajkova
                const likePromises = comments.map(async (comment) => {
                    try {
                        const isLikedCommentResponse = await axios.get(`https://localhost:7124/api/LikeComment/IsLikedComment/${iduser}/${comment.id}`);
                        const likecommentCountResponse = await axios.get(`https://localhost:7124/api/LikeComment/GetLikeCommentCountByCommentId/${comment.id}`);

                        const isDisLikedCommentResponse = await axios.get(`https://localhost:7124/api/DisLikeComment/IsDisLikedComment/${iduser}/${comment.id}`);
                        const dislikecommentCountResponse = await axios.get(`https://localhost:7124/api/DisLikeComment/GetDisLikeCommentCountByCommentId/${comment.id}`);
    
                        console.log("DisLike")
                        console.log(isDisLikedCommentResponse)
                        console.log(dislikecommentCountResponse)


                        // Dodajte likeCount u objekat komentara
                        const updatedComment = {
                            ...comment,
                            isLikedComment: isLikedCommentResponse.data,
                            likeCommentCount: likecommentCountResponse.data,
                            isDisLikedComment: isDisLikedCommentResponse.data,
                            dislikeCommentCount: dislikecommentCountResponse.data
                        };
    
                        return updatedComment;
                    } catch (error) {
                        console.error('Error fetching data:', error);
                    }
                });
    
                // Sačekajte da se sva obećanja završe pre nego što ažurirate stanje
                const updatedComments = await Promise.all(likePromises);
    
                // Ažurirajte stanje sa svim ažuriranim komentarima
                setData(updatedComments);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
    
        fetchData();
    }, [postId]);
    

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
                image: image,
                isLikedComment: false,
                likeCommentCount: 0,
                isDiSLikedComment: false,
                dislikeCommentCount: 0
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

    const onLikeComment = (idComment) => {

        const data = {
            idUser: iduser,
            idComment: idComment
        }

        try {
             axios.post(`https://localhost:7124/api/LikeComment/AddLikeComment`, data)
            .then((response) => {
                console.log(response);
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

    const unLikeComment =  (idComment) => {

        try {
            axios.delete(`https://localhost:7124/api/LikeComment/unLikeComment/${iduser}/${idComment}`)
            .then((response) => {
                console.log(response);
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

    const onDisLikeComment = (idComment) => {

        const data = {
            idUser: iduser,
            idComment: idComment
        }

        try {
             axios.post(`https://localhost:7124/api/DisLikeComment/AddDisLikeComment`, data)
            .then((response) => {
                console.log(response);
                setData((prevData) =>
                prevData.map((comment) =>
                    comment.id === idComment
                        ? { ...comment, isDisLikedComment: true, dislikeCommentCount: comment.dislikeCommentCount + 1 }
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

    const unDisLikeComment =  (idComment) => {

        try {
            axios.delete(`https://localhost:7124/api/DisLikeComment/unDisLikeComment/${iduser}/${idComment}`)
            .then((response) => {
                console.log(response);
                setData((prevData) =>
                prevData.map((comment) =>
                    comment.id === idComment
                        ? { ...comment, isDisLikedComment: false, dislikeCommentCount: comment.dislikeCommentCount - 1 }
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
                <TouchableOpacity onPress={() => submitComment(postId)}>
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
                            <View style={{alignItems:'flex-end',justifyContent:'center', flexDirection:'row'}}>

                              {comment.isLikedComment ? ( 
                              <>
                                <MaterialCommunityIcons name="thumb-up" color="#333" size={15} onPress={()=>unLikeComment(comment.id)} />
                                <Text  style={{ fontSize: 10, marginRight:5 }}>{comment.likeCommentCount}</Text>
                                <MaterialCommunityIcons name="thumb-down-outline" color="#333" size={15}/>
                                <Text  style={{ fontSize: 10 }}>{comment.dislikeCommentCount}</Text>
                              </>
                              ): comment.isDisLikedComment ? (
                                <>
                                 <MaterialCommunityIcons name="thumb-up-outline" color="#333" size={15}/>
                                 <Text  style={{ fontSize: 10, marginRight:5 }}>{comment.likeCommentCount}</Text>
                                <MaterialCommunityIcons name="thumb-down" color="#333" size={15} onPress={()=>unDisLikeComment(comment.id)} />
                                <Text  style={{ fontSize: 10 }}>{comment.dislikeCommentCount}</Text>
                              </>
                              ) : (
                              <>
                                <MaterialCommunityIcons name="thumb-up-outline" color="#333" size={15} onPress={()=>onLikeComment(comment.id)} />
                                <Text  style={{ fontSize: 10, marginRight:5 }}>{comment.likeCommentCount}</Text>
                                <MaterialCommunityIcons name="thumb-down-outline" color="#333" size={15} onPress={()=>onDisLikeComment(comment.id)} />
                                <Text  style={{ fontSize: 10}}>{comment.dislikeCommentCount}</Text>
                              </>  
                              )}
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


