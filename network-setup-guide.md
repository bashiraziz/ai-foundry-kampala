# Network Setup & Management Guide
## The AI Foundry Kampala — Physical Hub

> A practical guide for setting up and managing the internet connection at the hub. No technical background assumed.

---

## What This Guide Covers

- What internet connection to get and from whom
- How to set up the Ubiquiti UniFi access point
- How to stop students from downloading movies, music, and large files
- How to protect the backup 5G connection
- What to do when the internet is slow or broken

---

## The Two Internet Connections

The hub runs two internet connections at all times. One is the main connection. One is the backup. They are never used at the same time — the backup only activates if the main connection fails.

| Connection | Type | Cost | Provider options | Data limit |
|---|---|---|---|---|
| Primary | Business fiber — 100Mbps | ~$100/month | Roke Telkom, Liquid Telecom, MTN Business | Unlimited — flat monthly fee |
| Backup | 5G mobile data router | ~$40/month | Airtel Uganda, MTN Uganda | Capped — data bundle, use carefully |

**Important about the backup connection:** MTN and Airtel 5G data bundles in Uganda are purchased in chunks — you buy a set amount of gigabytes. If students use the backup connection to download files or stream video, the bundle runs out quickly and the hub has no fallback internet until you top it up. The backup is for emergencies only — slow browsing and API calls when fiber is down. Not for general student use.

---

## Equipment You Already Have

From the hub budget, you already have:

- **1 × Ubiquiti UniFi Access Point** (ceiling-mounted)
- **1 × Network switch**
- **Shielded Cat6 cabling**
- **1 × Backup 5G router**

The UniFi access point is the key piece. It is not just a Wi-Fi router — it has a management dashboard that lets you control exactly what students can and cannot do on the network. You access this dashboard from your laptop or phone.

---

## Part 1 — Setting Up the UniFi Access Point

### What you need before you start
- The UniFi access point (the round ceiling-mounted device)
- The network switch (the small box with multiple ethernet ports)
- Cat6 cables (already included in the budget)
- Your fiber modem/router provided by Roke/Liquid/MTN Business
- A laptop with a browser

### Step 1 — Physical connections

Connect everything in this order:

```
Fiber modem/router
       ↓  (Cat6 cable)
Network switch
       ↓  (Cat6 cable)
UniFi Access Point (ceiling)
```

The UniFi access point gets its power through the ethernet cable itself (called PoE — Power over Ethernet). You do not need a separate power cable for it. The switch must support PoE — confirm this when purchasing.

### Step 2 — Install the UniFi Network app

On your phone:
1. Go to the App Store (iPhone) or Play Store (Android)
2. Search for "UniFi Network"
3. Download and install it — it is free
4. Create a free Ubiquiti account at `account.ui.com`

### Step 3 — Adopt the access point

1. Open the UniFi Network app
2. It will automatically detect the access point on your local network
3. Tap "Adopt" next to the device
4. Wait 2–3 minutes for it to configure itself
5. The LED on the access point turns solid white when it is ready

### Step 4 — Create the student Wi-Fi network

In the UniFi app:
1. Go to Settings → WiFi → Add New WiFi Network
2. Name it: `AI Foundry Kampala`
3. Set a strong password — share this only with enrolled students
4. Save

Create a second network for facilitator use only:
1. Add New WiFi Network
2. Name it: `AF Facilitator` (do not advertise this name to students)
3. Different strong password — only you and Lubna have this
4. Save

**Why two networks?** If a student somehow bypasses the content filters, it does not affect your facilitator connection. You can always reach the UniFi dashboard and fix the problem.

---

## Part 2 — Blocking Inappropriate Content

This is the most important part of the setup. Do this before the first student connects.

### Method 1 — Block content categories (do this first)

In the UniFi app:
1. Go to Settings → Traffic Management → Content Filtering
2. Select the `AI Foundry Kampala` network
3. Enable blocking for these categories:

| Category | Why block it |
|---|---|
| Video streaming | Netflix, YouTube, TikTok — bandwidth hungry |
| File sharing | Torrents, large downloads |
| Adult content | Self-explanatory |
| Gaming | Not relevant to sessions |
| Social media | Optional — decide based on your culture |
| Music streaming | Spotify, Audiomack — bandwidth |

4. Leave these categories **unblocked**:
   - Software and technology
   - Education
   - Cloud services
   - Search engines
   - News

5. Save and apply

This takes about 10 minutes and blocks the majority of misuse automatically.

### Method 2 — Limit speed per device (do this second)

Even with category blocking, a student could find a workaround. A per-device speed limit makes abuse self-defeating — downloads become so slow they are not worth attempting.

In the UniFi app:
1. Go to Settings → WiFi → AI Foundry Kampala → Edit
2. Find "Bandwidth Limit" or "Client Rate Limiting"
3. Set: Download limit = **5 Mbps per device**
4. Set: Upload limit = **2 Mbps per device**
5. Save

**What 5 Mbps allows comfortably:**
- Running Python scripts and Claude API calls ✅
- Pushing code to GitHub ✅
- Reading documentation ✅
- Google Meet (video call) ✅
- Downloading a small Python package ✅

**What 5 Mbps makes impractical:**
- Streaming a movie (needs 10–25 Mbps) ❌
- Downloading a large file quickly ❌
- Multiple simultaneous video streams ❌

### Method 3 — Block specific domains (add as needed)

If you notice a specific site being abused that category filtering missed, block it directly:

1. Go to Settings → Traffic Management → Restrictions
2. Add the domain (e.g. `1337x.to`, `piratebay.org`)
3. Apply to the student network
4. Save

You do not need to do this upfront — add domains reactively when a problem appears.

---

## Part 3 — Protecting the Backup 5G Connection

The backup router should **never be accessible to students** under normal conditions. It is your emergency-only connection.

### Setup

1. Give the backup router a different Wi-Fi name — something generic like `Router_5G_AF` — not something students would recognize as the hub's backup
2. Do not share the password with students — ever
3. Connect the backup router to the same switch but configure it as a separate VLAN (your IT person or the UniFi setup guide can help with this — it is a 15-minute task)
4. When fiber is working: only the facilitator's devices connect to the backup router
5. When fiber is down: you temporarily connect your laptop and instructor machine to the backup router for the session

### Data management

Check your 5G data balance weekly — takes 30 seconds:
- MTN Uganda: dial `*135*8#`
- Airtel Uganda: dial `*175#`

Top up before it runs out — running out of backup data mid-session with no fiber is the worst-case scenario. Keep at least 10GB in reserve at all times.

---

## Part 4 — The Social Contract

Technical controls handle most problems. A clear rule handles the rest.

**Say this on Day 1 of every cohort — say it once, clearly:**

> "The internet here is a shared resource paid for by the club. It exists for your learning. Using it to download files, stream video, or anything unrelated to the session means losing your seat. This is not a warning system — it is a one-strike rule."

Post this on the wall near the entrance:

```
AI FOUNDRY KAMPALA — NETWORK RULES

✓  GitHub, Claude API, documentation, Google
✓  Course tools: OpenCode, OpenWork, Vercel, Neon
✗  Streaming video or music
✗  Downloading files unrelated to the session
✗  Torrents or file sharing

The network is monitored. Misuse = loss of seat.
No exceptions.
```

Most students will never test the limits once the rule is clear. The content filters exist for the few who would.

---

## Part 5 — Monitoring Usage

You do not need to watch the network constantly. Check it once per session — takes 2 minutes.

In the UniFi app, go to **Clients**. You will see every connected device with:
- Device name or MAC address
- How much data they have used this session
- Current download/upload speed

**What to look for:**
- Any device using more than 500MB in a session — investigate
- Any device with a sustained download speed above 4Mbps — they are downloading something large
- Unknown devices — someone connected who should not have

If you see something suspicious, tap the device and select "Block" — they are disconnected immediately. You can unblock them later if it was a mistake.

---

## Part 6 — When Things Go Wrong

### Fiber is down

1. Check the fiber modem — is it plugged in and showing lights?
2. Call your ISP support line — Roke Telkom: `+256 312 202 000`, Liquid Telecom: `+256 312 264 000`, MTN Business: `100`
3. While waiting: connect the instructor laptop and projector system to the backup 5G router
4. Do not connect student devices to the backup — conserve the data for instructor use only
5. Run the session with the instructor demonstrating — students observe rather than work independently

### Wi-Fi is slow for everyone

1. Open UniFi app → Clients — check if any one device is using disproportionate bandwidth
2. If yes: block that device
3. If no: restart the access point (unplug the ethernet cable from the AP for 30 seconds, plug back in)
4. If still slow: restart the fiber modem (unplug power for 60 seconds)

### A student cannot connect

1. Ask them: are they connecting to `AI Foundry Kampala` (not the facilitator network)?
2. Check the password is entered correctly — no spaces before or after
3. In UniFi app → Clients → check if their device is accidentally blocked
4. If blocked: tap the device → Unblock
5. If still failing: forget the network on their device and reconnect from scratch

### The UniFi app shows the access point as "offline"

1. Check the Cat6 cable between the switch and the AP is firmly plugged in at both ends
2. Check the switch is powered on
3. Unplug and replug the Cat6 cable at the AP end
4. Wait 2 minutes — the AP takes time to reboot
5. If the LED is flashing white: it is restarting — wait
6. If the LED is solid amber: it has a config problem — restart the UniFi app and re-adopt the device

---

## Part 7 — Before Every Session Checklist

Run through this 15 minutes before students arrive:

```
□ Fiber modem shows solid green lights
□ UniFi app shows access point as "online" (solid white LED)
□ Connect your laptop to AI Foundry Kampala and confirm internet works
□ Open a GitHub page — confirm it loads
□ Open Claude.ai — confirm it loads
□ Open one blocked site (e.g. youtube.com) — confirm it is blocked
□ Check 5G backup data balance — at least 10GB remaining
□ Check UniFi Clients — no unknown devices already connected
```

This takes 5 minutes and prevents 90% of session-day technical problems.

---

## Quick Reference

```
STUDENT NETWORK
Name:      AI Foundry Kampala
Limit:     5Mbps down / 2Mbps up per device
Filtering: Video, torrents, adult, gaming blocked

FACILITATOR NETWORK
Name:      AF Facilitator (not shared with students)
No limits, no filtering

BACKUP 5G
Use:       Facilitator only, emergencies only
Check:     MTN *135*8# / Airtel *175#
Reserve:   Keep 10GB minimum at all times

UNIFI APP
Monitor:   Clients tab — check once per session
Block:     Tap device → Block
Unblock:   Tap device → Unblock

ISP SUPPORT
Roke Telkom:     +256 312 202 000
Liquid Telecom:  +256 312 264 000
MTN Business:    100
```

---

*Network Setup & Management Guide — The AI Foundry Kampala — June 2026*
