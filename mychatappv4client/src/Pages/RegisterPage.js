import { use, useState } from "react";
import styles from '../styles/RegisterPage.module.css';
import axios from "axios";
import { useNavigate } from "react-router";

function RegisterPage()
{
    // const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [email, setEmail] = useState("");
    
    const [errors, setErrors] = useState({});
    // const [nameError, setNameError] = useState("");
    // const [usernameError, setUsernameError] = useState("");
    // const [emailError, setEmailError] = useState("");
    // const [passwordError, setPasswordError] = useState("");
    const [passwordMatchError, setPasswordMatchError] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async ()=>
    {
        try
        {
            if(password !== confirmPassword)
            {
                setPasswordMatchError("passwords do not match!");
                // console.log('passwords do not match!');
            }
            else
            {            
                const response = await axios.post("http://localhost:8080/register",{username, email, password, confirmPassword});
                console.log('response data:', response);
                if(response.data.token)
                {
                    localStorage.setItem("token", response.data.token);
                    console.log('registration successful! Token saved to local storage.');
                    console.log("Username:", username, "Email:", email,);
                    navigate("/users");
                }
                else
                {
                    console.log('registration failed: Token not received!');
                }
            }
        }
        catch(error)
        {
            console.log(error.response);
            // console.log("Asli error! ", error.response.data);
            if(error.response && error.response.data)
                setErrors(error.response.data);
            else
                console.log('Network or unexpected error!');
            // if(error.response.data.username)
            //     setUsernameError(error.response.data.username);
            // else
            //     setUsernameError("");
            // if(error.response.data.email)
            //     setEmailError(error.response.data.email);
            // else
            //     setEmailError("");
            // if(error.response.data.password)
            //     setPasswordError(error.response.data.password);
            // else
            //     setPasswordError("");
            // if(passwordMatchError)
            //     setPasswordMatchError(error.response.data.passwordMatch);
            // else
            //     setPasswordMatchError("");
        }
    }
    return (
        <div className={styles.registerContainer}>
            <h2>Register</h2>
            {/* <div className={styles.inputContainer}>
                <label>Name</label>
                {errors.name && <p className={styles.error}>**{errors.name}**</p>}
                <input 
                    type="text"
                    value={name}
                    onChange={(e)=>(setName(e.target.value))}
                />
            </div> */}
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
                <label>Email:</label>
                {errors.email && <p className={styles.error}>**{errors.email}**</p>}
                <input
                    type="email" 
                    value={email} 
                    onChange={(e)=>(setEmail(e.target.value))} 
                />
            </div>
            <div className={styles.inputContainer}>
                <label>Password:</label>
                {errors.password && <p className={styles.error}>**{errors.password}**</p>}
                <input 
                    type='password'
                    value={password}
                    onChange={(e)=>(setPassword(e.target.value))}
                />
            </div>
            <div className={styles.inputContainer}>
                <label>Confirm Password:</label>
                {/* {passwordMatchError && <p className={styles.error}>**password mismatch**</p>} */}
                {errors.confirmPassword && <p className={styles.error}>**{errors.confirmPassword}**</p>}
                <input 
                type="password"
                value={confirmPassword}
                onChange={(e)=>(setConfirmPassword(e.target.value))}
                />
            </div>
            <button 
                className="submitButton"
                onClick={handleSubmit}>
                    Register
            </button>
        </div>
    );
}
export default RegisterPage;