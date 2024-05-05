import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './styles.css';
import Home from './Components/Home';
import Login from './Components/Login';
import Upload from './Components/UploadRecipe';
import Saved from './Components/SavedRecipes';
import Navbar from './Components/Navbar';
import Register from './Components/Register';


function App() {
    return (
       <>
        <Navbar />
        <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
            <Route path='/create' element={<Upload />} />
            <Route path='/saved' element={<Saved />} />
        </Routes>
       </>
    );
}

export default App;