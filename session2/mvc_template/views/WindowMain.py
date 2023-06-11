import time
import math
import pygame
from pygame import Surface
from typing import Dict, List

from models.MapBuilding import MapBuilding
from models.Vector2D import Vector2D
from models.MapTile import MapTile

from models.enums.EnumActor import EnumActor
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

def toTilePos(x, y):
    posOut = Vector2D(x, y)
    posOut.x *= tileWidth
    posOut.y *= tileHeight

    if y % 2 == 1:
        posOut.x += tileWidth / 2

    return posOut

class WindowMain:
    def __init__(self, controller: ControllerGame):
        self.screen = pygame.display.set_mode(
            (520, 500)
        )
        self.is_game_running = True

        # Resource factories
        resourceFactoryImperius = ResourceFactoryImperius()
        resourceFactoryHoodrick = ResourceFactoryHoodrick()

        self.resource_factories_by_tribes = {
            EnumTribe.Imperius: resourceFactoryImperius,
            EnumTribe.Hoodrick: resourceFactoryHoodrick,
        }

        self.resource_factories_by_tribes[EnumTribe.Imperius]

        # Surfaces
        self.surfaces_by_buildings = {

        }
        
        self.surfaces_by_map_tiles = {
            EnumMapTile.Ground: pygame.image.load('./resources/Tribes/Imperius/Imperius ground.png'),
            EnumMapTile.Mountain: pygame.image.load('./resources/Tribes/Imperius/Imperius mountain.png'),
        }

        self.surfaces_by_actor = {
            EnumActor.Rider: pygame.image.load('./resources/Units/Sprites/Rider.png'),
            EnumActor.Warrior: pygame.image.load('./resources/Units/Sprites/Warrior.png'),
        }

        # Offsets
        self.offsets_by_tile = {
            EnumMapTile.Ground: Vector2D(0, 0),
            EnumMapTile.Mountain: Vector2D(-6, -17),
        }

        self.offsets_by_actor = {
            EnumActor.Rider: Vector2D(8, -18),
            EnumActor.Warrior: Vector2D(4, -20),
        }


        self.camSpeed = 6
        self.camPosition = Vector2D()
        
        self._controller = controller
        self._game = self._controller.new_game()

    def show(self):
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
                if event.type == pygame.MOUSEBUTTONUP:
                    posIn = pygame.mouse.get_pos()
                    pos = Vector2D(posIn[0] - self.camPosition.x, posIn[1] - self.camPosition.y)
                    clicked_tile: MapTile = None
                    closest = math.inf
                    
                    # Also make sure that the player cant go onto a mountain tile.
                    #* Will be handled in characters move, maybe just closest non-mountain tile

                    #! Calling move for the selected character
                    #! Getting only tiles around the click location character 100 x 100 = 10`000 or 5 x 5 = 25
                    for i in range(len(self._game.map_tiles)):
                        for j in range(len(self._game.map_tiles[i])):
                            tile = self._game.map_tiles[i][j]

                            if tile.tile_type == EnumMapTile.Ground:
                                tilePos = toTilePos(tile.position.x, tile.position.y)
                                tilePos += Vector2D(tileWidth / 2, tileHeight / 2)

                                deltaX = abs(tilePos.x - pos.x)
                                deltaY = abs(tilePos.y - pos.y)
                                distance = deltaX**2 + deltaY**2

                                if distance < closest:
                                    clicked_tile = tile
                                    closest = distance

                    if clicked_tile != None:
                        for i in self._controller._actor_controllers:
                            if type(i) == ControllerActorWarrior:
                                i.move(clicked_tile)

            # update
            self.update(delta_time)

            # draw
            self.draw()

            # update display
            pygame.display.flip()
            time.sleep(0.005)

    def update(self, delta_time):
        self._controller.update(self._game, delta_time)

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
                tile = self._game.map_tiles[j][i]
                tile_type = tile.tile_type
                tileOffset = self.offsets_by_tile[tile_type]

                x = j * tileWidth + tempCamPos.x
                y = i * tileHeight + tempCamPos.y
                
                if i % 2 == 1:
                    x += tileWidth / 2

                self.screen.blit(self.surfaces_by_map_tiles[tile_type], dest=(x + tileOffset.x, y + tileOffset.y))

            # Render actors for row
            actors = self._controller._actor_controllers
            actors.sort(key= lambda x: x.pos.y)
            for actor in actors:
                x = actor.animatedPos.x + tempCamPos.x + self.offsets_by_actor[actor.type].x
                y = actor.animatedPos.y + tempCamPos.y + self.offsets_by_actor[actor.type].y
                
                orderY = actor.animatedPos.y / tileHeight
                if math.ceil(orderY) == i:
                    surface = self.surfaces_by_actor[actor.type]
                    self.screen.blit(surface, dest=(x, y))