import math
import random
import struct
import time
from typing import Dict, List
import uuid

import pygame
from controllers.CollectionActorController import CollectionActorControllers
from controllers.ControllerActorKnight import ControllerActorKnight
from controllers.ControllerActorRider import ControllerActorRider
from controllers.ControllerActorWarrior import ControllerActorWarrior
from controllers.ControllerMap import ControllerMap

from models.Game import Game
from models.MapBuilding import MapBuilding
from models.MapItem import MapItem
from models.MapTile import MapTile
from models.Vector2D import Vector2D
from models.enums.EnumActor import EnumActor
from models.enums.EnumBuilding import EnumBuilding
from models.enums.EnumMapItem import EnumMapItem
from models.enums.EnumMapTile import EnumMapTile
from controllers.interfaces.IControllerActor import IControllerActor
from models.enums.EnumTribe import EnumTribe
from views.ViewProperties import ViewProperties

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

        # Actor controllers by actor type
        self.controller_by_actor_type: Dict[EnumActor, callable] = {
            EnumActor.Warrior: ControllerActorWarrior,
            EnumActor.Rider: ControllerActorRider,
            EnumActor.Knight: ControllerActorKnight,
        }

    def new_game(self):
        random.seed(time.time())
        self.game = Game()

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
    
    def execute_turn(self):
        self.collection_cont_actors = CollectionActorControllers(self._actor_controllers)
        for tribe, cont_actors in self.collection_cont_actors:
            if tribe == self.game.turn_tribe:
                for cont_actor in cont_actors:
                    cont_actor.execute_turn(self.game)
        if self.game.turn_tribe == EnumTribe.Imperius:
            self.game.turn_tribe = EnumTribe.Hoodrick
        else:
            self.game.turn_tribe = EnumTribe.Imperius
        self.game.turn += 1

    def update(self, delta_time):
        for actor in self._actor_controllers:
            actor.update(delta_time)

    def setup_game(self):
        # Remake actor controllers
        self.selected_controller = None
        self._actor_controllers.clear()
        for actor in self.game.actors:
            actor_type = actor.actor_type
            controller = self.controller_by_actor_type[actor_type](actor)
            self._actor_controllers.append(controller)

    def save_game(self):
        enum_tile_idx = {
            EnumMapTile.NotSet: 0,
            EnumMapTile.Ground: 1,
            EnumMapTile.Mountain: 2,
            EnumMapTile.Water: 3
        }

        enum_actor_type_idx = {
            EnumActor.NotSet: 0,
            EnumActor.Warrior: 1,
            EnumActor.Rider: 2,
            EnumActor.Knight: 3
        }

        enum_map_item_idx = {
            EnumMapItem.NotSet: 0,
            EnumMapItem.Forrest: 1,
            EnumMapItem.Fruit: 2
        }

        enum_building_type_idx = {
            EnumBuilding.NotSet: 0,
            EnumBuilding.Sawmill: 1,
            EnumBuilding.City: 2
        }
        
        enum_tribe_idx = {
            EnumTribe.NotSet: 0,
            EnumTribe.Hoodrick: 1,
            EnumTribe.Imperius: 2
        }

        game = self.game
        all_packed = b''

        # Pack formats
        general_packed_format = "<IIIIiiIiII"
        count_packed_format = "<IIIII"
        map_tiles_packed_format = "<iiI"
        map_items_packed_format = "<iiI"
        buildings_packed_format = "<36siiIII"
        actors_packed_format = "<36siiIIIIIIII"

        general_packed = struct.pack(
            general_packed_format,
            game.map_size.x,
            game.map_size.y,
            game.window_size.x,
            game.window_size.y,
            game.window_location.x,
            game.window_location.y,
            game.turn,
            game.stars,
            enum_tribe_idx[game.player_tribe],
            enum_tribe_idx[game.turn_tribe]
        )
        all_packed += general_packed

        count_packed = struct.pack(
            count_packed_format,
            game.map_size.y,
            game.map_size.x,
            len(game.items),
            len(game.buildings),
            len(game.actors)
        )
        all_packed += count_packed

        map_tiles_packed = b''
        for j in range(game.map_size.y):
            for i in range(game.map_size.x):
                map_tile = game.map_tiles[j][i]
                map_tile_packed = struct.pack(
                    map_tiles_packed_format,
                    map_tile.position.x,
                    map_tile.position.y,
                    enum_tile_idx[map_tile.tile_type]
                )
                map_tiles_packed += map_tile_packed
        all_packed += map_tiles_packed

        map_items_packed = b''
        for map_item in game.items:
            map_item_packed = struct.pack(
                map_items_packed_format,
                map_item.position.x,
                map_item.position.y,
                enum_map_item_idx[map_item.item_type]
            )
            map_items_packed += map_item_packed
        all_packed += map_items_packed

        buildings_packed = b''
        for building in game.buildings:
            building_uuid = str(building.uuid).encode('UTF-8')
            building_packed = struct.pack(
                buildings_packed_format,
                building_uuid,
                building.position.x,
                building.position.y,
                enum_building_type_idx[building.building_type],
                enum_tribe_idx[building.tribe],
                building.level
            )
            buildings_packed += building_packed
        all_packed += buildings_packed

        actors_packed = b''
        for actor in game.actors:
            actor_uuid = str(actor.uuid).encode('UTF-8')
            actor_packed = struct.pack(
                actors_packed_format,
                actor_uuid,
                actor.position.x,
                actor.position.y,
                enum_actor_type_idx[actor.actor_type],
                enum_tribe_idx[actor.tribe],
                actor.cost_stars,
                actor.move_steps,
                actor.power_attack,
                actor.power_defense,
                actor.experience,
                actor.level
            )
            actors_packed += actor_packed
        all_packed += actors_packed
  
        with open('state.bin', 'wb') as fp:
            fp.write(all_packed)

    def load_game(self):
        enum_tile_by_idx = {
            0: EnumMapTile.NotSet,
            1: EnumMapTile.Ground,
            2: EnumMapTile.Mountain,
            3: EnumMapTile.Water
        }

        enum_actor_type_by_idx = {
            0: EnumActor.NotSet,
            1: EnumActor.Warrior,
            2: EnumActor.Rider,
            3: EnumActor.Knight 
        }

        enum_map_item_by_idx = {
            0: EnumMapItem.NotSet,
            1: EnumMapItem.Forrest,
            2: EnumMapItem.Fruit
        }

        enum_building_type_by_idx = {
            0: EnumBuilding.NotSet,
            1: EnumBuilding.Sawmill,
            2: EnumBuilding.City
        }
        
        enum_tribe_by_idx = {
            0: EnumTribe.NotSet,
            1: EnumTribe.Hoodrick,
            2: EnumTribe.Imperius
        }

        self.game = Game()
        game = self.game

        with open('state.bin', 'rb') as fp:
            # General data
            map_size_x_raw = fp.read(4)
            map_size_y_raw = fp.read(4)
            window_size_x_raw = fp.read(4)
            window_size_y_raw = fp.read(4)
            window_location_x_raw = fp.read(4)
            window_location_y_raw = fp.read(4)
            turns_raw = fp.read(4)
            stars_raw = fp.read(4)
            player_tribe_idx_raw = fp.read(4)
            turn_tribe_idx_raw = fp.read(4)

            player_tribe_idx = struct.unpack('<I', player_tribe_idx_raw)[0]
            turn_tribe_idx = struct.unpack('<I', turn_tribe_idx_raw)[0]
            
            game.map_size.x = struct.unpack('<I', map_size_x_raw)[0]
            game.map_size.y = struct.unpack('<I', map_size_y_raw)[0]
            game.window_size.x = struct.unpack('<I', window_size_x_raw)[0]
            game.window_size.y = struct.unpack('<I', window_size_y_raw)[0]
            game.window_location.x = struct.unpack('<i', window_location_x_raw)[0]
            game.window_location.y = struct.unpack('<i', window_location_y_raw)[0]
            game.turn = struct.unpack('<I', turns_raw)[0]
            game.stars = struct.unpack('<i', stars_raw)[0]
            game.player_tribe = enum_tribe_by_idx[player_tribe_idx]
            game.turn_tribe = enum_tribe_by_idx[turn_tribe_idx]

            # Lengths of lists
            count_map_y_raw = fp.read(4)
            count_map_x_raw = fp.read(4)
            count_items_raw = fp.read(4)
            count_buildings_raw = fp.read(4)
            count_actors_raw = fp.read(4)
            count_map_y = struct.unpack('<I', count_map_y_raw)[0]
            count_map_x = struct.unpack('<I', count_map_x_raw)[0]
            count_items = struct.unpack('<I', count_items_raw)[0]
            count_buildings = struct.unpack('<I', count_buildings_raw)[0]
            count_actors = struct.unpack('<I', count_actors_raw)[0]

            # Map tiles
            for j in range(count_map_y):
                game.map_tiles.append([])
                for _ in range(count_map_x):
                    map_tile = MapTile()
                    
                    tile_position_x_raw = fp.read(4)
                    tile_position_y_raw = fp.read(4)
                    tile_type_idx_raw = fp.read(4)
                    tile_position_x = struct.unpack('<i', tile_position_x_raw)[0]
                    tile_position_y = struct.unpack('<i', tile_position_y_raw)[0]
                    tile_type_idx = struct.unpack('<I', tile_type_idx_raw)[0]
                    
                    map_tile.position = Vector2D(tile_position_x, tile_position_y)
                    map_tile.tile_type = enum_tile_by_idx[tile_type_idx]
                    game.map_tiles[j].append(map_tile)

            # Map items
            for _ in range(count_items):
                map_item = MapItem()

                item_position_x_raw = fp.read(4)
                item_position_y_raw = fp.read(4)
                item_type_idx_raw = fp.read(4)
                item_position_x = struct.unpack('<i', item_position_x_raw)[0]
                item_position_y = struct.unpack('<i', item_position_y_raw)[0]
                item_type_idx = struct.unpack('<I', item_type_idx_raw)[0]

                map_item.position = Vector2D(item_position_x, item_position_y)
                map_item.item_type = enum_map_item_by_idx[item_type_idx]
                game.items.append(map_item)

            # Buildings
            for _ in range(count_buildings):
                building = MapBuilding()

                building_uuid_str_raw = fp.read(36)
                building_position_x_raw = fp.read(4)
                building_position_y_raw = fp.read(4)
                building_type_idx_raw = fp.read(4)
                building_tribe_idx_raw = fp.read(4)
                building_level_raw = fp.read(4)
                building_uuid_str = struct.unpack('<36s', building_uuid_str_raw)[0]
                building_position_x = struct.unpack('<i', building_position_x_raw)[0]
                building_position_y = struct.unpack('<i', building_position_y_raw)[0]
                building_type_idx = struct.unpack('<I', building_type_idx_raw)[0]
                building_tribe_idx = struct.unpack('<I', building_tribe_idx_raw)[0]
                building_level = struct.unpack('<I', building_level_raw)[0]

                building.uuid = uuid.UUID(building_uuid_str.decode('UTF-8'))
                building.position = Vector2D(building_position_x, building_position_y)
                building.building_type = enum_building_type_by_idx[building_type_idx]
                building.tribe = enum_tribe_by_idx[building_tribe_idx]
                building.level = building_level
                game.buildings.append(building)

            # Actors
            for _ in range(count_actors):
                actor = MapBuilding()

                actor_uuid_str_raw = fp.read(36)
                actor_position_x_raw = fp.read(4)
                actor_position_y_raw = fp.read(4)
                actor_type_idx_raw = fp.read(4)
                actor_tribe_idx_raw = fp.read(4)
                actor_cost_stars_raw = fp.read(4)
                actor_move_steps_raw = fp.read(4)
                actor_power_attack_raw = fp.read(4)
                actor_power_defense_raw = fp.read(4)
                actor_experience_raw = fp.read(4)
                actor_level_raw = fp.read(4)
                actor_uuid_str = struct.unpack('<36s', actor_uuid_str_raw)[0]
                actor_position_x = struct.unpack('<i', actor_position_x_raw)[0]
                actor_position_y = struct.unpack('<i', actor_position_y_raw)[0]
                actor_type_idx = struct.unpack('<I', actor_type_idx_raw)[0]
                actor_tribe_idx = struct.unpack('<I', actor_tribe_idx_raw)[0]
                actor_cost_stars = struct.unpack('<I', actor_cost_stars_raw)[0]
                actor_move_steps = struct.unpack('<I', actor_move_steps_raw)[0]
                actor_power_attack = struct.unpack('<I', actor_power_attack_raw)[0]
                actor_power_defense = struct.unpack('<I', actor_power_defense_raw)[0]
                actor_experience =struct.unpack('<I', actor_experience_raw)[0]
                actor_level = struct.unpack('<I', actor_level_raw)[0]

                actor.uuid = uuid.UUID(actor_uuid_str.decode('UTF-8'))
                actor.position = Vector2D(actor_position_x, actor_position_y)
                actor.actor_type = enum_actor_type_by_idx[actor_type_idx]
                actor.tribe = enum_tribe_by_idx[actor_tribe_idx]
                actor.cost_stars = actor_cost_stars
                actor.move_steps = actor_move_steps
                actor.power_attack = actor_power_attack
                actor.power_defense = actor_power_defense
                actor.experience = actor_experience
                actor.level = actor_level
                game.actors.append(actor)