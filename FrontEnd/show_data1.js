import { get_rec } from "./API_Calls.js";







async function getAllRecipes() {
    try {
        const recipes = await get_rec()
        
        // Check if recipes is undefined or null
        if (!recipes || !Array.isArray(recipes)) {
            console.error('No recipes received from API');
            return [];
        }
        
        // Use the actual database pk as display ID instead of array index
        recipes.forEach((recipe, index) => {
            recipe.display_id = index + 1; // For display purposes only
            recipe.id = recipe.pk; // Use actual database primary key
        })
        
        localStorage.setItem('all_res', JSON.stringify(recipes));
        
        return recipes;
    } catch (error) {
        console.error('Error getting recipes:', error);
        return [];
    }
}




document.addEventListener('DOMContentLoaded',async () => {
   
    
    const tableBody = document.getElementById('recipe-table-body');
    const recipes = await getAllRecipes();
    
    
    tableBody.innerHTML = '';

    if (recipes.length === 0) {
        // Show message when no recipes are available
        tableBody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align: center; padding: 20px; color: #666;">
                    <div style="font-size: 16px; margin-bottom: 10px;">⚠️ No recipes available</div>
                    <div style="font-size: 14px;">
                        This could mean:<br>
                        • The server is not running<br>
                        • No recipes have been added yet<br>
                        • There's a connection issue
                    </div>
                </td>
            </tr>
        `;
        return;
    }

    recipes.forEach(recipe => {
        const row = document.createElement('tr');
    
        row.innerHTML = `
            <td>${recipe.display_id}</td>
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
        const recipeId = e.target.dataset.id;
        // Now the id is already the database primary key
        window.location.href = `adding_page.html?id=${recipeId}`;
    }

    
    if (e.target.classList.contains('delete-btn')) {
        if (confirm('Are you sure you want to delete this recipe?')) {
            const recipeId = e.target.dataset.id;
            // Now the id is already the database primary key
            const endpoint = "http://127.0.0.1:8000/recipes/" + recipeId
            try{
                const response = await fetch(endpoint, {
                    method : 'DELETE',
                    credentials : 'include',
                    headers : {
                        'Content-Type' : 'application/json'
                    }
                })
                if (response.status === 204){
                    // Recipe deleted successfully, refresh the page to reload data
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