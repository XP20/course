import random
import time
import math
import pygame
from pygame import Rect, Surface
from typing import Dict, List
from models.Actor import Actor

from models.MapBuilding import MapBuilding
from models.Vector2D import Vector2D
from models.MapTile import MapTile

from models.enums.EnumActor import EnumActor
from models.enums.EnumBuilding import EnumBuilding
from models.enums.EnumMapTile import EnumMapTile
from models.enums.EnumTribe import EnumTribe

from controllers.ControllerGame import ControllerGame
from controllers.interfaces.IControllerActor import IControllerActor
from controllers.ControllerActorWarrior import ControllerActorWarrior
from controllers.ControllerActorRider import ControllerActorRider

from views.resources.ResourceFactoryHoodrick import ResourceFactoryHoodrick
from views.resources.ResourceFactoryImperius import ResourceFactoryImperius
from views.components.ComponentButton import ComponentButton

tileHeight = 15
tileWidth = 52

screenWidth = 520
screenHeight = 500

cullMargin = 100

class WindowMain:
    __instance = None

    @staticmethod
    def instance():
        if WindowMain.__instance is None:
            WindowMain.__instance = WindowMain()
        return WindowMain.__instance

    def __init__(self):
        if WindowMain.__instance is not None:
            raise Exception('Only one instance of WinodwMain is allowed!')
        WindowMain.__instance = self

        self.screen = pygame.display.set_mode(
            (screenWidth, screenHeight)
        )
        self.is_game_running = True

        # Resource factories
        resourceFactoryImperius = ResourceFactoryImperius()
        resourceFactoryHoodrick = ResourceFactoryHoodrick()

        self.resource_factories_by_tribes = {
            EnumTribe.Imperius: resourceFactoryImperius,
            EnumTribe.Hoodrick: resourceFactoryHoodrick,
        }

        # Surfaces
        self.surfaces_by_building = {}

        self.surfaces_by_map_tiles = {
            EnumMapTile.Ground: pygame.image.load('./resources/Tribes/Imperius/Imperius ground.png').convert_alpha(),
            EnumMapTile.Mountain: pygame.image.load('./resources/Tribes/Imperius/Imperius mountain.png').convert_alpha(),
        }

        self.surfaces_by_actor = {
            EnumActor.Rider: pygame.image.load('./resources/Units/Sprites/Rider.png').convert_alpha(),
            EnumActor.Warrior: pygame.image.load('./resources/Units/Sprites/Warrior.png').convert_alpha(),
        }

        # Offsets
        self.offsets_by_tile = {
            EnumMapTile.Ground: Vector2D(0, 0),
            EnumMapTile.Mountain: Vector2D(-6, -17),
        }

        self.offsets_by_actor = {
            EnumActor.Rider: Vector2D(6, -22),
            EnumActor.Warrior: Vector2D(4, -20),
        }

        self.offsets_by_building = {
            EnumBuilding.City: Vector2D(1, -20),
            EnumBuilding.Sawmill: Vector2D(0, 0),
        }

        self.camSpeed = 18
        self.camPosition = Vector2D()

        pygame.font.init()
        
        self._controller = ControllerGame.instance()
        self._game = self._controller.new_game()

    def on_click_new_game(self):
        random.seed(time.time())
        self._game = self._controller.new_game()

    @staticmethod
    def toTilePos(x, y):
        posOut = Vector2D(x, y)
        posOut.x *= tileWidth
        posOut.y *= tileHeight

        if y % 2 == 1:
            posOut.x += tileWidth / 2

        return posOut

    def show(self):
        pygame.font.init()
        self.ui_button_new_game = ComponentButton(
            Rect(5, 5, 200, 40),
            'New Game'
        )
        self.ui_button_new_game.add_listener_click(self.on_click_new_game)

        # main game loop
        pygame.init()
        time_last = pygame.time.get_ticks()
        while self.is_game_running:
            # get delta seconds
            time_current = pygame.time.get_ticks()
            delta_milisec = time_current - time_last
            delta_time = delta_milisec / 1000 # seconds
            time_last = time_current

            for event in pygame.event.get():
                if event.type == pygame.QUIT:
                    self.is_game_running = False
                if event.type == pygame.MOUSEBUTTONUP and event.button == 3:
                    posIn = pygame.mouse.get_pos()
                    pos = Vector2D(posIn[0] - self.camPosition.x, posIn[1] - self.camPosition.y)
                    clicked_tile: MapTile = None
                    closest = math.inf
                    
                    for column in self._game.map_tiles:
                        for tile in column:
                            if tile.tile_type == EnumMapTile.Ground:
                                tilePos = self.toTilePos(tile.position.x, tile.position.y)
                                tilePos += Vector2D(tileWidth / 2, tileHeight / 2)

                                deltaX = abs(tilePos.x - pos.x)
                                deltaY = abs(tilePos.y - pos.y)
                                distance = deltaX**2 + deltaY**2

                                if distance < closest:
                                    clicked_tile = tile
                                    closest = distance
                    if clicked_tile != None:
                        if self._controller.selected_controller != None:
                            self._controller.selected_controller.move(clicked_tile)

            # update
            self.update(delta_time)
            
            # draw
            self.draw()

            # update display
            pygame.display.flip()
            time.sleep(max(0, 0.016 - delta_time))

    def update(self, delta_time):
        # Update actor controllers
        self._controller.update(self._game, delta_time)
        
        # Handle new game button
        mouse_pos = pygame.mouse.get_pos()
        mouse_buttons = pygame.mouse.get_pressed()
        self.ui_button_new_game.trigger_mouse(mouse_pos, mouse_buttons)

        # Handle actor buttons
        for controller in self._controller._actor_controllers:
            if controller.actor.button != None:
                controller.actor.button.move(self.toTilePos(controller.actor.position.x, controller.actor.position.y) + self.camPosition)
                if controller.actor.button.trigger_mouse(mouse_pos, mouse_buttons) == 2:
                    self._controller.selected_controller = controller

        # Handle city buttons
        for building in self._game.buildings:
            if building.button != None and building.building_type == EnumBuilding.City:
                building.button.move(self.toTilePos(building.position.x, building.position.y) + self.camPosition)
                if building.button.trigger_mouse(mouse_pos, mouse_buttons) == 2:
                    pos = building.position
                    
                    warrior = Actor()
                    warriorController = ControllerActorWarrior(warrior)
                    warriorController.actor.position = Vector2D(pos.x, pos.y)
                    warriorController.actor.tribe = building.tribe
                    warriorController.actor.button = ComponentButton(
                        pygame.Rect(0, 0, tileWidth, tileHeight), '')

                    self._game.actors.append(warrior)
                    self._controller._actor_controllers.append(warriorController)

    def execute_turn(self):
        self._controller.execute_turn(self._game)

    def draw(self):
        # Clear screen
        self.screen.fill((0, 0, 0))

        # Store current camera position
        tempCamPos = Vector2D()
        tempCamPos.x = self.camPosition.x
        tempCamPos.y = self.camPosition.y

        # Draw everything in isometric grid
        for i in range(self._game.map_size.y):
            # Render tiles for row
            for j in range(self._game.map_size.x):
                tile = self._game.map_tiles[i][j]
                tile_type = tile.tile_type
                tileOffset = self.offsets_by_tile[tile_type]

                x = j * tileWidth + tempCamPos.x
                y = i * tileHeight + tempCamPos.y

                if i % 2 == 1:
                    x += tileWidth / 2

                if (x > -cullMargin) and (x < (screenWidth + cullMargin)):
                    self.screen.blit(self.surfaces_by_map_tiles[tile_type], dest=(x + tileOffset.x, y + tileOffset.y))

            # Render buildings for row
            buildings = self._game.buildings
            buildings.sort(key= lambda x: x.position.y)
            for building in buildings:
                building_type = building.building_type
                level = building.level
                tribe = building.tribe
                
                x = building.position.x * tileWidth + tempCamPos.x + self.offsets_by_building[building_type].x
                y = building.position.y * tileHeight + tempCamPos.y + self.offsets_by_building[building_type].y

                if building.position.y % 2 == 1:
                    x += tileWidth / 2

                renderAhead = 0
                if building_type == EnumBuilding.Sawmill:
                    renderAhead = 2

                if building.position.y + renderAhead == i:
                    factory = self.resource_factories_by_tribes[tribe]
                    
                    building_key = tuple([building_type, tribe, level])
                    building_surface: Surface
                    
                    if building_key in self.surfaces_by_building:
                        building_surface = self.surfaces_by_building[building_key]
                    else:
                        building_surface = factory.create_building(building_type, level)
                        self.surfaces_by_building[building_key] = building_surface

                    if (x > -cullMargin) and (x < (screenWidth + cullMargin)):
                        self.screen.blit(building_surface, dest=(x, y))

            # Render actors for row
            actor_controllers = self._controller._actor_controllers
            actor_controllers.sort(key= lambda x: x.actor.position.y)
            for actor_controller in actor_controllers:
                actor = actor_controller.actor
                actor_type = actor.actor_type
                x = actor_controller.animatedPos.x + tempCamPos.x + self.offsets_by_actor[actor_type].x
                y = actor_controller.animatedPos.y + tempCamPos.y + self.offsets_by_actor[actor_type].y
                
                orderY = actor_controller.animatedPos.y / tileHeight
                if math.ceil(orderY) == i:
                    if (x > -cullMargin) and (x < (screenWidth + cullMargin)):
                        surface = self.surfaces_by_actor[actor_type]
                        self.screen.blit(surface, dest=(x, y))

            # Draw UI
            self.ui_button_new_game.draw(self.screen)