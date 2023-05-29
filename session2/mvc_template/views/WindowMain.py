import time
import pygame
import math
from typing import List

from controllers.ControllerGame import ControllerGame
from models.enums.EnumMapTileType import EnumMapTileType
from controllers.ControllerActorWarrior import ControllerActorWarrior
from controllers.ControllerActorRider import ControllerActorRider
from models.Vector2D import Vector2D
from models.MapTile import MapTile

renderOrder = (EnumMapTileType.Ground, EnumMapTileType.Mountain)
renderOffsets = {
    EnumMapTileType.Ground: Vector2D(0, 0),
    EnumMapTileType.Mountain: Vector2D(-8, -16),
}

height = 32
width = 26

class WindowMain:
    def __init__(self):
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

        self.tiles = {
            EnumMapTileType.Ground: self.ground,
            EnumMapTileType.Mountain: self.mountain,
        }
        
        self._controller = ControllerGame()
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
                    pos = pygame.mouse.get_pos()
                    clicked_tile: MapTile
                    closest = math.inf

                    #! For every single one would be way too bad.
                    #!     fix by using some 2 tiles to the left some 2 to the right, up, down, box blur type

                    #! Another thing, this does not take into account the camera offsets. Add those!
                    
                    #! Also make sure that the player cant go onto a mountain tile.

                    #! Make the player movement in tile space not in map space.
                    #! Warning: These requirements change as the player is on even / uneven tiles
                    #!     left up
                    #!     right up
                    #!     left down
                    #!     right down
                    for i in range(len(self._game.map_tiles)):
                        for j in range(len(self._game.map_tiles[i])):
                            el = self._game.map_tiles[i][j]
                            dx = abs(el.position.x * width + width - pos[0])
                            dy = abs(el.position.y * height + height * 0.5 - pos[1])
                            dist = math.sqrt(dx**2 + dy**2)
                            if dist < closest:
                                clicked_tile = el
                                closest = dist
                    for i in self._controller._actor_controllers:
                        if type(i) == ControllerActorWarrior:
                            i.execute_turn(self._game, clicked_tile.position.x, clicked_tile.position.y)

            # update
            self.update(delta_time)

            # draw
            self.draw()

            # update display
            pygame.display.flip()
            time.sleep(0.01)

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

        # Draw tiles in isometric grid
        for tileType in renderOrder:
            offset = renderOffsets[tileType]
            for j in range(self._game.map_size.y):
                for i in range(0,self._game.map_size.x,2):
                    if self._game.map_tiles[i][j].tile_type == tileType:
                        x = i * width + tempCamPos.x + offset.x
                        y = j * height + tempCamPos.y + offset.y
                        self.screen.blit(self.tiles[tileType], dest=(x, y))
                for i in range(1,self._game.map_size.x,2):
                    if self._game.map_tiles[i][j].tile_type == tileType:
                        x = i * width + tempCamPos.x + offset.x
                        y = j * height + height/2 + tempCamPos.y + offset.y
                        self.screen.blit(self.tiles[tileType], dest=(x, y))
        
        self._controller._actor_controllers.sort(key= lambda x: x.pos.y)
        for actor in self._controller._actor_controllers:
            x = actor.animatedPos.x * width + tempCamPos.x + 2
            preY = actor.animatedPos.y * height + tempCamPos.y - 26
            y = preY + abs(math.sin(0.5 * math.pi * actor.animatedPos.x)) * (height / 2)
            if type(actor) == ControllerActorRider:
                self.screen.blit(self.rider, dest=(x, y))
            elif type(actor) == ControllerActorWarrior:
                self.screen.blit(self.warrior, dest=(x, y))