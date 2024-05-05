import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Register() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const savedRecipes = [];
    const recipeCount = 0;

    const onSubmit = async (event) => {
        event.preventDefault();
        await axios.post("http://localhost:4500/users/register", { username, password, savedRecipes, recipeCount })
        .then(res=>{
            if(res.data.status===200){
                navigate("/login");
                alert("User Created Successfully! Login to continue.");
            }else if(res.data.status===409){
                alert("User Already Exists!")
            }
        })
        .catch(err=>{
            console.log('err :>> ', err);
        });
    }

    return (
        <div className='lgn'>
            <form  className='login-container' onSubmit={onSubmit}>
                <h2 className='subtitle'>Register</h2>
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
            <h3 className='reg-text'>Already have an account? <a href='/login'>Login Now</a></h3>
        </div>
    );
}

export default Register;
