import abc
from abc import abstractmethod, ABC
from models.Actor import Actor

class ICommand(ABC):
    @abstractmethod
    def execute(self):
        pass

    @abstractmethod
    def undo(self):
        pass