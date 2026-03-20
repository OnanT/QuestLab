# QuestLab Game Guide: Map Challenge

## 🎮 Game Overview
The **Map Challenge** is an interactive geography game where students locate specific places or landmarks on a map. It supports two distinct modes: **Image Mode** (using a static image) and **Leaflet Mode** (using a real-world interactive map).

### How it Works
1.  **Objective**: Find a series of locations on the map.
2.  **Gameplay**:
    *   The game displays a target location name (e.g., "Cuba").
    *   The student clicks/taps on the map where they think that location is.
    *   **Hint**: If they struggle, a hint is provided (e.g., "The largest island in the Caribbean").
    *   **Feedback**: A green pin appears for correct guesses; an error message appears for incorrect ones.
    *   **Scoring**: Points are awarded for each correct location found within the time limit.

---

## 🛠 Content Creation Guide

### Step 1: Choose Your Map Type

| Feature | **Image Mode** | **Leaflet Mode** |
| :--- | :--- | :--- |
| **Best For** | Custom maps, diagrams, fantasy worlds, or specific regions. | Real-world geography (islands, cities, landmarks). |
| **Coordinate System** | Percentage (0-100) for X and Y. | Latitude and Longitude. |
| **Setup** | Requires an image file in `frontend/public/maps/`. | Requires center coordinates and zoom level. |

### Step 2: Prepare Your Assets (Image Mode Only)
1.  Place your image (PNG or JPG) in `frontend/public/maps/`.
2.  Note the file name (e.g., `caribbean.png`).
3.  The `image_url` in the config will be `/maps/your-file.png`.

### Step 3: Define the Game Configuration (JSON)

#### Example: Image Mode (Caribbean)
```json
{
  "title": "Caribbean Island Explorer",
  "map_type": "image",
  "image_url": "/maps/caribbean.png",
  "tolerance": 8,
  "locations": [
    { "name": "Cuba", "x": 30, "y": 30, "hint": "Largest island" },
    { "name": "Jamaica", "x": 42, "y": 55, "hint": "Home of Reggae" }
  ]
}
```
*   **x/y**: 0 is top-left, 100 is bottom-right.
*   **tolerance**: How close (in percentage) the click must be to the center.

#### Example: Leaflet Mode (Jamaica)
```json
{
  "title": "Jamaica Landmark Quest",
  "map_type": "leaflet",
  "center_lat": 18.15,
  "center_lng": -77.3,
  "zoom": 9,
  "tolerance": 5,
  "locations": [
    { "name": "Blue Mountain Peak", "lat": 18.0465, "lng": -76.5872, "hint": "Highest point" }
  ]
}
```
*   **tolerance**: Maximum distance in kilometers from the target.

### Step 4: Add Content to Database
You can use a Python script to seed your game. Here is a boilerplate:

```python
import json, psycopg2
from datetime import datetime

# ... (db connection setup) ...

config = {
    "title": "My Map Game",
    "map_type": "image",
    "image_url": "/maps/my-map.png",
    "locations": [{"name": "Start", "x": 50, "y": 50, "hint": "Middle!"}]
}

# 4 is the ID for MapChallenge
cur.execute(
    "INSERT INTO games (lesson_id, game_engine_id, config_json) VALUES (%s, %s, %s)",
    (lesson_id, 4, json.dumps(config))
)
```

---

## 🔍 Troubleshooting
*   **Image not showing**: Ensure the file path starts with `/maps/` and the file exists in `frontend/public/maps/`.
*   **Leaflet Map blank**: Ensure you have an internet connection to load OpenStreetMap tiles.
*   **Clicks not registering**: Adjust the `tolerance` value (increase it to make the game easier).
