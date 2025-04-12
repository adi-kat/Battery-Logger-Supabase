# Battery-Logger-Supabase
Logs your device’s battery percentage to Supabase and displays the latest status using an iOS widget via Scriptable.

![IMG_2081](https://github.com/user-attachments/assets/57a12ac4-a203-45e8-abe9-043c08873640)
![IMG_2086](https://github.com/user-attachments/assets/baf74265-482a-4f40-b193-a5c08846577b)
<div align="center">
  (example percentage alert)
</div>

## Overview

This repo helps you:

- Log your Mac’s battery percentage every few minutes via a cron job
- Store and manage battery logs in a Supabase PostgreSQL database
- Automatically clean up logs older than 24 hours
- Display the latest battery status and receive charging notifications via a Scriptable widget on iOS

## 🔧 Project Structure

```Battery-Logger-Supabase/
│
├── mac_battery.py           # Collects battery % and logs to Supabase
├── battery_log.sql          # Supabase schema (for battery_logs table)
├── sample_battery_log.txt   # Sample log output
├── widget.js                # Scriptable iOS widget code
├── README.md                # You’re here!
```

## 🖥 Setup: Mac Side (Logging)

### 1. Clone the Repo

```git clone https://github.com/yourusername/Battery-Logger-Supabase.git
cd Battery-Logger-Supabase
```
### 2. Set Up a Python Virtual Environment

```python3 -m venv battery
source battery/bin/activate
pip install -r requirements.txt
```

Make sure your mac_battery.py script includes your Supabase API URL and API KEY.

### 3. Cron Job (Every 3 Minutes)

Add this to your crontab with crontab -e:
```
*/3 * * * * source /path/to/your/venv/bin/activate && /path/to/your/venv/bin/python /path/to/Battery-Logger-Supabase/mac_battery.py >> /path/to/Battery-Logger-Supabase/battery_log.txt 2>&1
```

This logs battery % to Supabase every 3 minutes and appends output to a log file.

## 🗃 Supabase Setup

### 1. Create battery_logs Table

Use the contents of battery_log.sql to initialize your table. It should look like:
```
create table battery_logs (
  id uuid default uuid_generate_v4() primary key,
  percentage int not null,
  timestamp timestamptz default now()
);
```

### 2. Periodic Cleanup Job

Use Supabase's Integrations to add this cron SQL job:
```
delete from battery_logs
where timestamp < now() - interval '1 day';
```
    This keeps your logs fresh and storage light.

## 📱 iOS Widget (via Scriptable)
### 1. Install [Scriptable](https://scriptable.app/)
### 2. Copy widget.js into a new Scriptable script
### 3. Add to Home Screen
- Set it to run the script.
- It will fetch the latest battery percentage and show it.
- Make sure the API URL and Key are configured properly inside widget.js.

## ✅ Sample Log Output

Example from sample_battery_log.txt:
```
Data inserted successfully: 64% at 2025-04-11T06:41:01.761934+00:00
Data inserted successfully: 63% at 2025-04-11T06:42:00.997792+00:00
...
```
## 💡 Ideas to Improve
- Weekly summary email of battery trends
- Multiple device support (MacBook, iPhone, etc.)
- UI similar to iOS Batteries Widget (if possible)
