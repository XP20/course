import random
import math

from controllers.ControllerActor import ControllerActor
from models.Actor import Actor
from models.Game import Game
from models.Vector2D import Vector2D
from models.enums.EnumMapTileType import EnumMapTileType
from models.MapTile import MapTile

import views.WindowMain as windowMain

animationTime = 0.3

class ControllerActorRider(ControllerActor):
    def __init__(self):
        super().__init__()
        self._actor = Actor()

        self.damage = 10
        self.movement = 2
        self.health = 200

    def update(self, delta_time):
        if self.animatedPos != self.pos:
            self.elapsed += delta_time * (1/animationTime)
            self.animatedPos = ControllerActor.lerp(self.animatedPos, self.pos, min(max(0, self.elapsed), 1))
        if self.elapsed > 1:
            self.animatedPos = self.pos
            self.elapsed = 0

    def execute_turn(self, game: Game, tx = -1, ty = -1):
        if tx < 0 or ty < 0:
            directions = [Vector2D(1,0), Vector2D(-1,0), Vector2D(0,1), Vector2D(0,-1)]
            steps = 0
            while (len(directions) > 0) and (steps < self.movement):
                direction = random.choice(directions)
                newPos = self.pos + direction

                onGround = game.map_tiles[newPos.x][newPos.y].tile_type == EnumMapTileType.Ground
                inside = (newPos.x >= 0) and (newPos.y >= 0) and (newPos.x < game.map_size.x) and (newPos.y < game.map_size.y)

                if not inside or not onGround:
                    directions.remove(direction)
                else:
                    steps += 1
                    self.pos = newPos
                    # Removing backwards direction so dont move back
                    try:
                        directions.remove(Vector2D(-direction.x, -direction.y))
                    except:
                        pass
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
                deltaX = abs(tile.position.x * windowMain.tileWidth + windowMain.tileWidth - clickPos.x)
                deltaY = abs(tile.position.y * windowMain.tileHeight + windowMain.tileHeight * 0.5 - clickPos.y)
                distance = deltaX**2 + deltaY**2
                if distance < closest:
                    clicked_tile = tile
                    closest = distance
        #! REPLACE WITH CODE FOR CALLING MOVE ON SELECTED CHARACTER
        self.execute_turn(self._game, clicked_tile.position.x, clicked_tile.position.y)