import { get_rec } from "./API_Calls.js";

let id = localStorage.getItem('id');

if(id === null){
    id = 1;
    localStorage.setItem('id', id);
} else {
    id = Number(id);
}


async function getAllRecipes() {
    const arr_rec_data = [];
    const respose = await get_rec();
    if(respose.status === 200){
        const rec_data = await respose.json()
        for(var i = 0 ; i <  rec_data.length; i++){
            rec_data[i].fields.id = rec_data[i].pk
            arr_rec_data.push(rec_data[i].fields)
        }
        console.log(arr_rec_data)
        return arr_rec_data
    }
    
    
}


document.addEventListener('DOMContentLoaded', async () => {
    
    
    const tableBody = document.getElementById('recipe-table-body');
    const recipes = await getAllRecipes();

    
    tableBody.innerHTML = '';
    
    for(var i = 0 ; i < recipes.length ; i++){
         const row = document.createElement('tr');
    
        row.innerHTML = `
            <td>${i + 1}</td>
            <td>${recipes[i].name}</td>
            <td>${recipes[i].tag}</td>
            <td>${recipes[i].ings} Ingredients</td>
            <td>
                <button class="action-btn view-btn" data-id="${recipes[i].id}">View</button>
                <button class="action-btn edit-btn" data-id="${recipes[i].id}">Edit</button>
                <button class="action-btn delete-btn" data-id="${recipes[i].id}">Delete</button>
            </td>
        `;
    
        tableBody.appendChild(row);
    }
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