import React, { useEffect, useState } from "react";
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Home(){
    const [recipes, setRecipes] = useState([]);
    const [savedRecipes, setSavedRecipes] = useState([]);
    const [cookies, _] = useCookies(["token"]);
    const username = window.localStorage.getItem('username');
    const navigate = useNavigate();

    useEffect(()=>{
        const getRecipe = async () => {
            await axios.get('http://localhost:4500/recipes')
            .then(res=>{
                setRecipes(res.data);
            })
            .catch(err=>{
                console.log(err);
            })
        }
        const getSavedRecipe = async () => {
            await axios.put('http://localhost:4500/recipes/saved', { username })
            .then(res=>{
                setSavedRecipes(res.data);
            })
            .catch(err=>{
                console.log(err);
            })
        }
        getRecipe();
        getSavedRecipe();
    }, []);

    const saveRecipe = async (r) => {
        const obj = {
            username: window.localStorage.getItem('username'),
            recipeID: r
        }
        await axios.post('http://localhost:4500/recipes/save', obj, {headers: {authorization: cookies.token}})
        .then(res=>{
            console.log(res);
            if(res.data.status === 400){
                navigate('/login');
            }else if(res.data.status === 200){
                alert("Done!");
            }
            window.location.reload();
        })
        .catch(err=>{
            console.log(err);
        })
    }

    const isSaved = (id)=>{
        for (let i = 0; i < savedRecipes.length; i++) {
            const element = savedRecipes[i];
            // eslint-disable-next-line
            if(id==element.recipeID){
                return true;
            }        
        }
        return false;
    }

    return(
        <div className="homeDiv">
           <h2 className="subtitle">All Recipes</h2>
           <ul>
            {
                recipes.length === 0 ?
                <div><h3 className="blank-text">No Recipes Found!</h3></div>
                :
                recipes.map((recipe) => (
                    <li className="recipe-card" key={recipe.recipeID}>
                        <img src={recipe.imgURL} alt={recipe.name}/>
                        <h3>{recipe.name}</h3>
                        <div className="inst">
                            <h4>Instructions</h4>
                            <p>{recipe.instructions}</p>
                        </div>
                        <h4>Time Required: {recipe.time}</h4>
                        <h4>Uploaded by: {recipe.username}</h4>
                        <button type="button" className="red-btn" onClick={()=>{saveRecipe(recipe.recipeID)}} disabled={isSaved(recipe.recipeID)}> {isSaved(recipe.recipeID) ? "Saved" : "Save"} </button>
                    </li>
                ))
            }
           </ul>
        </div>
    );
};

export default Home;