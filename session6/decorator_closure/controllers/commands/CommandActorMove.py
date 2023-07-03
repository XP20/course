from controllers.commands.interfaces.ICommand import ICommand
from models.Actor import Actor
from models.Game import Game
from models.Vector2D import Vector2D

class CommandActorMove(ICommand):
    def __init__(self, actor: Actor, game: Game, position_target: Vector2D):
        self.game = game
        self.actor_uuid = actor.uuid
        self.position_before = actor.position.copy()
        self.position_target = position_target

    def execute(self):
        for actor in self.game.actors:
            if actor.uuid == self.actor_uuid:
                actor.position = self.position_target

    def undo(self):
        for actor in self.game.actors:
            if actor.uuid == self.actor_uuid:
                actor.position = self.position_before

    def redo(self):
        self.execute()