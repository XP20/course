from typing import List
from loguru import logger
from pygame import SRCALPHA, Rect, Surface
import pygame

from models.Vector2D import Vector2D
from views.components.EventComponentButton import EventComponentButton

hover = (87, 85, 92)
press = (51, 50, 54)
up = (121, 119, 127)
border = (25, 24, 26)

class ComponentButton:
    def __init__(self, rect: Rect, text: str, linked_object: object = None, linked_enum: object = None):
        self.button_rect = rect
        self.button_up = Surface((rect.width, rect.height), SRCALPHA)

        # self.status == 0
        pygame.draw.rect(
            self.button_up,
            color=border,
            rect=Rect(0, 0, rect.width, rect.height)
        )
        pygame.draw.rect(
            self.button_up,
            color=up,
            rect=pygame.Rect(3, 3, rect.width - 6, rect.height - 6)
        )

        # self.status == 1
        self.button_hover = Surface((rect.width, rect.height), SRCALPHA)
        pygame.draw.rect(
            self.button_hover,
            color=border,
            rect=Rect(0, 0, rect.width, rect.height)
        )
        pygame.draw.rect(
            self.button_hover,
            color=hover,
            rect=pygame.Rect(3, 3, rect.width - 6, rect.height - 6)
        )

        # self.status == 2
        self.button_press = Surface((rect.width, rect.height), SRCALPHA)
        pygame.draw.rect(
            self.button_press,
            color=border,
            rect=Rect(0, 0, rect.width, rect.height)
        )
        pygame.draw.rect(
            self.button_press,
            color=press,
            rect=pygame.Rect(3, 3, rect.width - 6, rect.height - 6)
        )

        self.status = 0
        self.linked_object = linked_object
        self.linked_enum = linked_enum

        self.font = pygame.font.Font('freesansbold.ttf', 18)
        self.text = self.font.render(text, True, (255, 255, 255))

        self.was_clicked = False
        self.listeners_click: List[callable] = []

    def draw(self, surface: Surface):
        button_surface: Surface

        if self.status == 1:
            button_surface = self.button_hover
        elif self.status == 2:
            button_surface = self.button_press
        else:
            button_surface = self.button_up
        
        surface.blit(
            button_surface,
            (self.button_rect.x, self.button_rect.y)
        )
        surface.blit(
            self.text,
            (self.button_rect.x + 4, self.button_rect.y + 4)
        )

    def move(self, newPos: Vector2D):
        self.button_rect = Rect(newPos.x, newPos.y, self.button_rect.width, self.button_rect.height)

    def trigger_mouse(self, mouse_position, mouse_buttons):
        status = self.__get_status(mouse_position, mouse_buttons)
        if status == 2:
            for listener in self.listeners_click:
                event = EventComponentButton()
                event.linked_object = self.linked_object
                event.linked_enum = self.linked_enum

                # Try to call the function
                try:
                    listener(event)
                except Exception as exc1:
                    logger.exception(exc1)
                    listener()

        return status
    
    def __get_status(self, mouse_position, mouse_buttons):
        inX = (self.button_rect.x < mouse_position[0] < (self.button_rect.x + self.button_rect.width))
        inY = (self.button_rect.y < mouse_position[1] < (self.button_rect.y + self.button_rect.height))
        
        result = 0

        if inX and inY:
            self.status = 1
            result = 1
            if mouse_buttons[0]:
                self.status = 2
                if not self.was_clicked:
                    self.was_clicked = True
                    result = 2
            else:
                self.was_clicked = False
        else:
            self.was_clicked = False
            self.status = 0

        return result

    def add_listener_click(self, event_listener: callable):
        if event_listener not in self.listeners_click:
            self.listeners_click.append(event_listener)

    def remove_listener_click(self, event_listener: callable):
        if event_listener in self.listeners_click:
            self.listeners_click.remove(event_listener)