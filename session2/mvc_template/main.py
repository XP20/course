from views.WindowMain import WindowMain
from pynput import keyboard

windowMain = WindowMain()

def on_press(key):
    if key == keyboard.Key.right:
        windowMain.camPosition.x -= windowMain.camSpeed
    if key == keyboard.Key.left:
        windowMain.camPosition.x += windowMain.camSpeed
    if key == keyboard.Key.up:
        windowMain.camPosition.y += windowMain.camSpeed
    if key == keyboard.Key.down:
        windowMain.camPosition.y -= windowMain.camSpeed
    if key == keyboard.Key.space:
        windowMain.execute_turn()
    if key == keyboard.Key.esc:
        windowMain.is_game_running = False
 
def on_release(key):
    pass

listener = keyboard.Listener(
    on_press=on_press,
    on_release=on_release)
listener.start()

windowMain.show()