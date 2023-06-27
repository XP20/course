from models.Vector2D import Vector2D

tileHeight = 15
tileWidth = 52

class ViewProperties():
    @staticmethod
    def toTilePos(x, y):
        posOut = Vector2D(x, y)
        posOut.x *= tileWidth
        posOut.y *= tileHeight

        if y % 2 == 1:
            posOut.x += tileWidth / 2

        return posOut