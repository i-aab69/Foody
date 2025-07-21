from django.shortcuts import render
import json
from .models import User, Favorite
from django.http import HttpResponse, JsonResponse,HttpRequest
from django.core.serializers import serialize
from django.views.decorators.csrf import csrf_exempt
# Create your views here.

@csrf_exempt
def users(request : HttpRequest):
    if request.method == 'GET':
        users_set = User.objects.all()
        J_users_set = serialize('json', users_set)
        response = HttpResponse(J_users_set, content_type='application/json')
        return response
    
    elif request.method == 'POST':
        try:
            J_data = json.loads(request.body)
            new_user = User(username=J_data.get('UserName'), email=J_data.get('email'), password=J_data.get('password'),  is_admin=J_data.get('Role'))
            new_user.save()
            return JsonResponse({'id': new_user.pk}, status=201)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'invalid json data'}, status=400)

@csrf_exempt
def favorites(request: HttpRequest):
    if request.method == 'GET':
        user_name = request.GET.get('user_name')
        if user_name:
            user_favorites = Favorite.objects.filter(user_name=user_name)
            favorites_data = [{'recipe_id': fav.recipe_id, 'created_at': fav.created_at} for fav in user_favorites]
            return JsonResponse({'favorites': favorites_data})
        else:
            return JsonResponse({'error': 'user_name parameter required'}, status=400)
    
    elif request.method == 'POST':
        try:
            data = json.loads(request.body)
            user_name = data.get('user_name')
            recipe_id = data.get('recipe_id')
            
            if not user_name or not recipe_id:
                return JsonResponse({'error': 'user_name and recipe_id required'}, status=400)
            
            favorite, created = Favorite.objects.get_or_create(
                user_name=user_name, 
                recipe_id=recipe_id
            )
            
            if created:
                return JsonResponse({'message': 'Added to favorites', 'recipe_id': recipe_id}, status=201)
            else:
                return JsonResponse({'message': 'Already in favorites', 'recipe_id': recipe_id}, status=200)
                
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

@csrf_exempt 
def remove_favorite(request: HttpRequest):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            user_name = data.get('user_name')
            recipe_id = data.get('recipe_id')
            
            if not user_name or not recipe_id:
                return JsonResponse({'error': 'user_name and recipe_id required'}, status=400)
            
            deleted_count, _ = Favorite.objects.filter(
                user_name=user_name, 
                recipe_id=recipe_id
            ).delete()
            
            if deleted_count > 0:
                return JsonResponse({'message': 'Removed from favorites', 'recipe_id': recipe_id}, status=200)
            else:
                return JsonResponse({'message': 'Not in favorites', 'recipe_id': recipe_id}, status=404)
                
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    
    return JsonResponse({'error': 'Method not allowed'}, status=405)