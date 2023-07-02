from models.Vector2D import Vector2D

class ViewProperties:
    TILE_WIDTH = 52
    TILE_HEIGHT = 15
    SCREEN_WIDTH = 520
    SCREEN_HEIGHT = 500
    CULL_MARGIN = 100
    CAM_SPEED = 10
    ANIMATION_TIME = 24

    @staticmethod
    def toTilePos(x, y):
        posOut = Vector2D(x, y)
        posOut.x *= ViewProperties.TILE_WIDTH
        posOut.y *= ViewProperties.TILE_HEIGHT

        if y % 2 == 1:
            posOut.x += ViewProperties.TILE_WIDTH / 2

        return posOut