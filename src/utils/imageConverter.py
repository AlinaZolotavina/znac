from PIL import Image
import pillow_avif
import re
from os import listdir
from os.path import isfile, join

#dirPath is the path to directory with files that shpul be converted
dirPath = r"C:\Users\Алина\Downloads\photos"
#avofDirPath is the path to directory where converted files will be saved
avifDirPath = r"C:\Users\Алина\Downloads\avif"
onlyfiles = [f for f in listdir(dirPath) if isfile(join(dirPath, f))]

for i in range(0, len(onlyfiles)):
    head, sep, tail = onlyfiles[i].partition('.')
    JPGimg = Image.open(dirPath + "\\" + onlyfiles[i])
    JPGimg.save(avifDirPath + "\\" + head + '.AVIF','AVIF', quality=50)

