from enum import Enum

class EnumMapItem(str, Enum):
    NotSet = "NotSet"
    Fruit = "Fruit"

    def __str__(self) -> str:
        return self.value