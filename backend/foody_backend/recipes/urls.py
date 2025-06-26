from django.urls import path
from .views import recipes, recipes_id, ingredients, tags, search_recipes


urlpatterns = [
    path('recipes/', recipes, name='recipes' ),
    path('recipes/<int:id>', recipes_id, name='recipes by id' ),
    path('recipes/search/', search_recipes, name='search_recipes'),
    path('ings/',ingredients ,name='ings'),
    path('tag/',tags , name='tags')
]