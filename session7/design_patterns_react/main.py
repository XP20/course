import time
import pygame
import components.WindowMain
from components.WindowMain import WindowMain
from events.EventKey import EventKey
from events.EventMouse import EventMouse

pygame.init()
screen = pygame.display.set_mode(
    (500, 500)
)
screen.fill((0, 0, 0))

windowMain = WindowMain(
    props=components.WindowMain.Props(
        x=10,
        y=10,
        width=480,
        height=480
    )
)

is_running = True
is_mouse_down = False
while is_running:
    mouse_pos = pygame.mouse.get_pos()
    mouse_buttons = pygame.mouse.get_pressed()

    if is_mouse_down and not any(mouse_buttons):
        event = EventMouse()
        event.x = mouse_pos[0]
        event.y = mouse_pos[1]
        event.is_mouse_down = False
        windowMain.onPress(event)
    else:
        event = EventMouse()
        event.x = mouse_pos[0]
        event.y = mouse_pos[1]
        event.is_mouse_down = any(mouse_buttons)
        windowMain.onMouseMove(event)
    is_mouse_down = any(mouse_buttons)

    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            is_running = False
        elif event.type == pygame.KEYDOWN:
            if event.key == pygame.K_ESCAPE:
                is_running = False
            else:
                event = EventKey(
                    key_code=event.key,
                    key_name=pygame.key.name(event.key)
                )
                windowMain.onKeyDown(event)

    windowMain.draw(screen)
    pygame.display.flip()
    time.sleep(0.01)