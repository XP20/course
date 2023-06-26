import pygame
from pygame import Surface
from loguru import logger
from typing import Dict, Tuple
from models.Actor import Actor

from models.enums.EnumActor import EnumActor
from models.enums.EnumBuilding import EnumBuilding
from models.enums.EnumTribe import EnumTribe
from views.components.ComponentButton import ComponentButton
from views.factories.interfaces.IResourceFactory import IResourceFactory

class FactoryImperius(IResourceFactory):
    def __init__(self):
        super().__init__()

        self.surfaces_by_buildings: Dict[tuple(EnumBuilding, int), Surface] = {
            EnumBuilding.City: pygame.image.load('./resources/Tribes/Imperius/City/Imperius city 1.png'),
            EnumBuilding.Sawmill: pygame.image.load('./resources/Buildings/Sawmill/Sawmill level 1.png'),
        }

        self.surfaces_by_actor: Dict[EnumActor, Surface] = {
            EnumActor.Warrior: pygame.image.load(f'resources/Tribes/Imperius/Units/warrior.png').convert_alpha(),
            EnumActor.Rider: pygame.image.load(f'resources/Tribes/Imperius/Units/rider.png').convert_alpha(),
            EnumActor.Knight: pygame.image.load(f'resources/Tribes/Imperius/Units/knight.png').convert_alpha(),
        }

    def get_building(self, enum_building: EnumBuilding, level: int) -> Tuple[Surface, None]:
        result = None

        try:
            building_key = (enum_building, level)
            if building_key in self.surfaces_by_buildings:
                result = self.surfaces_by_buildings[building_key]
            else:
                if enum_building == EnumBuilding.City:
                    result = pygame.image.load(f'resources/Tribes/Imperius/City/Imperius city {level}.png').convert_alpha()
                    self.surfaces_by_buildings[building_key] = result
                elif enum_building == EnumBuilding.Sawmill:
                    result = pygame.image.load(f'resources/Buildings/Sawmill/Sawmill level {level}.png').convert_alpha()
                    self.surfaces_by_buildings[building_key] = result
        except Exception as exc:
            logger.exception(exc)

        return result
    
    def get_actor_surface(self, enum_actor: EnumActor) -> Tuple[Surface, None]:
        result = None

        try:
            actor_key = enum_actor
            if actor_key in self.surfaces_by_buildings:
                result = self.surfaces_by_buildings[actor_key]
            else:
                if enum_actor == EnumActor.Warrior:
                    result = pygame.image.load(f'resources/Tribes/Imperius/Units/warrior.png').convert_alpha()
                    self.surfaces_by_actor[actor_key] = result
                elif enum_actor == EnumActor.Knight:
                    result = pygame.image.load(f'resources/Tribes/Imperius/Units/knight.png').convert_alpha()
                    self.surfaces_by_actor[actor_key] = result
                elif enum_actor == EnumActor.Rider:
                    result = pygame.image.load(f'resources/Tribes/Imperius/Units/rider.png').convert_alpha()
                    self.surfaces_by_actor[actor_key] = result
        except Exception as exc:
            logger.exception(exc)

        return result
    
    @staticmethod
    def create_actor(enum_actor: EnumActor, button: ComponentButton = None) -> Tuple[Actor, None]:
        result = None

        try:
            if enum_actor == EnumActor.Warrior:
                result = Actor()

                result.actor_type = EnumActor.Warrior
                result.tribe = EnumTribe.Imperius

                result.level = 1
                result.power_attack = 15
                result.power_defense = 10
                result.move_steps = 1
                result.experience = 0

                result.button = button
            elif enum_actor == EnumActor.Knight:
                result = Actor()

                result.actor_type = EnumActor.Knight
                result.tribe = EnumTribe.Imperius
                
                result.level = 1
                result.power_attack = 20
                result.power_defense = 15
                result.move_steps = 1
                result.experience = 0

                result.button = button
            elif enum_actor == EnumActor.Rider:
                result = Actor()

                result.actor_type = EnumActor.Rider
                result.tribe = EnumTribe.Imperius

                result.level = 1
                result.power_attack = 10
                result.power_defense = 15
                result.move_steps = 2
                result.experience = 0

                result.button = button
        except Exception as exc:
            logger.exception(exc)

        return result