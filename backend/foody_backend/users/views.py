from django.shortcuts import render
import json
from .models import User
from django.http import HttpResponse, JsonResponse
# Create your views here.
def users(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')
        is_admin = data.get('is_admin', False)
        user = User.objects.create(
            username=username,
            email=email,
            password=password,
            is_admin=is_admin
        )
        user.save()
        favorite_recipes = data.get('favorite_recipes', [])
        for recipe_id in favorite_recipes:
            try:
                recipe = Recipe.objects.get(id=recipe_id)
                user.favorite_recipes.add(recipe)
            except Recipe.DoesNotExist:
                return HttpResponse(status=404)
        return JsonResponse({'message': 'User created successfully'}, status=201)
