import random
import time
import math
import pygame
from pygame import SRCALPHA, Rect, Surface

from models.Vector2D import Vector2D
from models.MapTile import MapTile

from models.enums.EnumActor import EnumActor
from models.enums.EnumBuilding import EnumBuilding
from models.enums.EnumMapTile import EnumMapTile
from models.enums.EnumTribe import EnumTribe

from controllers.ControllerGame import ControllerGame
from controllers.ControllerActorWarrior import ControllerActorWarrior
from views.ViewProperties import ViewProperties
from views.components.EventComponentButton import EventComponentButton

from views.factories.FactoryHoodrick import FactoryHoodrick
from views.factories.FactoryImperius import FactoryImperius
from views.components.ComponentButton import ComponentButton
from pynput import keyboard

class WindowMain:
    __instance = None

    @staticmethod
    def instance():
        if WindowMain.__instance is None:
            WindowMain.__instance = WindowMain()
        return WindowMain.__instance

    def __init__(self):
        if WindowMain.__instance is not None:
            raise Exception('Only one instance of WinodwMain is allowed!')
        WindowMain.__instance = self

        self.screen = pygame.display.set_mode(
            (ViewProperties.SCREEN_WIDTH, ViewProperties.SCREEN_HEIGHT)
        )
        self.is_game_running = True

        # Resource factories
        self.resource_factories_by_tribes = {
            EnumTribe.Imperius: FactoryImperius(),
            EnumTribe.Hoodrick: FactoryHoodrick(),
        }

        # Surfaces
        self.surfaces_by_building = {}

        self.surfaces_by_map_tiles = {
            EnumMapTile.Ground: pygame.image.load('./resources/Tribes/Imperius/Imperius ground.png').convert_alpha(),
            EnumMapTile.Mountain: pygame.image.load('./resources/Tribes/Imperius/Imperius mountain.png').convert_alpha(),
        }

        self.surfaces_by_actor = {
            EnumActor.Rider: pygame.image.load('./resources/Units/Sprites/Rider.png').convert_alpha(),
            EnumActor.Warrior: pygame.image.load('./resources/Units/Sprites/Warrior.png').convert_alpha(),
        }

        # Offsets
        self.offsets_by_tile = {
            EnumMapTile.Ground: Vector2D(0, 0),
            EnumMapTile.Mountain: Vector2D(-6, -17),
        }

        self.offsets_by_actor = {
            EnumActor.Rider: Vector2D(6, -22),
            EnumActor.Warrior: Vector2D(4, -20),
        }

        self.offsets_by_building = {
            EnumBuilding.City: Vector2D(1, -20),
            EnumBuilding.Sawmill: Vector2D(0, 0),
        }

        self.camSpeed = 18
        self.camPosition = Vector2D()

        pygame.font.init()
        
        self._controller = ControllerGame.instance()
        self._game = self._controller.new_game()

    def on_click_new_game(self, event: EventComponentButton):
        self._game = self._controller.new_game()

    def on_key_press(self, key):
        if key == keyboard.Key.right:
            WindowMain.instance().camPosition.x -= ViewProperties.CAM_SPEED
        if key == keyboard.Key.left:
            WindowMain.instance().camPosition.x += ViewProperties.CAM_SPEED
        if key == keyboard.Key.up:
            WindowMain.instance().camPosition.y += ViewProperties.CAM_SPEED
        if key == keyboard.Key.down:
            WindowMain.instance().camPosition.y -= ViewProperties.CAM_SPEED
        # if key == keyboard.Key.space:
        #     WindowMain.instance().execute_turn()
        if key == keyboard.Key.esc:
            WindowMain.instance().is_game_running = False
    
    def on_key_release(self, key):
        pass

    def show(self):
        listener = keyboard.Listener(
            on_press=self.on_key_press,
            on_release=self.on_key_release)
        listener.start()

        # New game button
        pygame.font.init()
        self.ui_button_new_game = ComponentButton(
            Rect(ViewProperties.SCREEN_WIDTH - 110, 5, 105, 35),
            'New Game'
        )
        self.ui_button_new_game.add_listener_click(self.on_click_new_game)

        # Do turn button
        self.ui_button_do_turn = ComponentButton(
            Rect(5, 35, 80, 30),
            'Do Turn'
        )
        self.ui_button_do_turn.add_listener_click(self.execute_turn)

        # Tribe turn surface
        self.font = pygame.font.Font('freesansbold.ttf', 18)
        self.ui_text_tribe_turn_surface = self.font.render('Tribe: Imperius', True, (255, 255, 255))
        self.ui_text_tribe_turn = EnumTribe.Imperius

        # background
        self.ui_text_tribe_turn_background = Surface((160, 28), SRCALPHA)
        pygame.draw.rect(
            self.ui_text_tribe_turn_background,
            color=(25, 24, 26),
            rect=Rect(0, 0, 160, 28)
        )
        pygame.draw.rect(
            self.ui_text_tribe_turn_background,
            color=(121, 119, 127),
            rect=pygame.Rect(3, 3, 160 - 6, 28 - 6)
        )

        # Turn count surface
        self.font = pygame.font.Font('freesansbold.ttf', 18)
        self.ui_text_turn_count_surface = self.font.render('Turn: 0', True, (255, 255, 255))
        self.ui_text_turn_count = 0

        # background
        self.ui_text_turn_count_background = Surface((95, 28), SRCALPHA)
        pygame.draw.rect(
            self.ui_text_turn_count_background,
            color=(25, 24, 26),
            rect=Rect(0, 0, 95, 28)
        )
        pygame.draw.rect(
            self.ui_text_turn_count_background,
            color=(121, 119, 127),
            rect=pygame.Rect(3, 3, 95 - 6, 28 - 6)
        )

        # Main game loop
        pygame.init()
        time_last = pygame.time.get_ticks()
        while self.is_game_running:
            # Get delta seconds
            time_current = pygame.time.get_ticks()
            delta_milisec = time_current - time_last
            delta_time = delta_milisec / 1000 # seconds
            time_last = time_current

            # Get events
            for event in pygame.event.get():
                if event.type == pygame.QUIT:
                    self.is_game_running = False
                if event.type == pygame.MOUSEBUTTONUP and event.button == 3:
                    posIn = pygame.mouse.get_pos()
                    pos = Vector2D(posIn[0] - self.camPosition.x, posIn[1] - self.camPosition.y)
                    self._controller.move_selected_actor(pos)

            # Update
            self.update(delta_time)
            
            # Draw
            self.draw()

            # Update display
            pygame.display.flip()
            time.sleep(max(0, 0.016 - delta_time))

    def update(self, delta_time):
        # Update actor controllers
        self._controller.update(self._game, delta_time)
        
        # Handle new game button
        mouse_pos = pygame.mouse.get_pos()
        mouse_buttons = pygame.mouse.get_pressed()
        self.ui_button_new_game.trigger_mouse(mouse_pos, mouse_buttons)
        self.ui_button_do_turn.trigger_mouse(mouse_pos, mouse_buttons)

        # Handle actor buttons
        for controller in self._controller._actor_controllers:
            if controller.actor.button != None:
                controller.actor.button.move(ViewProperties.toTilePos(controller.actor.position.x, controller.actor.position.y) + self.camPosition)
                if controller.actor.button.trigger_mouse(mouse_pos, mouse_buttons) == 2:
                    self._controller.selected_controller = controller

        # Handle city buttons
        for building in self._game.buildings:
            if building.button != None and building.building_type == EnumBuilding.City:
                building.button.move(ViewProperties.toTilePos(building.position.x, building.position.y) + self.camPosition)
                if building.button.trigger_mouse(mouse_pos, mouse_buttons) == 2:
                    pos = building.position

                    factory = self.resource_factories_by_tribes[building.tribe]
                    warrior = factory.create_actor(EnumActor.Warrior)

                    # Cant move to ControllerGame because self.resource_factories_by_tribe and circular import with ControllerActorWarrior
                    warriorController = ControllerActorWarrior(warrior)
                    warriorController.actor.position = Vector2D(pos.x, pos.y)
                    warriorController.actor.button = ComponentButton(
                        pygame.Rect(0, 0, ViewProperties.TILE_WIDTH, ViewProperties.TILE_HEIGHT), '')

                    self._game.actors.append(warrior)
                    self._controller._actor_controllers.append(warriorController)

    def execute_turn(self, event: EventComponentButton):
        self._controller.execute_turn(self._game)

    def draw_surface(self, surface: pygame.Surface, x: int, y: int):
        if (x > -ViewProperties.CULL_MARGIN) and (x < (ViewProperties.SCREEN_WIDTH + ViewProperties.CULL_MARGIN)):
            if (y > -ViewProperties.CULL_MARGIN) and (y < (ViewProperties.SCREEN_HEIGHT + ViewProperties.CULL_MARGIN)):
                self.screen.blit(surface, dest=(x, y))

    def draw(self):
        # Clear screen
        self.screen.fill((0, 0, 0))

        # Store current camera position
        tempCamPos = Vector2D()
        tempCamPos.x = self.camPosition.x
        tempCamPos.y = self.camPosition.y

        # Render everything in isometric grid
        for i in range(self._game.map_size.y):
            # Render tiles for row
            for j in range(self._game.map_size.x):
                tile = self._game.map_tiles[i][j]
                tile_type = tile.tile_type
                tileOffset = self.offsets_by_tile[tile_type]

                x = j * ViewProperties.TILE_WIDTH + tempCamPos.x
                y = i * ViewProperties.TILE_HEIGHT + tempCamPos.y

                if i % 2 == 1:
                    x += ViewProperties.TILE_WIDTH / 2

                endX = x + tileOffset.x
                endY = y + tileOffset.y
                tileSurface = self.surfaces_by_map_tiles[tile_type]
                self.draw_surface(tileSurface, endX, endY)

            # Render buildings for row
            buildings = self._game.buildings
            buildings.sort(key= lambda x: x.position.y)
            for building in buildings:
                building_type = building.building_type
                level = building.level
                tribe = building.tribe
                
                x = building.position.x * ViewProperties.TILE_WIDTH + tempCamPos.x + self.offsets_by_building[building_type].x
                y = building.position.y * ViewProperties.TILE_HEIGHT + tempCamPos.y + self.offsets_by_building[building_type].y

                if building.position.y % 2 == 1:
                    x += ViewProperties.TILE_WIDTH / 2

                renderAhead = 0
                if building_type == EnumBuilding.Sawmill:
                    renderAhead = 2

                if building.position.y + renderAhead == i:
                    factory = self.resource_factories_by_tribes[tribe]
                    
                    building_key = (building_type, tribe, level)
                    building_surface: Surface
                    
                    if building_key in self.surfaces_by_building:
                        building_surface = self.surfaces_by_building[building_key]
                    else:
                        building_surface = factory.get_building(building_type, level)
                        self.surfaces_by_building[building_key] = building_surface

                    self.draw_surface(building_surface, x, y)

            # Render actors for row
            actor_controllers = self._controller._actor_controllers
            actor_controllers.sort(key= lambda x: x.actor.position.y)
            for actor_controller in actor_controllers:
                actor = actor_controller.actor
                actor_type = actor.actor_type
                x = actor_controller.animatedPos.x + tempCamPos.x + self.offsets_by_actor[actor_type].x
                y = actor_controller.animatedPos.y + tempCamPos.y + self.offsets_by_actor[actor_type].y
                
                orderY = actor_controller.animatedPos.y / ViewProperties.TILE_HEIGHT
                if math.ceil(orderY) == i:
                    actorSurface = self.surfaces_by_actor[actor_type]
                    self.draw_surface(actorSurface, x, y)

            # Draw UI
            self.ui_button_new_game.draw(self.screen)
            self.ui_button_do_turn.draw(self.screen)

            # Show which tribe's turn it is
            if self.ui_text_tribe_turn is not self._controller.turn_tribe:
                self.ui_text_tribe_turn_surface = self.font.render('Tribe: ' + self._controller.turn_tribe, True, (255, 255, 255))
                self.ui_text_tribe_turn = self._controller.turn_tribe
            self.draw_surface(self.ui_text_tribe_turn_background, 5, 5)
            self.draw_surface(self.ui_text_tribe_turn_surface, 10, 10)

            # Show which turn it is
            if self.ui_text_turn_count is not self._controller.game.turn:
                self.ui_text_turn_count_surface = self.font.render('Turn: ' + str(self._controller.game.turn), True, (255, 255, 255))
                self.ui_text_turn_count = self._controller.game.turn
            self.draw_surface(self.ui_text_turn_count_background, 170, 5)
            self.draw_surface(self.ui_text_turn_count_surface, 175, 10)