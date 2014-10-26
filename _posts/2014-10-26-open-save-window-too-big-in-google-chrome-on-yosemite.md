---
layout: post
title: Open/Save Window too big in Google Chrome on Yosemite
date:   2014-10-26 12:00:00
categories: posts
description:
---

After my recent upgrade to [Mac OS X Yosemite](https://www.apple.com/ca/osx/) I've been experiencing a number of problems where seemingly everything that I used for development was broken/gone.

{% include post_ad.html %}

[Valgrind](http://valgrind.org/) broke, [Brew](http://brew.sh/) broke, and Java was removed, which luckily can always be reinstalled. Brew and Valgrind weren't so lucky, there seem to be library incompatibilities with them on Yosemite.

Another strange issue eluded me today; I discovered that when trying to open or save a file in Chrome I was greeted with a dialog window that was way too large for my 13" Macbook Air display. The Save/Open/Cancel buttons at the bottom were below the bottom edge of my display and the window looked almost comical overall, since the browser window was so small and the Finder dialog was so large.

![Chrome dialog window too big][chrome-dialog-window-too-big]

The cause is still [not exactly known](https://code.google.com/p/chromium/issues/detail?id=423635), but here's a quick and dirty fix until Chrome/Apple sorts out their problems.

    defaults delete com.google.Chrome NSNavPanelExpandedSizeForSaveMode
    defaults delete com.google.Chrome NSNavPanelExpandedSizeForOpenMode

Running the above commands in a terminal window brings the Open/Save dialog size back to its default, which makes it usable again.

After running the script, resizing the dialog to a very large size may cause it to grow and for the Open/Save/Cancel buttons to be hidden again, so you'll just have to re-run the commands everytime that issue occurs.

[chrome-dialog-window-too-big]: ../../../../images/2014-10-26/chrome-dialog-window-too-big.png "Chrome dialog window too big"