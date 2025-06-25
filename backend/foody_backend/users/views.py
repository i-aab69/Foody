from django.shortcuts import render
import json
from .models import User
from django.http import HttpResponse, JsonResponse,HttpRequest
from django.core.serializers import serialize
from django.views.decorators.csrf import csrf_exempt
# Create your views here.

@csrf_exempt
def users(request : HttpRequest):
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
        return JsonResponse({'message': 'User created successfully'}, status=201)
    
    elif request.method == 'GET':
        users_set = User.objects.all()
        J_users_set = serialize('json', users_set)
        response = HttpResponse(J_users_set, content_type='application/json')
        return response