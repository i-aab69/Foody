from django.db import models
from recipes.models import Recipe
# Create your models here.
class User(models.Model):
    username = models.CharField(max_length=150, unique=True)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=128) 
    is_admin = models.BooleanField(default=False)
    favorite_recipes = models.ManyToManyField(Recipe, related_name='favorited_by', blank=True)

    def __str__(self):
        return self.username

class Favorite(models.Model):
    user_name = models.CharField(max_length=255)
    recipe_id = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ('user_name', 'recipe_id')