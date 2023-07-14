from dataclasses import dataclass, field
from typing import List
import pygame
import react.Component
import components.Button
import components.TextField
from actions import actions_chat
from components.Button import Button
from components.TextBox import TextBox
from components.TextField import TextField
from react.Component import Component
from stores.store_main import store_main


@dataclass
class Props(react.Component.Props):
    pass

@dataclass
class State:
    num: int = 0

class WindowMain(Component):
    def __init__(self, props):
        super().__init__(props)
        self.focused: bool = False
        self.caps: bool = False
        self.state = State(
            num=1
        )
        store_main.subscribe(self.onStoreChange)

    def onStoreChange(self):
        self.forceUpdate()
        self.setState(
            State(
                num=self.state.num+1
            )
        )

    def onPressSend(self):
        action = actions_chat.action_chat_add_message(
            store_main.get_state()['current_message']
        )
        store_main.dispatch(action)

        action = actions_chat.action_chat_edit_message('')
        store_main.dispatch(action)

    def onPressClear(self):
        action = actions_chat.action_chat_clear_messages()
        store_main.dispatch(action)

    def onPressUndo(self):
        action = actions_chat.action_chat_undo_message(
            store_main.get_state()['messages']
        )
        store_main.dispatch(action)

    def onPressToggleCaps(self):
        self.caps = not self.caps
        action = actions_chat.action_chat_change_caps(
            store_main.get_state()['messages'],
            self.caps
        )
        store_main.dispatch(action)

    def onPressDelete(self, message: str):
        action = actions_chat.action_chat_delete_message(
            store_main.get_state()['messages'],
            message
        )
        store_main.dispatch(action)

    def onTextChange(self, text):
        action = actions_chat.action_chat_edit_message(
            text
        )
        store_main.dispatch(action)

    def onTextBoxFocusChange(self, focused):
        self.focused = focused

    def render(self):
        elements = []
        offset_top = self.props.y + 10
        messages = store_main.get_state()['messages']
        for i, message in enumerate(messages):
            text_field = TextField(
                props=components.TextField.Props(
                    x=self.props.x + 10,
                    y=offset_top,
                    width=self.props.width - 110,
                    height=40,
                    text=message
                )
            )
            text_delete = Button(
                props=components.Button.Props(
                    x=self.props.width - 100,
                    y=offset_top,
                    width=90,
                    height=35,
                    title='Delete',
                    onPress=self.onPressDelete,
                    arg=message
                )
            )
            text_lines = text_field.getWrappedText()
            height = text_field.props.height * len(text_lines)
            offset_top += height
            elements.append(text_field)
            elements.append(text_delete)

        text_input = TextBox(
            props=components.TextBox.Props(
                x=self.props.x + 10,
                y=self.props.y + self.props.height - 50,
                width=self.props.width - 290,
                height=40,
                text=store_main.get_state()['current_message'],
                onTextChange=self.onTextChange,
                onFocusChange=self.onTextBoxFocusChange,
                focused=self.focused
            )
        )

        elements.append(Button(
            props=components.Button.Props(
                x=self.props.x + self.props.width - 180,
                y=self.props.y + self.props.height - 100,
                width=170,
                height=40,
                title="Toggle Caps",
                onPress=self.onPressToggleCaps
            )
        ))

        elements.append(Button(
            props=components.Button.Props(
                x=self.props.x + self.props.width - 90,
                y=self.props.y + self.props.height - 50,
                width=80,
                height=40,
                title="Undo",
                onPress=self.onPressUndo
            )
        ))

        elements.append(Button(
            props=components.Button.Props(
                x=self.props.x + self.props.width - 180,
                y=self.props.y + self.props.height - 50,
                width=80,
                height=40,
                title="Clear",
                onPress=self.onPressClear
            )
        ))

        elements.append(Button(
            props=components.Button.Props(
                x=self.props.x + self.props.width - 270,
                y=self.props.y + self.props.height - 50,
                width=80,
                height=40,
                title="Send",
                onPress=self.onPressSend
            )
        ))

        elements.append(text_input)

        return elements

    def draw(self, screen):
        if self.shouldComponentUpdate(self.props, self.state):
            print('updating component')
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