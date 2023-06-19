import math
import random
import time
from typing import List

import pygame
from controllers.CollectionActorController import CollectionActorControllers
from controllers.ControllerMap import ControllerMap
from models.Actor import Actor

from models.Game import Game
from models.MapBuilding import MapBuilding
from models.MapTile import MapTile
from models.Vector2D import Vector2D
from models.enums.EnumActor import EnumActor
from models.enums.EnumBuilding import EnumBuilding
from models.enums.EnumMapTile import EnumMapTile
from controllers.interfaces.IControllerActor import IControllerActor
from models.enums.EnumTribe import EnumTribe
from views.ViewProperties import ViewProperties
from views.components.ComponentButton import ComponentButton
from views.factories.FactoryImperius import FactoryImperius

tileHeight = 15
tileWidth = 52

class ControllerGame:
    __instance = None

    @staticmethod
    def instance():
        if ControllerGame.__instance is None:
            ControllerGame.__instance = ControllerGame()
        return ControllerGame.__instance

    def __init__(self):
        if ControllerGame.__instance is not None:
            raise Exception('Only one instance of ControllerGame is allowed!')
        ControllerGame.__instance = self

        self._actor_controllers: List[IControllerActor] = []
        self.selected_controller: IControllerActor = None
        self.collection_cont_actors = None
        self._size_x = 100
        self._size_y = 100
        self.turn_tribe = EnumTribe.Imperius

    def new_game(self):
        random.seed(time.time())
        self.game = Game()

        self.turn_tribe = EnumTribe.Imperius

        # Reset actors
        self._actor_controllers: List[IControllerActor] = []
        
        # Create map
        self.game.map_size.x = self._size_x
        self.game.map_size.y = self._size_y

        ControllerMap.generate_map(self.game)

        # Spawn buildings
        ControllerMap.generate_initial_buildings(self.game)

        return self.game
    
    def move_selected_actor(self, pos: Vector2D):
        clicked_tile: MapTile = None
        closest = math.inf
        
        for column in self.game.map_tiles:
            for tile in column:
                if tile.tile_type == EnumMapTile.Ground:
                    tilePos = ViewProperties.toTilePos(tile.position.x, tile.position.y)
                    tilePos += Vector2D(ViewProperties.TILE_WIDTH / 2, ViewProperties.TILE_HEIGHT / 2)

                    deltaX = abs(tilePos.x - pos.x)
                    deltaY = abs(tilePos.y - pos.y)
                    distance = deltaX**2 + deltaY**2

                    if distance < closest:
                        clicked_tile = tile
                        closest = distance
        if clicked_tile != None:
            if self.selected_controller != None:
                self.selected_controller.move(clicked_tile)
    
    def execute_turn(self, game: Game):
        # for actor in self._actor_controllers:
        #     if actor is not self.selected_controller:
        #         actor.execute_turn(game)
        self.collection_cont_actors = CollectionActorControllers(self._actor_controllers)
        for tribe, cont_actors in self.collection_cont_actors:
            if tribe == self.turn_tribe:
                for cont_actor in cont_actors:
                    # if cont_actor.actor not in self.turn_actors_played:
                    cont_actor.execute_turn(game)
                        # break
        if self.turn_tribe == EnumTribe.Imperius:
            self.turn_tribe = EnumTribe.Hoodrick
        else:
            self.turn_tribe = EnumTribe.Imperius
        self.game.turn += 1

    def update(self, game: Game, delta_time):
        for actor in self._actor_controllers:
            actor.update(delta_time)