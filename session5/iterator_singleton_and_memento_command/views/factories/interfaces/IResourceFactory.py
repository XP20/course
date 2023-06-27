from abc import abstractmethod, ABC
from typing import Tuple
from pygame import Surface
from models.Actor import Actor

from models.enums.EnumActor import EnumActor
from models.enums.EnumBuilding import EnumBuilding
from views.components.ComponentButton import ComponentButton

class IResourceFactory(ABC):
    @abstractmethod
    def get_building(self, enum_building: EnumBuilding, level: int) -> Tuple[Surface, None]:
        pass

    @abstractmethod
    def get_actor_surface(self, enum_actor: EnumActor) -> Tuple[Surface, None]:
        pass

    @staticmethod
    @abstractmethod
    def create_actor(enum_actor: EnumActor, button: ComponentButton = None) -> Tuple[Actor, None]:
        pass