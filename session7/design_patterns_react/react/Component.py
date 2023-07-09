from dataclasses import dataclass
from events import EventMouse
from events.EventKey import EventKey

@dataclass
class Props:
    x: int = 0
    y: int = 0
    width: int = 0
    height: int = 0

@dataclass
class State:
    pass

class Component:
    def __init__(self, props: Props):
        self.children = []
        self.children_before = []

        self.props = props
        self.state = State()

        self.propsPrevious = None
        self.statePrevious = None

        self.is_mounted = False

    def setState(self, state):
        self.state = state
        self.children = self.render()

    def forceUpdate(self):
        self.children = self.render()

    def componentDidMount(self):
        pass

    def componentDidUpdate(self):
        self.statePrevious = self.state
        self.propsPrevious = self.props

    def componentWillUnmount(self):
        pass

    def shouldComponentUpdate(self, nextProps, nextState):
        result = not self.is_mounted or self.propsPrevious != nextProps or self.statePrevious != nextState
        return result

    def render(self):
        return []

    def draw(self, screen):
        children_next = self.render()

        if not self.is_mounted:
            self.children = children_next
            self.componentDidMount()
            self.is_mounted = True

        if len(children_next) != len(self.children_before):
            for child in self.children_before:
                child.componentWillUnmount()
            self.children = children_next
            for child in self.children:
                child.draw(screen)
        else:
            for child, child_before in zip(self.children, self.children_before):
                if child_before.shouldComponentUpdate(child.props, child.state) or self.shouldComponentUpdate(self.props, self.state):
                    child.children = child.render()
                    child.draw(screen)

        self.children_before = self.children

        if self.shouldComponentUpdate(self.props, self.state):
            self.componentDidUpdate()

    def onPress(self, event: EventMouse):
        if not event.is_handled:
            for child in self.children:
                child.onPress(event)

    def onMouseMove(self, event: EventMouse):
        if not event.is_handled:
            for child in self.children:
                child.onMouseMove(event)

    def onKeyDown(self, event: EventKey):
        if not event.is_handled:
            for child in self.children:
                child.onKeyDown(event)