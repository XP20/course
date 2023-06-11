import random

from controllers.interfaces.IControllerActor import IControllerActor
from models.enums.EnumActor import EnumActor
from models.enums.EnumTribe import EnumTribe
from models.Actor import Actor
from models.Game import Game
from models.Vector2D import Vector2D
from models.enums.EnumMapTile import EnumMapTile
from models.MapTile import MapTile

import views.WindowMain as windowMain

animationTime = 0.2

class ControllerActorWarrior(IControllerActor):
    def __init__(self, actor):
        self.actor = actor
        super().__init__()
        self._actor = Actor()
        
        self.damage = 15
        self.movement = 1
        self.health = 100

        self.type = EnumActor.Warrior
        self.tribe: EnumTribe = EnumTribe.NotSet

    def update(self, delta_time):
        tilePos = windowMain.toTilePos(self.pos.x, self.pos.y)
        if self.animatedPos != tilePos:
            self.elapsed += delta_time * (1/animationTime)
            self.animatedPos = self.animatedPos.lerpTo(tilePos, self.elapsed)
        if self.elapsed > 1:
            self.animatedPos = tilePos
            self.elapsed = 0

    def execute_turn(self, game: Game):
        directions = [Vector2D(1,1), Vector2D(-1,-1), Vector2D(-1,1), Vector2D(1,-1)]
        steps = 0
        while (len(directions) > 0) and (steps < self.movement):
            direction = random.choice(directions)
            newPos = self.pos + direction

            inside = (newPos.x >= 0) and (newPos.y >= 0) and (newPos.x < game.map_size.x) and (newPos.y < game.map_size.y)
            if inside:
                onGround = (game.map_tiles[newPos.x][newPos.y].tile_type == EnumMapTile.Ground)
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

    def move(self, targetTile: MapTile):
        tile_type = targetTile.tile_type
        if tile_type != EnumMapTile.Mountain:
            self.pos = targetTile.position