import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import styles from '../styles/LoginPage.module.css';

function LoginPage()
{
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});
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
                setErrors("Login Failed: Token not received!");
            }
        }
        catch(error)
        {
            console.log(error.response);
            console.log(error.response.data);
            console.log(error.response.data.error);
            setErrors(error.response.data);
        }
    }
    return(<>
        <div className={styles.loginContainer}>
            <h2>Login</h2>

            <div className={styles.inputContainer}>
                <label>Username:</label>
                {errors.username && <p className={styles.error}>**{errors.username}**</p>}
                <input
                    type='text'
                    value={username}
                    onChange={(e)=>(setUsername(e.target.value))}
                />
            </div>

            <div className={styles.inputContainer}>
                <label>Password:</label>
                {errors.password && <p className={styles.error}>**{errors.password}**</p>}
                <input
                    name='password'
                    type='password'
                    value={password}
                    onChange={(e)=>(setPassword(e.target.value))}
                />
            </div>
            {errors.error && <p className={styles.error}>**{errors.error}**</p>}
            <button onClick={handleLogin} className={styles.loginButton}>
                Login
            </button>
        </div>
    </>);
}
export default LoginPage;