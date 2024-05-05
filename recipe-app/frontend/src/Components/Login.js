import React, { useState } from 'react';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [cookies, setCookies] = useCookies(["token"]);
    const navigate = useNavigate();

    const onSubmit = async (event) => {
        event.preventDefault();
        await axios.post("http://localhost:4500/users/login", {username, password})
        .then(res=>{
            if(res.data.status===404){
                alert("User Not Found!");
            }else if(res.data.status===400){
                alert("Incorrect Password");
            }else{
                setCookies("token", res.data.token);
                window.localStorage.setItem("username", res.data.dbUsername);
                alert("Login Successful!");
                navigate("/");
                window.location.reload();
            }
        })
        .catch(err=>{
            console.log('err :>> ', err);
        })
    }

    return (
        <div className='lgn'>
            <form  className='login-container' onSubmit={onSubmit}>
                <h2 className='subtitle'>Login</h2>
                <div className='input-group'>
                    <label htmlFor='username'>Username: </label>
                    <input type='text' id='username' value={username} onChange={(event)=>{setUsername(event.target.value)}}/>
                </div>
                <div className='input-group'>
                    <label htmlFor='password'>Password: </label>
                    <input type='password' id='password' value={password} onChange={(event)=>{setPassword(event.target.value)}}/>
                </div>
                <button type='submit' className='btn'>Submit</button>
            </form>
            <h3 className='reg-text'>Don't have an account? <a href='/register'>Register Now</a></h3>
        </div>
    );
}

export default LoginPage;
