import urllib
import re
class color:
  PURPLE = '\033[95m'
  CYAN = '\033[96m'
  DARKCYAN = '\033[36m'
  BLUE = '\033[94m'
  GREEN = '\033[92m'
  YELLOW = '\033[93m'
  RED = '\033[91m'
  BOLD = '\033[1m'
  UNDERLINE = '\033[4m'
  END = '\033[0m'


def extractLyrics(pageTxt):
  lyric = []
  songTitle = re.search(r'<h1 .*>(.*?)</h1>', pageTxt, re.DOTALL)
  songTitle = songTitle.group(1).replace('Lyrics', '')
  lyric.append(songTitle)

  lTxt = re.search(r'<div id="lyrics-body-text">(.*?)</div>', pageTxt, re.DOTALL)
  lTxt = lTxt.group(1)
  lP = re.sub(r'</?p.*?>', '\n', lTxt)
  lyric.append(re.sub(r'<.*?>', '', lP))
  return lyric



urlFile = urllib.urlopen('http://www.metrolyrics.com/highway-to-hell-lyrics-acdc.html')
lyrics = extractLyrics(urlFile.read())
print color.RED+color.UNDERLINE+lyrics[0].strip()+color.END+color.END
print color.GREEN+lyrics[1]+color.END
