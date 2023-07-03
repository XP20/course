from pygame import SRCALPHA, Surface

from models.Vector2D import Vector2D
from views.components.ComponentButton import ComponentButton

class DecoratorUnclickableButton(ComponentButton):
    def __init__(self, button: ComponentButton):
        self._button = button
        visited = []
        while hasattr(self._button, "_button") and self._button not in visited:
            visited.append(self._button)
            self._button = self._button._button

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
        pass

    def add_listener_click(self, event_listener: callable):
        pass

    def remove_listener_click(self, event_listener: callable):
        pass