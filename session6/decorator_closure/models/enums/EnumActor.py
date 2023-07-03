from enum import Enum

class EnumActor(str, Enum):
    NotSet = "NotSet"
    Warrior = "Warrior"
    Rider = "Rider"
    Knight = "Knight"

    def __str__(self) -> str:
        return self.value
    
    def __int__(self) -> int:
        result = 0
        if self == EnumActor.Warrior:
            result = 1
        elif self == EnumActor.Rider:
            result = 2
        elif self == EnumActor.Knight:
            result = 3
        return result

    @staticmethod
    def from_int(value: int) -> "EnumActor":
        result = None
        for actor in EnumActor:
            if int(actor) == value:
                result = actor
        return result
    
# my_enum = EnumActor.Warrior
# encoded_value = int(my_enum)
# print(encoded_value)  # Output: 1

# decoded_enum = EnumActor.from_int(encoded_value)
# print(decoded_enum)  # Output: EnumActor.Warrior