from django.shortcuts import render, get_object_or_404
from django.http import HttpRequest, HttpResponse, JsonResponse
from .models import Recipe, Tag, Ingredient
from django.core.serializers import serialize
import json
from django.views.decorators.csrf import csrf_exempt
from django.db.models.fields.related import ManyToManyField
# Create your views here.

@csrf_exempt
def recipes(request: HttpRequest):
    if request.method == 'GET':
        recipes_set = Recipe.objects.all()
        J_recipes_set = serialize('json', recipes_set)
        response = HttpResponse(J_recipes_set, content_type='application/json')
        return response
    
    elif request.method == 'POST':
        try:
            J_data = json.loads(request.body)
            new_recipe = Recipe(name=J_data.get('name'), img=J_data.get('img'), instructions=J_data.get('instructions'))
            new_recipe.save()

            tags_data = J_data.get('tags')
            if tags_data:
                for tag_name in tags_data:
                    tag, _ = Tag.objects.get_or_create(name=tag_name)
                    new_recipe.tags.add(tag)

            ing_data = J_data.get('ings')
            if ing_data:
                for ing_name in ing_data:
                    ing, _ =  Ingredient.objects.get_or_create(name=ing_name)
                    new_recipe.ingredients.add(ing) 

            return JsonResponse( new_recipe.id, status=201, safe=False)
        except json.JSONDecodeError :
            return JsonResponse({'error':'invalid json data'}, status=400)

@csrf_exempt
def recipes_id(request: HttpRequest, id : int):
    Selected_recipe = get_object_or_404(Recipe,id = id)
    if request.method == 'DELETE':
        deleted_count,_ = Selected_recipe.delete()
        
        if deleted_count :
            return JsonResponse({'message' : 'recipe deleted'}, status=204)
        else :
            return JsonResponse({'error' : 'delete failed'}, status=400)
        
    elif request.method == 'GET':
        recipe_json = serialize('json', [Selected_recipe])
        response = HttpResponse(recipe_json,content_type='application/json')
        return response
    
    elif request.method == 'PATCH':
        changed_obj = json.loads(request.body)
        M2M  = [field.name  for field in Selected_recipe._meta.get_fields() if isinstance(field, ManyToManyField)]
        m2m_changes = {}
        for field,value in changed_obj.items():
            if field in M2M :
                if field == 'ingredients':
                    for ing in value:
                        try:
                            to_remove = Ingredient.objects.filter(name__iexact = ing.get("old_name")).first()
                            Selected_recipe.ingredients.remove(to_remove)
                        except Ingredient.DoesNotExist:
                            pass
                        
                        new_ing,_ = Ingredient.objects.get_or_create(name = ing.get('new_name'))
                        Selected_recipe.ingredients.add(new_ing)

                        if 'ingredients' not in m2m_changes:
                            m2m_changes['ingredients'] = []
                        m2m_changes['ingredients'].append(new_ing.pk)

                elif field == 'tags':
                    for tag in value:
                        try:
                            to_remove = Tag.objects.filter(name__iexact = tag.get("old_name")).first()
                            Selected_recipe.tags.remove(to_remove)
                        except Tag.DoesNotExist:
                            pass
                        
                        new_tag,_ = Tag.objects.get_or_create(name = tag.get('new_name'))
                        Selected_recipe.tags.add(new_tag)

                        if 'tags' not in m2m_changes:
                            m2m_changes['tags'] = []
                        m2m_changes['tags'].append(new_tag.pk)
            
            else :
                setattr(Selected_recipe,field,value)

        Selected_recipe.save()
        if m2m_changes:
            return JsonResponse(m2m_changes,status = 200)        
        else:
            return HttpResponse(status = 204)

        
            
                


@csrf_exempt
def ingredients(request : HttpRequest) :
     
     if request.method == 'GET':
        ing_set = Ingredient.objects.all()
        J_ing_set = serialize('json', ing_set)
        response = HttpResponse(J_ing_set, content_type='application/json')
        return response
     
@csrf_exempt
def tags(request : HttpRequest) :
     
     if request.method == 'GET':
        tag_set = Tag.objects.all()
        J_tag_set = serialize('json', tag_set)
        response = HttpResponse(J_tag_set, content_type='application/json')
        return response
        
