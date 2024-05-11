import axios from 'axios';
import { useState } from 'react';
import LoginError from './LoginError';
import { useNavigate} from 'react-router-dom';
import { useCookies } from 'react-cookie';

function Upload(){
    const user = window.localStorage.getItem('username');
    const navigate = useNavigate();
    const [cookies, _] = useCookies(['token']);
    const [recipe, setRecipe] = useState({
        recipeID: "",
        username: user,
        name: "",
        ingredients: [],
        instructions: "",
        imgURL: "",
        time: "",
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setRecipe({...recipe, [name]: value});
        // eslint-disable-next-line
        if(name=='time'){
            setRecipe({...recipe, time: value+" minutes"});
        }
    };

    const handleIngChange = (event, i) => {
        const {value} = event.target;
        let ing = recipe.ingredients;
        ing[i] = value;
        setRecipe({...recipe, ingredients: ing});
        console.log(recipe);
    }

    const addIng = () => {
        setRecipe({...recipe, ingredients: [...recipe.ingredients, ""]});
    }

    const onSubmit = async(event) => {
        event.preventDefault();
        await axios.post('http://localhost:4500/recipes/create', recipe,  {headers: {authorization: cookies.token}})
        .then(res => {
            console.log(res);
            if(res.data.status === 400){
                alert("Incomplete Details!");
            }else if(res.data.status === 200){
                alert("Recipe Added Successfully!");
                navigate('/');
            }
        })
    }

    if(user){
        return (
            <>
                <div className='rcp'>
                    <form className='recipe-container'>
                        <h2 className='subtitle'>Create a New Recipe</h2>
                        <div className='input-group'>
                            <label htmlFor='name'>Name: </label>
                            <input className='widthI' type='text' id='name' name='name' onChange={handleChange} />
                        </div>
                        <div className='input-group'>
                            <label htmlFor='ingredients'>Ingredients:</label>
                            {
                                recipe.ingredients.map((ing, i)=>(
                                   <input key={i} type='text' name='ingredients' required value={ing} onChange={(event) => handleIngChange(event, i)} />)
                                )
                            }
                            <button className='red-btn' onClick={addIng} type='button'>Add Ingredient</button>
                        </div>
                        <div className='input-group'>
                            <label htmlFor="instructions">Instructions:</label>
                            <textarea className='widthI' id="instructions" name="instructions" onChange={handleChange} />
                        </div>
                        <div className='input-group'>
                            <label htmlFor=" imgURL">Image URL:</label>
                            <input className='widthI' type="text" id="imgURL" name="imgURL" onChange={handleChange} />
                        </div>
                        <div className='input-group'>
                            <label htmlFor="cookingTime">Cooking Time (minutes):</label>
                            <input className='widthI' type="number" id="time" name="time" onChange={handleChange} />
                        </div>
                        <button className='btn' type='submit' onClick={onSubmit}>Submit</button>
                    </form>
                </div>
            </>
        );
    }else{
        return <LoginError/>;
    }
}

export default Upload;