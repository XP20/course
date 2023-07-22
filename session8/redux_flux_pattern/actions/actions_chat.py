from enum import Enum
from typing import List
from loguru import logger

class ActionsChat(str, Enum):
    CHAT_ADD_MESSAGE = 'CHAT_ADD_MESSAGE'
    CHAT_EDIT_MESSAGE = 'CHAT_EDIT_MESSAGE'
    CHAT_CLEAR_MESSAGES = 'CHAT_CLEAR_MESSAGES'
    CHAT_UNDO_MESSAGE = 'CHAT_UNDO_MESSAGE'
    CHAT_CHANGE_CAPS = 'CHAT_CHANGE_CAPS'
    CHAT_DELETE_MESSAGE = 'CHAT_DELETE_MESSAGE'

def action_chat_add_message(message: str):
    return {
        'type': ActionsChat.CHAT_ADD_MESSAGE,
        'payload': message
    }

def action_chat_edit_message(message: str):
    return {
        'type': ActionsChat.CHAT_EDIT_MESSAGE,
        'payload': message
    }

def action_chat_clear_messages():
    return {
        'type': ActionsChat.CHAT_CLEAR_MESSAGES,
        'payload': []
    }

def action_chat_undo_message(messages: List[str]):
    return {
        'type': ActionsChat.CHAT_UNDO_MESSAGE,
        'payload': messages[:-1]
    }

def action_chat_change_caps(messages: List[str], uppercase: bool):
    modified_messages = messages.copy()
    for i, message in enumerate(modified_messages):
        if uppercase:
            modified_message = message.upper()
        else:
            modified_message = message.lower()
        modified_messages[i] = modified_message

    return {
        'type': ActionsChat.CHAT_CHANGE_CAPS,
        'payload': modified_messages
    }

def action_chat_delete_message(messages: List[str], message: str):
    messages_updated = messages.copy()
    if message in messages_updated:
        messages_updated.remove(message)

    return {
        'type': ActionsChat.CHAT_DELETE_MESSAGE,
        'payload': messages_updated
    }