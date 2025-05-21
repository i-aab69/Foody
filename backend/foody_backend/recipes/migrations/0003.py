from django.db import migrations


class Migration(migrations.Migration):
    
    def seed_data(apps, schema_editor):                           # apps provides access to models at migration time
        Tag = apps.get_model("recipes", "Tag")                # get the Tag model
        Ingredient = apps.get_model("recipes", "Ingredient")  # get the Ingredient model
        Recipe = apps.get_model("recipes", "Recipe")          # get the Recipe model
        
        recipes_data = [                                        # list of recipes to seed
            {
                "name": "recipe1",
                "img": "data:image/jpeg;base64,/9j/6zLrSlCpAAAAAAAAADLhan",
                "instructions": "",
                "ings": 3,
                "ingredients": ["ing1", "ing1", "ing1"],
                "tag": ["main course", "dessert", "meal"],
            },
            {
                "name": "recipe2",
                "img": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAA",
                "instructions": "",
                "ings": 6,
                "ingredients": ["ing1", "ing1", "ing1", "ing1", "fish", "egg"],
                "tag": ["main course", "main course", "main course"],
            },
            {
                "name": "recipe3",
                "img": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAAAAAAA",
                "instructions": "asdfghjkl;",
                "ings": 3,
                "ingredients": ["ing1", "ing1", "egg"],
                "tag": ["main course", "dessert"],
            },
            {
                "name": "recipe4",
                "img": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAA",
                "instructions": "so delious",
                "ings": 3,
                "ingredients": ["fish", "egg", "salt"],
                "tag": ["break_fast", "main course"],
            }
        ]

        for recipe in recipes_data:
            recipe_entry = Recipe.objects.create(
                name=recipe["name"],
                img=recipe["img"],
                instructions=recipe["instructions"],
            )

            # Add tags
            for tag_name in recipe["tag"]:
                tag_entry, _ = Tag.objects.get_or_create(name=tag_name)
                recipe_entry.tags.add(tag_entry)

            # Add ingredients
            for ing_name in recipe["ingredients"]:
                ing_entry, _ = Ingredient.objects.get_or_create(name=ing_name)
                recipe_entry.ingredients.add(ing_entry)

    dependencies = [
        ('recipes', '0002_ingredient_tag_recipe_img_recipe_instructions_and_more'),
    ]

    operations = [
        migrations.RunPython(seed_data)
    ]
