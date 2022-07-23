# gen.algo
This is an exercise in genetic programming first described (much of the code is from his article) by Baruk Anbar. (I hope I spelled that right). 

The two data structures used here are the Gene and the Population, a convenience function named evolve grows a string on the console. This function relies on pulling the carrage return upon printing the current front runner in this genetic race to match the supplied target string. 

This is nothing fancy. It's probably incredibly ineficcient, and like not even "correct". But it produces a nice visual effect when you run it. 

To run this node.js program, make sure NodeJS is installed, then call node genetic.algo.js with text files containining short lines of text. Logn lines of text will bust this program, it is not very efficicent.
