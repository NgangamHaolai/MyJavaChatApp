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


function Chat({user, onBack})
{
    const [messages, setMessages] = useState([]);
    const [newMessages, setNewMessages] = useState("");
    const stompClientRef = useRef(null);
    const [loggedInUser, setLoggedInUser] = useState("");
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
            if(loggedInUser && user)
            {
                try
                {
                    const token = localStorage.getItem("token");
                    if(token)
                    {
                        const response = await axios.get(`http://localhost:8080/api/messages?sender=${loggedInUser}&receiver=${user.username}`,
                            {headers: { Authorization: `Bearer ${token}` }}
                        );
                        console.log(response.data);
                        
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
    }, [loggedInUser, user]);

    useEffect(()=>  // WebSocket connection setup
    {
        const connect = ()=>
        {
            try
            {
                const token = localStorage.getItem("token");
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
                        if((receivedMessage.sender === user.username && receivedMessage.receiver === loggedInUser) ||
                        (receivedMessage.sender === loggedInUser && receivedMessage.receiver === user.username))
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
        if(loggedInUser && user)
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
    }, [loggedInUser, user]);
    // Handle sending new messages
    const handleSendMessage = ()=>
    {
        if(newMessages.trim() === "") return;
        const messageObject = {
            id: Date.now(), // Temporary ID, replace with server-generated ID if needed
            sender: loggedInUser,
            receiver: user.username,
            message: newMessages,
            timestamp: new Date().toISOString()
        }
        // Send the new message via WebSocket
        if(stompClientRef.current && stompClientRef.current.connected)
        {
            stompClientRef.current.send("/app/chat", JSON.stringify(messageObject));
            console.log("sent message", messageObject);
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

    return(
    <div className={styles.chatContainer}>
        <div className={styles.chatBar}>
            <div className={styles.profilePic}>
                <img src="https://i.etsystatic.com/48111938/r/isla/448e06/68047008/isla_200x200.68047008_9oodzao2.jpg" alt="avatar.jpg"></img>
            </div>
            <div className={styles.profileName}>{user}</div>
        {/* <button onClick={onBack} className="back-button">Back</button>
        <h2>Chat with {user.name}</h2>
        <div className="chat-messages">
                {messages.map((msg, index)=>(
                    <div key={index} className={`message ${msg.sender === loggedInUser ? "me" : "them"}`}>
                        <strong>{msg.sender}:</strong>{msg.message}
                        <div>{new Date(msg.timestamp).toLocaleTimeString()}</div>
                    </div>
                ))}
        </div>
        <div className="chat-input">
            <input type="text" 
                placeholder="Type a message" 
                value={newMessages} 
                onChange={(e) => setNewMessages(e.target.value)}>
            </input>
            <button onClick={handleSendMessage}>Send</button>
        </div> */}
        </div>
        <div className={styles.chatMessages}>
            <div className={styles.senderBox}>
                hey how are you doing?
            </div>
            <div className={styles.receiverBox}>
                I'm doing good, how about you?
            </div>
        </div>
        <div className={styles.textContainer}>
            <div className={styles.emojiContaier}>:)</div>
            <input type="text" placeholder="Type a message" value={newMessages} onChange={(e)=> setNewMessages(e.target.value)}></input>
            <button onClick={handleSendMessage}>Send</button>
        </div>
    </div>
    );
};
export default Chat;