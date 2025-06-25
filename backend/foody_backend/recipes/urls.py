from django.urls import path
from .views import recipes, recipes_id, ingredients,tags


urlpatterns = [
    path('recipes/', recipes, name='recipes' ),
    path('recipes/<int:id>', recipes_id, name='recipes by id' ),
    path('ings/',ingredients ,name='ings'),
    path('tag/',tags , name='tags')
]