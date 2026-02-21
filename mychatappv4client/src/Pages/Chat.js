import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useState, useRef, useEffect } from "react";
import styles from '../styles/ChatPage.module.css';
import { useNavigate } from "react-router-dom";
import SockJS from 'sockjs-client'; 
// SockJS-client is a JavaScript library that provides a WebSocket-like interface for creating low-latency, full-duplex, cross-domain communication channels between a browser and a web server.
import { Stomp } from '@stomp/stompjs';
// STOMP.js is a fully-fledged STOMP over WebSocket library for browsers and Node.js, providing seamless integration with STOMP protocol-compliant messaging brokers.
// What is STOMP?
// STOMP is a simple and easy-to-implement messaging protocol that allows clients to communicate with any STOMP-compliant message broker. 
// It provides a standardized wire format for messaging, making it possible for applications written in different programming languages to interact seamlessly. 
// STOMP is particularly useful in scenarios where messaging systems need to be integrated across various platforms and technologies.


function Chat({selectedUser, profile, onBack})
{
    const [messages, setMessages] = useState([]);
    const [newMessages, setNewMessages] = useState("");
    const stompClientRef = useRef(null);
    const [loggedInUser, setLoggedInUser] = useState("");
    // const [selectedUser, setSelectedUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => // Decode JWT to get currentUser username
    {
        const token = localStorage.getItem("token");
        if(token)
        {
            try
            {
                const decoded = jwtDecode(token);
                setLoggedInUser(decoded.sub);
                console.log('decode.sub ',decoded);
            }
            catch(error)
            {
                console.log('Error occured during token decoding' ,error);
            }
        }
    }, []);

    useEffect(()=>  // Fetch previous messages between currentUser and user
    {
        const fetchMessages = async()=>
        {
            if(loggedInUser && selectedUser)
            {
                try
                {
                    const token = localStorage.getItem("token");
                    if(token)
                    {
                        const response = await axios.get(`http://localhost:8080/api/messages?sender=${loggedInUser}&receiver=${selectedUser}`,
                            {headers: { Authorization: `Bearer ${token}` }}
                        );
                        console.log("Retrieved Messages: ",response.data);
                        
                        const sortedData = response.data.sort(
                            (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
                        );
                        setMessages(sortedData);
                    }
                    else
                    {
                        console.log("No token found. User might not be logged in.");
                        navigate('/login'); // Redirect to login if no token is found
                    }
                }
                catch(error)
                {
                    console.log("error fetching messages!", error);
                }
            }
        }   
        fetchMessages();
    }, [loggedInUser, selectedUser]);

    useEffect(()=>  // WebSocket connection setup
    {
        const connect = ()=>
        {
            try
            {
                // const token = localStorage.getItem("tokean");
                console.log('trying to connect...');
                const socket = new SockJS(`http://localhost:8080/ws`,
                    // { headers: { Authorization: `Bearer ${token}`}}
                );
                const stompClient = Stomp.over(socket);
                stompClientRef.current = stompClient;
                stompClient.connect({}, ()=> 
                {
                    console.log("Conected to WebSocket.");
                    // Subscribe to messages for current user
                    stompClient.subscribe(`/topic/messages/${loggedInUser}`, (message)=>
                    {
                        const receivedMessage = JSON.parse(message.body);
                        console.log("Received message: ",receivedMessage);

                        // check if the mesasge is between the current user and the selected user
                        if((receivedMessage.sender === selectedUser.username && receivedMessage.receiver === loggedInUser) ||
                        (receivedMessage.sender === loggedInUser && receivedMessage.receiver === selectedUser.username))
                        {
                            setMessages((prevMessages) => 
                            {
                                const exists = prevMessages.some(msg => msg.id === receivedMessage.id);
                                return exists ? prevMessages : [...prevMessages, receivedMessage];
                            });
                        }
                    });
                }, 
                (error)=>
                {
                    console.log("WebSocket connection error: ", error);
                });
            }
            catch(error)
            {
                console.log("WebSocket connection error: ", error);
            }
        };
        if(loggedInUser && selectedUser)
        {
            connect();
        }
        // Cleanup on component unmount
        return ()=>
        {
            if(stompClientRef.current)
            {
                stompClientRef.current.disconnect(()=>
                {
                    console.log("Disconnected from WebSocket.");
                });
            }
        };
    }, [loggedInUser, selectedUser]);
    // Handle sending new messages
    const handleSendMessage = ()=>
    {
        if(newMessages.trim() === "") return;
        const messageObject = {
            // id: Date.now(), // Temporary ID, replace with server-generated ID if needed
            sender: loggedInUser,
            receiver: selectedUser,
            message: newMessages,
            timestamp: new Date().toISOString()
        }
        console.log("messageObject:" ,messageObject);
        
        // Send the new message via WebSocket
        if(stompClientRef.current && stompClientRef.current.connected)
        {                                                                               // Spring automatically converts JSON to Java object.
            stompClientRef.current.send("/app/chat", {}, JSON.stringify(messageObject));// body needs to be in JSON format for de-serialization to take place.
            console.log("sent message", messageObject);
            console.log("sent message", JSON.stringify(messageObject));

            // prevents duplicate messages in the UI by checking if the message already exists before adding it to the state.
            setMessages((prevMessages) => {
                const exists = prevMessages.some((msg)=>(msg.timestamp === messageObject.timestamp));
                return exists ? prevMessages : [...prevMessages, messageObject];
            });
            setNewMessages("");
        }
        else
        {
            console.log("Stomp Client is not connected. Unable to send message.");
        }
    };

    const formatChatTime = (timestamp)=>
    {
        const date = new Date(timestamp);
        return date.toLocaleTimeString('en-US',
            {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            }
        );
    };

    return(
    <div className={styles.chatContainer}>
        <div className={styles.chatBar}>
            <div className={styles.profilePic}>
                <img src={profile} alt="avatar.jpg"></img>
            </div>
            <div className={styles.profileName}>{selectedUser}</div>
        </div>
        <div className={styles.chatMessages}>
            {/* <div className={styles.senderBox}>
                hey how are you doing?
                <p className={styles.timestamp}>10:00 pm</p>
            </div> */}
            {/* <div className={styles.receiverBox}>
                I'm doing good, how about you?It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).
                <p className={styles.timestamp}>10:00 pm</p>
            </div>
            <div className={styles.senderBox}>
                hey how are you doing? Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                <p className={styles.timestamp}>10:00 pm</p>
            </div>
            <div className={styles.receiverBox}>
                I'm doing good, how about you? dgsdgsdggsgdgcbcvkukhjkkukhnmliuow4tqwewmbn vbnetx ghgfjj kgl wfesfgefg hgfh hgj nijlbug vygvygb nnknkj nin ouh okj njkmo moj in nn nu u
                <p className={styles.timestamp}>10:00 pm</p>
            </div><div className={styles.senderBox}>
                hey how are you doing?
                <p className={styles.timestamp}>10:00 pm</p>
            </div> */}
            {/* <div className={styles.receiverBox}>
                I'm doing good, how about you? so will you be coming tonight? to the party? I'm expecting you..
                <p className={styles.timestamp}>10:00 pm</p>
            </div>
            <div className={styles.senderBox}>
                hey how are you doing?
                <p className={styles.timestamp}>10:00 pm</p>
            </div> */}
            {messages.map((e)=>
            (
                <div key={e.id} className={styles.senderBox}>
                    {e.message}
                    <p className={styles.timestamp}>{formatChatTime(e.timestamp)}</p>
                </div>
            ))}

        </div>
        <div className={styles.textContainer}>
            <button className={styles.emojiButton}>:)</button>
            <input type="text" placeholder="Type a message..." value={newMessages} onChange={(e)=> setNewMessages(e.target.value)}></input>
            <button className={styles.sendButton} onClick={handleSendMessage}>Send</button>
        </div>
    </div>
    );
};
export default Chat;