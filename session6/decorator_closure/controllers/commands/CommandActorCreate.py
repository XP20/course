import uuid
from controllers.ControllerGame import ControllerGame
from controllers.commands.interfaces.ICommand import ICommand
from controllers.decorators.DecoratorFasterActor import DecoratorFasterActor
from models.Game import Game
from models.Vector2D import Vector2D
from models.enums.EnumActor import EnumActor
from views.factories.interfaces.IResourceFactory import IResourceFactory

class CommandActorCreate(ICommand):
    def __init__(self, game: Game, actor_type: EnumActor, target_position: Vector2D, factory: IResourceFactory, actor_uuid: str):
        self.game = game
        self.actor_type = actor_type
        self.target_position = target_position.copy()
        self.factory = factory
        self.actor_uuid = actor_uuid
        self.actor = None
        self.actor_controller = None

    def execute(self):
        self.actor = self.factory.create_actor(self.actor_type)
        self.actor.position = self.target_position.copy()
        self.actor.uuid = uuid.UUID(self.actor_uuid)
        
        controller_by_actor_type = ControllerGame.instance().controller_by_actor_type
        self.actor_controller = controller_by_actor_type[self.actor_type](self.actor)

        if self.actor_type == EnumActor.Rider:
            self.actor_controller = DecoratorFasterActor(self.actor_controller)
            self.actor_controller = DecoratorFasterActor(self.actor_controller)
            self.actor_controller = DecoratorFasterActor(self.actor_controller)
            self.actor_controller = DecoratorFasterActor(self.actor_controller)

        self.game.actors.append(self.actor)
        ControllerGame.instance()._actor_controllers.append(self.actor_controller)

    def undo(self):
        actor_controllers = ControllerGame.instance()._actor_controllers
        if self.actor in self.game.actors:
            self.game.actors.remove(self.actor)
        if self.actor_controller in actor_controllers:
            actor_controllers.remove(self.actor_controller)

    def redo(self):
        self.execute()
import uuid
from controllers.ControllerGame import ControllerGame
from controllers.commands.interfaces.ICommand import ICommand
from controllers.decorators.DecoratorFasterActor import DecoratorFasterActor
from models.Game import Game
from models.Vector2D import Vector2D
from models.enums.EnumActor import EnumActor
from views.factories.interfaces.IResourceFactory import IResourceFactory

class CommandActorCreate(ICommand):
    def __init__(self, game: Game, actor_type: EnumActor, target_position: Vector2D, factory: IResourceFactory, actor_uuid: str):
        self.game = game
        self.actor_type = actor_type
        self.target_position = target_position.copy()
        self.factory = factory
        self.actor_uuid = actor_uuid
        self.actor = None
        self.actor_controller = None

    def execute(self):
        self.actor = self.factory.create_actor(self.actor_type)
        self.actor.position = self.target_position.copy()
        self.actor.uuid = uuid.UUID(self.actor_uuid)
        
        controller_by_actor_type = ControllerGame.instance().controller_by_actor_type
        self.actor_controller = controller_by_actor_type[self.actor_type](self.actor)

        # Make Rider move further
        if self.actor_type == EnumActor.Rider:
            self.actor_controller = DecoratorFasterActor(self.actor_controller)

        self.game.actors.append(self.actor)
        ControllerGame.instance()._actor_controllers.append(self.actor_controller)

    def undo(self):
        actor_controllers = ControllerGame.instance()._actor_controllers
        if self.actor in self.game.actors:
            self.game.actors.remove(self.actor)
        if self.actor_controller in actor_controllers:
            actor_controllers.remove(self.actor_controller)

    def redo(self):
        self.execute()