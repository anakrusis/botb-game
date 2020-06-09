from PIL import Image
import sys
import random

path_in = sys.argv[1]
canvasName = sys.argv[2]
file_out = open(canvasName + ".js", "w")

imageIn = Image.open(path_in)
i_loaded = imageIn.load()
imageTileset = Image.open("botb-spritesheet.png")
t_loaded = imageTileset.load()

palette_x = {} # Dictionaries for colors that have already been used
palette_y = {}

width, height = imageIn.size
tWidth, tHeight = imageTileset.size

file_out.write(canvasName + ' = {\n')

file_out.write('init(){\n')
file_out.write('this.canvas = document.createElement("canvas");\n')
file_out.write('this.ctx = this.canvas.getContext("2d");\n')
file_out.write('this.canvas.setAttribute("id", "' + canvasName + '");\n')
file_out.write('this.canvas.width = ' + str(width) + '; ' + 'this.canvas.height = ' + str(height) + ";\n")
file_out.write("document.body.appendChild(" + "this.canvas );\n")

currentPixelKey = ""

def main():

    startX = 0;
    currentY = 0;
    
    for x in range (width):
        for y in range (height):
            pixel = i_loaded[x,y]
            r = pixel[0]; g = pixel[1]; b = pixel[2]; a = pixel[3];
            pixelKey = str(r) + " " + str(g) + " " + str(b) + " " + str(a)
            #print(pixelKey);

            if (not pixelKey in palette_x):
                sX, sY = findPixel(r, g, b, a)
                palette_x[pixelKey] = sX
                palette_y[pixelKey] = sY
                print("Color " + pixelKey + " found at " + str(sX) + ", " + str(sY))
                #currentPixelKey = pixelKey;
            tileX = palette_x.get(pixelKey)
            tileY = palette_y.get(pixelKey)

            file_out.write('this.ctx.drawImage(tileset, ' + str(tileX) + ", " + str(tileY) + ", 1, 1, " + str(x) + ", " + str(y) + ", 1, 1);\n")

            #if (currentPixelKey != pixelKey or currentY != y):
                #file_out.write("for (i = " + str(startX) + "; i < " + str(x) + "; i++){\n")
                
                #file_out.write("}\n")
                #startX = x;



    file_out.write("}}\n")
    file_out.write("spriteCanvases.push(" + canvasName + ");")

def findPixel( r, g, b, a ):

    for y in range(tHeight):
        for x in range(tWidth):

            pixel = t_loaded[x,y]
            rT = pixel[0]; gT = pixel[1]; bT = pixel[2]; aT = pixel[3];

            if (rT == r and gT == g and bT == b and aT == a):
                return x,y
            else:
                True
            
    return -1,-1

main()
