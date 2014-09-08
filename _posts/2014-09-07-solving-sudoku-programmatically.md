---
layout: post
title: Solving Sudoku Programmatically
cover: cover.jpg
date:   2014-09-08 12:00:00
categories: posts
---

1. Sudoku becoming a hit
2. Representing a Sudoku Puzzle
3. Solving the trivial cases
4. Supposition
5. Putting the code together
6. Credit

Creating a sudoku solver is something that's commonly heard of in Computer Science but not often required. In my third year of my Bachelor's program I finally decided make my own solution(with proven strategies) to solve sudoku puzzles efficiently.

## Selecting a language

I decided to create this project in [Python](https://www.python.org/).

## Representing a sudoku puzzle in code

The way I chose to format the puzzles that entered my solver were as 81 character long strings with periods(.) for the unknowns. Obviously there are many ways that these puzzles can be represented, and changing it wouldn't be all-too difficult.

The most common way to solve sudoku puzzles in code, often used by beginners, is by keeping a list of *candidates* for each cell.

