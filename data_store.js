


let check = localStorage.getItem('id')
 if(check == '1'){
    for (let index = 0; index < localStorage.length; index++) {
        localStorage.removeItem(localStorage.key(index));
        
    }

 }

document.getElementById('Save').addEventListener('click', function(){
    let find = false;
    
    let number_of_ing = document.getElementById('ingredients-list').children.length
    let real_number_of_ing = number_of_ing 
    for(let i = 0; i<number_of_ing; i++){
        let ing = document.getElementById('ingredients-list').children[i].children[0].value
        if(ing == ""){
            real_number_of_ing = real_number_of_ing - 1
        }  
    }
        console.log('number of ing',number_of_ing)
        console.log('real number of ing',real_number_of_ing)
        if(document.getElementById('recipe-name').value == "" || document.getElementById('tag_name').value == "" || real_number_of_ing == 0){
            localStorage.setItem('is_there',find)
            
            alert('you miss something name or ing or tage of recipe')
    }else{
        let recipe_name = document.getElementById('recipe-name').value
        let tag_name = document.getElementById('tag_name').value
        find = true;
        console.log(recipe_name)
        console.log('not empty')
        localStorage.setItem('number_of_ing',real_number_of_ing)
        localStorage.setItem('recipeName',recipe_name)
        localStorage.setItem('tag_name',tag_name)
        localStorage.setItem('is_there',find)
        let recipe = { id: localStorage.getItem('id'), name:localStorage.getItem('recipeName'),tag: localStorage.getItem('tag_name'), ings:localStorage.getItem('number_of_ing')}
        localStorage.setItem('recipe'+localStorage.getItem('id'),JSON.stringify(recipe))
        let id = localStorage.getItem('id')
        localStorage.setItem('id',id - 1 + 2)

        localStorage.removeItem('number_of_ing')
        localStorage.removeItem('recipeName')
        localStorage.removeItem('tag_name')
        
        // for (let index = 0; index < Number(localStorage.getItem('id')); index++) {
        //     all_recipe.push(localStorage.getItem(localStorage.key(index + 2))) 
            
        // }
        
    }
})
