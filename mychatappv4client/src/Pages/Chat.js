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
import { AiOutlinePoweroff } from "react-icons/ai";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { BsEmojiSmile } from "react-icons/bs";
import EmojiPickerReact from 'emoji-picker-react';

function Chat({selectedUser, profile, onBack})
{
    const [messages, setMessages] = useState([]);
    const [newMessages, setNewMessages] = useState("");
    const stompClientRef = useRef(null);
    const [loggedInUser, setLoggedInUser] = useState("");
    const [showEmoji, setShowEmoji] = useState(false);
    const navigate = useNavigate();
    const chatRef = useRef(null);

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

    useEffect(()=>  // Fetch previous messages between currentUser and user
    {
        fetchMessages();
    }, [loggedInUser, selectedUser]);

    useEffect(()=>  // WebSocket connection setup
    {
        const connect = ()=>
        {
            try
            {
                const token = localStorage.getItem("token");
                console.log('trying to connect...');
                const socket = new SockJS(`http://localhost:8080/ws`);
                const stompClient = Stomp.over(socket);
                stompClientRef.current = stompClient;
                stompClient.connect({
                    headers: { Authorization: `Bearer ${token}`}
                }, ()=> 
                {
                    console.log("Conected to WebSocket.");
                    // Subscribe to messages for current user
                    stompClient.subscribe(`/topic/messages/${loggedInUser}`, (message) => {
                        const receivedMessage = JSON.parse(message.body);
                        
                        // if((receivedMessage.sender === selectedUser.username && receivedMessage.receiver === loggedInUser) ||
                        // (receivedMessage.sender === loggedInUser && receivedMessage.receiver === selectedUser.username))
                        // {
            // prevents duplicate messages in the UI by checking if the message already exists before adding it to the state.
                            setMessages((prevMessages) => 
                            {
                                const exists = prevMessages.some(msg => {
                                    // console.log('msg.id',msg.id)
                                    // console.log('receivedMessage.id',receivedMessage.id);
                                    return msg.id === receivedMessage.id
                                });
                                return exists ? prevMessages : [...prevMessages, receivedMessage];
                            });
                        // }
                        console.log("Incoming message:", receivedMessage);
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
    }, [loggedInUser]);
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
        if(stompClientRef.current && stompClientRef.current.connected)  // just a safety check.
        {                             // ddestination(string), headers(object), body(string)                                        // Spring automatically converts JSON to Java object.
            stompClientRef.current.send("/app/chat", {}, JSON.stringify(messageObject));// body needs to be in JSON format for de-serialization to take place.
            console.log("sent messageObject", messageObject);
            // JSON.stringify() in JavaScript is used to convert a JavaScript value (object, array, number, string, etc.) into a JSON-formatted string.
            setNewMessages("");
        }
        else
        {
            console.log("Stomp Client is not connected. Unable to send message.");
        }
    };

    // useEffect(()=>
    // {
        
    // }, [handleSendMessage]);

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

    const handleEmojiPicker = ()=>
    {
        setShowEmoji(!showEmoji);
    }
    const handleEmojiClick = (e)=>
    {
        setNewMessages(prev=>prev+e.emoji);
        setShowEmoji(false);
    }
    useEffect(()=>
    {
        if(chatRef.current)
            chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }, [messages]);
    
    return(
    <div className={styles.chatContainer}>
        <div className={styles.chatBar}>
            <div className={styles.profilePic}>
                <img src={profile} alt="avatar.jpg"></img>
            </div>
            <div className={styles.profileName}>{selectedUser}</div>
            <div className={styles.logout}>
                <AiOutlinePoweroff/>
            </div>
        </div>
        <div ref={chatRef} className={styles.chatMessages}>
            {messages.map((e)=>
            (
                <div key={e.id} className={e.sender === loggedInUser ? styles.senderBox : styles.receiverBox}>
                    {e.message}
                    <p className={styles.timestamp}>{formatChatTime(e.timestamp)}</p>
                </div>
            ))}
        </div>
        <form onSubmit={(e)=>
            {
                e.preventDefault();
                handleSendMessage();
                // fetchMessages();     // this is a very incorrect & inefficient way of refreshing chat list.
            }}>
                {/* <div className={styles.emojiContainer}> */}
                    {showEmoji && <EmojiPickerReact theme="dark" onEmojiClick={handleEmojiClick}/>}
                {/* </div> */}
            <div className={styles.textContainer}>
                <button type="button" className={styles.emojiButton} onClick={handleEmojiPicker}>
                    <BsEmojiSmile className={styles.emojiClass} size={30}/>
                </button>
                <input 
                    type="text" 
                    placeholder="Type a message..." 
                    value={newMessages} 
                    onChange={(e)=> setNewMessages(e.target.value)}>
                </input>
                <button type="submit" className={styles.sendButton}> 
                    Send
                </button>
            </div>
        </form>
    </div>
    );
};
export default Chat; // TDZ GEC