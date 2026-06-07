# 🎹 Pianus Studio - Orbital 2026
*By **Nguyen Khanh Duong** & **Dao Quang Linh***

<br>
<br>

## 🚀 Proposed Level of Achievement:

**Apollo 11** 

<br>

## 🌐 Deployed Link to Our Website:

* **[Pianus Studio](https://pianus-studio-orbital26.vercel.app/)** 
* [**Demo**](https://youtu.be/OEWCI49M6Nc) by our admin

<br>

## 🔥 Motivation:

Have you ever watched a pianist glide effortlessly across the keys, and wondered what it would feel like to create that kind of magic yourself? Yet at the same time, making the choice can be a big move.

Becoming a pianist can be a difficult choice for anyone. Piano is an instrument that requires a lot of patience, time and effort to practice. The cost of buying and learning piano can be somewhat heavy. The piano can take up quite some space at your home too. <br>

But what if i tell you that you can try all that without spending a single penny?

Welcome to Pianus Studio, where your computer’s keyboard is the piano keys so you no longer need a grand instrument to begin your journey — all you need is your passion and curiosity.<br> 

Unlike guitars, pianos are not instruments we can simply carry everywhere we go. If you love the piano but cannot always be near one, Pianus Studio is here for you. Whether you want to practice, discover melodies, or simply enjoy the beauty of music, Pianus Studio brings the piano closer to you — anytime, anywhere, completely free.

<br>


## User Stories:

* As a person who cannot afford a piano (mainly due to time and space constraints), I want to have a certain familiarity with the piano keyboard using this virtual piano website.
* As a piano enthusiast, I want to learn some basic piano songs.
* As a piano player, I believe that a perfect pitch will significantly contribute to my musical ability. Hence, I want to train my ears by doing several pitch recognition exercises.
* As a user, I want to listen to my playing back and forth, so the recording feature will be useful.
* As a user, I want to save all of my progress (of learning piano songs and doing pitch recognition exercises) in my personal account.
* As a user, I want to see how good I am compared to other users.

<br>

## 🏰 Proposed Features:

>### Simulator that simulates a real-life piano

When the user holds down a particular note, the corresponding piano sound will be created, and the following visual effects will be created:
* The piano key itself changes its color
* A rectangular bar will appear from the top of the key and grow taller. However, since the bottom of that rectangular bar is fixed, only the top edge keeps climbing higher and higher the longer you hold the key. <br>

Conversely, when that note is released, the simulator stops displaying the piano sound, and the following visual effects will be created:
* The piano key changed back to its original color
* The rectangular bar stops growing and floats upward like a bubble until it disappears off the screen. <br>

For better understanding, please watch the video of an user played “Twinkle, Twinkle, Little Star” on Pianus Studio: **[Twinkle Twinkle Little Star](https://www.youtube.com/watch?v=y1AhHW2RyyM)** 
<br>

>### Piano lessons through beginner-friendly piano pieces
*We will add a collection of beginner-friendly piano pieces for users to learn (the pieces in the collection will be decided later). As part of the users’ learning process, they have to know how to play that piece correctly. That’s why displaying mode will be included. That is, Pianus Studio can automatically play a piece of our collection from start to end (take the “Twinkle, Twinkle, Little Star” video as an example).*

>### Pitch recognition exercises
*We will add a collection of pitch recognition exercises. For each exercise, Pianus Studio plays a sequence of notes or a chord without showing visually which notes are being played. To pass that exercise, the user must replay exactly every note that Pianus Studio played. Notice that the notes in exercises can be randomly generated (which may make users harder to pass).*

>### Learning mode
*For every piece of our collection, a learning mode will be added. That is, the piece will be broken down into notes or chords. Pianus Studio shows each step visually and waits for the user to replicate it correctly before advancing, starting from the first chord of the piece.*

>### Scoring mode
*For every piece in our collection, a scoring mode will be added in addition to the learning mode. That is, the user will play the piece from start to end, and Pianus Studio will grade that performance based on how close it is to the sample performance (in the displaying mode). The details on how the grading system works will be decided by our team later.*
> ### Private accounts
* Users can create private accounts that keep track of the completeness of every pitch recognition exercise, as well as their scores in every piece in our collection.
* Users will be able to create freestyle piano songs. The recordings of their playing can be saved to their personal accounts, but we will limit the time that they can record.
* Several leaderboards will be created to rank users based on several aspects: the number of pitch recognition exercises completed and the maximum score a user can achieve on a particular piece (in scoring mode).

<br>

## 🖥️ Tech Stack:
Our team will use **HTML**, **CSS**, **Vite & React** for the frontend and **Supabase**, **Fastapi**, and **PostgreSQL** for the backend.

<br>

## 📈 Current Progress:

Up to now, we have created four pages on our websites: home, piano simulator, about us and contact us. The piano-simulator page already showed a decent virtual piano with sufficient effects shown in feature 1.

<br>

## ⏱️ Development Plan:

| <div style="width:400px">Target</div>  | Deadline |
| :----   | :----  | 
|  Finish the Liftoff poster and video. | By 16th May |
|  <div style="width:400px">Pick up the necessary tech stack and implement the 1st feature - Piano Simulator</div> | By 1st June |
| <div style="width:400px">Implement a register/login page with database & Add the first piano piece to our collection with display mode available - Feature 2</div> | By 10th June |
| Add several simple pitch-recognition exercises - Feature 3 | By 17th June |
| <div style="width:400px">Add two more piano pieces to our collection & Implement the learning mode for all three pieces - Feature 4</div> | By 29th June |
| <div style="width:400px">Implement the scoring mode for all three pieces in our piece collection - Feature 5</div> | By 6th July |
| <div style="width:400px">Improve the database so that it satisfies feature 6 & Complete the collection of pitch recognition exercises (by adding some more complex exercises)</div> | By 13th July |
| <div style="width:400px">Implement feature 7 + improve the database to support saving users’ recordings</div> | By 20th July |
| <div style="width:400px">Implement the leaderboards (feature 8) & Optimize the UI/UX design of the whole page & Test, debug the whole Pianus Studio</div> | By 27th July |

