# BCIT Clash Royale Tournament

BCIT Clash Royale Tournament is a small web application designed to organize and manage a Clash Royale tournament for BCIT students. The platform allows players to register their information, join the tournament Discord server, and be placed into tournaments based on their trophy range.

---

# Overview

The goal of this project is to make organizing a Clash Royale tournament simple by:

- Allowing players to register quickly  
- Automatically storing player information in a database  
- Categorizing players based on trophy count  
- Coordinating tournaments through a Discord server  

Players register once on the website and are then directed to the tournament Discord server where matches and communication take place.

---

# Website Features

## User Side

Users can register for the tournament through a simple form.

Process:

1. User enters a **username** (no password required since registration only needs to happen once).  
2. User provides:
   - Supercell ID  
   - Trophy count and/or rank  
3. The system stores the information in the database.  
4. A **Discord invite link** is shown so the user can join the tournament server.

---

## Admin Side

Admins can view all registered players and manage tournament placement.

Features:

- Table of registered players  
- Display of:
  - Username  
  - Supercell ID  
  - Trophy count  

Players are grouped into tournament brackets based on trophies:

| Trophy Range | Tournament |
|---------------|------------|
| < 7000 | Low Trophy Tournament |
| 7000 – 10000 | Mid Trophy Tournament |
| 10000+ | High Trophy Tournament |

(The number of brackets may change depending on player count.)

---

# Server Side

The server stores player data in a database.

Each registered user includes:

- User ID  
- Username  
- Supercell ID  
- Trophy count  
- Discord name  

---

# Discord Server Structure

The Discord server is used to coordinate tournaments and communication.

### Channels

- Announcements  
- General  
- Questions  
- Schedule  
- Tournaments (private category)

### Tournament Channels

- Tournament 1  
- Tournament 2  
- Tournament 3  

Moderators will place players into the appropriate tournament channels.

---

# Moderators

- offmitch  
- gdaula  

---

# Tournament Structure

Players register for a **time slot** and are matched against others in the same slot.

Games are scheduled **after school hours** so they do not conflict with class times.

---

# Incentives

Possible incentives for participation include:

- Prize for the winner (potentially provided by BCIT)  
- Title of **Best Clash Royale Player at BCIT**

Possible tournament divisions:

- Low Trophy Tournament  
- High Trophy Tournament  
```
