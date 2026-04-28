---
layout: post
title: Early Impressions of Chrome from a Firefox User
---

I've used Firefox for many years now, but I had to switch to Chrome recently on my work computer for corporate reasons.

It's only been about a week but I've already developed a set of opinions on features that I miss from Firefox...and a few things that I actually like better about Chrome.

## What I don't like about Chrome

### Unpredictable autocomplete behaviour

This has to be one of the biggest sources of friction for me right now because my muscle memory was so finely tuned to Firefox's autocomplete behaviour.

My company uses GitHub, and that means that our repositories have predictable URLs in the form `github.com/company/repository-name`. There's also other GitHub pages that I frequent like `github.com/issues` or `github.com/pulls`.

In Firefox, when you start typing `github.com` it autocompletes with the trailing slash, which allows you to select it and start typing the next segment, and so on.

For example, this means to get to `github.com/company/front-end` you can do:

<kbd>g</kbd><kbd>i</kbd><kbd>→</kbd><kbd>c</kbd><kbd>→</kbd><kbd>f</kbd><kbd>enter</kbd>

Or to view my pull requests at `github.com/pulls`:

<kbd>g</kbd><kbd>i</kbd><kbd>→</kbd><kbd>p</kbd><kbd>enter</kbd>

In Chrome, I have _no idea_ what the autocomplete behaviour is.

I've visited our repo URLs many times in Chrome and had Chrome to the point where typing <kbd>g</kbd><kbd>i</kbd> autofilled my most visited repo URL, which would've been fine behaviour. But today I visited `githubstatus.com` to check out the daily GitHub outage, and now every time I type <kbd>g</kbd><kbd>i</kbd> in the address bar it prefills to `githubstatus.com`, and I can't get it to stop recommending it!

I've done some initial research to see if you can enable the Firefox autocomplete behaviour in Chrome, but for some reason every article seems to be asking how to port the Chrome autocomplete to Firefox instead. Insane!

### No native picture-in-picture

I frequently have YouTube videos on in the background while I work, and sometimes it's nice to have them playing picture-in-picture.

After realizing that Chrome didn't seem to have picture-in-picture built in I looked for a solution and, luckily enough, there's an [official Chrome extension](https://chromewebstore.google.com/detail/picture-in-picture-extens/hkgfoiooedgoejojocmhlaklaeopbecg?hl=en) to enable this functionality. I have no idea why they didn't just build this into the browser.

In a way this extension is actually more pleasant than Firefox because it automatically switches to picture-in-picture when you tab away from YouTube, but a major drawback is that it doesn't render YouTube's subtitles, which is painful when you want to glance to catch a word you missed.

### No native screenshotting

Today I found myself trying to screenshot a part of a webpage, which is another quality-of-life feature from Firefox.

_I guess_ it's reasonable for Chrome not to include this because you can just take screenshots using the OS' screenshot utilities, but the screenshot feature in Firefox is perfect for web developers because it lets you choose which element to capture and that becomes the bounding box for the capture.

In Chrome, if you have an always-on-top window above the page (like the aforementioned picture-in-picture overlay) and wanted to use the OS' screenshot utilities, you'd have to move the overlay to the side or else it would wind up in the screenshot.

Plus, if you want to compare the before-and-after of a particular element it's nice to capture the exact bounding box of the div, rather than having to approximately drag a box twice in a row, just for the screenshots differently sized and hard to compare nicely.

I think there are Chrome extensions that provide some screenshotting functionality, but it seems silly not to build this feature right into the browser.

### Tabs crowd faster

You can have _way_ too many tabs open in Firefox without sacrificing readability of the tab titles, but when you have too many tabs open in Chrome the tabs decrease in width until you can't see which tab is which.

{% include image.html src="/assets/images/early-impressions-of-chrome/50-chrome-tabs.png" alt="Chrome with 50 tabs open" caption="All you get is the favicons with 50 tabs open in Chrome" %}

In Firefox you can just scroll left and right to see all the tabs, and again, you **never** lose the tab title.

{% include image.html src="/assets/images/early-impressions-of-chrome/50-firefox-tabs.png" alt="Firefox with 50 tabs open" caption="Also 50 tabs, but so much more readable" %}

As a bonus, I'd like to point out that hovering over a tab in Firefox shows you a preview of that tab. Considering that Chrome really doesn't want you to read tab titles the _least_ they could do was the hover preview, but they bungled that too.

## Where Chrome might be better

### Google Meets overlay

When you're in a Google Meet and you switch tabs, an overlay shows the meeting (complete with chat!) in a little pop up window.

I have no idea what magical API Chrome is using for this, but I'd imagine that it's similar to whatever's powering their picture-in-picture extension. It must be limited to only Google products or else everyone in the world would be using it to make annoying always-on-top popups.

### Things "feel" smoother

This isn't a particularly well researched point and is mostly vibes-based, but I find that GitHub Workflows with an enormous number of logs actually scroll more smoothly in Chrome than in Firefox. I _think_ I've noticed other sites performing more smoothly as well, but it's all anecdotal so I can't really say for sure.

### Copy styles button

Before I started to use Chrome regularly, I made an interactive replica of the GitHub merge queue page to record an educational video about how merge queues work. To mimic the page's exact style, the workflow I used was to right-click the element in Chrome Dev Tools -> Copy -> Copy styles, which was a faster workflow than any method I could find in Firefox.

Arguably this feature is probably only useful if you're copying a website, but if you have a good reason to do it (hopefully not phishing!) then I can recommend this solution.

## Who really knows

At a week in, I'm still early in my Chrome journey and maybe there are solutions to my problems that I haven't stumbled across yet.

All in all, I'm looking forward to [Ladybird](https://ladybird.org/) to add some much-needed competition to the browser landscape.
