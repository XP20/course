import random
from typing import List

from models.Game import Game
from models.MapTile import MapTile
from models.Vector2D import Vector2D
from models.enums.EnumMapTile import EnumMapTile
from controllers.interfaces.IControllerActor import IControllerActor
from controllers.ControllerActorWarrior import ControllerActorWarrior
from controllers.ControllerActorRider import ControllerActorRider
from models.enums.EnumTribe import EnumTribe

class ControllerGame:
    def __init__(self, x = 100, y = 100):
        self._actor_controllers: List[IControllerActor] = []
        self._size_x = x
        self._size_y = y

    def new_game(self):
        game = Game()

        # Create map
        game.map_size.x = self._size_x
        game.map_size.y = self._size_y

        randomTiles = (EnumMapTile.Ground, EnumMapTile.Ground, EnumMapTile.Ground, EnumMapTile.Ground, EnumMapTile.Ground, EnumMapTile.Mountain)#, EnumMapTile.Water)

        for j in range(game.map_size.y):
            game.map_tiles.append([])
            for i in range(game.map_size.x):
                map_tile = MapTile()
                map_tile.tile_type = random.choice(randomTiles)
                map_tile.position = Vector2D(i, j)

                game.map_tiles[j].append(map_tile)

        # Spawn actors
        warrior = ControllerActorWarrior(EnumTribe.Imperius)
        rider = ControllerActorRider(EnumTribe.Imperius)

        self._actor_controllers.append(warrior)
        self._actor_controllers.append(rider)

        return game
    
    def execute_turn(self, game: Game):
        for actor in self._actor_controllers:
            actor.execute_turn(game)

    def update(self, game: Game, delta_time):
        for actor in self._actor_controllers:
            actor.update(delta_time)