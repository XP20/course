from dataclasses import dataclass
from typing import Tuple
import pygame
import components.TextField
from events.EventKey import EventKey
from events.EventMouse import EventMouse
from react.Component import Component

@dataclass
class Props(components.TextField.Props):
    color_border: Tuple = (0, 0, 0)
    color_background: Tuple = (200, 200, 200)
    onTextChange: callable = None

@dataclass
class State:
    text: str = ""
    focused: bool = False

class TextBox(Component):
    def __init__(self, props):
        super().__init__(props)
        self.state = State(
            text=self.props.text,
            focused=False,
        )

    def render(self):
        font = pygame.font.SysFont('arial', 24)
        text = self.state.text
        current_text = ''
        for i, char in reversed(list(enumerate(text))):
            next_text_width, next_text_height = font.size(char + current_text)
            if next_text_width > self.props.width - 20:
                break
            current_text = char + current_text

        text_field = components.TextField.TextField(
            props=components.TextField.Props(
                x=self.props.x + 5,
                y=self.props.y + 5,
                width=self.props.width - 5,
                height=self.props.height - 5,
                text=current_text
            )
        )
        return [text_field]

    def onPress(self, event: EventMouse):
        focused = False
        if self.props.x < event.x < self.props.x + self.props.width:
            if self.props.y < event.y < self.props.y + self.props.height:
                event.is_handled = True
                focused = True
        self.setState(
            State(
                text=self.state.text,
                focused=focused
            )
        )

    def onKeyDown(self, event: EventKey):
        if self.state.focused:
            if event.key_code == pygame.K_BACKSPACE:
                text_len = len(self.state.text)
                if text_len > 0:
                    text = self.state.text[:-1]
                    self.setState(
                        State(
                            text=text,
                            focused=self.state.focused
                        )
                    )
            elif 32 <= event.key_code <= 126:
                text: str = self.state.text
                char: str = event.key_name

                if char == 'space':
                    char = ' '

                text += char
                self.setState(
                    State(
                        text=text,
                        focused=self.state.focused
                    )
                )

    def draw(self, screen):
        if self.shouldComponentUpdate(self.props, self.state):
            color_background = self.props.color_background
            if self.state.focused:
                color_background = (255, 255, 255)

            pygame.draw.rect(
                screen,
                color_background,
                (self.props.x, self.props.y, self.props.width, self.props.height)
            )
            pygame.draw.rect(
                screen,
                self.props.color_border,
                (self.props.x, self.props.y, self.props.width, self.props.height),
                1
            )
        super().draw(screen)