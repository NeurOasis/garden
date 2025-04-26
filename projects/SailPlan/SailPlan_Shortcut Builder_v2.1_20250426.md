# SailPlan_Shortcut Builder_v2.1_20250426

This guide provides detailed, step-by-step instructions for creating an iOS Shortcut 
that processes SailTime emails and manages calendar events and reminders.

## Setup Overview

This shortcut will be triggered by an automation that runs when emails from 
embark.sailtime.com are received. The shortcut will:

1. Identify the type of email (reservation, cancellation, etc.)
2. Extract relevant information (dates, times)
3. Create, update, or delete calendar events and reminders accordingly

## Detailed Setup Instructions

### Part 1: Create the Processing Shortcut

1. Open the Shortcuts app on your iPhone
2. Tap "+" to create a new shortcut
3. Follow these steps precisely:

#### Step 1: Set Up Input Handling
- Add "Receive Input from" action (appears automatically at the top)
- Keep default settings (accepts any input type)
- Under "If there's no input" section, keep "Continue"

#### Step 2: Get Input
- Tap "Search Actions" at the bottom
- Type "shortcut input" and select "Get Shortcut Input"
- Add this action

#### Step 3: Add Boat Name
- Tap "Search Actions"
- Type "text" and select "Text" action
- Enter "Time Out" as the text
- Tap the small "..." at the bottom right of this action
- Select "Set Variable"
- Enter "Boat Name" as the variable name

#### Step 4: Add Location
- Add another "Text" action
- Enter "Horn Point Marina, 105 Eastern Ave, Annapolis, MD"
- Tap "..." and select "Set Variable"
- Name it "Location"

#### Step 5: Determine Email Type (First Condition)
- Tap "Search Actions" and type "if"
- Select the "If" action
- Tap "Condition" to set up your condition
- For the left side, tap "Variable" and select "Shortcut Input"
- For the comparison, select "Contains"
- For the right side, type "Reservation Canceled"

#### Step 6: Set Email Type for Cancellation
- Inside this If (when true):
- Add a "Text" action
- Type "Cancellation" as the text
- Tap "..." and select "Set Variable"
- Name it "Email Type"

#### Step 7: Check for Confirmation Email
- Tap "Otherwise"
- Add another "If" action
- Set condition: "Shortcut Input" contains "Confirmation Has Opened"
- Add "Text" action with "Confirmation Reminder"
- Save as variable "Email Type"

#### Step 8: Check for Time Change Email
- In the next Otherwise, add another If
- Condition: "Shortcut Input" contains "Boat Reservation Time Change"
- Add "Text" action with "Time Change"
- Save as variable "Email Type"

#### Step 9: Default to New Reservation
- In the final Otherwise:
- Add "Text" action with "New Reservation"
- Save as variable "Email Type"

#### Step 10: Main Processing Decision
- After all nested If statements, add a new "If" action
- Condition: "Email Type" equals "Cancellation"
- This section will handle cancellation emails

### Part 2: Cancellation Email Processing

#### Step 11: Extract Cancellation Date
- Inside the "Email Type equals Cancellation" If:
- Add a "Match Text" action
- Set input to "Shortcut Input"
- Pattern: `reservation on\s+([A-Za-z]+\s+\d{2}\s+\d{4}\s+\d{2}:\d{2}(?:am|pm))\s+date has been canceled`
- Tap the blue arrow to access Match Group 1
- Add "Set Variable" to save Match Group 1 as "Canceled Date Text"

#### Step 12: Format Date for Calendar Search
- Add "Date" action
- Set it to create date from "Canceled Date Text"
- Save to variable "Canceled Date"

#### Step 13: Find Calendar Events
- Add "Find Calendar Events" action
- Select your calendar
- Set "Title contains" to variable "Boat Name"
- Start Date: Variable "Canceled Date"
- End Date: "Canceled Date" + 1 day
- Save to variable "Events To Delete"

#### Step 14: Delete Calendar Events
- Add "If" action
- Condition: Count of "Events To Delete" > 0
- Inside this If, add "Delete Calendar Events" action
- Set to delete "Events To Delete"
- Add "Show Notification" action
- Content: "Removed canceled sailing event"

#### Step 15: Find and Delete Reminders
- Add "Find Reminders" action
- Select your Reminders list
- Filter: Title contains "Prepare for sailing" AND Notes contains variable "Canceled Date Text"
- Save to variable "Tasks To Delete"
- Add "If" action
- Condition: Count of "Tasks To Delete" > 0
- Inside this If, add "Remove Reminders" action
- Set to remove "Tasks To Delete"
- Add "Show Notification" action
- Content: "Removed preparation task for canceled sailing"

### Part 3: Confirmation Reminder Email Processing

#### Step 16: Set Up Confirmation Processing
- Go back to the main If that checks Email Type
- Add "Otherwise" section
- Add "If" condition: "Email Type" equals "Confirmation Reminder"

#### Step 17: Extract Reservation Details
- Add "Match Text" action
- Set input to "Shortcut Input"
- Pattern: `confirm your reservation on\s+([A-Za-z]+,\s+[A-Za-z]+\s+\d{1,2},\s+\d{4})\s+at\s+(\d{1,2}:\d{2}\s+(?:am|pm))`
- Save Match Group 1 to variable "Reservation Date"
- Add another "Match Text" with same pattern
- Save Match Group 2 to variable "Reservation Time"

#### Step 18: Create Confirmation Task
- Add "Add Reminder" action
- List: Select your Reminders list
- Title: "⚠️ CONFIRM SAILING RESERVATION - " + variable "Boat Name"
- Notes: "Log into https://embark.sailtime.com/ to confirm reservation for " + variable "Reservation Date" + " at " + variable "Reservation Time" + ". IMPORTANT: If not confirmed, reservation will be released!"
- Due Date: Current Date + 1 day
- Priority: High

#### Step 19: Create Calendar Reminder
- Add "Create Calendar Event" action
- Calendar: Your preferred calendar
- Title: "⚠️ CONFIRM SAILING RESERVATION ⚠️"
- Notes: "Log into https://embark.sailtime.com/ to confirm sailing reservation"
- Start Date: Current Date at 10:00 PM
- End Date: Current Date at 10:15 PM
- Alert: At time of event
- Add "Show Notification" action
- Content: "Created confirmation reminder for sailing on " + variable "Reservation Date"

### Part 4: Time Change Email Processing

#### Step 20: Set Up Time Change Processing
- Go back to the main If that checks Email Type
- Add another "Otherwise" section with nested "If"
- Condition: "Email Type" equals "Time Change"

#### Step 21: Notify About Time Change
- Add "Show Notification" action
- Content: "Updating all future sailing times"

#### Step 22: Find Future Events
- Add "Find Calendar Events" action
- Calendar: Your preferred calendar
- Title contains: Variable "Boat Name"
- Start Date: Current Date
- End Date: Current Date + 1 year
- Save to variable "Events To Update"

#### Step 23: Check If Events Found
- Add "If" action
- Condition: Count of "Events To Update" > 0
- Inside this If, add "Repeat with Each" action
- Input: Variable "Events To Update"

#### Step 24: Process Each Event
- Inside the Repeat:
- Add "Get Details of Calendar Event" action
- Input: "Repeat Item" (current event)
- Detail: "Start Date"
- Save to variable "Event Start"

#### Step 25: Update Based on Start Time
- Add "If" action
- Condition: "Event Start" Hour is between 10 and 11
- Inside this If:
  - Add "Calculate" action to add 7.5 hours to "Event Start"
  - Save as "New End Time"
  - Add "Update Calendar Event" action
  - Calendar Event: "Repeat Item"
  - End Date: "New End Time"
- Otherwise (for evening sails):
  - Add "If" action
  - Condition: "Event Start" Hour is between 18 and 19
  - Inside this If:
    - Add "Calculate" action to add 16.5 hours to "Event Start"
    - Save as "New End Time"
    - Add "Update Calendar Event" action
    - Calendar Event: "Repeat Item"
    - End Date: "New End Time"

#### Step 26: Finish Time Change Processing
- After the Repeat action ends:
- Add "Show Notification" action
- Content: "Updated " + Count of "Events To Update" + " events"

### Part 5: New Reservation Processing

#### Step 27: Set Up New Reservation Processing
- Go back to main If structure
- Add final "Otherwise" section (will process new reservations)

#### Step 28: Extract Reservation Information
- Add "Match Text" action
- Input: "Shortcut Input"
- Pattern: `reservation scheduled for\s+([A-Za-z]+\s+\d{1,2},\s+\d{4})\s+at\s+(\d{1,2}:\d{2}\s+(?:am|pm))`
- Save Match Group 1 as "Reservation Date"
- Add another "Match Text" with same pattern
- Save Match Group 2 as "Reservation Time"

#### Step 29: Check If Match Found
- Add "If" action
- Condition: "Reservation Date" has any value
- This ensures we only proceed if date extraction succeeded

#### Step 30: Combine Date and Time
- Add "Date" action
- Combine Date "Reservation Date" and Time "Reservation Time"
- Save to variable "Start Time"

#### Step 31: Determine Sail Type
- Add "If" action
- Condition: "Reservation Time" contains "10:30 am"
- If true:
  - Add "Text" action with "Day Sail"
  - Save to variable "Sail Type"
  - Add "Calculate" action to add 7.5 hours to "Start Time"
  - Save to variable "End Time"
- Otherwise:
  - Add "Text" action with "Overnight Sail"
  - Save to variable "Sail Type"
  - Add "Calculate" action to add 16.5 hours to "Start Time"
  - Save to variable "End Time"

#### Step 32: Check for Existing Events
- Add "Find Calendar Events" action
- Calendar: Your calendar
- Title contains: "Sailing: " + variable "Boat Name"
- Start Date: Variable "Start Time"
- End Date: Variable "Start Time" + 1 minute
- Save to variable "Existing Events"

#### Step 33: Create Event If None Exists
- Add "If" action
- Condition: Count of "Existing Events" equals 0
- Inside this If:

#### Step 34: Calculate Alert Times
- Add "Date" action for 7-day alert
- Calculate: "Start Time" - 7 days
- Format to include time: 10:00 PM
- Save to variable "Week Alert"
- Repeat for 3-day and 2-day alerts
- Add "Date" action for packing alert (18 hours before)
- Calculate: "Start Time" - 18 hours
- Save to variable "Packing Alert"

#### Step 35: Create Calendar Event
- Add "Create Calendar Event" action
- Calendar: Your calendar
- Title: "Sailing: " + variable "Boat Name" + " - " + variable "Sail Type"
- Location: Variable "Location"
- Start Date: Variable "Start Time"
- End Date: Variable "End Time"
- Add alerts:
  - First alert: Variable "Week Alert" (if applicable)
  - Second alert: Variable "Three Day Alert"
  - Third alert: Variable "Two Day Alert"
  - Fourth alert: Variable "Packing Alert"
- Notes: "SailTime Reservation at Horn Point Marina"

#### Step 36: Create Preparation Task
- Add "Add Reminder" action
- List: Your Reminders list
- Title: "Prepare for " + variable "Sail Type" + " - " + variable "Location"
- Notes: Detailed preparation notes with sailing info
- Due Date: Variable "Start Time" - 1 day
- Priority: Medium

#### Step 37: Show Success Notification
- Add "Show Notification" action
- Content: "Added sailing on " + variable "Reservation Date" + " to calendar with reminders"

#### Step 38: Handle Duplicate Event Case
- In the Otherwise section of the existing events check:
- Add "Show Notification" action
- Content: "Event already exists for this date"

### Part 6: Automation Setup

After creating the shortcut, set up the automation:

1. Go to the "Automation" tab in Shortcuts
2. Tap "+" to create a new personal automation
3. Select "Email" as the trigger
4. Configure:
   - Account: Your email account
   - Sender contains: "embark.sailtime.com"
   - Subject contains: Leave blank to catch all SailTime emails
5. Tap "Next"
6. Add action "Run Shortcut"
7. Select your SailTime processing shortcut
8. If testing, leave "Ask Before Running" enabled
9. For production use, disable "Ask Before Running"
10. Tap "Done"

## Testing Recommendations

1. Forward yourself sample emails of each type to test
2. Run the shortcut manually on these test emails
3. Verify calendar events and reminders are created/updated correctly
4. Once confirmed working, enable the automation to run without asking

## Important Notes

- This shortcut relies on regex patterns that match specific email formats
- If SailTime changes their email format, you may need to update the patterns
- Test after any SailTime system updates to ensure continued functionality

## Version History

- v2.1 (20250426): Updated file naming convention
- v2.0 (20250425): Complete revision with detailed step-by-step instructions
- v1.1 (20250425): Updated with more detailed instructions
- v1.0 (20250424): Initial documentation