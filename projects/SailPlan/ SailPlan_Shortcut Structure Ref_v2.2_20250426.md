# SailPlan_Shortcut Structure Ref_v2.2_20250426

This markdown-formatted reference diagram shows the structure of the SailPlan shortcut for easy visualization.

## SailPlan Shortcut Structure

### Initial Setup
```
1. When this shortcut runs (Initial step)
2. Get (Scripting action) → "Shortcut Input" variable
3. Text → "Time Out" → Set as Variable "Boat Name"
4. Text → "Horn Point Marina, 105 Eastern Ave, Annapolis, MD" → Set as Variable "Location"
```

### Email Type Detection
```
IF [Shortcut Input] contains "Reservation Canceled"
  |
  └─ Text → "Cancellation" → Set as Variable "Email Type"
ELSE
  |
  └─ IF [Shortcut Input] contains "Confirmation Has Opened"
      |
      └─ Text → "Confirmation Reminder" → Set as Variable "Email Type"
     ELSE
      |
      └─ IF [Shortcut Input] contains "Boat Reservation Time Change"
          |
          └─ Text → "Time Change" → Set as Variable "Email Type" 
         ELSE
          |
          └─ Text → "New Reservation" → Set as Variable "Email Type"
```

### Main Processing

```
IF [Email Type] equals "Cancellation"
  |
  ├─ Match Text from [Shortcut Input] using regex pattern
  |   └─ Save Match Group 1 as "Canceled Date Text"
  |
  ├─ Date → Format [Canceled Date Text] → Set as Variable "Canceled Date"
  |
  ├─ Find Calendar Events containing [Boat Name]
  |   └─ Save as "Events To Delete"
  |
  ├─ IF [Events To Delete] count > 0
  |   ├─ Delete Calendar Events [Events To Delete]
  |   └─ Show Notification: "Removed canceled sailing event"
  |
  ├─ URL → "bonoboapp://x-callback-url/search?query=Prepare for sailing"
  ├─ Get Contents of URL
  └─ IF [Results] contains [Canceled Date Text]
      ├─ URL → "bonoboapp://x-callback-url/complete?id=[TASK_ID]"
      ├─ Get Contents of URL
      └─ Show Notification: "Removed preparation task..."
```

```
ELSE IF [Email Type] equals "Confirmation Reminder"
  |
  ├─ Match Text → extract [Reservation Date] from [Shortcut Input]
  ├─ Match Text → extract [Reservation Time] from [Shortcut Input]
  |
  ├─ Current Date + 1 day → Set as Variable "Tomorrow Date"
  ├─ Format Date [Tomorrow Date] as "yyyy-MM-dd" → Set as "Formatted Tomorrow"
  |
  ├─ URL → "bonoboapp://x-callback-url/create?title=⚠️ CONFIRM SAILING..." 
  |   (with variables inserted)
  ├─ Get Contents of URL
  |
  ├─ Create Calendar Event:
  |   ├─ Title: "⚠️ CONFIRM SAILING RESERVATION ⚠️"
  |   ├─ Time: Today at 10:00 PM to 10:15 PM
  |   └─ Alert: At time of event
  |
  └─ Show Notification: "Created confirmation reminder..."
```

```
ELSE IF [Email Type] equals "Time Change"
  |
  ├─ Show Notification: "Updating all future sailing times"
  |
  ├─ Find Calendar Events with [Boat Name] from now to 1 year ahead
  |   └─ Save as "Events To Update"
  |
  └─ IF [Events To Update] count > 0
      |
      ├─ Repeat with Each Event:
      |   ├─ Get [Event Start] time from current event
      |   |
      |   └─ IF [Event Start] hour is between 10 and 11
      |       ├─ Calculate: [Event Start] + 7.5 hours → "New End Time"
      |       └─ Update Calendar Event: End Date = [New End Time]
      |      ELSE
      |       └─ IF [Event Start] hour is between 18 and 19
      |           ├─ Calculate: [Event Start] + 16.5 hours → "New End Time"
      |           └─ Update Calendar Event: End Date = [New End Time]
      |
      └─ Show Notification: "Updated [Count] events"
```

```
ELSE (New Reservation)
  |
  ├─ Match Text → extract [Reservation Date] from [Shortcut Input]
  ├─ Match Text → extract [Reservation Time] from [Shortcut Input]
  |
  └─ IF [Reservation Date] has any value
      |
      ├─ Date → Combine [Reservation Date] and [Reservation Time] → "Start Time"
      |
      ├─ IF [Reservation Time] contains "10:30 am"
      |   ├─ Text → "Day Sail" → Set as Variable "Sail Type"
      |   └─ Calculate: [Start Time] + 7.5 hours → "End Time"
      |  ELSE
      |   ├─ Text → "Overnight Sail" → Set as Variable "Sail Type" 
      |   └─ Calculate: [Start Time] + 16.5 hours → "End Time"
      |
      ├─ Find Calendar Events containing "Sailing: [Boat Name]"
      |   └─ Save as "Existing Events"
      |
      └─ IF [Existing Events] count equals 0
          |
          ├─ Calculate alert times:
          |   ├─ [Start Time] - 7 days at 10:00 PM → "Week Alert"
          |   ├─ [Start Time] - 3 days at 10:00 PM → "Three Day Alert" 
          |   ├─ [Start Time] - 2 days at 10:00 PM → "Two Day Alert"
          |   └─ [Start Time] - 18 hours → "Packing Alert"
          |
          ├─ Create Calendar Event with all alerts
          |
          ├─ Calculate: [Start Time] - 1 day → "Day Before Sail"
          ├─ Format Date [Day Before Sail] as "yyyy-MM-dd" → "Formatted Day Before"
          |
          ├─ URL → "bonoboapp://x-callback-url/create?title=Prepare for..."
          |   (with variables inserted)
          ├─ Get Contents of URL
          |
          └─ Show Notification: "Added sailing on [Reservation Date]..."
         ELSE
          |
          └─ Show Notification: "Event already exists for this date"
```

### Automation Setup
```
Trigger: Email
  ├─ Account: Gmail
  ├─ Sender contains: "embark.sailtime.com" 
  ├─ Subject contains: [leave blank]
  └─ Run Shortcut: SailTime Processing
```

## Key Points

- The structure is organized in **separate logical blocks**, not as one big nested tree
- First determine email type, then process based on type in a separate section
- Each section uses clear IF/ELSE structure with proper nesting
- Bonobo Actions integration uses URL scheme with specific formatting requirements
- Different sail types (Day vs. Overnight) use different duration calculations
- Multiple calendar alerts are set at different intervals before sailing

## Version History

- v2.2 (20250426): Updated to use Bonobo Actions and markdown-formatted diagram
- v2.1 (20250426): Updated file naming convention
- v2.0 (20250425): Added detailed annotations and processing structure
- v1.0 (20250425): Initial structure diagram