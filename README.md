# Hidden Hanover

## Overview

**Hidden Hanover** is an interactive web app that turns Dartmouth and Hanover into a **digital 3D journal**. It’s a place to discover hidden corners, read and write memories, add music, and see the map respond to weather and time of day.

This project began with a simple love: maps. I’ve always loved wandering, finding hidden places, and just being in nature when I need to “touch some grass.” The real spark came when I visited **Nathan’s Garden** for the first time. I was stunned that so many people didn’t even know it existed — and even more stunned to find a notebook there, filled with handwritten entries from visitors. It felt special, intimate, and I thought:

> *“What if every secret spot had a place for stories like this? What if that journal was digital, and the whole map became alive with these moments?”*

Hidden Hanover is my answer to that question.

---

## Features

* **Interactive Map** – Built with Mapbox GL JS, the map isn’t just a static view: it’s a canvas for discovery.
* **Dynamic Weather & Time** – The map visually responds to rain, snow, and daylight changes. For demo purposes, there’s even a toggle to simulate conditions.
* **Add Your Own Spots** – Users can mark places, name them, and decide if they stay private or go public for others to see.
* **Community Journal** – Each spot has a page where anyone can add journal entries, share photos, and leave their own memories.
* **Spotify Integration** – Each location can have an associated playlist to set the mood.
* **Live Weather Forecast** – Displays current conditions and upcoming weather for Hanover so explorers know what to expect.

---

## Why I Built This

I’ve been meaning to build this app for a long time. Every time I found a tucked-away garden or quiet corner on campus, I’d think:

* *“Why doesn’t everyone know about this?”*
* *“Why can’t there be one place where these spots — and the stories behind them — live?”*

This project is personal. It’s not just a technical exercise; it’s about making a **map that feels alive** and **building something I wish existed** when I first came here.

---

## Tech Stack

* **Frontend:** React (with Vite)
* **Mapping:** Mapbox GL JS (switched from Google Maps for more flexibility and better design)
* **Backend:** Firebase Firestore (spot data, journal entries), Firebase Storage (images)
* **Auth:** Firebase Authentication (Google Sign-In)
* **APIs:**

  * Mapbox API (interactive map and styling)
  * Weather API (current conditions + forecast)
  * Spotify API (playlist integration for each spot)
* **Hosting:** Firebase Hosting

---

## Learning Journey & Challenges

This was my **first time building an app solo** from scratch. That made it both overwhelming and deeply rewarding.

**What I learned:**

* How to stitch together **multiple APIs** and have them talk to each other.
* How to take a rough idea (“a digital journal of hidden places”) and actually turn it into a working product.
* How to structure and deploy a full app, from front-end React components to Firebase hosting.

**What challenged me most:**

* **Google Maps vs. Mapbox:** I started with Google Maps, but it didn’t give me enough flexibility — and it didn’t look great. Discovering Mapbox was like opening a door. Suddenly, I could design the map to feel like I wanted.
* **CORS errors & authentication headaches:** Some APIs didn’t play nice at first. I spent a lot of time troubleshooting tokens, headers, and browser complaints.
* **Building alone:** Every bug, every broken feature was mine to untangle. But every fix — every moment it finally worked — felt incredible.

---

## How It Works

1. **Explore the Map** – Start on the Mapbox-powered map and see Hanover laid out in 3D.
2. **Add a Spot** – Click to mark your own hidden place, write a description, upload photos, and even link a playlist.
3. **Share or Keep Private** – You can make a spot public for the world or keep it to yourself.
4. **Leave a Journal Entry** – Spots act like digital notebooks; anyone can add a note, reflection, or memory.
5. **Watch the Weather Shape the Map** – Rain or snow? The map shows it, and the vibe changes instantly.

---

## The Bigger Picture

This started as a personal project, but it could easily grow. Imagine:

* Dartmouth students using it to **share their favorite corners of campus.**
* Visitors discovering places they’d never find on their own.
* A living, ever-growing **map of memories** for Hanover.

---

## Deployment

The app is hosted on **Firebase Hosting** and connected to Firebase Firestore for storage. *https://hidden-hanover-dali-app.web.app*

---

## Next Steps

* Add **directions and navigation** to help users find each spot.
* Expand **weather triggers** for more natural responses (fog, sunset lighting).
* Build a **mobile app version** for quick, on-the-go exploring.

---

## Closing Thoughts and A Few Picture of the Journey

Building Hidden Hanover taught me more than just code. It taught me how much I love projects that **mean something to me** — projects that mix technology with a personal spark.

## Screenshots

can be found in images folder

![initial-sketch-1](/images/Image.jpeg)
![initial-sketch-2](/images/Image 2.jpeg)
![initial-sketch-3](/images/Image 3.jpeg)
![initial-sketch-4](/images/Image 4.jpeg)
![initial-sketch-5](/images/Image 5.jpeg)
![initial-sketch-6](/images/Image 6.jpeg)

![early-looks-1](/images/Screenshot 2025-07-28 at 2.29.52 AM.png)
![early-looks-2](/images/Screenshot 2025-07-24 at 7.01.41 PM (2).png)
![early-looks-3](/images/Screenshot 2025-07-27 at 11.22.23 PM (3).png)


MADE BY ALISHA QURESHI | DARTMOUTH '28

