import React from "react";
import { Link } from 'react-router-dom';

const LoginError = () => {

    return (
        <>
            <div className="err-container">
                <h2 className="subtitle">You must be logged in to continue.</h2>
                <button className="btn"><Link className='link-ele' to='/login'>Login</Link></button>
                <h3 className='reg-text'>Don't have an account? <a href='/register'>Register Now</a></h3>
            </div>
        </>
    );
};

export default LoginError;