# Week 1: Course Preflight

Let's begin by reviewing some key concepts and techniques that we've previously encountered in ARTG5330 and similar introductory courses. These constitute the foundational knowledge that we'll be building on in this course. The expectation is that you already possess this knowledge (even if it's a little rusty), and the following exercises are meant to help you self-assess and reveal areas of weakness.

Please allocate about 3 hours to go through the following exercises. If you can breeze through them, great; if not, please go through the supplementary reading in greater detail. If you are stuck, don't panic--please schedule office hour time with me.

## Part 1: installing software
Please make sure you have all the following software installed on your computer:
- [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
- [Node](https://nodejs.org/en/download/)
- [NPM](https://www.npmjs.com/get-npm)
- Python (Mac users already have this installed by default)
- A code editor of your choice (Sublime Text, for example)

## Part 2: downloading course repo, and spinning up a simple http server
With your computer's terminal, issue the following commands (the following are Mac-specific; for PC, swap `dir` for `cd`). This will clone the course "repo" (folder) onto your desktop:

```
cd $home
cd Desktop
git clone git@github.com:Siqister/artg-2019-s.git
```

Once done, navigate into the course folder...
```
cd artg-2019-s
```

...and spin up a simple http server (pick one of the following commands)
```
python -m SimpleHTTPServer
python -m http.server #or try this
py -m http.server #or try this
```

Now, open Chrome web browser and navigate to localhost://8000. You should see the internal file directory of "week-1", indicating that the files from this folder are being successfully served.

## Part 3: data structures (arrays and objects)

In the following parts (3 through 5), you are expected to edit the JavaScript program contained in `script.js`, following the prompts. You can see the result of your edits in the browser console (in Chrome, press CMD + Option + I).

Being able to manipulate data (as arrays and objects) is a key skill that the rest of the course bulids on. As you go through the exercise in part-3, please ensure that you understand the following concepts and JavaScript methods:
- array.forEach
- array.map (how is it different from array.forEach?)
- array.sort
- array.filter
- accessing, modifying, and deleting object properties


### Supplementary material
Refer to [this link](http://learnjsdata.com/) for additional information on how to manipulate data in JavaScript.

## Part 4: functions

We will rely on functions to provide organization and reusability for the larger, more complex projects that we'll build in this course. As you attempt the exercise in part-4, make sure you understand the following concepts and methods:
- how to write a function
- how to invoke or "call" a function
- what is an argument?
- what is the return value of the function?

### Supplementary material
Refer to [this link](https://codeburst.io/all-about-javascript-functions-in-1-article-49bfd94b31ab) for additional information on JavaScript functions.