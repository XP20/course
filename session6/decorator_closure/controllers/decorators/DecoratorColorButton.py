from pygame import SRCALPHA, Rect, Surface
import pygame
from models.Vector2D import Vector2D
from views.components.ComponentButton import ComponentButton

class DecoratorColorButton(ComponentButton):
    def __init__(self, button: ComponentButton, hover = (87, 85, 92), press = (51, 50, 54), up = (121, 119, 127), border = (25, 24, 26)):
        self._button = button
        visited = []
        while hasattr(self._button, "_button") and self._button not in visited:
            visited.append(self._button)
            self._button = self._button._button

        self._button.button_up = Surface((self._button.button_rect.width, self._button.button_rect.height), SRCALPHA)
        pygame.draw.rect(
            self._button.button_up,
            color=border,
            rect=Rect(0, 0, self._button.button_rect.width, self._button.button_rect.height)
        )
        pygame.draw.rect(
            self._button.button_up,
            color=up,
            rect=pygame.Rect(3, 3, self._button.button_rect.width - 6, self._button.button_rect.height - 6)
        )

        # self.status == 1
        self._button.button_hover = Surface((self._button.button_rect.width, self._button.button_rect.height), SRCALPHA)
        pygame.draw.rect(
            self._button.button_hover,
            color=border,
            rect=Rect(0, 0, self._button.button_rect.width, self._button.button_rect.height)
        )
        pygame.draw.rect(
            self._button.button_hover,
            color=hover,
            rect=pygame.Rect(3, 3, self._button.button_rect.width - 6, self._button.button_rect.height - 6)
        )

        # self.status == 2
        self._button.button_press = Surface((self._button.button_rect.width, self._button.button_rect.height), SRCALPHA)
        pygame.draw.rect(
            self._button.button_press,
            color=border,
            rect=Rect(0, 0, self._button.button_rect.width, self._button.button_rect.height)
        )
        pygame.draw.rect(
            self._button.button_press,
            color=press,
            rect=pygame.Rect(3, 3, self._button.button_rect.width - 6, self._button.button_rect.height - 6)
        )

        self.text = self._button.text
        super().__init__(self._button.button_rect, self.text, self._button.linked_object, self._button.linked_enum)

    def set_linked_object(self, linked_object: object):
        self._button.set_linked_object(linked_object)

    def set_linked_enum(self, linked_enum: object):
        self._button.set_linked_enum(linked_enum)

    def draw(self, surface: Surface):
        self._button.draw(surface)

    def move(self, newPos: Vector2D):
        self._button.move(newPos)

    def trigger_mouse(self, mouse_position, mouse_buttons):
        self._button.trigger_mouse(mouse_position, mouse_buttons)

    def add_listener_click(self, event_listener: callable):
        self._button.add_listener_click(event_listener)

    def remove_listener_click(self, event_listener: callable):
        self._button.remove_listener_click(event_listener)