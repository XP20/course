import time
import uuid
from typing import Dict, List
import pygame
from pygame import SRCALPHA, Rect, Surface
from controllers.interfaces.IControllerActor import IControllerActor
from models.Game import Game

from models.Vector2D import Vector2D

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

        # Buttons
        self.ui_buttons: List[ComponentButton] = []

        self.actor_buttons: Dict[str, ComponentButton] = {}
        self.building_buttons: Dict[str, ComponentButton] = {}

        self.camSpeed = 18
        self.camPosition = Vector2D()

        pygame.font.init()
        
        self._controller = ControllerGame.instance()
        self._game = self._controller.new_game()
        self.make_building_buttons()

    def make_building_buttons(self):
        for building in self._game.buildings:
            building_uuid = str(building.uuid)
            if building_uuid not in self.building_buttons:
                button = ComponentButton(
                    pygame.Rect(0, 0, ViewProperties.TILE_WIDTH, ViewProperties.TILE_HEIGHT), '', building, building.tribe)
                button.add_listener_click(self.on_click_building)
                self.building_buttons[building_uuid] = button

    def make_actor_buttons(self):
        for actor_cont in self._controller._actor_controllers:
            actor = actor_cont.actor
            actor_uuid = str(actor.uuid)
            if actor_uuid not in self.actor_buttons:
                button = ComponentButton(
                    pygame.Rect(0, 0, ViewProperties.TILE_WIDTH, ViewProperties.TILE_HEIGHT), '', actor_cont)
                button.add_listener_click(self.on_click_actor_cont)
                self.actor_buttons[actor_uuid] = button

    def on_click_actor_cont(self, event: EventComponentButton):
        actor_cont = event.linked_object
        if actor_cont:
            if event.left_click:
                self._controller.selected_controller = actor_cont

    def on_click_building(self, event: EventComponentButton):
        building = event.linked_object
        if building:
            tribe = building.tribe

            if event.left_click:
                pos = building.position
                factory = self.resource_factories_by_tribes[tribe]
                warrior = factory.create_actor(EnumActor.Warrior)

                # Cant move to ControllerGame because circular import with ControllerActorWarrior and WindowMain
                warriorController = ControllerActorWarrior(warrior)
                warriorController.actor.position = Vector2D(pos.x, pos.y)
                warriorController.actor.uuid = uuid.uuid4()
                
                self._game.actors.append(warrior)
                self._controller._actor_controllers.append(warriorController)
                self.make_actor_buttons()

    def on_click_new_game(self, event: EventComponentButton):
        self._game = self._controller.new_game()
        self.make_building_buttons()

    def on_click_save_game(self, event: EventComponentButton):
        state_json = self._game.to_json(indent=4)
        with open('state.json', 'w') as fp:
            fp.write(state_json)

    def on_click_load_game(self, event: EventComponentButton):
        with open('state.json', 'r') as fp:
            # Save old actor controllers
            actorControllerDict: Dict[str, IControllerActor] = {}
            for actor_cont in self._controller._actor_controllers:
                actor = actor_cont.actor
                uuid = str(actor.uuid)
                actorControllerDict[uuid] = actor_cont

            state_json = fp.read()
            self._controller.game = Game.from_json(state_json)
            self._game = self._controller.game

            # Set the correct actor references
            for actor in self._game.actors:
                uuid = str(actor.uuid)
                actor_cont = actorControllerDict[uuid]
                actor_cont.set_actor(actor)

            # Make building buttons again
            self.building_buttons.clear()
            self.make_building_buttons()
            
            #! SAVING POSITION WORKS BUT LOADING DOESNT UPDATE POSITION + SAVING AGAIN DOESNT WORK

    def on_key_press(self, key):
        if key == keyboard.Key.right:
            WindowMain.instance().camPosition.x -= ViewProperties.CAM_SPEED
        if key == keyboard.Key.left:
            WindowMain.instance().camPosition.x += ViewProperties.CAM_SPEED
        if key == keyboard.Key.up:
            WindowMain.instance().camPosition.y += ViewProperties.CAM_SPEED
        if key == keyboard.Key.down:
            WindowMain.instance().camPosition.y -= ViewProperties.CAM_SPEED
        if key == keyboard.Key.esc:
            WindowMain.instance().is_game_running = False
    
    def on_key_release(self, key):
        pass

    def show(self):
        listener = keyboard.Listener(
            on_press=self.on_key_press,
            on_release=self.on_key_release)
        listener.start()

        pygame.font.init()
        
        # New game button
        self.ui_button_new_game = ComponentButton(
            Rect(ViewProperties.SCREEN_WIDTH - 120, 5, 115, 35),
            'New Game'
        )
        self.ui_button_new_game.add_listener_click(self.on_click_new_game)

        # Save game button
        self.ui_button_save_game = ComponentButton(
            Rect(ViewProperties.SCREEN_WIDTH - 120, 43, 115, 35),
            'Save Game'
        )
        self.ui_button_save_game.add_listener_click(self.on_click_save_game)

        # Save game button
        self.ui_button_load_game = ComponentButton(
            Rect(ViewProperties.SCREEN_WIDTH - 120, 81, 115, 35),
            'Load Game'
        )
        self.ui_button_load_game.add_listener_click(self.on_click_load_game)

        # Do turn button
        self.ui_button_do_turn = ComponentButton(
            Rect(5, 35, 80, 30),
            'Do Turn'
        )
        self.ui_button_do_turn.add_listener_click(self.execute_turn)

        # Add buttons to ui_buttons list
        self.ui_buttons.append(self.ui_button_new_game)
        self.ui_buttons.append(self.ui_button_save_game)
        self.ui_buttons.append(self.ui_button_load_game)
        self.ui_buttons.append(self.ui_button_do_turn)

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

        for button in self.ui_buttons:
            button.trigger_mouse(mouse_pos, mouse_buttons)

        # Move actor buttons
        for controller in self._controller._actor_controllers:
            actor = controller.actor
            actor_uuid = str(actor.uuid)
            button = self.actor_buttons[actor_uuid]
            if button != None:
                button.move(ViewProperties.toTilePos(actor.position.x, actor.position.y) + self.camPosition)
                button.trigger_mouse(mouse_pos, mouse_buttons)

        # Move city buttons
        for building in self._game.buildings:
            building_uuid = str(building.uuid)
            button = self.building_buttons[building_uuid]
            if button != None and building.building_type == EnumBuilding.City:
                button.move(ViewProperties.toTilePos(building.position.x, building.position.y) + self.camPosition)
                button.trigger_mouse(mouse_pos, mouse_buttons)

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
            # buildings = self._game.buildings
            # for building in buildings:
            #     building_type = building.building_type
            #     level = building.level
            #     tribe = building.tribe
                
            #     x = building.position.x * ViewProperties.TILE_WIDTH + tempCamPos.x + self.offsets_by_building[building_type].x
            #     y = building.position.y * ViewProperties.TILE_HEIGHT + tempCamPos.y + self.offsets_by_building[building_type].y

            #     if building.position.y % 2 == 1:
            #         x += ViewProperties.TILE_WIDTH / 2

            #     renderAhead = 0
            #     if building_type == EnumBuilding.Sawmill:
            #         renderAhead = 2

            #     if building.position.y + renderAhead == i:
            #         factory = self.resource_factories_by_tribes[tribe]
                    
            #         building_key = (building_type, tribe, level)
            #         building_surface: Surface
                    
            #         if building_key in self.surfaces_by_building:
            #             building_surface = self.surfaces_by_building[building_key]
            #         else:
            #             building_surface = factory.get_building(building_type, level)
            #             self.surfaces_by_building[building_key] = building_surface

            #         self.draw_surface(building_surface, x, y)

            # Render actors for row
            # actor_controllers = self._controller._actor_controllers
            # for actor_controller in actor_controllers:
            #     actor = actor_controller.actor
            #     actor_type = actor.actor_type
            #     x = actor_controller.animatedPos.x + tempCamPos.x + self.offsets_by_actor[actor_type].x
            #     y = actor_controller.animatedPos.y + tempCamPos.y + self.offsets_by_actor[actor_type].y
                
            #     orderY = actor_controller.animatedPos.y / ViewProperties.TILE_HEIGHT
            #     if math.ceil(orderY) == i:
            #         actorSurface = self.surfaces_by_actor[actor_type]
            #         self.draw_surface(actorSurface, x, y)

        for elem in (self._game.buildings + self._controller._actor_controllers):
            surface = None
            x = 0
            y = 0
            if elem in self._game.buildings:
                building_type = elem.building_type
                level = elem.level
                tribe = elem.tribe
                
                x = elem.position.x * ViewProperties.TILE_WIDTH + tempCamPos.x + self.offsets_by_building[building_type].x
                y = elem.position.y * ViewProperties.TILE_HEIGHT + tempCamPos.y + self.offsets_by_building[building_type].y

                if elem.position.y % 2 == 1:
                    x += ViewProperties.TILE_WIDTH / 2

                factory = self.resource_factories_by_tribes[tribe]
                    
                building_key = (building_type, tribe, level)
                    
                if building_key in self.surfaces_by_building:
                    surface = self.surfaces_by_building[building_key]
                else:
                    surface = factory.get_building(building_type, level)
                    self.surfaces_by_building[building_key] = surface
            elif elem in self._controller._actor_controllers:
                actor = elem.actor
                actor_type = actor.actor_type
                x = elem.animatedPos.x + tempCamPos.x + self.offsets_by_actor[actor_type].x
                y = elem.animatedPos.y + tempCamPos.y + self.offsets_by_actor[actor_type].y
                
                surface = self.surfaces_by_actor[actor_type]

            if surface != None:
                self.draw_surface(surface, x, y)

        # Draw UI
        for button in self.ui_buttons:
            button.draw(self.screen)

        # Show which tribe's turn it is
        if self.ui_text_tribe_turn is not self._controller.game.turn_tribe:
            self.ui_text_tribe_turn_surface = self.font.render('Tribe: ' + self._controller.game.turn_tribe, True, (255, 255, 255))
            self.ui_text_tribe_turn = self._controller.game.turn_tribe
        self.draw_surface(self.ui_text_tribe_turn_background, 5, 5)
        self.draw_surface(self.ui_text_tribe_turn_surface, 10, 10)

        # Show which turn it is
        if self.ui_text_turn_count is not self._controller.game.turn:
            self.ui_text_turn_count_surface = self.font.render('Turn: ' + str(self._controller.game.turn), True, (255, 255, 255))
            self.ui_text_turn_count = self._controller.game.turn
        self.draw_surface(self.ui_text_turn_count_background, 170, 5)
        self.draw_surface(self.ui_text_turn_count_surface, 175, 10)