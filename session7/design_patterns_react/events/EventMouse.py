from dataclasses import dataclass


@dataclass
class EventMouse:
    is_handled: bool = False
    is_mouse_down: bool = False
    x: int = 0
    y: int = 0