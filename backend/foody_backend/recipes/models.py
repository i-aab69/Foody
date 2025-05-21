from django.db import models

class Ingredient(models.Model):
    name = models.CharField(max_length=255) 

class Tag(models.Model):
    name = models.CharField(max_length=255)

class Recipe(models.Model):
    name = models.CharField(max_length=255)
    desc = models.TextField()
    img = models.CharField(max_length=255, blank=True, null=True)

    instructions = models.TextField(blank=True, null=True)
    ingredients = models.ManyToManyField(Ingredient, related_name="recipes")
    tags = models.ManyToManyField(Tag, related_name="recipes_tag")
    
   
