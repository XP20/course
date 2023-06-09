import pygame
from pygame import Surface
from loguru import logger

from models.enums.EnumActor import EnumActor
from models.enums.EnumBuilding import EnumBuilding
from views.resources.interfaces.IResourceFactory import IResourceFactory

class ResourceFactoryHoodrick(IResourceFactory):
    def __init__(self):
        super().__init__()

    def create_building(self, enum_building: EnumBuilding, level: int) -> Surface:
        result = None

        try:
            if enum_building == EnumBuilding.City:
                result = pygame.image.load(f'resources/Tribes/Hoodrick/City/Hoodrick city {level}.png').convert_alpha()
            elif enum_building == EnumBuilding.Sawmill:
                result = pygame.image.load(f'resources/Buildings/Sawmill/Sawmill level {level}.png').convert_alpha()
        except Exception as exc:
            logger.exception(exc)

        return result
    
    def create_actor(self, enum_actor: EnumActor) -> Surface:
        result = None

        try:
            if enum_actor == EnumActor.Warrior:
                result = pygame.image.load(f'resources/Tribes/Hoodrick/Units/warrior.png').convert_alpha()
            elif enum_actor == EnumActor.Knight:
                result = pygame.image.load(f'resources/Tribes/Hoodrick/Units/knight.png').convert_alpha()
            elif enum_actor == EnumActor.Rider:
                result = pygame.image.load(f'resources/Tribes/Hoodrick/Units/rider.png').convert_alpha()
        except Exception as exc:
            logger.exception(exc)

        return result