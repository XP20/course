from dataclasses import field
from dataclasses import dataclass
from models.Vector2D import Vector2D
from models.enums.EnumActor import EnumActor
from models.enums.EnumTribe import EnumTribe
from dataclasses_json import dataclass_json
import uuid

from views.components.ComponentButton import ComponentButton

@dataclass_json
@dataclass
class Actor:
    uuid: str = uuid.uuid4()
    position: Vector2D = field(default=Vector2D)
    actor_type: EnumActor = EnumActor.NotSet
    tribe: EnumTribe = EnumTribe.NotSet

    cost_stars: int = 0
    move_steps: int = 0
    power_attack: int = 0
    power_defense: int = 0
    experience: int = 0
    level: int = 0