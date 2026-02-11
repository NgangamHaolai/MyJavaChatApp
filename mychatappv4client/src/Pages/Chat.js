import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useState, useRef, useEffect } from "react";
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
    const [currentUser, setCurrentUser] = useState("");

    useEffect(() => // Decode JWT to get currentUser username
    {
        const token = localStorage.getItem("token");
        if(token)
        {
            try
            {
                const decoded = jwtDecode(token);
                setCurrentUser(decoded.sub);
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
            if(currentUser && user.username)
            {
                try{
                    const response = await axios.get(`http://localhost:8080/api/messages?sender=${currentUser}&receiver=${user.username}`);
                    // if(!response.ok) throw new Error("Failed to fetch messages");
                    // const data = response.json();
                    const sortedData = response.data.sort(
                        (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
                    );
                    setMessages(sortedData);
                }
                catch(error)
                {
                    console.log("error fetching messages!", error);
                }
            }
        }   
        fetchMessages();
    }, [currentUser, user]);

    useEffect(()=>  // WebSocket connection setup
    {
        const connect = ()=>
        {
            console.log('trying to connect...');
            const socket = new SockJS(`http://localhost:8080/ws`);
            const stompClient = Stomp.over(socket);
            stompClientRef.current(stompClient);

            stompClient.connect({}, ()=>
            {
                console.log("Conected to WebSocket.");
                // Subscribe to messages for current user
                stompClient.subscribe(`/topic/messages/${currentUser}`, (message)=>
                {
                    const receivedMessage = JSON.parse(message.body);
                    console.log("Received message: ",receivedMessage);

                    // check if the mesasge is between the current user and the selected user
                    if((receivedMessage.sender === user.username && receivedMessage.receiver === currentUser) ||
                       (receivedMessage.sender === currentUser && receivedMessage.receiver === user.username))
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
        };
        if(currentUser && user)
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
    }, [currentUser, user]);
    // Handle sending new messages
    const handleSendMessage = ()=>
    {
        if(newMessages.trim() === "") return;
        const messageObject = {
            id: Date.now(), // Temporary ID, replace with server-generated ID if needed
            sender: currentUser,
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
    <div className="chat-screen">
        <button onClick={onBack} className="back-button">Back</button>
        <h2>Chat with {user.name}</h2>
        <div className="chat-messages">
                {messages.map((msg, index)=>(
                    <div key={index} className={`message ${msg.sender === currentUser ? "me" : "them"}`}>
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
        </div>
    </div>
    );
};
export default Chat;