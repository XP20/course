import math
from dataclasses import dataclass
from typing import Tuple, List
import pygame
import react.Component
from react.Component import Component

@dataclass
class Props(react.Component.Props):
    text: str = ''
    color_font: Tuple = (0, 0, 0)

@dataclass
class State:
    pass

class TextField(Component):
    def __init__(self, props):
        super().__init__(props)
        if self.props.color_font is None:
            self.props.color_font = (0, 0, 0)

    def render(self):
        return []

    def getWrappedText(self) -> List[str]:
        text = self.props.text
        text_lines = []
        font = pygame.font.SysFont('arial', 24)
        text_width, text_height = font.size(text)
        max_text_width = self.props.width - 15

        loop_times = math.floor(text_width / max_text_width)
        for _ in range(loop_times):
            # Getting a line
            current_selected = ''
            chars_counted = 0
            for i in range(len(text)):
                char = text[i]
                to_be_text_width, to_be_text_height = font.size(current_selected + char)
                if to_be_text_width > max_text_width:
                    break
                current_selected += char
                chars_counted += 1

            # Add line
            text_lines.append(current_selected)
            text = text[chars_counted:]

        text_lines.append(text)
        return text_lines

    def draw(self, screen):
        if self.shouldComponentUpdate(self.props, self.state):
            font = pygame.font.SysFont('arial', 24)
            text_lines = self.getWrappedText()

            for i, line in enumerate(text_lines):
                img_font = font.render(line, True, self.props.color_font)
                screen.blit(img_font, (self.props.x, self.props.y + self.props.height * i))

        super().draw(screen)