# Generated by Django 5.1.7 on 2025-03-27 21:48

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("api", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="note",
            name="tags",
            field=models.TextField(blank=True, null=True),
        ),
    ]
