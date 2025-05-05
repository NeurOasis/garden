# SailPlan_Shortcut Structure Ref_v5.1_20250504

This structured diagram provides a visual reference for the SailPlan shortcut flow, highlighting the key components and their relationships.

```
┌─ Shortcut Start
│  ├─ Get Shortcut Input
│  ├─ Set Boat Name to "Time Out" as Variable
│  └─ Set Location to "Horn Point Marina..." as Variable
│
├─ EMAIL TYPE DETECTION
│  │
│  ├─ If (Input contains "has been canceled")
│  │  └─ Set Email Type to "Cancellation"
│  │
│  └─ Otherwise
│     ├─ If (Input contains "Confirmation Has Opened")
│     │  └─ Set Email Type to "Confirmation Reminder"
│     │
│     └─ Otherwise
│        ├─ If (Input contains "Time Change")
│        │  └─ Set Email Type to "Time Change"
│        │
│        └─ Otherwise
│           └─ Set Email Type to "New Reservation"
│
├─ Debug: Show notification with Email Type
│
├─ MAIN PROCESSING SECTION (Separate flow, not nested)
│  │
│  ├─ If (Email Type equals "Cancellation")
│  │  ├─ Match Text with updated regex pattern to extract date, time, and boat name
│  │  ├─ Get Canceled Date Text (Group 1), Canceled Time (Group 2), and Canceled Boat Name (Group 3)
│  │  ├─ Show notification with extracted date/time
│  │  ├─ Format Date from extracted components
│  │  ├─ Find Calendar Events containing Boat Name on that date
│  │  ├─ If (Events To Delete count > 0)
│  │  │  ├─ Delete Calendar Events
│  │  │  └─ Show Notification: "Removed canceled sailing event"
│  │  │
│  │  ├─ Find Reminders containing "sailing" in title and date in notes
│  │  └─ If (Tasks To Delete contains matches)
│  │     ├─ Remove Reminders
│  │     └─ Show Notification: "Removed preparation task..."
│  │
│  └─ Otherwise
│     ├─ If (Email Type equals "Confirmation Reminder")
│     │  ├─ Match Text with updated regex to extract reservation date
│     │  ├─ Match Text to extract reservation time
│     │  ├─ Show notification with extracted date/time
│     │  ├─ Add New Reminder in iOS Reminders app
│     │  │  ├─ Title: "⚠️ CONFIRM SAILING RESERVATION - [Boat Name]"
│     │  │  ├─ Notes: Details including reservation date/time
│     │  │  ├─ Due Date: Tomorrow
│     │  │  └─ Priority: High
│     │  │
│     │  ├─ Create Calendar Event for tonight at 10:00 PM
│     │  └─ Show Notification: "Created confirmation reminder..."
│     │
│     └─ Otherwise
│        ├─ If (Email Type equals "Time Change")
│        │  ├─ Show Notification: "Updating all future sailing times"
│        │  ├─ Find Calendar Events (current date to 1 year ahead)
│        │  └─ If (Events To Update count > 0)
│        │     ├─ Repeat with Each Event:
│        │     │  ├─ Get Start Date of current event
│        │     │  └─ If (Event Start Hour is between 10 and 11)
│        │     │     ├─ Calculate: Event Start + 7.5 hours
│        │     │     └─ Update End Date of event
│        │     │     Otherwise
│        │     │     ├─ If (Event Start Hour is between 18 and 19)
│        │     │     │  ├─ Calculate: Event Start + 16.5 hours
│        │     │     │  └─ Update End Date of event
│        │     │     
│        │     └─ Show Notification: "Updated X events"
│        │
│        └─ Otherwise (New Reservation)
│           ├─ Match Text with updated regex to extract reservation date
│           ├─ Match Text to extract reservation time
│           ├─ Show notification with extracted date/time
│           ├─ If (Reservation Date has any value)
│           │  ├─ Combine Date and Time to create Start Time
│           │  ├─ If (Reservation Time contains "10:30 am")
│           │  │  ├─ Set Sail Type to "Day Sail"
│           │  │  └─ Calculate: Start Time + 7.5 hours = End Time
│           │  │  Otherwise
│           │  │  ├─ Set Sail Type to "Overnight Sail" 
│           │  │  └─ Calculate: Start Time + 16.5 hours = End Time
│           │  │
│           │  ├─ Find Calendar Events (check for duplicates)
│           │  └─ If (Existing Events count equals 0)
│           │     ├─ Calculate alert times (7 days, 3 days, 2 days, 18 hours)
│           │     ├─ Create Calendar Event with multiple alerts
│           │     ├─ Add New Reminder for preparation
│           │     └─ Show Notification: "Added sailing event..."
│           │     Otherwise
│           │     └─ Show Notification: "Event already exists..."
│           │
└─ Shortcut End

AUTOMATION SETUP:
- Trigger: Email
- From: embark.sailtime.com
- Action: Run Shortcut (SailPlan V5.1)
```

## Key Features in Version 5.0

1. **Enhanced Regex Patterns**
   - Updated patterns that handle variations in date formats (with/without commas)
   - Support for zero-padded dates (e.g., "May 05" instead of "May 5")
   - More flexible spacing and time format handling
   - Explicit matching of "Embark reservation scheduled for"

2. **Debug Notifications**
   - Added notification steps at key points to show:
     - Detected email type
     - Extracted dates and times
     - Actions being performed

3. **Native iOS Integration**
   - Using built-in iOS Reminders app instead of third-party task managers
   - Standard Calendar integration with multiple alerts
   - No dependencies on third-party URL schemes

4. **Multiple Sail Types**
   - Day Sail: 10:30am start, 7.5 hour duration
   - Overnight Sail: 6:30pm start, 16.5 hour duration
   - Automatic detection based on start time

5. **Fail-Safe Checks**
   - Verification of extracted date before proceeding
   - Duplicate event checking
   - Notification feedback at each major step

## Important Implementation Notes

- The EMAIL TYPE DETECTION and MAIN PROCESSING SECTION are sequential, not nested
- Each regex pattern has been updated to handle the actual format of SailTime emails
- Debug notifications help isolate issues in the shortcut execution
- This version uses native iOS apps for better privacy and reliability

The automation trigger should be configured to detect emails from "embark.sailtime.com" and run the shortcut without asking for confirmation (after testing is complete).