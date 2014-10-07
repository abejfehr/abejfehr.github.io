---
layout: post
title: Programming a Sudoku Solver
date:   2014-10-09 12:00:00
categories: posts
description:
---

Creating a sudoku solver is something that's commonly heard of as a Computer Science exercise. In my third year of my Bachelor's program I finally decided make my own solution(with proven strategies) to solve sudoku puzzles effectively.

## Selecting a programming language

A sudoku solver can be written in basically any programming language, but I decided to create this project in [Python](https://www.python.org/) since Python's splicing and list comprehension make it a very suitable language. The simple syntax made it easy to program the solver in a very iterative manner.

If you don't know anything about Python, I would recommend that you complete the [Python course on Codecademy](http://www.codecademy.com/en/tracks/python) &mdash; be warned, it's very long.

## Representing a sudoku puzzle in code

A common way to format sudoku puzzles is as 81 character long strings with full-stops(periods) for the unknowns. Obviously there are many ways that these puzzles can be represented, and changing the expected format wouldn't be very difficult at all.

Let's start with a sample puzzle:
{% highlight python %}
    p = "...5....3...82...13....179.17.............3..6..712.4..4..6.....9........6..5.2.."
{% endhighlight %}

Our program will take the puzzle this way and convert it to a format where we can keep track of other data for each cell, namely the *candidates*.

## Generating Candidate Squares

The most common way to solve sudoku puzzles in code is by keeping a list of possible candidates for each cell.

Obviously, a cell with only one candidate means that the single candidate is the *only solution*. This makes these cases trivial, and a very simple puzzle could be solved by only looking at trivial cases where no decisions need to be made.

Keeping the puzzle as a string doesn't give us the opportunity to store the candidates within the unknown locations, so we'll convert the puzzle from the **input format** to something which I'll be calling a **candidate puzzle**.

{% highlight python %}

    def generate_candidate_puzzle(p):
    	#the puzzle is already solved or isn't the correct length
    	if not "." in p or len(p) is not 81: return False

    	#go through the puzzle given and convert it to a list of candidates
    	q = [] #q for candidate puzzle

    	#generate the candidate list initially
    	for i in range(81):
    		z = get_candidates(i, p)
    		if z: q.append(get_candidates(i, p))
    		else: return False

    	return q

{% endhighlight %}

In the above code, we've defined a function named `generate_candidate_puzzle`, which takes an input puzzle `p` and puts it's contents into a list that's 81 long.

For now, we can forward all of this to another function called `get_candidates`, which will actually create the candidates for each cell

## Getting the candidates for a cell

How does a person solve a sudoku puzzle when they look at it on paper? We look at cells which are *related* to the one we're trying to fill in order to find out which numbers are valid candidates for that cell.

The neighbouring cells of course, are the other 8 members of the row, column, and the box which the target cell occupies.

It is very easy for the human eye to filter out the cells which are not neighbouring the target cell and only focus on neighbours, but instructing the computer to do the same can be quite difficult. Our spatial minds realize that the cells in a row or a column belong to something that resembles a line, or that the cell's box is a 3 by 3 square. Some sudoku puzzles are even printed with bolded lines that denote the edges of these boxes.

In order to write our `get_candidates` function, we'll have to look at all of the cells which neighbour the current one, that way we know which numbers to remove from the set of 1-9.

{% highlight python %}

def get_candidates(i, p):
	if p[i] is not ".":
		return [int(p[i])]

	#start with all of them
	c = range(1,10)

	#row candidates
	row = get_row_set(i, p)

	#column candidates
	col = get_col_set(i, p)

	#box candidates
	box = get_box_set(i, p)
	c = [x for x in list(set(c) - set(row + col + box))   if x is not "."]

  #if there are no candidates, this is invalid
	if len(c) < 1: return False

	return c

{% endhighlight %}
## Solving a trivially easy puzzle


## Solving a slightly more difficult puzzle


## Putting it all together


## Making it more efficient