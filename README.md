# Sorting-Visualizer

Thing that allows you to see sorting algorithms in action

## Abstract

The goal of this project is to have a simple way of viewing what happens within an array when a sorting algorithm is running.

## Running the code

index.html acts as the launching point for running everything. Due to cross-origin CORS stuff making directly opening the file in a browser difficult, the easiest way to run the code is by navigating to the projects directory in a terminal and then running 'python3 -m http.server'. The terminal should prompt you to open a link in a browser, which will by default be localhost:8000 

## Current problems

Once the animation has run, it needs to be reset if the user tries to play it again. Otherwise the same steps are run on a different array which creates a mess.
There is now a problem when the array swaps are happening where the left item snaps to the spot it was just in for a split second as the animation runs. Ie, suppose there is a an array 3 0 1. When 3 and 0 are swapped, everything is normal. However, if you were to then swap 3 and 1, 3 would snap back to the position of 0 before animating a slide over to where 1 is. This problem can be easily replicated running bubble some on something like 5 0 1 2 3 4 and setting the animation time to something large.
Swap items is being called when items are being dragged around. This causes the item being dragged to annoyingly snap to positions before the user is done dragging it.

## Other
Uses ES6 modules. This will have to be indicated when setting up the tsconfig file