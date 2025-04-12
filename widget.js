const url = ''; // fill string with your supabase project url
const serviceRoleKey = ''; // fill string with your project api key 

const headers = {
  'Authorization': `Bearer ${serviceRoleKey}`,
  'apikey': serviceRoleKey,
  'Content-Type': 'application/json'
};

async function fetchBatteryData() {
  try {
    const req = new Request(url);
    req.headers = headers;
    const res = await req.loadJSON();
    
    console.log('Response data:', JSON.stringify(res, null, 2));
    
    if (res && res.length > 0) {
      const batteryData = res[0];
      const batteryPercent = batteryData.battery_percent;
      const timestamp = new Date(batteryData.timestamp).toLocaleTimeString();

      console.log(`Battery: ${batteryPercent}% at ${timestamp}`);
      
      return { batteryPercent, timestamp };
    } else {
      console.error('No data available in response.');
      return { batteryPercent: 'No data', timestamp: 'N/A' };
    }
  } catch (error) {
    console.error('Error fetching battery data:', error);
    return { batteryPercent: 'Error', timestamp: 'N/A' };
  }
}

function sendNotification(message) {
  const notification = new Notification();
  notification.title = "Battery Alert";
  notification.body = message;
  notification.schedule();
}

async function createWidget() {
  const { batteryPercent, timestamp } = await fetchBatteryData();
  
  const widget = new ListWidget();
  widget.backgroundColor = new Color('#1F1F1F'); 

  const batteryText = widget.addText(`${batteryPercent}%`);
  batteryText.centerAlignText();
  batteryText.font = Font.boldSystemFont(30);

  if (batteryPercent <= 10) {
    batteryText.textColor = new Color('#FF0000'); 
    sendNotification("Battery is below 10%! Please charge soon.");
  } else if (batteryPercent <= 20) {
    batteryText.textColor = new Color('#FFFF00');
    sendNotification("Battery is below 20%. Consider charging soon.");
  } else if (batteryPercent === 100) {
    batteryText.textColor = new Color('#00FF00'); 
    sendNotification("Battery is fully charged!");
  } else {
    batteryText.textColor = new Color('#00FF00');
  }

  const timeText = widget.addText(`Last updated: ${timestamp}`);
  timeText.centerAlignText();
  timeText.font = Font.systemFont(12);
  timeText.textColor = new Color('#FFFFFF'); 

  return widget;
}

let widget = await createWidget();
if (config.runsInWidget) {
  Script.setWidget(widget);
} else {
  widget.presentMedium();
}

Script.complete();
