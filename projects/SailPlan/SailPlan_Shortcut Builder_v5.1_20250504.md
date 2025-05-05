# SailPlan_Shortcut Builder_v5.1_20250504

This guide provides detailed, step-by-step instructions for creating an iOS Shortcut that processes SailTime emails and manages calendar events and iOS Reminders tasks.

## 🔍 Setup Overview

This shortcut will be triggered by an automation that runs when emails from embark.sailtime.com are received. The shortcut will:

1. Identify the type of email (reservation, cancellation, etc.)
2. Extract relevant information (dates, times)
3. Create, update, or delete calendar events and iOS Reminders tasks accordingly

## 📋 Detailed Setup Instructions

### Part 1: Create the Processing Shortcut

1. Open the Shortcuts app on your iPhone
2. Tap "+" to create a new shortcut
3. Name the shortcut "SailPlan V5.1"
4. Follow these steps precisely:

#### Step 1: Set Up Initial Shortcut
- You'll see the editor screen with "Shortcut Name" at the top
- If there's a "When this shortcut runs" placeholder at the top, leave it

#### Step 2: Add Input Handling
- Tap the search bar at the bottom of the screen
- Type "get" and locate the "Get" action under the Scripting category
- Add this action and select "Shortcut Input" as the variable to get
- This creates a "Get Shortcut Input" action

#### Step 3: Add Boat Name
- Tap the search bar at the bottom of the screen
- Type "text" and locate the "Text" action
- Add this action and type "Time Out" in the text field
- Tap the small "..." button in the top-right corner
- Select "Set as Variable" from the menu
- Name the variable "Boat Name" and tap "Done"

#### Step 4: Add Location
- Add another "Text" action
- Type "Horn Point Marina, 105 Eastern Ave, Annapolis, MD"
- Set this as a variable named "Location"

#### Step 5: Determine Email Type (First Condition)
- Add an "If" action from the Scripting category
- Set the condition: "Shortcut Input" contains "has been canceled"
- Inside this If block:
  - Add a "Text" action with "Cancellation"
  - Set this as a variable named "Email Type"

#### Step 6: Set Email Type for Confirmation
- Tap the "Otherwise" section of the If block
- Add another "If" action
- Set the condition: "Shortcut Input" contains "Confirmation Has Opened"
- Inside this If block:
  - Add a "Text" action with "Confirmation Reminder"
  - Set this as a variable named "Email Type"

#### Step 7: Check for Time Change Email
- Tap the "Otherwise" section of the current If block
- Add another "If" action
- Set the condition: "Shortcut Input" contains "Time Change"
- Inside this If block:
  - Add a "Text" action with "Time Change"
  - Set this as a variable named "Email Type"

#### Step 8: Default to New Reservation
- Tap the "Otherwise" section of the current If block
- Add a "Text" action with "New Reservation"
- Set this as a variable named "Email Type"

#### Step 9: Add Debug Notification
- After all the nested If statements (at the main level)
- Add a "Show Notification" action
- Set the content to "Email Type = " and insert the "Email Type" variable

#### Step 10: Main Processing Decision
- Add a new "If" action at the main level
- Set the condition: "Email Type" equals "Cancellation"
- This starts the main processing section

### Part 2: Cancellation Email Processing

#### Step 11: Extract Cancellation Date
- Inside the "Email Type equals Cancellation" If block:
- Add a "Match Text" action
- Set the text to "Shortcut Input"
- Use this pattern to match the cancellation date and time:
  ```
  Your reservation for\s+([A-Za-z]+\s+\d{1,2}(?:,|)\s+\d{4})\s+at\s+(\d{1,2}:\d{2}\s*(?:am|pm)).*?"([^"]+)"
  ```
- Get Match Group 1 and set as "Canceled Date Text"
- Add another "Match Text" with the same pattern
- Get Match Group 2 and set as "Canceled Time"
- Add one more "Match Text" with the same pattern
- Get Match Group 3 and set as "Canceled Boat Name"

#### Step 12: Debug Date Extraction
- Add a "Show Notification" action
- Content: "Extracted: " + "Canceled Date Text" + " at " + "Canceled Time" + " for boat: " + "Canceled Boat Name"

#### Step 13: Format Date for Calendar Search
- Add a "Date" action
- Use "Canceled Date Text" and "Canceled Time" to create a date
- Set as variable "Canceled Date"

#### Step 14: Find Calendar Events
- Add "Find Calendar Events" action
- Select your calendar
- Add filters:
  - Title contains "Boat Name" variable
  - Start Date is "Canceled Date"
  - End Date is "Canceled Date" + 1 day
- Save results as "Events To Delete"

#### Step 15: Delete Calendar Events
- Add an "If" action
- Condition: Count of "Events To Delete" > 0
- Inside this If block:
  - Add "Delete Calendar Events" action using "Events To Delete"
  - Add "Show Notification" with "Removed canceled sailing event"

#### Step 16: Find and Delete Reminders
- Add "Find Reminders" action
- Select your Reminders list
- Add filter: Title contains "sailing" AND Notes contains "Canceled Date Text"
- Save as "Tasks To Delete"
- Add an "If" action
- Condition: Count of "Tasks To Delete" > 0
- Inside this If:
  - Add "Remove Reminders" action to remove "Tasks To Delete"
  - Add "Show Notification" with "Removed preparation task"

### Part 3: Confirmation Reminder Email Processing

#### Step 17: Set Up Confirmation Processing
- After the Cancellation processing, add "Otherwise" to the main If
- Add an "If" condition: "Email Type" equals "Confirmation Reminder"

#### Step 18: Extract Reservation Details
- Add a "Match Text" action
- Set text to "Shortcut Input"
- Use this pattern:
  ```
  confirm your reservation on\s+([A-Za-z]+(?:,|)\s+[A-Za-z]+\s+\d{1,2}(?:,|)\s+\d{4})\s+at\s+(\d{1,2}:\d{2}\s*(?:am|pm))
  ```
- Get Match Group 1 as "Reservation Date"
- Add another Match using the same pattern
- Get Match Group 2 as "Reservation Time"

#### Step 19: Debug Date Extraction
- Add a "Show Notification" action
- Content: "Creating reminder for: " + "Reservation Date" + " at " + "Reservation Time"

#### Step 20: Create Confirmation Task
- Add "Add New Reminder" action
- List: Your Reminders list
- Title: "⚠️ CONFIRM SAILING RESERVATION - " + variable "Boat Name"
- Notes: "Log into https://embark.sailtime.com/ to confirm reservation for " + variable "Reservation Date" + " at " + variable "Reservation Time" + ". IMPORTANT: If not confirmed, reservation will be released!"
- Due Date: Current Date + 1 day
- Priority: High

#### Step 21: Create Calendar Reminder
- Add "Create Calendar Event" action
- Calendar: Your preferred calendar
- Title: "⚠️ CONFIRM SAILING RESERVATION ⚠️"
- Notes: "Log into https://embark.sailtime.com/ to confirm sailing reservation"
- All-day Event: OFF
- Starts: Current Date at 10:00 PM
- Ends: Current Date at 10:15 PM
- Alert: At time of event
- Add "Show Notification" action
- Content: "Created confirmation reminder for sailing on " + variable "Reservation Date"

### Part 4: Time Change Email Processing

#### Step 22: Set Up Time Change Processing
- After the Confirmation section, add "Otherwise" to the main If structure
- Add an "If" condition: "Email Type" equals "Time Change"

#### Step 23: Notify About Time Change
- Add "Show Notification" action
- Content: "Updating all future sailing times"

#### Step 24: Find Future Events
- Add "Find Calendar Events" action
- Calendar: Your preferred calendar
- Filters:
  - Title contains "Boat Name"
  - Start Date is after Current Date
  - End Date is before Current Date + 1 year
- Save as "Events To Update"

#### Step 25: Check If Events Found
- Add an "If" action
- Condition: Count of "Events To Update" > 0
- Inside this If, add "Repeat with Each" action
- Set to repeat with "Events To Update"

#### Step 26: Process Each Event
- Inside the Repeat with Each loop:
- Add "Get Details of Calendar Event" action
- Get "Start Date" from "Repeat Item"
- Save as variable "Event Start"

#### Step 27: Update Based on Start Time
- Add an "If" action
- Condition: Hour of "Event Start" is between 10 and 11
- Inside this If (for morning sails):
  - Add "Calculate" action: "Event Start" + 7.5 hours
  - Save as "New End Time"
  - Add "Update Calendar Event" action:
    - Calendar Event: "Repeat Item"
    - Field: "End Date"
    - Value: "New End Time"
- Otherwise:
  - Add an "If" action
  - Condition: Hour of "Event Start" is between 18 and 19
  - Inside this If (for evening sails):
    - Add "Calculate" action: "Event Start" + 16.5 hours
    - Save as "New End Time"
    - Add "Update Calendar Event" action:
      - Calendar Event: "Repeat Item"
      - Field: "End Date"
      - Value: "New End Time"

#### Step 28: Finish Time Change Processing
- After the Repeat loop ends (back at main level):
- Add "Show Notification" action
- Content: "Updated " + Count of "Events To Update" + " events"

### Part 5: New Reservation Processing

#### Step 29: Set Up New Reservation Processing
- After the Time Change section, add "Otherwise" to the main If structure
- This section will process new reservations

#### Step 30: Extract Reservation Information
- Add a "Match Text" action
- Set text to "Shortcut Input"
- Use this updated pattern that will match your actual email format:
  ```
  Embark reservation scheduled for\s+([A-Za-z]+\s+\d{1,2}(?:,|)\s+\d{4})\s+at\s+(\d{1,2}:\d{2}\s*(?:am|pm))
  ```
- Get Match Group 1 as "Reservation Date"
- Add another Match using the same pattern
- Get Match Group 2 as "Reservation Time"

#### Step 31: Debug Date Extraction
- Add a "Show Notification" action
- Content: "Extracted date: " + "Reservation Date" + " at " + "Reservation Time"

#### Step 32: Check If Match Found
- Add an "If" action
- Condition: "Reservation Date" has any value
- This ensures we only proceed if the date extraction was successful

#### Step 33: Combine Date and Time
- Inside the "Reservation Date has any value" If block:
- Add a "Date" action
- For the Date part, use "Reservation Date"
- For the Time part, use "Reservation Time"
- Save as variable "Start Time"

#### Step 34: Determine Sail Type
- Add an "If" action
- Condition: "Reservation Time" contains "10:30 am"
- If true (for morning sails):
  - Add a "Text" action with "Day Sail"
  - Set as variable "Sail Type"
  - Add "Calculate" action: "Start Time" + 7.5 hours
  - Save as "End Time"
- Otherwise (for evening/overnight sails):
  - Add a "Text" action with "Overnight Sail"
  - Set as variable "Sail Type"
  - Add "Calculate" action: "Start Time" + 16.5 hours
  - Save as "End Time"

#### Step 35: Check for Existing Events
- Add "Find Calendar Events" action
- Calendar: Your preferred calendar
- Filters:
  - Title contains "Sailing: " + "Boat Name"
  - Start Date is "Start Time"
  - End Date is "Start Time" + 1 minute
- Save as "Existing Events"

#### Step 36: Create Event If None Exists
- Add an "If" action
- Condition: Count of "Existing Events" equals 0
- All following steps will be inside this "No existing events" If block

#### Step 37: Calculate Alert Times
- For each alert time, follow these steps:
  - Add a "Date" action
  - Use "Start Time" as the base
  - Subtract the appropriate time (7 days, 3 days, 2 days, or 18 hours)
  - For day alerts, set time to 10:00 PM
  - Save as the appropriate variable ("Week Alert", "Three Day Alert", etc.)

#### Step 38: Create Calendar Event
- Add "Create Calendar Event" action
- Calendar: Your preferred calendar
- Title: "Sailing: " + "Boat Name" + " - " + "Sail Type"
- Location: "Location" variable
- Notes: "SailTime Reservation at Horn Point Marina"
- All-day Event: OFF
- Starts: "Start Time"
- Ends: "End Time"
- Add four alerts using the alert variables you created

#### Step 39: Create Preparation Task
- Add "Add New Reminder" action
- List: Your preferred Reminders list
- Title: "Prepare for " + "Sail Type" + " - " + "Location"
- Notes: "Sailing information: " + "Reservation Date" + " at " + "Reservation Time" + ". Pack gear, check weather, and prepare food."
- Due Date: "Start Time" - 1 day
- Priority: Medium

#### Step 40: Show Success Notification
- Add "Show Notification" action
- Content: "Added sailing on " + "Reservation Date" + " to calendar with reminders"

#### Step 41: Handle Duplicate Event Case
- In the Otherwise section of the "Existing Events" check:
- Add "Show Notification" action
- Content: "Event already exists for this date"

### Part 6: Automation Setup

After creating the shortcut, set up the automation:

1. Go to the "Automation" tab in Shortcuts
2. Tap "+" to create a new personal automation
3. Select "Email" as the trigger
4. Configure:
   - Account: Your email account
   - From: "embark.sailtime.com"
   - Subject contains: (leave blank to catch all SailTime emails)
5. Tap "Next"
6. Add action "Run Shortcut"
7. Select your "SailPlan V5.1" shortcut
8. For testing, leave "Ask Before Running" enabled
9. For production use, disable "Ask Before Running"
10. Tap "Done"

## 🧪 Testing Tips

1. Forward yourself sample emails of each type to test
2. Watch for the debug notifications to confirm each step is working
3. Verify calendar events and reminder tasks are created correctly
4. Test each email type separately to isolate any issues

## ⚠️ Important Notes

- The regex patterns in this guide have been updated to match the actual format of SailTime emails, including handling dates with or without commas and zero-padded days
- Added debug notifications will help you identify exactly where any issues occur
- If you see "Email Type = New Reservation" but no further notifications, the date extraction regex is likely not matching

## Regex Pattern Reference

Here are the updated regex patterns that should match your actual email formats:

1. **Cancellation Email**:
   ```
   Your reservation for\s+([A-Za-z]+\s+\d{1,2}(?:,|)\s+\d{4})\s+at\s+(\d{1,2}:\d{2}\s*(?:am|pm)).*?"([^"]+)"
   ```

2. **Confirmation Reminder Email**:
   ```
   confirm your reservation on\s+([A-Za-z]+(?:,|)\s+[A-Za-z]+\s+\d{1,2}(?:,|)\s+\d{4})\s+at\s+(\d{1,2}:\d{2}\s*(?:am|pm))
   ```

3. **New Reservation Email**:
   ```
   Embark reservation scheduled for\s+([A-Za-z]+\s+\d{1,2}(?:,|)\s+\d{4})\s+at\s+(\d{1,2}:\d{2}\s*(?:am|pm))
   ```

These patterns have been made more flexible to match dates with or without commas, zero-padded days, and variations in spacing.