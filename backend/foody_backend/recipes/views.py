from django.shortcuts import render, get_object_or_404
from django.http import HttpRequest, HttpResponse, JsonResponse
from .models import Recipe, Tag, Ingredient
from django.core.serializers import serialize
import json
from django.views.decorators.csrf import csrf_exempt
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


def recipes_id(request: HttpRequest, id : int):
    pass