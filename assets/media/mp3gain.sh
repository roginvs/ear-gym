#!/bin/bash
find . -name '*mp3' -exec /c/Program\ Files\ \(x86\)/MP3Gain/mp3gain.exe -r -k {} \;
git checkout silenceIosWorkaround.mp3 
git status
