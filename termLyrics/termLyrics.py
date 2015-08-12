import urllib
import re

def extractLyrics(pageTxt):
  lTxt = re.search(r'<div id="lyrics-body-text">(.*?)</div>', pageTxt, re.DOTALL)
  lTxt = lTxt.group(1)
  lP = re.sub(r'</?p.*?>', '\n', lTxt)
  lyric = re.sub(r'<.*?>', '', lP)
  return lyric



urlFile = urllib.urlopen('http://www.metrolyrics.com/bad-blood-lyrics-taylor-swift.html')
lyrics = extractLyrics(urlFile.read())
print lyrics
