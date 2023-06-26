from views.WindowMain import WindowMain
from controllers.ControllerGame import ControllerGame

controller = ControllerGame.instance()
windowMain = WindowMain.instance()

windowMain.show()