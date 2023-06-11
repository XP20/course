import random
import math

from controllers.ControllerActor import ControllerActor
from models.ViewProperties import ViewProperties
from models.Actor import Actor
from models.Game import Game
from models.Vector2D import Vector2D
from models.enums.EnumMapTileType import EnumMapTileType
from models.MapTile import MapTile

import views.WindowMain as windowMain

animationTime = 0.3

class ControllerActorWarrior(ControllerActor, ViewProperties):
    def __init__(self):
        super().__init__()
        self._actor = Actor()
        
        self.damage = 15
        self.movement = 1
        self.health = 100

        self.renderOffset = Vector2D(4, -20)

    def update(self, delta_time):
        tilePos = windowMain.toTilePos(self.pos.x, self.pos.y)
        if self.animatedPos != tilePos:
            self.elapsed += delta_time * (1/animationTime)
            self.animatedPos = self.animatedPos.lerpTo(tilePos, self.elapsed)
        if self.elapsed > 1:
            self.animatedPos = tilePos
            self.elapsed = 0

    def execute_turn(self, game: Game, tx = -1, ty = -1):
        if tx < 0 or ty < 0:
            directions = [Vector2D(1,1), Vector2D(-1,-1), Vector2D(-1,1), Vector2D(1,-1)]
            steps = 0
            while (len(directions) > 0) and (steps < self.movement):
                direction = random.choice(directions)
                newPos = self.pos + direction

                inside = (newPos.x >= 0) and (newPos.y >= 0) and (newPos.x < game.map_size.x) and (newPos.y < game.map_size.y)
                if inside:
                    onGround = (game.map_tiles[newPos.x][newPos.y].tile_type == EnumMapTileType.Ground)
                    if onGround:
                        steps += 1
                        self.pos = newPos

                        # Removing backwards direction so dont move back
                        try:
                            directions.remove(Vector2D(-direction.x, -direction.y))
                        except:
                            pass
                    else:
                        directions.remove(direction)
                else:
                    directions.remove(direction)
        else:
            self.pos = Vector2D(tx, ty)

    def move(self, clickPos: Vector2D):
        clicked_tile: MapTile
        closest = math.inf

        # For every single one would be way too bad.
        #     fix by using some 2 tiles to the left some 2 to the right, up, down, box blur type
        #* Just estimating around where + offsets
        
        # Also make sure that the player cant go onto a mountain tile.
        #* Will be handled in characters move, maybe just closest non-mountain tile

        for i in range(len(windowMain._game.map_tiles)):
            for j in range(len(windowMain._game.map_tiles[i])):
                tile = windowMain._game.map_tiles[i][j]

                if tile.tile_type == EnumMapTileType.Ground:
                    tilePos = windowMain.toTilePos(tile.position.x, tile.position.y)
                    tilePos += Vector2D(windowMain.tileWidth / 2, windowMain.tileHeight / 2)
                    deltaX = abs(tilePos.x - clickPos.x)
                    deltaY = abs(tilePos.y - clickPos.y)
                    distance = deltaX**2 + deltaY**2
                    if distance < closest:
                        clicked_tile = tile
                        closest = distance
        self.execute_turn(self._game, clicked_tile.position.x, clicked_tile.position.y)