---
layout: post
title: Solving Sudoku Programmatically
date:   2014-10-09 12:00:00
categories: posts
description:
---

Creating a sudoku solver is something that's commonly heard of as a Computer Science exercise. In my third year of my Bachelor's program I finally decided make my own solution(with proven strategies) to solve sudoku puzzles effectively(not necessarily efficiently).

## Terminology

Before we begin, I'd like to standardize the words which I'll be using in this post to alleve any potential confusion.

**Sudoku Puzzle**: An 81 character long string with numbers for knowns and full stops(periods) for unknowns. Usually denoted by a `p` in code

**Cell**: Each of the 81 spaces that a number could occupy in the puzzle.

**Row**: All of the cells which share the y coordinate in the puzzle

**Column**: All of the cells which share the x coordinate in the puzzle

**Box**: All of the cells which belong to a 3x3 cell square, where the origin cell(top-left) has coordinates that are a multiple of 3.

**Candidate Puzzle**: The 81 element array which contains arrays with all the candidates that *could*
possibly occupy each cell. Usually denoted by `q` in code

**Solved**: The state when each cell in a puzzle has only one candidate and the values are unique by row, box, and column

**Valid**: Not the same as a *solved* puzzle; when each cell has no less than one candidate. An invalid puzzle(one that contains zero candidates for a cell) is unsolvable.


## Selecting a language

I decided to create this project in [Python](https://www.python.org/). Python's splicing and list comprehension make it a very suitable language. The simple syntax of Python made it easy to program in an iterative manner.

That being said, this should be easily done in most programming languages.

## Representing a sudoku puzzle in code

A common way to format the puzzles is as 81 character long strings with full-stops(periods) for the unknowns. Obviously there are many ways that these puzzles can be represented, and changing the expected format wouldn't be very difficult at all.

Let's start with a sample puzzle:
{% highlight python %}
    p = "...5....3...82...13....179.17.............3..6..712.4..4..6.....9........6..5.2.."
{% endhighlight %}

The most common way to solve sudoku puzzles in code, often used by beginners, is by keeping a list of *candidates* for each cell.

## Solving a *trivially easy* puzzle

Obviously, a cell with only one candidate means that the single candidate is the *only solution*. This makes these cases trivial, and a very simple puzzle could be solved by only looking at trivial cases where no decisions need to be made.

This is the most logical way to solve a sudoku puzzle.



## Solving a slightly more difficult puzzle

Not every puzzle is solvable by only

## Putting it all together

## Making it more efficient