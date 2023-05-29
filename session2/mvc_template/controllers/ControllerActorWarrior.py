import random

from controllers.ControllerActor import ControllerActor
from models.Actor import Actor
from models.Game import Game
from models.Vector2D import Vector2D
from models.enums.EnumMapTileType import EnumMapTileType

animationTime = 0.2

class ControllerActorWarrior(ControllerActor):
    def __init__(self):
        super().__init__()
        self._actor = Actor()
        
        self.damage = 15
        self.movement = 1
        self.health = 100

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