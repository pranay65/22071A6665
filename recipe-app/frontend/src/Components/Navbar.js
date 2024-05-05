import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';

function Navbar() {
  const [cookies, setCookies] = useCookies("token");
  const navigate = useNavigate();

  const logout = () => {
    setCookies("token", "");
    window.localStorage.removeItem("username");
    navigate("/login");
    window.location.reload();
  }

  return (
    <nav className="navbar">
        <h1 className='title'><Link className='link-ele' to='/'>RecipeApp</Link></h1>
        <div className='div-cont'>
            <h3 className='navbar-text'><Link className='link-ele' to='/'>Home</Link></h3>
            {cookies.token ? 
            (<><h3 className='navbar-text'><Link className='link-ele' to='/create'>Create Recipe</Link></h3>
            <h3 className='navbar-text'><Link className='link-ele' to='/saved'>Saved Recipes</Link></h3></>) : <></>
            }
            {!cookies.token ? 
                (<><h3 className='navbar-text'><Link className='link-ele' to='/login'>Login</Link></h3>
                <h3 className='navbar-text'><Link className='link-ele' to='/register'>Register</Link></h3></>) : 
            <h3 className='navbar-text'><Link className='link-ele' onClick={logout}>Logout</Link></h3>}
        </div>   
    </nav>
  );
}

export default Navbar;
