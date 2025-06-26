from django.urls import path
from .views import users, favorites, remove_favorite


urlpatterns = [
    path('users/', users, name='users'),
    path('favorites/', favorites, name='favorites'),
    path('favorites/remove/', remove_favorite, name='remove_favorite'),
]