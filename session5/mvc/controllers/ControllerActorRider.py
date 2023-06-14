import random
from typing import List

import pygame

from controllers.interfaces.IControllerActor import IControllerActor
from models.enums.EnumActor import EnumActor
from models.enums.EnumTribe import EnumTribe
from models.Actor import Actor
from models.Game import Game
from models.Vector2D import Vector2D
from models.enums.EnumMapTile import EnumMapTile
from models.MapTile import MapTile

import controllers.ControllerGame as controllerGameFile
import views.WindowMain as windowMainFile

animationTime = 0.2

class ControllerActorRider(IControllerActor):
    def __init__(self, actor: Actor):
        self._actor = actor
        self._actor.actor_type = EnumActor.Rider
        
        self.actor.power_attack = 10
        self.actor.power_defense = 20
        self.actor.move_steps = 2

        self.elapsed = 0
        self.animatedPos = Vector2D(0, 0)

        self.controllerGame = controllerGameFile.ControllerGame.instance()
        self.windowMain = windowMainFile.WindowMain.instance()

        super().__init__(actor)

    @property
    def actor(self) -> Actor:
        return self._actor

    def update(self, delta_time):
        tilePos = self.windowMain.toTilePos(self.actor.position.x, self.actor.position.y)
        if self.animatedPos != tilePos:
            self.elapsed += delta_time * (1/animationTime)
            self.animatedPos = self.animatedPos.lerpTo(tilePos, self.elapsed)
        if self.elapsed > 1:
            self.animatedPos = tilePos
            self.elapsed = 0

    def execute_turn(self, game: Game):
        directions = [Vector2D(1,1), Vector2D(-1,-1), Vector2D(0,1), Vector2D(0,-1)]
        steps = 0
        while (len(directions) > 0) and (steps < self.actor.move_steps):
            # Adjusting for isometric grid
            if self.actor.position.y % 2 == 1:
                if Vector2D(-1, -1) in directions:
                    directions.remove(Vector2D(-1, -1))
                    directions.append(Vector2D(1, -1))
                if Vector2D(-1, 1) in directions:
                    directions.remove(Vector2D(-1, 1))
                    directions.append(Vector2D(1, 1))
            else:
                if Vector2D(1, -1) in directions:
                    directions.remove(Vector2D(1, -1))
                    directions.append(Vector2D(-1, -1))
                if Vector2D(1, 1) in directions:
                    directions.remove(Vector2D(1, 1))
                    directions.append(Vector2D(-1, 1))

            direction = random.choice(directions)
            newPos = Vector2D(self.actor.position.x, self.actor.position.y) + direction

            inside = (newPos.x >= 0) and (newPos.y >= 0) and (newPos.x < game.map_size.x) and (newPos.y < game.map_size.y)
            if inside:
                onGround = (game.map_tiles[newPos.y][newPos.x].tile_type == EnumMapTile.Ground)
                if onGround:
                    steps += 1
                    self.actor.position = newPos

                    # Removing backwards direction so dont move back
                    try:
                        directions.remove(Vector2D(-direction.x, -direction.y))
                    except:
                        pass
                else:
                    directions.remove(direction)
            else:
                directions.remove(direction)
        self.controllerGame.game.stars += 1
    
    def move(self, targetTile: MapTile):
        tile_type = targetTile.tile_type
        if tile_type != EnumMapTile.Mountain:
            self.actor.position = targetTile.position