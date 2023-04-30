from enum import Enum
from abc import ABCMeta, abstractmethod

class Game:
    def __init__(self):    
        self.map_size = Vector2D()
        self.turn = 0
        self._map_tiles = [MapTile()]

    def get_map_tiles(self):
        return self._map_tiles
    
    def new_game(self):
        pass
    
    def update_step(self, tribe, actor):
        pass

class Vector2D:
    def __init__(self):
        self.x = 0
        self.y = 0
    
    def __add__(self, vec):
        pass
        #result = Vector2D()
        #result.x = self.x + vec.x
        #result.y = self.y + vec.y
        #return result
    
    def __sub__(self, vec):
        pass
        #result = Vector2D()
        #result.x = self.x - vec.x
        #result.y = self.y - vec.y
        #return result

# Item
class Item:
    def __init__(self):
        self.is_consumable = False
        self.coins_collect = 0

class Fruit(Item):
    def collect(self):
        pass

class Forest(Item):
    pass

class Building(Item):
    level = 0

class Sawmill(Building):
    pass

class Village(Building):
    def capture(self):
        pass

class City(Village):
    pass

# MapTile
class MapTile:
    def __init__(self):    
        self.position = Vector2D()
        self.season = EnumSeason.NONE
        self.tribe = EnumTribe.NONE
        self.items_on_tile = [] #Item
        self.actor_on_tile = [] #Actor
        self.is_visible_for_tribe = [] #EnumTribe

class Land(MapTile):
    pass

class Mountain(MapTile):
    pass

class Water(MapTile):
    pass

class EnumSeason(Enum):
    NONE = 0
    WINTER = 1
    SUMMER = 2

# Actor
class Actor(metaclass=ABCMeta):
    def __init__(self):
        self.tribe = EnumTribe.NONE
        self.coins_cost = 0
        self.move_steps = 0
        self.power_attack = 0
        self.power_defense = 0
        self.experience = 0
        self.level = 0

    @abstractmethod
    def move(self, pos):
        pass

class Warrior(Actor):
    def move(self, pos):
        pass

class Horseman(Actor):
    def move(self, pos):
        pass

class Knight(Horseman):
    def move(self, pos):
        pass

class EnumTribe(Enum):
    NONE = 0
    PLAYER = 1
    OPPONENT = 2