from django.urls import path
from .views import recipes, recipes_id


urlpatterns = [
    path('recipes/', recipes, name='recipes' ),
    path('recipes/<int:id>', recipes_id, name='recipes by id' ),
    path('ingredients/', ,name='ings'),
    path('tag/', , name='tags')
]