# Generated by Django 3.0.5 on 2020-12-13 00:34

from django.db import migrations, models
import django.db.models.deletion
import wzrd.games.models


class Migration(migrations.Migration):

    dependencies = [
        ('games', '0002_session_map'),
    ]

    operations = [
        migrations.CreateModel(
            name='Hero',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.TextField(blank=True)),
                ('race', models.TextField(blank=True, default='Human')),
                ('sex', models.TextField(blank=True, default='TREBUSHET')),
            ],
        ),
        migrations.CreateModel(
            name='HeroSession',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('game_data', wzrd.games.models.GameObjectsField(blank=True, default=dict)),
                ('base', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='hero_sessions', related_query_name='hero_session', to='games.Hero')),
                ('session', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='heroes', related_query_name='hero', to='games.Session')),
            ],
        ),
    ]
