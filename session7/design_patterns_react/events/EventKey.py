from dataclasses import dataclass

@dataclass
class EventKey:
    is_handled: bool = False
    key_code: int = 0
    key_name: str = ""