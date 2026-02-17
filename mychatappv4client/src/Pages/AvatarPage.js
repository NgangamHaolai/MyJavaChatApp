import { useEffect, useState } from 'react';
import styles from '../styles/AvatarPage.module.css';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router';

function AvatarPage() 
{
    const [avatars, setAvatars] = useState([]);
    const [selectedAvatar, setSelectedAvatar] = useState(null);
    const [loggedInUser, setLoggedInUser] = useState(null);
    const navigate = useNavigate();
    useEffect(() =>
    {
        retrieveAvatars();
    }, [])

    const retrieveAvatars = async () =>
    {
        try
        {
            const token = localStorage.getItem("token");
            if(token)
            {
                const decodedToken = jwtDecode(token);
                console.log("decodedToken ", decodedToken);
                setLoggedInUser(decodedToken.sub);
                console.log('decodedToken.sub: ',decodedToken.sub);
            }

            // const response = await axios.get("http://localhost:8080/api/avatars",
            //    { headers: { Authorization: `Bearer ${token}` } }
            // );
            // if(response.data)
            // {
            //     setAvatars(response.data);
            // }
            // console.log(response.data);
            setAvatars(["https://img.freepik.com/premium-photo/men-design-logo-avatar_665280-69427.jpg?ga=GA1.1.1173692762.1745160499&semt=ais_hybrid&w=740",

        "https://img.freepik.com/free-vector/mysterious-mafia-man-smoking-cigarette_52683-34828.jpg?ga=GA1.1.1173692762.1745160499&semt=ais_hybrid&w=740",
        
        "https://png.pngtree.com/png-vector/20230416/ourmid/pngtree-avatar-ninja-symbol-icon-vector-png-image_6709524.png",
        
        "https://img.freepik.com/free-psd/3d-illustration-with-online-avatar_23-2151303087.jpg?ga=GA1.1.1173692762.1745160499&semt=ais_hybrid&w=740",
        
        "https://img.freepik.com/premium-vector/anime-schoolgirl-portrait-illustration-vector-icon-cartoon_674187-289.jpg?ga=GA1.1.1173692762.1745160499&semt=ais_hybrid&w=740",
        
        "https://img.freepik.com/free-psd/3d-rendering-avatar_23-2150833548.jpg?ga=GA1.1.1173692762.1745160499&semt=ais_hybrid&w=740"]);
        }
        catch(error)
        {
            console.log('Error fetching avatars: ', error.reseponse);
            console.log("Error fetching avatars: ", error.response.data);
        }
    }

    const handleSetAvatar = async ()=>
    {
        try
        {
            const token = localStorage.getItem("token");
            const decodeToken = jwtDecode(token);
            const response = await axios.put("http://localhost:8080/api/avatar", {
                // headers: { Authorization: `Bearer ${decodeToken}`}, 
                avatar: selectedAvatar, loggedInUser: loggedInUser }
            );
            if(response.data)
            {
                console.log(response.data);
            }
        }
        catch(error)
        {
            console.log('could not set avatar. error occured! ', error);
            console.log(error.response.data);
        }
    }

    const handleSelectAvatar = (avatar) =>
    {
        setSelectedAvatar(avatar);
        console.log('avatar', avatar);
    }
    const handleSubmit = (e)=>
    {
        e.preventDefault();
        handleSetAvatar();
        navigate("/users")
    }
    return (
        <>
            <h2>Select Your Avatar</h2>
            <div className={styles.avatarContainer}>
                <div className={styles.avatarsGrid}>
                    {avatars.map((avatar, index)=>(
                    <div key={index} 
                        className={selectedAvatar === avatar ? styles.selectedAvatarPreview : styles.avatarPreview}
                        onClick={()=>handleSelectAvatar(avatar)}>
                        <img src={avatar}/>
                    </div>
                    ))}
                </div>
            </div>
            <div className={styles.submitButton}>
                <button 
                    type='submit' 
                    onClick={handleSubmit}
                >
                    Continue
                </button>
            </div>
        </>
    );
}
export default AvatarPage;