import { get_rec } from "./API_Calls.js";







async function getAllRecipes() {
   
    const recipes = await get_rec()
    recipes.forEach((recipe, index) => {recipe.id = index+1})
    
    
    
    
    localStorage.setItem('all_res', JSON.stringify(recipes));
    
    return recipes;
}




document.addEventListener('DOMContentLoaded',async () => {
   
    
    const tableBody = document.getElementById('recipe-table-body');
    const recipes = await getAllRecipes();
    
    
    tableBody.innerHTML = '';

    recipes.forEach(recipe => {
        const row = document.createElement('tr');
    
        row.innerHTML = `
            <td>${recipe.id}</td>
            <td>${recipe.name}</td>
            <td>${recipe.tag}</td>
            <td>${recipe.ings} Ingredients</td>
            <td>
                <button class="action-btn view-btn" data-id="${recipe.id}">View</button>
                <button class="action-btn edit-btn" data-id="${recipe.id}">Edit</button>
                <button class="action-btn delete-btn" data-id="${recipe.id}">Delete</button>
            </td>
        `;
    
        tableBody.appendChild(row);
    });
});


document.addEventListener('click',async (e) => {

    if (e.target.classList.contains('view-btn')) {
        const id = e.target.dataset.id;
        window.location.href = `Discription_page.html?id=${id}`;
    }

    
    if (e.target.classList.contains('edit-btn')) {
        const idToDelete = e.target.dataset.id;
            const all_recipes = await getAllRecipes()
           const real_id_want_to_delete =  all_recipes.find((recipe) => {return recipe.id == idToDelete}).pk
           console.log(real_id_want_to_delete)
           
        window.location.href = `adding_page.html?id=${real_id_want_to_delete}`;
    }

    
    if (e.target.classList.contains('delete-btn')) {
        if (confirm('Are you sure you want to delete this recipe?')) {
            const idToDelete = e.target.dataset.id;
            const all_recipes = await getAllRecipes()
           const real_id_want_to_delete =  all_recipes.find((recipe) => {return recipe.id == idToDelete}).pk
           console.log(real_id_want_to_delete)
            const endpoint = "http://127.0.0.1:8000/recipes/" + real_id_want_to_delete
            try{
                const response = await fetch(endpoint, {
                    method : 'DELETE',
                    credentials : 'include',
                    headers : {
                        'Content-Type' : 'application/json'
                    }
                })
                if (response.status === 204){
                    
                    let recipes = JSON.parse(localStorage.getItem('all_res')) || [];
        
                    
                    recipes = recipes.filter(recipe => recipe.id !== idToDelete);
        
                    
                    recipes.forEach((recipe, index) => {
                        recipe.id = (index + 1).toString();
                    });
        
                   
                    Object.keys(localStorage).forEach(key => {
                        if (key.startsWith('recipe')) {
                            localStorage.removeItem(key);
                        }
                    });
        
                  
                    recipes.forEach((recipe, index) => {
                        localStorage.setItem(`recipe${index + 1}`, JSON.stringify(recipe));
                    });
        
        
                    localStorage.setItem('all_res', JSON.stringify(recipes));
        
                
                    localStorage.setItem('id', recipes.length + 1);
        
                    e.target.closest('tr').remove();
                    
                   
                    window.location.reload();
                }else{
                    console.error("fail to delete server error",response.status)
                }
            }catch(error){
                console.error("fail to requst server", error)
            }
        }
    }
});