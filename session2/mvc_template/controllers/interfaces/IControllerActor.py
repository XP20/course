import abc
from models.Actor import Actor
from models.Vector2D import Vector2D
from models.Game import Game

class IControllerActor(metaclass=abc.ABCMeta):
    def __init__(self, actor: Actor):
        pass

    @abc.abstractmethod
    def update(delta_time):
        pass

    @abc.abstractmethod
    def execute_turn(game: Game):
        pass

    @abc.abstractmethod
    def move(pos: Vector2D):
        pass