import random
from typing import List

from models.Game import Game
from models.MapTile import MapTile
from models.Vector2D import Vector2D
from models.enums.EnumMapTileType import EnumMapTileType
from controllers.ControllerActor import ControllerActor
from controllers.ControllerActorWarrior import ControllerActorWarrior
from controllers.ControllerActorRider import ControllerActorRider

class ControllerGame:
    def __init__(self):
        self._actor_controllers: List[ControllerActor] = []

    def new_game(self):
        game = Game()

        # Create map
        game.map_size.x = 100
        game.map_size.y = 100

        randomTiles = (EnumMapTileType.Ground, EnumMapTileType.Ground, EnumMapTileType.Ground, EnumMapTileType.Ground, EnumMapTileType.Ground, EnumMapTileType.Mountain)#, EnumMapTileType.Water)

        for j in range(game.map_size.y):
            game.map_tiles.append([])
            for i in range(game.map_size.x):
                map_tile = MapTile()
                map_tile.tile_type = random.choice(randomTiles)
                map_tile.position = Vector2D(i, j)

                game.map_tiles[j].append(map_tile)

        # Spawn actors
        warrior = ControllerActorWarrior()
        rider = ControllerActorRider()

        self._actor_controllers.append(warrior)
        self._actor_controllers.append(rider)

        return game
    
    def execute_turn(self, game: Game):
        pass

    def update(self, game: Game, delta_time):
        pass