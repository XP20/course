import json

from actions.actions_chat import ActionsChat

def reducer_main(state, action):
    print(json.dumps(action, indent=4))
    state = state.copy()

    if action['type'] == ActionsChat.CHAT_EDIT_MESSAGE:
        state.update({
            'current_message': action['payload']
        })
    elif action['type'] == ActionsChat.CHAT_ADD_MESSAGE:
        state.update({
            'messages': state['messages'] + [action['payload']]
        })
    elif action['type'] == ActionsChat.CHAT_CLEAR_MESSAGES:
        state.update({
            'messages': action['payload']
        })
    elif action['type'] == ActionsChat.CHAT_UNDO_MESSAGE:
        last_action = state['actions'].pop() # ???? undo_chat_message

        state.update({
            'messages': action['payload']
        })
    elif action['type'] == ActionsChat.CHAT_CHANGE_CAPS:
        state.update({
            'messages': action['payload']
        })
    elif action['type'] == ActionsChat.CHAT_DELETE_MESSAGE:
        state.update({
            'messages': action['payload']
        })

    state.update({
        'actions': state['actions'] + [action]
    })

    return state