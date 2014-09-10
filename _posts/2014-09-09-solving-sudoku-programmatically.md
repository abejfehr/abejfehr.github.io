---
layout: post
title: Solving Sudoku Programmatically
date:   2014-09-09 12:00:00
categories: posts
---

Creating a sudoku solver is something that's commonly heard of as a Computer Science exercise. In my third year of my Bachelor's program I finally decided make my own solution(with proven strategies) to solve sudoku puzzles effectively(not necessarily efficiently).

## Selecting a language

I decided to create this project in [Python](https://www.python.org/). The original code wasn't well planned, so the simple syntax of Python made it easy to program in an iterative manner.

That being said, this should be easily done in most programming languages.

## Representing a sudoku puzzle in code

The way I chose to format the puzzles that entered my solver were as 81 character long strings with periods(.) for the unknowns. Obviously there are many ways that these puzzles can be represented, and changing it wouldn't be all-too difficult.

Let's start with a sample puzzle:
{% highlight python %}
    p1 = "...5....3...82...13....179.17.............3..6..712.4..4..6.....9........6..5.2.."
{% endhighlight %}
<br />
The most common way to solve sudoku puzzles in code, often used by beginners, is by keeping a list of *candidates* for each cell.

## Trivial Cases

Obviously, a cell with only one candidate means that the single candidate is the *only solution*. This makes these cases *trivial*.

## Supposition

Not every puzzle is solvable by only

## Putting it all together