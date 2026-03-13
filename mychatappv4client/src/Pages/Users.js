import { useEffect, useState } from "react";
import {jwtDecode} from 'jwt-decode';
import axios from "axios";
import Chat from './Chat.js';
import styles from '../styles/Users.module.css';
import { useNavigate } from "react-router-dom";

function Users()
{
    const [users, setUsers] = useState([]);
    const [loggedInUser, setLoggedInUser] = useState("");
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedUserProfile, setSelectedUserProfile] = useState("");
    const [logoutPopup, setLogoutPopup] = useState(false);
    const navigate = useNavigate();
    
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
                setLoggedInUser(decodedToken.sub);     // assuming sub holds the userID
                console.log('decodedToken.sub: ',decodedToken);
                const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/users`, { 
                    headers: { Authorization: `Bearer ${token}` } 
                });
                setUsers(response.data);
                console.log('users: ',response.data);
            }
            else
            {
                console.log('No token found. User might not be logged in.');
                navigate('/login'); // Redirect to login if no token is found
            }
        }
        catch(error)
        {
            console.log("error occured! ",error.response);
            console.log("error occured! ",error.response.data);
            if(error.response.data.unauthorized)
            {
                alert("Unauthorized! Please login again.");
                navigate("/login");
            }
        }
    }
    const handleSelectedUser = (user)=>
    {
        setSelectedUser(user.username);
        setSelectedUserProfile(user.avatar);
        console.log("user:",user);
    }
    const handleLogout = ()=>
    {
        localStorage.removeItem("token");
        setLogoutPopup(false);
        navigate("/login");
    }


    return(
        <div className={styles.mainContainer}>

                <div className={styles.usersContainer}>
                <div className={styles.usersBar}>
                    <div className={styles.logo}>
                        <img src="https://i.etsystatic.com/48111938/r/isla/448e06/68047008/isla_200x200.68047008_9oodzao2.jpg" alt="Logo" className={styles.logoImage} />
                    </div>
                    <div className={styles.appName}>Buzzer</div>
                    <div className={styles.options}>:::</div>
                </div>
                {users.filter((user) => user.username !== loggedInUser) // Exclude logged-in user from the list
                    .map((user)=>(
                        <div key={user.id} className={selectedUser === user ? styles.userContainerSelected : styles.userContainer} onClick={()=> handleSelectedUser(user)} >
                            <div className={styles.profilePic}>
                                <img src={user.avatar} alt="avatar.jpg"></img>
                            </div>
                            <div className={styles.profileName}>{user.username}</div> {/* When clicked, set selectedUser to this person */   }
                        </div>
                ))}
                </div>

                {selectedUser && <div className={styles.chatContainer}>
                    <Chat 
                        selectedUser={selectedUser} 
                        profile={selectedUserProfile} 
                        onBack={()=> setSelectedUser(null)} 
                        onLogout={()=> setLogoutPopup(true)} />
                </div> }

                {logoutPopup && 
                <div className={styles.logoutBackground}>
                    <div className={styles.logoutPopup}>
                        <div className={styles.areYouSure}>Are you Sure?</div><br></br>
                        <div>
                            <button className={styles.button} onClick={handleLogout}>Yes</button>
                            <button className={styles.button} onClick={()=>setLogoutPopup(false)}>No</button>
                        </div>
                    </div>
                </div>}
        </div>
    );
};
export default Users;