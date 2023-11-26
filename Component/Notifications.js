// import React, { useEffect, useState } from "react";
// import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
// import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
// import axios from "axios";

// export default function Notifications() {
//     const [hubConnection, setHubConnection] = useState(null);
//     const [text, setText] = useState("");
//     const [messageList, setMessageList] = useState([]);
//     const [followResult, setFollowResult] = useState(null);

//     useEffect(() => {
//         createHubConnection();
//     }, [])

//     const createHubConnection = async () => {
//         const hubConnection = new HubConnectionBuilder().withUrl("https://localhost:7124/notifications").build();

//         console.log("Pokušavam da uspostavim vezu...");

//         try {
//             await hubConnection.start();
//             console.log("Vezanje uspešno pokrenuto");
//         } catch (e) {
//             console.log("Greška prilikom pokretanja veze:", e);
//         }

//         setHubConnection(hubConnection);
//     }

//     useEffect(() => {
//         if (hubConnection) {
//             hubConnection.on("ReceiveMessage", (message) => {
//                 setMessageList((prevState => {
//                     return prevState.concat(message);
//                 }))
//             });

//             // hubConnection.on("ReceiveFollowNotification", (notification) => {
//             //     setMessageList((prevState) => {
//             //         return prevState.concat(notification);
//             //     });
//             // });

//             hubConnection.on("ReceiveFollowNotification", (notification) => {
//                 setMessageList((prevState) => {
//                     return prevState.concat(`${notification} started following you (ID: ${followerInfo.Id}).`);
//                 });
//             });
//         }
//     }, [hubConnection])

//     const sendMSG = async () => {
//         if (hubConnection) {
//             setText("");
//             await hubConnection.invoke("SendMessage", text);
//         }
//     }

//     const Following = () => {
//         const data = {
//             followers: 4,
//             following: 2,
//         };

//         axios.post('https://localhost:7124/api/Followover/AddFollowover', data)
//             .then((response) => {
//                 // Pozovi obaveštenje o praćenju
//                 hubConnection.invoke("SendFollowNotification", "4", "ImePratitelja")
//                     .then(() => {
//                         console.log("Follow notification sent successfully");
//                         // setFollowResult("Following successful!");
//                     })
//                     .catch((error) => {
//                         console.error("Error sending follow notification:", error);
//                         setFollowResult("Error following user.");
//                     });
//             })
//             .catch((error) => {
//                 console.error("Error adding followover:", error);
//                 setFollowResult("Error following user.");
//             });
//     }

//     return (
//         <View style={styles.container}>
//             <TextInput
//                 style={styles.input}
//                 value={text}
//                 onChangeText={(text) => setText(text)}
//                 placeholder="Enter your message"
//             />
//             <TouchableOpacity onPress={sendMSG}>
//                 <Text>Send message</Text>
//             </TouchableOpacity>

//             <Text>Message List:</Text>
//             <View>
//                 {messageList.map((item, index) => (
//                     <View key={index}>
//                         <Text>{item}</Text>
//                     </View>
//                 ))}
//             </View>

//             <TouchableOpacity
//                 onPress={Following}
//                 style={{ backgroundColor: 'red', padding: 20 }}
//             >
//                 <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
//                     <Text style={{ fontSize: '15' }}>Zaprati</Text>
//                 </View>
//             </TouchableOpacity>

//             {followResult && <Text>{followResult}</Text>}
//         </View>
//     )
// }

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         alignItems: 'center',
//         justifyContent: 'flex-start',
//         backgroundColor: '#fff'
//     },
//     input: {
//         height: 40,
//         borderColor: 'gray',
//         borderWidth: 1,
//         marginBottom: 10,
//         padding: 10,
//         width: '80%'
//     },
// });


import React, { useEffect, useState } from "react";
import { View, Text } from 'react-native';
import { HubConnectionBuilder } from '@microsoft/signalr';

export default function Notifications() {
    const [hubConnection, setHubConnection] = useState(null);

    useEffect(() => {
        createHubConnection();
    }, []);

    const createHubConnection = async () => {
        const hubConnection = new HubConnectionBuilder().withUrl("https://localhost:7124/notifications").build();

        try {
            await hubConnection.start();
            console.log("Connected to SignalR Hub");
        } catch (e) {
            console.log("Error connecting to SignalR Hub:", e);
        }

        setHubConnection(hubConnection);
    }

    useEffect(() => {
        if (hubConnection) {
            hubConnection.on("ReceiveFollowNotification", (followerInfo) => {
                console.log(`${followerInfo.Name} started following you (ID: ${followerInfo.Id}).`);
            });
        }
    }, [hubConnection]);

    return (
        <View>
            <Text>Notifications Component</Text>
        </View>
    );
}
