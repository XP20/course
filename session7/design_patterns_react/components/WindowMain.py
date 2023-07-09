from dataclasses import dataclass, field
from typing import List
import pygame
import react.Component
import components.Button
import components.TextField
from components.Button import Button
from components.TextBox import TextBox
from components.TextField import TextField
from react.Component import Component

@dataclass
class Props(react.Component.Props):
    pass

@dataclass
class State:
    messages: List[str] = field(default_factory=list)

class WindowMain(Component):
    def __init__(self, props):
        super().__init__(props)

        self.state = State(
            messages=[]
        )

        self.text_input: TextBox = None

    def onPressSend(self, linked_object: object):
        if type(linked_object) == TextBox:
            messages = self.state.messages
            text = linked_object.state.text

            messages.append(text)
            self.setState(
                State(
                    messages=messages
                )
            )

    def onPressClear(self, linked_object: object):
        self.setState(
            State(
                messages=[]
            )
        )

    def render(self):
        elements = []
        offset_top = self.props.y + 10
        for i, message in enumerate(self.state.messages):
            text_field = TextField(
                props=components.TextField.Props(
                    x=self.props.x + 10,
                    y=offset_top,
                    width=self.props.width,
                    height=40,
                    text=message
                )
            )
            text_lines = text_field.getWrappedText()
            height = text_field.props.height * len(text_lines)
            offset_top += height
            elements.append(text_field)

        text_input = TextBox(
            props=components.TextBox.Props(
                x=self.props.x + 10,
                y=self.props.y + self.props.height - 50,
                width=self.props.width - 200,
                height=40,
                text=""
            )
        )

        elements.append(Button(
            props=components.Button.Props(
                x=self.props.x + self.props.width - 90,
                y=self.props.y + self.props.height - 50,
                width=80,
                height=40,
                title="Clear",
                onPress=self.onPressClear
            )
        ))

        elements.append(Button(
            props=components.Button.Props(
                x=self.props.x + self.props.width - 180,
                y=self.props.y + self.props.height - 50,
                width=80,
                height=40,
                title="Send",
                onPress=self.onPressSend,
                linkedObject=text_input
            )
        ))

        elements.append(text_input)

        return elements

    def draw(self, screen):
        if self.shouldComponentUpdate(self.props, self.state):
            pygame.draw.rect(
                screen,
                color=(230, 230, 230),
                rect=pygame.Rect(
                    self.props.x,
                    self.props.y,
                    self.props.width,
                    self.props.height
                )
            )
        super().draw(screen)