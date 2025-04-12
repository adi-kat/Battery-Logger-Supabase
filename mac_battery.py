import psutil
from datetime import datetime, timezone
from supabase import create_client, Client

SUPABASE_URL = "" # fill string with your supabase project url
SUPABASE_KEY = "" # fill string with your supabase api key

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

battery = psutil.sensors_battery()
if battery:
    percent = battery.percent
    timestamp = datetime.now(timezone.utc).isoformat()

    try:
        response = supabase.table("sample_battery_logs").insert({
            "battery_percent": percent,
            "timestamp": timestamp
        }).execute()

        print(f"Response Data: {response.data}")

        if response.data:
            print(f"Data inserted successfully: {percent}% at {timestamp}")
        else:
            print(f"Unexpected error. No data returned.")

    except Exception as e:
        print(f"Error while inserting data: {e}")