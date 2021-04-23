# -*- coding: utf-8 -*-
"""
Created on Thu Apr 22 18:01:39 2021

@author: dyerj
"""
#==============================================================================
# Description:
"""
Python file to use Least-Significant-Bit Steganography to embed text
in an image provided in Base64 format.

Outputs the embedded image in Base64 format.
"""
#==============================================================================

#==============================================================================
# Imports
#==============================================================================

import sys
import re
import base64
from io import BytesIO

import numpy as np
from PIL import Image

#==============================================================================
# Functions
#==============================================================================

'''
Convert the provided string to a string of binary digits.
'''
def stringToBinary(string):
    return "".join(bin(ord(x))[2:].zfill(8) for x in string)

'''
Encodes a provided UTF-8 string into the provided cover image on every
channel.

If the message is too big, it returns the provided cover image as-is.
'''
def encodeLSB(image, message):
    messagebinary = stringToBinary(message)
    channels = len(image.getbands())
    # Case: Encoding can't work if the message exceeds the cover.
    if image.width * image.height * channels < len(messagebinary):
        return image
    # Case: Encoding is possible.
    imagedata = np.array(image)
    for pixel in range(len(messagebinary) + 8):
        # Get coordinates.
        row = (pixel // channels) % image.width
        col = (pixel // channels) // image.width
        chn = pixel % channels
        
        # Special condition: Apply END OF MESSAGE.
        if pixel >= len(messagebinary):
            imagedata[col, row, chn] &= ~(1)
            continue
        
        # Set the least significant bit accordingly.
        digit = int(messagebinary[pixel])
        if digit == 0:
            imagedata[col, row, chn] &= ~(1)
        elif digit == 1:
            imagedata[col, row, chn] |= digit
    return Image.fromarray(imagedata)

'''
Converts valid Base64 into a Pillow Image.
'''
def B64toImage(b64):
    # Create the Image object.
    b64_in = re.sub('^data:image/.+;base64,', '', b64)
    byt_in = BytesIO(base64.b64decode(b64_in))
    
    return Image.open(byt_in)

'''
Converts a Pillow Image into Base64.
'''
def ImageToB64(image):
    # Convert the Image object to Base64.
    file = BytesIO()
    image.save(file, format="PNG") # Done to avoid compression.
    byte = file.getvalue()
    
    return str(base64.b64encode(byte))[2:-1] # Remove byte indication.

#==============================================================================
# Main Body
#==============================================================================
if __name__ == "__main__":
    # Get inputs.
    b64_carrier = sys.stdin.readline()
    message = sys.stdin.readline()
    
    # Convert the b64 into an image.
    initimage = B64toImage(b64_carrier)
    
    # Embed the message in the image.
    encodedimage = encodeLSB(initimage, message)
    
    # Convert the image back to b64.
    b64_encoded = 'data:image/png;base64,' + ImageToB64(encodedimage)
    
    # Output the resulting b64 modified image.
    print(b64_encoded)