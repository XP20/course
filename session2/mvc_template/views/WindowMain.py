import time
import pygame
import math
from typing import List

from controllers.ControllerGame import ControllerGame
from models.enums.EnumMapTileType import EnumMapTileType
from controllers.ControllerActor import ControllerActor
from controllers.ControllerActorWarrior import ControllerActorWarrior
from controllers.ControllerActorRider import ControllerActorRider
from models.Vector2D import Vector2D
from models.MapTile import MapTile

renderOrder = (EnumMapTileType.Ground, EnumMapTileType.Mountain)
renderOffsets = {
    EnumMapTileType.Ground: Vector2D(0, 0),
    EnumMapTileType.Mountain: Vector2D(-8, -16),
}

tileHeight = 16
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

        self.camSpeed = 6
        self.camPosition = Vector2D()

        self.ground = pygame.image.load('./resources/Tribes/Imperius/Imperius ground.png').convert_alpha()
        self.ground.set_colorkey((0,0,0))
        self.mountain = pygame.image.load('./resources/Tribes/Imperius/Imperius mountain.png').convert_alpha()
        self.mountain.set_colorkey((0,0,0))

        self.rider = pygame.image.load('./resources/Units/Sprites/Rider.png').convert_alpha()
        self.rider.set_colorkey((0,0,0))
        self.warrior = pygame.image.load('./resources/Units/Sprites/Warrior.png').convert_alpha()
        self.warrior.set_colorkey((0,0,0))

        self.tileSurface = {
            EnumMapTileType.Ground: self.ground,
            EnumMapTileType.Mountain: self.mountain,
        }

        self.actorSurface = {
            ControllerActorRider: self.rider,
            ControllerActorWarrior: self.warrior,
        }
        
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
                    clicked_tile: MapTile
                    closest = math.inf

                    # For every single one would be way too bad.
                    #     fix by using some 2 tiles to the left some 2 to the right, up, down, box blur type
                    #* Just estimating around where + offsets
                    
                    # Also make sure that the player cant go onto a mountain tile.
                    #* Will be handled in characters move, maybe just closest non-mountain tile

                    # selected.move(self.camPosition)

                    #! REPLACE WITH CODE FOR CALLING MOVE ON SELECTED CHARACTER
                    for i in range(len(self._game.map_tiles)):
                        for j in range(len(self._game.map_tiles[i])):
                            tile = self._game.map_tiles[i][j]

                            if tile.tile_type == EnumMapTileType.Ground:
                                tilePos = toTilePos(tile.position.x, tile.position.y)
                                tilePos += Vector2D(tileWidth / 2, tileHeight / 2)
                                deltaX = abs(tilePos.x - pos.x)
                                deltaY = abs(tilePos.y - pos.y)
                                distance = deltaX**2 + deltaY**2
                                if distance < closest:
                                    clicked_tile = tile
                                    closest = distance
                    for i in self._controller._actor_controllers:
                        if type(i) == ControllerActorWarrior:
                            print(clicked_tile.position)
                            i.execute_turn(self._game, clicked_tile.position.x, clicked_tile.position.y)

            # update
            self.update(delta_time)

            # draw
            self.draw()

            # update display
            pygame.display.flip()
            time.sleep(0.005)

    def update(self, delta_time):
        for actor in self._controller._actor_controllers:
            actor.update(delta_time)

    def execute_turn(self):
        for actor in self._controller._actor_controllers:
            actor.execute_turn(self._game)

    def draw(self):
        # Clear screen
        self.screen.fill((0, 0, 0))

        # Store current camera position
        tempCamPos = Vector2D()
        tempCamPos.x = self.camPosition.x
        tempCamPos.y = self.camPosition.y

        # Draw everything in isometric grid
        for i in range(self._game.map_size.y):
            for j in range(self._game.map_size.x):
                tile = self._game.map_tiles[j][i]
                tile_type = tile.tile_type
                tileOffset = renderOffsets[tile_type]

                x = j * tileWidth + tempCamPos.x
                y = i * tileHeight + tempCamPos.y
                
                if i % 2 == 1:
                    x += tileWidth / 2

                self.screen.blit(self.tileSurface[tile_type], dest=(x + tileOffset.x, y + tileOffset.y))

            actors = self._controller._actor_controllers
            actors.sort(key= lambda x: x.pos.y)
            for actor in actors:
                x = actor.animatedPos.x + tempCamPos.x + actor.renderOffset.x
                y = actor.animatedPos.y + tempCamPos.y + actor.renderOffset.y

                if actor.pos.y == i:
                    surface = self.actorSurface[type(actor)]
                    self.screen.blit(surface, dest=(x, y))