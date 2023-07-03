from controllers.interfaces.IControllerActor import IControllerActor
from models.Actor import Actor
from models.Game import Game
from models.MapTile import MapTile
from models.Vector2D import Vector2D

class DecoratorFasterActor(IControllerActor):
    def __init__(self, controller: IControllerActor):
        super().__init__(controller.actor)
        self._controller = controller
        self._controller.actor.move_steps += 1

    @property
    def actor(self) -> Actor:
        return self._controller.actor
    
    @property
    def animatedPos(self) -> Vector2D:
        return self._controller.animatedPos
    
    def update(self, delta_time):
        self._controller.update(delta_time)

    def execute_turn(self, game: Game):
        self._controller.execute_turn(game)

    def move(self, target_tile: MapTile):
        self._controller.move(target_tile)