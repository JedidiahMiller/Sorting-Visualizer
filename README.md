# Sorting-Visualizer

Thing that allows you to see sorting algorithms in action

## Abstract

The goal of this project is to have a simple way of viewing what happens within an array when a sorting algorithm is running.

## Running the code

index.html acts as the launching point for running everything. Due to cross-origin CORS stuff making directly opening the file in a browser difficult, the easiest way to run the code is by navigating to the projects directory in a terminal and then running 'python3 -m http.server'. The terminal should prompt you to open a link in a browser, which will by default be localhost:8000 

## Current problem

The algorithm animations are finally working, but when the animator runs the swapElements function it triggers the orderChanged event, which resets the algorithm steps, which means the code trys to reach a thing out of index.