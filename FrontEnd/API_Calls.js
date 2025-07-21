
const user_endpoint = "http://127.0.0.1:8000/users/users/"
const recipe_endpoint = "http://127.0.0.1:8000/recipes/"
const ing_endpoint = "http://127.0.0.1:8000/ings/"

export async function send_rec(recipeData) {
    const Jrecipe_data = JSON.stringify(recipeData)
    try{
        const response = await fetch(recipe_endpoint, {
            method : 'POST',
            headers : {
                'Content-Type' : 'application/json'
            },
            credentials : 'include',
            body : Jrecipe_data
        })
        return response;
    }catch(error){
        console.error("could not send to sever");
        
    }
    
}

export async function get_rec() {
    
    try{
        const response = await fetch(recipe_endpoint)
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const all_recipes = await response.json();
        const recipes = [];
        for (let index = 0; index < all_recipes.length; index++) {
            all_recipes[index]["fields"].pk = all_recipes[index]["pk"]
            recipes.push(all_recipes[index]["fields"])
        }
        
        return recipes;
    }catch(error){
        console.error("Error fetching recipes:", error);
        return []; // Return empty array instead of undefined
    }
}


export async function get_ing() {
    
    try{
        const response = await fetch(ing_endpoint)
        const all_ings = await response.json();
        const ings = [];
        for (let index = 0; index < all_ings.length; index++) {
            all_ings[index]["fields"].pk = all_ings[index]["pk"]
            ings.push(all_ings[index]["fields"])
            
        }
        
        return ings;
    }catch(error){
        console.error("Error fetching ingredients:", error);
        return []; // Return empty array instead of undefined
    }
}

export async function get_users() {
    
    try{
        const response = await fetch(user_endpoint)
        const all_user = await response.json();
        const users = [];
        for (let index = 0; index < all_user.length; index++) {
            all_user[index]["fields"].pk = all_user[index]["pk"]
            users.push(all_user[index]["fields"])
            
        }
        console.log(users)
        return users;
    }catch(error){
        console.error("Error fetching users:", error);
        return []; // Return empty array instead of undefined
    }
}

export async function send_user(userData) {
    const Juser_data = JSON.stringify(userData)
    try{
        const response = await fetch(user_endpoint, {
            method : 'POST',
            headers : {
                'Content-Type' : 'application/json'
            },
            credentials : 'include',
            body : Juser_data
        })
        return response;
    }catch(error){
        console.error("could not send to sever");
        
    }
    
}