from django.shortcuts import render, get_object_or_404
from django.http import HttpRequest, HttpResponse, JsonResponse
from .models import Recipe, Tag, Ingredient
from django.core.serializers import serialize
import json
from django.views.decorators.csrf import csrf_exempt
from django.db.models.fields.related import ManyToManyField
from django.db.models import Q
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
def search_recipes(request: HttpRequest):
    if request.method == 'GET':
        query = request.GET.get('q', '').strip()
        ingredients = request.GET.get('ingredients', '').strip()
        tags = request.GET.get('tags', '').strip()
        
        # Pagination parameters
        page = int(request.GET.get('page', 1))
        limit = int(request.GET.get('limit', 20))
        offset = (page - 1) * limit
        
        recipes_queryset = Recipe.objects.all()
        
        # Filter by recipe name if query provided
        if query:
            recipes_queryset = recipes_queryset.filter(name__icontains=query)
        
        # Filter by ingredients if provided
        if ingredients:
            ingredient_list = [ing.strip() for ing in ingredients.split(',') if ing.strip()]
            for ingredient in ingredient_list:
                recipes_queryset = recipes_queryset.filter(
                    ingredients__name__icontains=ingredient
                )
        
        # Filter by tags if provided
        if tags:
            tag_list = [tag.strip() for tag in tags.split(',') if tag.strip()]
            for tag in tag_list:
                recipes_queryset = recipes_queryset.filter(
                    tags__name__icontains=tag
                )
        
        # Get distinct recipes and apply pagination
        recipes_queryset = recipes_queryset.distinct()
        total_count = recipes_queryset.count()
        paginated_recipes = recipes_queryset[offset:offset + limit]
        
        # Serialize and return results
        recipes_data = []
        for recipe in paginated_recipes:
            recipe_dict = {
                'pk': recipe.pk,
                'name': recipe.name,
                'desc': recipe.desc,
                'img': recipe.img,
                'instructions': recipe.instructions,
                'ingredients': [ing.name for ing in recipe.ingredients.all()],
                'tags': [tag.name for tag in recipe.tags.all()]
            }
            recipes_data.append(recipe_dict)
        
        return JsonResponse({
            'recipes': recipes_data,
            'count': len(recipes_data),
            'total_count': total_count,
            'page': page,
            'limit': limit,
            'has_more': offset + limit < total_count,
            'query': query,
            'ingredients': ingredients,
            'tags': tags
        })
    
    return JsonResponse({'error': 'Method not allowed'}, status=405)

@csrf_exempt
def recipes_id(request: HttpRequest, id : int):
    Selected_recipe = get_object_or_404(Recipe,id = id)
    if request.method == 'DELETE':
        deleted_count,_ = Selected_recipe.delete()
        
        if deleted_count :
            return JsonResponse({'message' : 'recipe deleted', 'recipe_id': id}, status=200)
        else :
            return JsonResponse({'error' : 'delete failed'}, status=400)
        
    elif request.method == 'GET':
        recipe_json = serialize('json', [Selected_recipe])
        response = HttpResponse(recipe_json,content_type='application/json')
        return response
    
    elif request.method == 'PATCH':
        try:
            changed_obj = json.loads(request.body)
            print(f"PATCH request data: {changed_obj}")  # Debug log
            M2M  = [field.name  for field in Selected_recipe._meta.get_fields() if isinstance(field, ManyToManyField)]
            m2m_changes = {}
            
            for field,value in changed_obj.items():
                if field in M2M :
                    if field == 'ingredients':
                        for ing in value:
                            old_name = ing.get("old_name")
                            new_name = ing.get("new_name")
                            
                            # Remove old ingredient if specified
                            if old_name:
                                try:
                                    to_remove = Ingredient.objects.filter(name__iexact=old_name).first()
                                    if to_remove:
                                        Selected_recipe.ingredients.remove(to_remove)
                                except (Ingredient.DoesNotExist, AttributeError):
                                    pass
                            
                            # Add new ingredient if specified
                            if new_name:
                                try:
                                    new_ing, _ = Ingredient.objects.get_or_create(name=new_name)
                                    Selected_recipe.ingredients.add(new_ing)
                                    
                                    if 'ingredients' not in m2m_changes:
                                        m2m_changes['ingredients'] = []
                                    m2m_changes['ingredients'].append(new_ing.pk)
                                except Exception as e:
                                    print(f"Error adding ingredient {new_name}: {e}")

                    elif field == 'tags':
                        for tag in value:
                            old_name = tag.get("old_name")
                            new_name = tag.get("new_name")
                            
                            # Remove old tag if specified
                            if old_name:
                                try:
                                    to_remove = Tag.objects.filter(name__iexact=old_name).first()
                                    if to_remove:
                                        Selected_recipe.tags.remove(to_remove)
                                except (Tag.DoesNotExist, AttributeError):
                                    pass
                            
                            # Add new tag if specified
                            if new_name:
                                try:
                                    new_tag, _ = Tag.objects.get_or_create(name=new_name)
                                    Selected_recipe.tags.add(new_tag)
                                    
                                    if 'tags' not in m2m_changes:
                                        m2m_changes['tags'] = []
                                    m2m_changes['tags'].append(new_tag.pk)
                                except Exception as e:
                                    print(f"Error adding tag {new_name}: {e}")
                
                else :
                    setattr(Selected_recipe,field,value)

            Selected_recipe.save()
            if m2m_changes:
                return JsonResponse(m2m_changes,status = 200)        
            else:
                return HttpResponse(status = 204)
                
        except Exception as e:
            print(f"PATCH error: {e}")  # Debug log
            return JsonResponse({'error': str(e)}, status=500)

        
            
                


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
        
