# Generated by Django 3.0.5 on 2020-12-06 12:17

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('game_sessions', '0001_initial'),
        ('users', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='sessions',
            field=models.ManyToManyField(to='game_sessions.Session'),
        ),
    ]
