---
layout: post
title: Programming a Sudoku Solver
date:   2014-10-14 12:00:00
categories: posts
description:
---

Creating a sudoku solver is something that's not uncommon as a Computer Science exercise. After putting off the project for much to long, I finally decided to make my own solution to solve sudoku puzzles in [Python](https://www.python.org/).

I chose Python since its [list slicing](https://docs.python.org/3.0/library/functions.html#slice) and [list comprehension](https://docs.python.org/2/tutorial/datastructures.html#list-comprehensions) made it a very suitable language for grabbing certain elements from the sudoku puzzle array. Python's simple syntax made it even easier to program the solver in an iterative manner.

## The strategy

The most common way to solve sudoku puzzles in code is by keeping a list of possible candidates for each cell. A very simple puzzle could be solved by only recursively looking at trivial cases where there is only one candidate per cell. Once we find a singleton cell, we can clear that value from it's neighbours and check if any of the neighbours are now singletons as well.

![An example of a Sudoku Candidate Puzzle][sudoku-candidate-puzzle]

How does a person solve a sudoku puzzle when they look at it on paper? We look at neighbouring cells &mdash; cells which share a row, column or box with the one we're trying to fill in order to find out which numbers are valid candidates for that cell.

{% include post_ad.html %}

It is very easy for the human eye to filter out the cells which are not neighbouring the target cell and only focus on neighbours, but instructing the computer to do the same can be quite difficult. Our spatial minds realize that the cells in a row or a column belong to something that resembles a line, or that the cell's box is a 3 by 3 square. Some sudoku puzzles, like the one above, are even printed with bolded lines that denote the edges of these boxes.

In addition to the candidate elimination, my solution also uses recursion to try multiple possible solutions when faced with a decision. This is a scenario where no cells in the candidate puzzle have only one candidate. In the real world, the ideal solution is to photocopy the sudoku puzzle once for each candidate in the cell, and on each individual photocopy carry on as if only having chosen one of the candidates until that copy of the puzzle is solved or proven to be unsolvable.

## Organizing the puzzle

It's not uncommon to represent a sudoku puzzle as a string of 81 characters where the unknown values are shown as full-stops(periods). My solution takes a string as an input value for the solve and converts it to an array of lists which each contain candidates for that cell.

Each of the squares would be indexed as they are in the array, with the numbers 0 to 80, as can be seen in the image below.

![Sudoku Cell Coordinates][sudoku-cell-coordinates]

From these coordinates, we can get the row/column coordinates by doing the following:

{% highlight python %}

    row = i / 9
    col = i % 9

{% endhighlight %}

## Selecting the neighbours

Selecting the neighbouring cells for a target is considerably easier in Python than in most other programming languages because of its list manipulation syntax.

![Box, colum, and row neighbours of a cell in a Sudoku Puzzle][sudoku-puzzle-neighbour-cells]

As you can see by the image above, the target cell in this example is cell number 52, and all of it's neighbour groups are highlighted in yellow.

The goal behind selecting the neighbours of the target is so we can end up with a  [set](https://en.wikipedia.org/wiki/Set_(mathematics)) of already known values and subtract that from an array of 1-9. Anything which would remain in that array is a *potential candidate*.

### Row neighbours

Getting the row neighbours is the easiest, since all their indices are consecutive numbers. We can accomplish this with the following code:

{% highlight python %}

    return map(int, [x for x in p[i/9*9:i/9*9+9] if x is not "."])

{% endhighlight %}

It might look confusing, but remember that the code `i/9*9`, where `i` is the target index, is just a quick and dirty way to find the starting index for the row we're currently on by taking advantage of Python 2.x's [integer division](http://mathworld.wolfram.com/IntegerDivision.html).

### Column neighbours

The code for columnal neighbours is slightly more interesting and complicated, but still fairly simple if you take a minute to really think about it.

All of the candidates in a particular column have indices that are 9 apart. That means that we can take advantage of the step value in Python's slice notation to count by 9's.

{% highlight python %}

    return map(int, [x for x in p[i%9::9] if x is not "."])

{% endhighlight %}

### Box neighbours

Getting the set of known values that are inside the box of the target is the hardest calculation we'll need to do.

Basically, it involves getting the starting index of the first cell in the box. From there we can get the rest of the cells easily by combining 3 smaller groups.

{% highlight python %}

    m = 9 * (i / 9 / 3 * 3) + (i % 9 / 3 * 3)
    return map(int, [x for x in p[m:m+3] + p[m+9:m+12] + p[m+18:m+21] if x is not "."])

{% endhighlight %}

Lastly, since each cell containing exactly one candidate is a *trivial solution*, we can use these methods of traversing the neighbouring cells of a target to clear out all the cells where the singleton candidate is present. In my solution, I've created a function that does this called `clear_candidates(i, q)`. The code for that function isn't posted, but rather left as an exercise to the reader.

## Photocopying puzzles

When faced with a decision(no cells have fewer than 2 candidates), photocopying the puzzle to try all the potential solutions is a reasonable option.

Copying an array in Python by default doesn't perform a [deep copy](http://stackoverflow.com/questions/184710/what-is-the-difference-between-a-deep-copy-and-a-shallow-copy), but this functionality can be found in the [copy module](https://docs.python.org/2/library/copy.html), and is easily incorportated in our solution. While photocopying, we also need to select the index of which candidate, `n`, to be used in the copy.

{% highlight python %}

    import copy

    def photocopy_puzzle_with(n, i, q):
      x = copy.deepcopy(q)
      x[i] = [x[i][n]]
      clear_candidates(i, x)
      return x

{% endhighlight %}

So in the above code, I can pass list `q` and receive a new list where the `i`th cell uses index `n`.

Of course, photocopying the puzzle doesn't accomplish anything, I need to decide if the photocopied puzzle returns a valid solution or not, so we'll have to incorporate that in our main `solve()` code.

## The main `solve()`

Now we just need to do exactly what we've been talking about and solve our sudoku puzzle! Though I haven't provided the code for all of the auxilliary functions necessary, I've described the general idea behind the process, and that should be enough to guide you in the right direction.

{% highlight python %}

    def solve(q):
      #if invalid, don't even bother
      if not valid(q):
        return False

      #if complete, return the result
      if solved(q): return q

      #solve the trivial cases
      for i in range(81):
        if len(q[i]) is 1:
          clear_candidates(i, q)

      #the minimum number of decisions to make
      h = 2

      #do until the puzzle is solved
      while(not solved(q) and h < 8):
        for i in range(81):
          #check for h number of candidates(decisions)
          if len(q[i]) is h:
            #for every decision...
            for j in range(h):
              #...make a copy and try solving
              nq = photocopy_puzzle_with(j, i, q)
              result = solve(nq)
              if result:
                return result

            #none of the decisions were successful at this point, stop here
            return False

        #if there are no squares with h decisions, we need to make h+1 decisions
        h += 1

      if solved(q): return q
      return False

{% endhighlight %}

The above code may seem confusing, but after reading the detailed comments for each important action you'll begin to understand the process that's happening.

At the very beginning of the function are checks to see if the puzzle is *valid* or already *solved*. The key difference between a puzzle that's valid and a puzzle that's solved is that a solved puzzle contains no cells that don't have only one candidate. A valid puzzle means that it's potentially solvable, each cell has *at least* one candidate and no numbers exist more than once in a neighbourhood.

Next we go through all of the cells from 0 to 80, clearing the neighbourhood candidates for all of the singleton cells, recursively. Any puzzle with a chain reaction of trivial solutions can be solved in this step alone.

Finally, when there are no more trivial cases, we go through the puzzle's cells that have 2 or more candidates and make "photocopies" of the puzzle with each candidate as a test, returning the solution of that recursive call if it wasn't a failure.

Cells that have 2 decisions are tried first, then the decision counter(`h`) is incremented until 8 is reached. At this point it's not even a reasonable sudoku puzzle since it's fairly unlikely that it could be solvable without the aid of a computer program.

![Completed Sudoku Puzzle][completed-sudoku-puzzle]

The resulting completed sudoku puzzle is a very satisfying thing to see after all the small errors that cropped up in development. We can finally rest...for now.

## Becoming more efficient

The above techniques used in my solver should be capable of solving *most* sudoku puzzles, even ones that are really difficult.

Really challenging puzzles, however, do take some time to complete, so there's room for improvement in the efficiency of this solution.

One of the things which I noticed while I was writing the code was that the lists that contained the neighbours were getting created each time a new target was chosen to check against. This could be potentially avoided by storing the rows, columns, and boxes in separate candidate arrays that are created only once at the beginning of the solve.

Even storing the coordinates of all of the cells instead of calculating them on-the-fly might shave off some time.

At some point in the future I might separate implement some of these behaviours into my program.

## `is` and `is not`

As a side note, I've used `is` and `is not` operators for all of the equality checking in my code for efficiency purposes.

This only works because all of the values which I'm checking fall in the range of `-5` and `256`, which are stored as references so they're comparable.

## Conclusion

Creating a sudoku solver is a challenging project that can exercise your ability to think, and hopefully, allow you to become more intimate with your programming language of choice. My choice to use Python was strategic because of the list manipulation features included, and combined with following proven methods of solving sudoku puzzles resulted in a reasonably effective, although not necessarily efficient, solution.

[sudoku-candidate-puzzle]: ../../../../images/2014-10-14/sudoku-candidate-puzzle.png "Sudoku Candidate Puzzle"
[sudoku-puzzle-neighbour-cells]: ../../../../images/2014-10-14/sudoku-puzzle-neighbour-cells.png "Box, colum, and row neighbours of a cell in a Sudoku Puzzle"
[sudoku-cell-coordinates]: ../../../../images/2014-10-14/sudoku-cell-coordinates.png "Sudoku Cell Coordinates"
[completed-sudoku-puzzle]: ../../../../images/2014-10-14/completed-sudoku-puzzle.png "Completed Sudoku Puzzle"