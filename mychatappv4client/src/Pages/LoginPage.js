import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import styles from '../styles/LoginPage.module.css';

function LoginPage()
{
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState({});
    const nav = useNavigate();

    const handleLogin = async ()=>
    {
        try
        {
            const response = await axios.post("http://localhost:8080/login", { username, password });
            if(response.data.token)
            {
                localStorage.setItem("token", response.data.token);
                console.log("Login successful! TOken saved to local storage.");
                nav("/users");
            }
            else
            {
                setError("Login Failed: Token not received!");
            }
        }
        catch(error)
        {
            console.log(error.response);
            console.log(error.response.data);
            console.log(error.response.data.error);
            setError(error.response.data);
        }
    }
    return(<>
        <div className={styles.loginContainer}>
            <h2>Login</h2>

            <div className={styles.inputContainer}>
                <label>Username:</label>
                {error.username && <p className={styles.error}>**{error.username}**</p>}
                <input
                    type='text'
                    value={username}
                    onChange={(e)=>(setUsername(e.target.value))}
                />
            </div>

            <div className={styles.inputContainer}>
                <label>Password:</label>
                {error.password && <p className={styles.error}>**{error.password}**</p>}
                <input
                    name='password'
                    type='password'
                    value={password}
                    onChange={(e)=>(setPassword(e.target.value))}
                />
            </div>
            {error.error && <p className={styles.error}>**{error.error}**</p>}
            <button onClick={handleLogin} className={styles.loginButton}>
                Login
            </button>
        </div>
    </>);
}
export default LoginPage;