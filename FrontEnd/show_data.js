let id = localStorage.getItem('id');

if(id === null){
    id = 1;
    localStorage.setItem('id', id);
} else {
    id = Number(id);
}


function getAllRecipes() {
    let all_s_recipe = [];

    for (let index = 0; index < localStorage.length; index++) {
        let key = localStorage.key(index);
        if (key.includes('recipe')) {
            let val = localStorage.getItem(key);
            all_s_recipe.push(val);
        }
    }

    let all_o_recipe = [];
    for (let index = 0; index < all_s_recipe.length; index++) {
        all_o_recipe.push(JSON.parse(all_s_recipe[index]));
    }
    
    all_o_recipe.sort((a, b) => a.id.localeCompare(b.id));
    localStorage.setItem('all_res', JSON.stringify(all_o_recipe));
    
    return all_o_recipe;
}


document.addEventListener('DOMContentLoaded', () => {
    getAllRecipes(); 
    
    const tableBody = document.getElementById('recipe-table-body');
    const recipes = JSON.parse(localStorage.getItem('all_res')) || [];

    
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


document.addEventListener('click', (e) => {

    if (e.target.classList.contains('view-btn')) {
        const id = e.target.dataset.id;
        window.location.href = `Discription_page.html?id=${id}`;
    }

    
    if (e.target.classList.contains('edit-btn')) {
        const id = e.target.dataset.id;
        window.location.href = `adding_page.html?id=${id}`;
    }

    
    if (e.target.classList.contains('delete-btn')) {
        if (confirm('Are you sure you want to delete this recipe?')) {
            const idToDelete = e.target.dataset.id;
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
        }
    }
});