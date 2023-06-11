import abc
from models.Vector2D import Vector2D
from models.Game import Game
from models.enums.EnumActor import EnumActor
from models.enums.EnumTribe import EnumTribe

class ControllerActor(metaclass=abc.ABCMeta):
    def __init__(self):
        self.pos = Vector2D()
        self.movement = 0
        self.damage = 0
        self.health = 100
        self.type: EnumActor = EnumActor.NotSet
        self.tribe: EnumTribe = EnumTribe.NotSet

        # Animation
        self.animatedPos = Vector2D()
        self.elapsed = 0
        self.oldPos = self.pos

    @abc.abstractmethod
    def update(delta_time):
        pass

    @abc.abstractmethod
    def execute_turn(game: Game):
        pass

    @abc.abstractmethod
    def move(pos: Vector2D):
        pass