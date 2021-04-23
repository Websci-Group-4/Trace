# -*- coding: utf-8 -*-
"""
Created on Thu Apr 22 18:01:49 2021

@author: dyerj
"""
#==============================================================================
# Description:
"""
Python file to use Least-Significant-Bit Steganography to recover text
from an image provided in Base64 format.

Outputs the embedded text.
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
Convert the provided string of binary digits into a UTF-8 string.
'''
def binaryToString(binary):
    result = ""
    for index in range(0, len(binary), 8):
        char = chr(int(binary[index:index+8], 2))
        if char == chr(0):
            break
        result += char
    return result

'''
Assuming a provided image is LSB-encoded, this function will read
through every pixel and every channel to assemble the message one
character at a time.  It stops when it reads 8 consecitive 0 bits
and returns the decoded string.
'''
def decodeLSB(image):
    imagedata = np.array(image)
    channels = len(image.getbands())
    # Get LSB data from every channel of the encoded image.
    result = ""
    binstring = ""
    for pixel in range(image.width * image.height * channels):
        # Get coordinates.
        row = (pixel // channels) % image.width
        col = (pixel // channels) // image.width
        chn = pixel % channels
        
        # Get the least significant bit.
        binstring += bin(imagedata[col, row, chn])[-1]
        
        # Limited to 1-byte UTF-8, so determine what to do after 8 bits.
        if len(binstring) == 8:
            if binstring == "00000000":
                return result
            result += binaryToString(binstring)
            binstring = ""
    return result

'''
Converts valid Base64 into a Pillow Image.
'''
def B64toImage(b64):
    # Create the Image object.
    b64_in = re.sub('^data:image/.+;base64,', '', b64)
    byt_in = BytesIO(base64.b64decode(b64_in))
    
    return Image.open(byt_in)

#==============================================================================
# Main Body
#==============================================================================
if __name__ == "__main__":
    # Get inputs.
    b64_embedded = sys.stdin.readline()
    
    # Convert the b64 into an image.
    initimage = B64toImage(b64_embedded)
    
    # Return the message embedded in the image -- whatever it may be.
    decodedMessage = decodeLSB(initimage)
    
    # Output the resulting message.
    print(decodedMessage)