

const recipe_endpoint = "http://127.0.0.1:8000/recipes/"

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
        return response;
    }catch(error){
        console.log("we didn't get any recipes")
    }
}