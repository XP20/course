import abc
from abc import abstractmethod, ABC
import pygame
from pygame import Surface

from models.enums.EnumActor import EnumActor
from models.enums.EnumBuilding import EnumBuilding

class IResourceFactory(ABC):
    @abstractmethod
    def create_building(self, enum_building: EnumBuilding, level: int) -> Surface:
        pass

    @abstractmethod
    def create_actor(self, enum_actor: EnumActor) -> Surface:
        pass