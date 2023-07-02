import random
from typing import List
from loguru import logger

import uuid
from models.Game import Game
from models.MapBuilding import MapBuilding
from models.MapTile import MapTile
from models.Vector2D import Vector2D
from models.enums.EnumBuilding import EnumBuilding
from models.enums.EnumMapTile import EnumMapTile
from models.enums.EnumTribe import EnumTribe

class ControllerMap:
    @staticmethod
    def generate_map(game: Game) -> List[List[MapTile]]:
        is_success = False
        try:
            randomTiles = (EnumMapTile.Ground, EnumMapTile.Ground, EnumMapTile.Ground, EnumMapTile.Ground, EnumMapTile.Ground, EnumMapTile.Mountain)#, EnumMapTile.Water)

            for j in range(game.map_size.y):
                game.map_tiles.append([])
                for i in range(game.map_size.x):
                    map_tile = MapTile()
                    map_tile.tile_type = random.choice(randomTiles)
                    map_tile.position = Vector2D(i, j)

                    game.map_tiles[j].append(map_tile)

            is_success = True
        except Exception as e:
            logger.exception(e)
        return is_success
    
    @staticmethod
    def get_all_map_tiles_by_type(game: Game, map_tile_type: EnumMapTile):
        map_tiles = []
        try:
            for j in range(game.map_size.y):
                for i in range(game.map_size.x):
                    map_tile = game.map_tiles[j][i]
                    if map_tile.tile_type == map_tile_type:
                        map_tiles.append(map_tile)
        except Exception as e:
            logger.exception(e)
        return map_tiles

    @staticmethod
    def generate_initial_buildings(game: Game):
        is_success = False
        try:
            for _ in range(50):
                building = MapBuilding()
                building.building_type = random.choice([EnumBuilding.City, EnumBuilding.Sawmill])
                building.level = 1
                building.position = Vector2D(random.randint(0, game.map_size.x - 1), random.randint(0, game.map_size.y - 1))
                building.tribe = random.choice([EnumTribe.Imperius, EnumTribe.Hoodrick])
                building.uuid = uuid.uuid4()
                
                game.buildings.append(building)
            
            is_success = True
        except Exception as e:
            logger.exception(e)
        return is_success