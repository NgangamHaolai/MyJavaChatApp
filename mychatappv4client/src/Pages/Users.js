import { useEffect, useState } from "react";
import {jwtDecode} from 'jwt-decode';
import axios from "axios";
import Chat from './Chat.js';

function Users()
{
    const [users, setUsers] = useState([]);
    const [loggedInUserId, setLoggedInUserId] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);

    useEffect(()=>
    {
        getUsers();
    }, []);

    const getUsers = async()=>
    {
        try
        {
            const token = localStorage.getItem("token");
            if(token)
            {
                const decodedToken = jwtDecode(token);   // decoding the token to get user info aka userID
                setLoggedInUserId(decodedToken.sub);     // assuming sub holds the userID
                console.log('decodedToken.sub: ',decodedToken.sub);
            }
            const response = await axios.get("http://localhost:8080/user");
            setUsers(response.data);
        }
        catch(error)
        {
            console.log("error occured! ",error);
        }
        // .then((response)=>
        // {
        //     setUsers(response.data);
        // })
        // .catch((error) => console.log(error));
    }

    return(
        <div>
            {selectedUser ? (
                <Chat user={selectedUser} onBack={()=> setSelectedUser(null)} />
            ) : (
                <div>
                    {users.filter((person) => person.username !== loggedInUserId) // Exclude logged-in user from the list
                        .map((person)=>(
                        // <div key={person.name} style={{border: '1px solid black', margin: '10px', padding: '10px'}}>
                            <div key={person.id}>
                                <p>{person.name}</p>
                                <button onClick={()=> setSelectedUser(person)}>Chat</button> {/* When clicked, set selectedUser to this person */   }
                            </div>
                    ))}
                </div>
            )}
        </div>
    );
};
export default Users;