---
layout: post
title: Markdown Preview with Math in Atom
date:   2015-02-27 12:00:00
categories: posts
description:
---

For those of you that don't know, [Github](https://github.com/)'s [Atom]() is the greatest text editor in the world. I've been using it since the alpha, and to be honest I don't miss using [Kod](http://kod.en.softonic.com/mac) at all. Every aspect of the editor is customizable and that it's open source. I can work with platforms I already know(NodeJS and JavaScript) to extend the editor. What's better than that?

Until last week I was never writing any math to go with my markdown, and if it was it would just go in `code blocks`. But now I needed a solution to write out Relational Algebra for a database assignment.

# Markdown Preview Plus

[Markdown Preview Plus](https://github.com/Galadirith/markdown-preview-plus) is a beautiful markdown previewing tool that displays math inside markdown documents. I wasn't able to find any other Atom packages with that functionality.

## What I don't like about it

The library used to render the math on the page is MathJax, which is *slow* and *big*. I remember working on a small side-project with a friend years ago which involved rendering math, and uploading ~30mb of files to our web server over an [MTS](http://www.mts.ca/mts/personal/internet) "high speed" internet connection took us almost half an hour.

To use Markdown Preview Plus, a separate Atom package called "[MathJax Wrapper](https://github.com/Galadirith/mathjax-wrapper)" must be installed to be able to use it. The README file has troubleshooting instructions and the issues page for the project contain complaints from people who can't get it installed properly. It took me almost 45 minutes to install and configure it, and then math previewing wasn't even enabled by default.

# Previewing math in markdown with KaTeX

![Markdown Preview with Math](https://raw.githubusercontent.com/abejfehr/markdown-preview-katex/master/imgs/preview.png)

Khan Academy has a beautiful library for typesetting math called [KaTeX](http://khan.github.io/KaTeX/). The library is small and could be included easily with the atom package, it's possible to generate the markup for the math on the "server side" and send it back, and it's lightning quick to render things.

I set out to create my own fork of Markdown Preview Plus, which is just called [Markdown Preview with Math](https://atom.io/packages/markdown-preview-katex). It accomplishes nearly all the same things as Markdown Preview Plus, except using KaTeX instead.