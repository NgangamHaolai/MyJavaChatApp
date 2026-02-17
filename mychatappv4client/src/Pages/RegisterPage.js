import { use, useState } from "react";
import styles from '../styles/RegisterPage.module.css';
import axios from "axios";
import { useNavigate } from "react-router";

function RegisterPage()
{
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [email, setEmail] = useState("");
    
    const [errors, setErrors] = useState({});
    // // const [nameError, setNameError] = useState("");
    // const [usernameError, setUsernameError] = useState("");
    // const [emailError, setEmailError] = useState("");
    // // const [passwordError, setPasswordError] = useState("");
    // const [passwordMatchError, setPasswordMatchError] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (e)=>
    {
        e.preventDefault();
        try
        {
            // if(password !== confirmPassword)
            // {
            //     // setPasswordMatchError("passwords do not match!");
            //     console.log('passwords do not match!');
            // }
            // else
            // {            
                const response = await axios.post("http://localhost:8080/register",{username, email, password, confirmPassword});
                // console.log('response data:', response);
                if(response.data.token)
                {
                    localStorage.setItem("token", response.data.token);
                    console.log('registration successful! Token saved to local storage.');
                    console.log("Username:", username, "Email:", email,);
                    navigate("/avatar");
                }
                else
                {
                    console.log('registration failed: Token not received!');
                }
            // }
        }
        catch(error)
        {
            console.log(error.response.data);
            if(error.response && error.response.data)
            {
                setErrors(error.response.data);
                const {field, message} = error.response.data;
                setErrors((prev)=>({...prev, [field] : message}));
                // console.log('errors', errors);
            }
            // if(error.response && error.response.data.duplicateEmail)
            // {
            //     setErrors((prev)=>({...prev, DUB_email: error.response.data.duplicateEmail}));
            // }
            // if(error.response && error.response.data.passwordMismatch)
            // {
            //     setErrors((prev)=>({...prev, passwordMismatch: error.response.data.passwordMismatch}));
            // }
            // if(error.response && error.response.data)
            //     setErrors(error.response.data);
            else
                console.log('Network or unexpected error!');
        }
    }
    return (
        <form onSubmit={handleSubmit}>
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
                {/* {errors.duplicateUsername && <p className={styles.error}>**{errors.duplicateUsername}**</p>} */}
                <input
                    type='text'
                    value={username}
                    onChange={(e)=>(setUsername(e.target.value))}
                />
            </div>
            <div className={styles.inputContainer}>
                <label>Email:</label>
                {errors.email && <p className={styles.error}>**{errors.email}**</p>}
                {/* {errors.duplicateEmail && <p className={styles.error}>**{errors.duplicateEmail}**</p>} */}
                <input
                    type="email" 
                    value={email} 
                    onChange={(e)=>{(setEmail(e.target.value));
                        setErrors((prev)=>({...prev, email: ""}));
                    }} 
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
                {/* {passwordMatchError && <p className={styles.error}>{passwordMatchError}</p>} */}
                {errors.confirmPassword && <p className={styles.error}>**{errors.confirmPassword}**</p>}
                {/* {errors.passwordMismatch && <p className={styles.error}>**{errors.passwordMismatch}**</p>} */}
                <input 
                type="password"
                value={confirmPassword}
                onChange={(e)=>(setConfirmPassword(e.target.value))}
                />
            </div>
            <button 
                className="submitButton"
                type="submit">
                    Register
            </button>
        </div>
        </form>
    );
}
export default RegisterPage;