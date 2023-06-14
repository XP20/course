import random
from typing import List

import pygame
from models.Actor import Actor

from models.Game import Game
from models.MapBuilding import MapBuilding
from models.MapTile import MapTile
from models.Vector2D import Vector2D
from models.enums.EnumBuilding import EnumBuilding
from models.enums.EnumMapTile import EnumMapTile
from controllers.interfaces.IControllerActor import IControllerActor
from controllers.ControllerActorWarrior import ControllerActorWarrior
from controllers.ControllerActorRider import ControllerActorRider
from models.enums.EnumTribe import EnumTribe
from views.components.ComponentButton import ComponentButton

tileHeight = 15
tileWidth = 52

class ControllerGame:
    __instance = None

    @staticmethod
    def instance():
        if ControllerGame.__instance is None:
            ControllerGame.__instance = ControllerGame()
        return ControllerGame.__instance

    def __init__(self, x = 100, y = 100):
        if ControllerGame.__instance is not None:
            raise Exception('Only one instance of ControllerGame is allowed!')
        ControllerGame.__instance = self

        self._actor_controllers: List[IControllerActor] = []
        self.selected_controller: IControllerActor = None
        self._size_x = x
        self._size_y = y

    def new_game(self):
        self.game = Game()

        # Create map
        self.game.map_size.x = self._size_x
        self.game.map_size.y = self._size_y

        randomTiles = (EnumMapTile.Ground, EnumMapTile.Ground, EnumMapTile.Ground, EnumMapTile.Ground, EnumMapTile.Ground, EnumMapTile.Mountain)#, EnumMapTile.Water)

        for j in range(self.game.map_size.y):
            self.game.map_tiles.append([])
            for i in range(self.game.map_size.x):
                map_tile = MapTile()
                map_tile.tile_type = random.choice(randomTiles)
                map_tile.position = Vector2D(i, j)

                self.game.map_tiles[j].append(map_tile)

        # Spawn actors
        self._actor_controllers: List[IControllerActor] = []

        warrior = Actor()
        rider = Actor()
        self.game.actors.append(warrior)
        self.game.actors.append(rider)

        warriorController = ControllerActorWarrior(warrior)
        riderController = ControllerActorRider(rider)
        
        warrior.button = ComponentButton(
            pygame.Rect(0, 0, tileWidth, tileHeight), '')
        rider.button = ComponentButton(
            pygame.Rect(0, 0, tileWidth, tileHeight), '')

        self._actor_controllers.append(warriorController)
        self._actor_controllers.append(riderController)
        self.selected_controller = warriorController

        # Spawn buildings
        for i in range(25):
            building = MapBuilding()
            building.building_type = random.choice([EnumBuilding.City, EnumBuilding.Sawmill])
            building.level = 1
            building.position = Vector2D(random.randint(0, self.game.map_size.x - 1), random.randint(0, self.game.map_size.y - 1))
            building.tribe = random.choice([EnumTribe.Imperius, EnumTribe.Hoodrick])
            building.button = ComponentButton(
                pygame.Rect(0, 0, tileWidth, tileHeight), '')
            self.game.buildings.append(building)

        return self.game
    
    def execute_turn(self, game: Game):
        for actor in self._actor_controllers:
            if actor is not self.selected_controller:
                actor.execute_turn(game)

    def update(self, game: Game, delta_time):
        for actor in self._actor_controllers:
            actor.update(delta_time)