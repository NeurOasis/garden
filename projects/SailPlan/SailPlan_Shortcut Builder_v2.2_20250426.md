# SailPlan_Shortcut Builder_v2.2_20250426

This guide provides detailed, step-by-step instructions for creating an iOS Shortcut 
that processes SailTime emails and manages calendar events and Bonobo Actions tasks.

## Setup Overview

This shortcut will be triggered by an automation that runs when emails from 
embark.sailtime.com are received. The shortcut will:

1. Identify the type of email (reservation, cancellation, etc.)
2. Extract relevant information (dates, times)
3. Create, update, or delete calendar events and Bonobo Actions tasks accordingly

## Detailed Setup Instructions

### Part 1: Create the Processing Shortcut

1. Open the Shortcuts app on your iPhone
2. Tap "+" to create a new shortcut
3. Follow these steps precisely:

#### Step 1: Set Up Initial Shortcut
- When you create a new shortcut, you'll see the editor screen with "Shortcut Name" at the top
- You may see "When this shortcut runs" or a similar placeholder at the top
- If not, don't worry - we'll add input handling in the next step

#### Step 2: Add Input Handling
- Tap the search bar at the bottom of the screen (it says "Search for apps and actions")
- Type "get" and locate the "Get" action under the Scripting category
- Tap to add this action
- When prompted for what to get, tap on "Variable" and select "Shortcut Input" from the list
- This creates a complete "Get Shortcut Input" action

#### Step 3: Add Boat Name
- Tap the search bar at the bottom of the screen
- Type "text" and locate the "Text" action under the Scripting category
- Tap to add this action
- In the text field that appears, type "Time Out"
- Tap the small "..." button in the top-right corner of this Text action
- Select "Set as Variable" from the menu
- In the "Variable Name" field that appears, type "Boat Name"
- Tap "Done" to save the variable

#### Step 4: Add Location
- Tap the search bar at the bottom of the screen again
- Type "text" and select the "Text" action under the Scripting category
- In the text field that appears, type "Horn Point Marina, 105 Eastern Ave, Annapolis, MD"
- Tap the small "..." button in the top-right corner of this Text action
- Select "Set as Variable" from the menu
- In the "Variable Name" field that appears, type "Location"
- Tap "Done" to save the variable

#### Step 5: Determine Email Type (First Condition)
- Tap the search bar at the bottom of the screen
- Type "if" and select the "If" action from the Scripting category
- This adds an If statement with a condition field
- Tap the "Condition" field to set up your condition
- For the left side of the condition, tap "Variables" at the bottom of the screen
- Select "Shortcut Input" from the list of variables
- In the middle dropdown that appears, tap and select "contains"
- For the right side, tap the text field and type "Reservation Canceled"
- This creates a complete condition that checks if the email contains the cancellation text

#### Step 6: Set Email Type for Cancellation
- Inside this If block (when condition is true):
- Tap the search bar at the bottom of the screen
- Type "text" and select the "Text" action from the Scripting category
- In the text field that appears, type "Cancellation"
- Tap the small "..." button in the top-right corner of this Text action
- Select "Set as Variable" from the menu
- In the "Variable Name" field that appears, type "Email Type"
- Tap "Done" to save the variable

#### Step 7: Check for Confirmation Email
- Tap the "Otherwise" section at the bottom of the If block
- This expands the Otherwise section where you'll add the next condition
- Tap the search bar at the bottom of the screen
- Type "if" and select the "If" action from the Scripting category
- Tap the "Condition" field to set up your condition
- For the left side, tap "Variables" and select "Shortcut Input"
- In the middle dropdown, select "contains"
- For the right side, type "Confirmation Has Opened"
- Inside this new If block:
  - Tap the search bar and type "text"
  - Select the "Text" action from the Scripting category
  - Type "Confirmation Reminder" in the text field
  - Tap the "..." button in the top-right corner of this Text action
  - Select "Set as Variable"
  - Type "Email Type" as the variable name
  - Tap "Done" to save

#### Step 8: Check for Time Change Email
- Tap the "Otherwise" section at the bottom of the current If block
- This expands another Otherwise section for the next condition
- Tap the search bar at the bottom of the screen
- Type "if" and select the "If" action from the Scripting category
- Tap the "Condition" field to set up your condition
- For the left side, tap "Variables" and select "Shortcut Input"
- In the middle dropdown, select "contains"
- For the right side, type "Boat Reservation Time Change"
- Inside this new If block:
  - Tap the search bar and type "text"
  - Select the "Text" action from the Scripting category
  - Type "Time Change" in the text field
  - Tap the "..." button in the top-right corner of this Text action
  - Select "Set as Variable"
  - Type "Email Type" as the variable name
  - Tap "Done" to save

#### Step 9: Default to New Reservation
- Tap the "Otherwise" section at the bottom of the current If block
- This expands the final Otherwise section where we'll set the default email type
- Tap the search bar at the bottom of the screen
- Type "text" and select the "Text" action from the Scripting category
- Type "New Reservation" in the text field
- Tap the "..." button in the top-right corner of this Text action
- Select "Set as Variable"
- Type "Email Type" as the variable name
- Tap "Done" to save

#### Step 10: Main Processing Decision
- After completing all the nested If statements (you should now be at the main shortcut level, outside of all the nested conditions)
- Tap the search bar at the bottom of the screen
- Type "if" and select the "If" action from the Scripting category
- Tap the "Condition" field to set up your condition
- For the left side, tap "Variables" and select "Email Type"
- In the middle dropdown, select "equals"
- For the right side, type "Cancellation"
- This creates a new, separate If block that will handle cancellation emails based on the Email Type variable we set earlier

### Part 2: Cancellation Email Processing

#### Step 11: Extract Cancellation Date
- Inside the "Email Type equals Cancellation" If block:
- Tap the search bar at the bottom of the screen
- Type "match" and select the "Match Text" action from the Text category
- In the "Text" field, tap "Variables" and select "Shortcut Input"
- In the "Pattern" field, type or paste this exact regex pattern:
  ```
  reservation on\s+([A-Za-z]+\s+\d{2}\s+\d{4}\s+\d{2}:\d{2}(?:am|pm))\s+date has been canceled
  ```
- After entering the pattern, tap "Done"
- Now tap the "Match Group" button below the Pattern field
- In the list that appears, tap "Match Group 1" (this extracts the date/time)
- Tap the "..." button in the top-right corner of this action
- Select "Set as Variable"
- Type "Canceled Date Text" as the variable name
- Tap "Done" to save

#### Step 12: Format Date for Calendar Search
- Tap the search bar at the bottom of the screen
- Type "date" and select the "Date" action from the Scripting category
- This adds a Date action that can create a date in various ways
- Tap "Custom" (or "Custom Format" depending on your iOS version)
- Tap "Variables" and select "Canceled Date Text"
- If prompted to select a format, choose "Custom Format"
- Tap the "..." button in the top-right corner of this Date action
- Select "Set as Variable"
- Type "Canceled Date" as the variable name
- Tap "Done" to save the formatted date as a variable

#### Step 13: Find Calendar Events
- Tap the search bar at the bottom of the screen
- Type "find calendar" and select the "Find Calendar Events" action from the Calendar category
- Tap "Calendar" and select your preferred calendar from the list
- Tap "Add Filter" and select "Title"
- For the title filter, tap "is" and change it to "contains"
- Tap "Value" next to "contains" and select "Variables"
- Choose "Boat Name" from your variables list
- Tap "Add Filter" again and select "Start Date"
- For the start date filter, tap "Value" and select "Variables"
- Choose "Canceled Date" from your variables list
- Tap "Add Filter" again and select "End Date"
- For the end date, tap "Value" and select "Calculate"
- In the calculator, select "Variables" and choose "Canceled Date"
- Tap "+" and enter "1" (to add 1 day)
- In the units dropdown, select "Days"
- Tap "Done" for the calculation
- Tap the "..." button in the top-right corner of the Find Calendar Events action
- Select "Set as Variable"
- Type "Events To Delete" as the variable name
- Tap "Done" to save

#### Step 14: Delete Calendar Events
- Tap the search bar at the bottom of the screen
- Type "if" and select the "If" action from the Scripting category
- Tap the "Condition" field to set up your condition
- For the left side, tap "Calculate"
- In the calculator, tap "Variables" and select "Events To Delete"
- Tap "Count" to count the number of events found
- Back in the condition editor, set the middle dropdown to "is greater than"
- For the right side, enter "0"
- Inside this If block (when events are found):
  - Tap the search bar and type "delete calendar"
  - Select the "Delete Calendar Events" action from the Calendar category
  - Tap "Calendar Events" and select "Variables"
  - Choose "Events To Delete" from your variables list
  - Now tap the search bar again and type "notification"
  - Select the "Show Notification" action from the Notifications category
  - In the notification text field, type "Removed canceled sailing event"
  - Tap "Done" to complete the notification setup

#### Step 15: Find and Delete Bonobo Actions Tasks
- Tap the search bar at the bottom of the screen
- Type "url" and select the "URL" action from the Web category
- In the URL field, type: "bonoboapp://x-callback-url/search?query=Prepare for sailing"
- Tap "Done" to complete the URL action
- Tap the search bar again and type "get contents"
- Select the "Get Contents of URL" action from the Web category
- The input URL should automatically be set to the previous URL action
- Tap the "..." button in the top-right corner of this action
- Select "Set as Variable"
- Type "Search Results" as the variable name
- Tap "Done" to save
- Now tap the search bar and type "if"
- Select the "If" action from the Scripting category
- Tap the "Condition" field to set up your condition
- For the left side, tap "Variables" and select "Search Results"
- In the middle dropdown, select "contains"
- For the right side, tap "Variables" and select "Canceled Date Text"
- Inside this If block (when matching tasks are found):
  - Tap the search bar and type "url"
  - Select the "URL" action from the Web category
  - In the URL field, type: "bonoboapp://x-callback-url/complete?id="
  - For the task ID, you'll need to extract it from the search results
  - You might need to use "Match Text" on the "Search Results" variable to find the ID
  - (Note: For simplicity in testing, you might want to use a direct match with the task name instead of ID initially)
  - Tap the search bar again and type "get contents"
  - Select the "Get Contents of URL" action to execute the task completion
  - Now tap the search bar again and type "notification"
  - Select the "Show Notification" action from the Notifications category
  - In the notification text field, type "Removed preparation task for canceled sailing"
  - Tap "Done" to complete the notification setup

### Part 3: Confirmation Reminder Email Processing

#### Step 16: Set Up Confirmation Processing
- After completing the cancellation processing section, find the end of the main If block that checks if "Email Type" equals "Cancellation"
- Tap the "Otherwise" section at the bottom of this main If block
- This expands the Otherwise section for handling other email types
- Tap the search bar at the bottom of the screen
- Type "if" and select the "If" action from the Scripting category
- Tap the "Condition" field to set up your condition
- For the left side, tap "Variables" and select "Email Type"
- In the middle dropdown, select "equals"
- For the right side, type "Confirmation Reminder"
- This creates a new If block for handling confirmation reminder emails

#### Step 17: Extract Reservation Details
- Inside the "Email Type equals Confirmation Reminder" If block:
- Tap the search bar at the bottom of the screen
- Type "match" and select the "Match Text" action from the Text category
- In the "Text" field, tap "Variables" and select "Shortcut Input"
- In the "Pattern" field, type or paste this exact regex pattern:
  ```
  confirm your reservation on\s+([A-Za-z]+,\s+[A-Za-z]+\s+\d{1,2},\s+\d{4})\s+at\s+(\d{1,2}:\d{2}\s+(?:am|pm))
  ```
- After entering the pattern, tap "Done"
- Tap the "Match Group" button below the Pattern field
- In the list that appears, tap "Match Group 1" (this extracts the date)
- Tap the "..." button in the top-right corner of this action
- Select "Set as Variable"
- Type "Reservation Date" as the variable name
- Tap "Done" to save

- Now tap the search bar again and select "Match Text" again
- In the "Text" field, tap "Variables" and select "Shortcut Input"
- Use the exact same regex pattern as before:
  ```
  confirm your reservation on\s+([A-Za-z]+,\s+[A-Za-z]+\s+\d{1,2},\s+\d{4})\s+at\s+(\d{1,2}:\d{2}\s+(?:am|pm))
  ```
- This time, tap the "Match Group" button and select "Match Group 2" (this extracts the time)
- Tap the "..." button
- Select "Set as Variable"
- Type "Reservation Time" as the variable name
- Tap "Done" to save

#### Step 18: Create Confirmation Task in Bonobo Actions
- Still inside the Confirmation Reminder If block:
- First, let's create tomorrow's date for the due date:
  - Tap the search bar and type "date"
  - Select "Current Date" from the Date category
  - Tap the "+" button to adjust the date
  - Enter "1" and select "Days" from the dropdown
  - Tap "Done" to create a date for tomorrow
  - Tap the "..." button
  - Select "Set as Variable"
  - Type "Tomorrow Date" as the variable name
  - Tap "Done" to save

- Now tap the search bar again and type "format date"
- Select the "Format Date" action from the Date category
- Tap "Date" and select "Variables"
- Choose "Tomorrow Date" from your variables
- For the format, select "Custom"
- Type "yyyy-MM-dd" as the format string (this is the ISO format required by Bonobo Actions)
- Tap "Done"
- Tap the "..." button
- Select "Set as Variable"
- Type "Formatted Tomorrow" as the variable name
- Tap "Done" to save

- Now tap the search bar and type "url"
- Select the "URL" action from the Web category
- In the URL field, start typing: "bonoboapp://x-callback-url/create?title=⚠️ CONFIRM SAILING RESERVATION - "
- Tap after the dash and space, then tap "Variables" and select "Boat Name"
- Continue the URL by typing: "&note=Log into https://embark.sailtime.com/ to confirm reservation for "
- Tap after "for ", then tap "Variables" and select "Reservation Date"
- Continue by typing: " at "
- Tap after "at ", then tap "Variables" and select "Reservation Time"
- Continue by typing: ". IMPORTANT: If not confirmed, reservation will be released!&priority=high&dueDate="
- Tap after "dueDate=", then tap "Variables" and select "Formatted Tomorrow"
- Tap "Done" to complete the URL

- Tap the search bar again and type "get contents"
- Select the "Get Contents of URL" action from the Web category
- The input URL should automatically be set to the previous URL action
- This will execute the task creation in Bonobo Actions

#### Step 19: Create Calendar Reminder
- Still inside the Confirmation Reminder If block:
- Tap the search bar and type "create calendar"
- Select the "Create Calendar Event" action from the Calendar category
- Tap "Calendar" and select your preferred calendar from the list
- Tap "Title" and type "⚠️ CONFIRM SAILING RESERVATION ⚠️"
- Tap "Location" and leave it blank (or add a relevant location if desired)
- Tap "Notes" and type "Log into https://embark.sailtime.com/ to confirm sailing reservation"
- Tap "All-day Event" to turn it OFF if it's selected
- Tap "Starts" to set the start time:
  - Tap "Date" and select "Current Date"
  - For the time, set it to 10:00 PM
  - Tap "Done" to set the start time
- Tap "Ends" to set the end time:
  - Tap "Date" and select "Current Date"
  - For the time, set it to 10:15 PM
  - Tap "Done" to set the end time
- Tap "Alert" and select "At time of event" (or whichever alert timing you prefer)
- Tap "Done" to complete the calendar event setup

- Now tap the search bar again and type "notification"
- Select the "Show Notification" action from the Notifications category
- In the notification text field, type "Created confirmation reminder for sailing on "
- Tap after "on " in the text field, then tap "Variables" and select "Reservation Date"
- Tap "Done" to complete the notification setup

### Part 4: Time Change Email Processing

#### Step 20: Set Up Time Change Processing
- After completing the confirmation reminder processing section, find the end of the If block that checks if "Email Type" equals "Confirmation Reminder"
- Tap the "Otherwise" section at the bottom of this If block
- This expands another Otherwise section for handling the next email type
- Tap the search bar at the bottom of the screen
- Type "if" and select the "If" action from the Scripting category
- Tap the "Condition" field to set up your condition
- For the left side, tap "Variables" and select "Email Type"
- In the middle dropdown, select "equals"
- For the right side, type "Time Change"
- This creates a new If block for handling time change emails

#### Step 21: Notify About Time Change
- Inside the "Email Type equals Time Change" If block:
- Tap the search bar at the bottom of the screen
- Type "notification" and select the "Show Notification" action from the Notifications category
- In the notification text field, type "Updating all future sailing times"
- Tap "Done" to complete the notification setup

#### Step 22: Find Future Events
- Still inside the Time Change If block:
- Tap the search bar at the bottom of the screen
- Type "find calendar" and select the "Find Calendar Events" action from the Calendar category
- Tap "Calendar" and select your preferred calendar from the list
- Tap "Add Filter" and select "Title"
- For the title filter, tap "is" and change it to "contains"
- Tap "Value" next to "contains" and select "Variables"
- Choose "Boat Name" from your variables list
- Tap "Add Filter" again and select "Start Date"
- For the start date filter, tap "is after" and ensure it remains selected
- Tap "Value" and select "Current Date" (to find events after today)
- Tap "Add Filter" again and select "End Date"
- For the end date, tap "is before" and ensure it's selected
- Tap "Value" and select "Calculate"
- In the calculator, select "Current Date"
- Tap "+" and enter "365" (to add 1 year)
- In the units dropdown, select "Days"
- Tap "Done" for the calculation
- Tap the "..." button in the top-right corner of the Find Calendar Events action
- Select "Set as Variable"
- Type "Events To Update" as the variable name
- Tap "Done" to save

#### Step 23: Check If Events Found
- Still inside the Time Change If block:
- Tap the search bar at the bottom of the screen
- Type "if" and select the "If" action from the Scripting category
- Tap the "Condition" field to set up your condition
- For the left side, tap "Calculate"
- In the calculator, tap "Variables" and select "Events To Update"
- Tap "Count" to count the number of events found
- Back in the condition editor, set the middle dropdown to "is greater than"
- For the right side, enter "0"
- Inside this If block (when events are found):
  - Tap the search bar and type "repeat"
  - Select the "Repeat with Each" action from the Scripting category
  - Tap "Item" and select "Variables"
  - Choose "Events To Update" from your variables list
  - This creates a Repeat loop that will process each event found

#### Step 24: Process Each Event
- Inside the Repeat with Each loop:
- Tap the search bar at the bottom of the screen
- Type "get details of calendar" and select the "Get Details of Calendar Event" action from the Calendar category
- Tap "Calendar Event" and select "Magic Variable"
- In the variables picker that appears, look for "Repeat Item" under the Current Item section (this represents the current event in the loop)
- Tap to select it
- Tap "Detail" and select "Start Date" from the dropdown
- Tap the "..." button in the top-right corner of this action
- Select "Set as Variable"
- Type "Event Start" as the variable name
- Tap "Done" to save the event's start date as a variable

#### Step 25: Update Based on Start Time
- Still inside the Repeat with Each loop:
- Tap the search bar at the bottom of the screen
- Type "if" and select the "If" action from the Scripting category
- Tap the "Condition" field to set up your condition
- For the left side, tap "Variables" and select "Event Start"
- Tap "Get Time" (to extract just the hour)
- If "Get Time" isn't available, tap "Format Date" and choose a format that shows just the hour
- In the middle dropdown, select "is between"
- For the "is between" values, enter "10" and "11" (to catch morning sails that start at 10:30am)
- Inside this If block (for morning sails):
  - Tap the search bar and type "calculate"
  - Select the "Calculate" action from the Scripting category
  - Tap "Variables" and select "Event Start"
  - Tap "+" to add time
  - Enter "7.5" and select "Hours" from the dropdown
  - Tap "Done" to complete the calculation
  - Tap the "..." button and select "Set as Variable"
  - Type "New End Time" as the variable name
  - Tap "Done" to save
  - Tap the search bar again and type "update calendar"
  - Select the "Update Calendar Event" action from the Calendar category
  - Tap "Calendar Event" and select "Magic Variable"
  - Select "Repeat Item" from the variables list
  - Tap "Field" and select "End Date"
  - Tap "Value" and select "Variables"
  - Choose "New End Time" from your variables list
  - Tap "Done" to complete the update

- Tap "Otherwise" at the bottom of this If statement to add an Otherwise section
- Inside the Otherwise section (for evening sails):
  - Tap the search bar and type "if"
  - Select the "If" action from the Scripting category
  - Tap the "Condition" field
  - For the left side, tap "Variables" and select "Event Start"
  - Tap "Get Time" (to extract just the hour)
  - In the middle dropdown, select "is between"
  - For the "is between" values, enter "18" and "19" (to catch evening sails around 6:30pm)
  - Inside this nested If block:
    - Tap the search bar and type "calculate"
    - Select the "Calculate" action
    - Tap "Variables" and select "Event Start"
    - Tap "+" to add time
    - Enter "16.5" and select "Hours" from the dropdown
    - Tap "Done" to complete the calculation
    - Tap the "..." button and select "Set as Variable"
    - Type "New End Time" as the variable name
    - Tap "Done" to save
    - Tap the search bar again and type "update calendar"
    - Select the "Update Calendar Event" action
    - Tap "Calendar Event" and select "Magic Variable"
    - Select "Repeat Item" from the variables list
    - Tap "Field" and select "End Date"
    - Tap "Value" and select "Variables"
    - Choose "New End Time" from your variables list
    - Tap "Done" to complete the update

#### Step 26: Finish Time Change Processing
- After the Repeat with Each loop ends (this will be at the same level as where you started the Repeat):
- Tap the search bar at the bottom of the screen
- Type "notification" and select the "Show Notification" action from the Notifications category
- In the notification text field, type "Updated "
- Tap after "Updated " in the text field, then tap "Calculate"
- In the calculator, tap "Variables" and select "Events To Update"
- Tap "Count" to count the number of updated events
- Back in the notification text, continue typing " events"
- Tap "Done" to complete the notification setup
- This notifies you of how many events were successfully updated

### Part 5: New Reservation Processing

#### Step 27: Set Up New Reservation Processing
- After completing the time change processing section, find the end of the If block that checks if "Email Type" equals "Time Change"
- Tap the "Otherwise" section at the bottom of this If block
- This expands the final Otherwise section for handling new reservation emails
- This section will process new reservations (the default case after checking for all other email types)

#### Step 28: Extract Reservation Information
- Inside the final Otherwise section (for new reservations):
- Tap the search bar at the bottom of the screen
- Type "match" and select the "Match Text" action from the Text category
- In the "Text" field, tap "Variables" and select "Shortcut Input"
- In the "Pattern" field, type or paste this exact regex pattern:
  ```
  reservation scheduled for\s+([A-Za-z]+\s+\d{1,2},\s+\d{4})\s+at\s+(\d{1,2}:\d{2}\s+(?:am|pm))
  ```
- After entering the pattern, tap "Done"
- Tap the "Match Group" button below the Pattern field
- In the list that appears, tap "Match Group 1" (this extracts the date)
- Tap the "..." button in the top-right corner of this action
- Select "Set as Variable"
- Type "Reservation Date" as the variable name
- Tap "Done" to save

- Now tap the search bar again and select "Match Text" again
- In the "Text" field, tap "Variables" and select "Shortcut Input"
- Use the exact same regex pattern as before:
  ```
  reservation scheduled for\s+([A-Za-z]+\s+\d{1,2},\s+\d{4})\s+at\s+(\d{1,2}:\d{2}\s+(?:am|pm))
  ```
- This time, tap the "Match Group" button and select "Match Group 2" (this extracts the time)
- Tap the "..." button
- Select "Set as Variable"
- Type "Reservation Time" as the variable name
- Tap "Done" to save

#### Step 29: Check If Match Found
- Still in the new reservation section:
- Tap the search bar at the bottom of the screen
- Type "if" and select the "If" action from the Scripting category
- Tap the "Condition" field to set up your condition
- For the left side, tap "Variables" and select "Reservation Date"
- In the middle dropdown, select "has any value"
- This creates an If block that ensures we only proceed if the date extraction was successful
- All the remaining steps will be placed inside this If block

#### Step 30: Combine Date and Time
- Inside the "Reservation Date has any value" If block:
- Tap the search bar at the bottom of the screen
- Type "date" and select the "Date" action from the Scripting category
- This adds a Date action that can create a date from various formats
- Tap "Custom" or "Custom Format" 
- In the format selector that appears, tap "Combine Date and Time"
- For the Date part, tap "Variables" and select "Reservation Date"
- For the Time part, tap "Variables" and select "Reservation Time"
- Tap "Done" to create the combined date/time
- Tap the "..." button in the top-right corner of this action
- Select "Set as Variable"
- Type "Start Time" as the variable name
- Tap "Done" to save the combined date and time as a variable

#### Step 31: Determine Sail Type
- Still inside the "Reservation Date has any value" If block:
- Tap the search bar at the bottom of the screen
- Type "if" and select the "If" action from the Scripting category
- Tap the "Condition" field to set up your condition
- For the left side, tap "Variables" and select "Reservation Time"
- In the middle dropdown, select "contains"
- For the right side, type "10:30 am" (to identify morning sails)
- Inside this If block (for morning sails):
  - Tap the search bar and type "text"
  - Select the "Text" action from the Scripting category
  - Type "Day Sail" in the text field
  - Tap the "..." button in the top-right corner
  - Select "Set as Variable"
  - Type "Sail Type" as the variable name
  - Tap "Done" to save
  - Tap the search bar again and type "calculate"
  - Select the "Calculate" action from the Scripting category
  - Tap "Variables" and select "Start Time"
  - Tap "+" to add time
  - Enter "7.5" and select "Hours" from the dropdown
  - Tap "Done" to complete the calculation
  - Tap the "..." button and select "Set as Variable"
  - Type "End Time" as the variable name
  - Tap "Done" to save

- Tap "Otherwise" at the bottom of this If statement to add an Otherwise section
- Inside the Otherwise section (for evening/overnight sails):
  - Tap the search bar and type "text"
  - Select the "Text" action from the Scripting category
  - Type "Overnight Sail" in the text field
  - Tap the "..." button in the top-right corner
  - Select "Set as Variable"
  - Type "Sail Type" as the variable name
  - Tap "Done" to save
  - Tap the search bar again and type "calculate"
  - Select the "Calculate" action from the Scripting category
  - Tap "Variables" and select "Start Time"
  - Tap "+" to add time
  - Enter "16.5" and select "Hours" from the dropdown
  - Tap "Done" to complete the calculation
  - Tap the "..." button and select "Set as Variable"
  - Type "End Time" as the variable name
  - Tap "Done" to save

#### Step 32: Check for Existing Events
- Still inside the "Reservation Date has any value" If block:
- Tap the search bar at the bottom of the screen
- Type "find calendar" and select the "Find Calendar Events" action from the Calendar category
- Tap "Calendar" and select your preferred calendar from the list
- Tap "Add Filter" and select "Title"
- For the title filter, tap "is" and change it to "contains"
- Tap "Value" next to "contains" and select "Text"
- Type "Sailing: " and then tap "Variables" and select "Boat Name"
- This creates a title filter for "Sailing: Time Out" (or whatever your boat name is)
- Tap "Add Filter" again and select "Start Date"
- For the start date filter, tap "Value" and select "Variables"
- Choose "Start Time" from your variables list
- Tap "Add Filter" again and select "End Date"
- For the end date, tap "Value" and select "Calculate"
- In the calculator, select "Variables" and choose "Start Time"
- Tap "+" and enter "1" 
- In the units dropdown, select "Minutes"
- Tap "Done" for the calculation
- This creates a 1-minute window to find events that start at exactly the same time
- Tap the "..." button in the top-right corner of the Find Calendar Events action
- Select "Set as Variable"
- Type "Existing Events" as the variable name
- Tap "Done" to save

#### Step 33: Create Event If None Exists
- Still inside the "Reservation Date has any value" If block:
- Tap the search bar at the bottom of the screen
- Type "if" and select the "If" action from the Scripting category
- Tap the "Condition" field to set up your condition
- For the left side, tap "Calculate"
- In the calculator, tap "Variables" and select "Existing Events"
- Tap "Count" to count the number of events found
- Back in the condition editor, set the middle dropdown to "equals"
- For the right side, enter "0"
- This creates an If block that only runs when no matching events are found
- All the following steps will be inside this "No existing events" If block

#### Step 34: Calculate Alert Times
- Inside the "Existing Events count equals 0" If block:
- Tap the search bar at the bottom of the screen
- Type "date" and select the "Date" action from the Scripting category
- Tap "Custom" or "Adjust Date"
- Tap "Variables" and select "Start Time"
- Tap the "-" button to subtract time
- Enter "7" and select "Days" from the dropdown
- Tap "At" and set the time to 10:00 PM
- Tap "Done" to create the date for the week-before alert
- Tap the "..." button and select "Set as Variable"
- Type "Week Alert" as the variable name
- Tap "Done" to save

- Repeat this process to create the following alert variables:
  - For "Three Day Alert":
    - Subtract 3 days from "Start Time"
    - Set time to 10:00 PM
  - For "Two Day Alert":
    - Subtract 2 days from "Start Time"
    - Set time to 10:00 PM
  - For "Packing Alert":
    - Subtract 18 hours from "Start Time"
    - Leave the time as is (no adjustment needed)

- For each alert time, follow these steps:
  - Tap the search bar and type "date"
  - Select the "Date" action
  - Tap "Custom" or "Adjust Date"
  - Tap "Variables" and select "Start Time"
  - Tap "-" and enter the appropriate value (7 days, 3 days, 2 days, or 18 hours)
  - For day alerts, set the time to 10:00 PM
  - Tap "Done" to create the date
  - Tap the "..." button
  - Select "Set as Variable"
  - Type the appropriate variable name ("Week Alert", "Three Day Alert", "Two Day Alert", or "Packing Alert")
  - Tap "Done" to save

#### Step 35: Create Calendar Event
- Still inside the "Existing Events count equals 0" If block:
- Tap the search bar at the bottom of the screen
- Type "create calendar" and select the "Create Calendar Event" action from the Calendar category
- Tap "Calendar" and select your preferred calendar from the list
- Tap "Title" and type "Sailing: "
- Tap after "Sailing: " and tap "Variables"
- Select "Boat Name" from the variables list
- Tap again after the boat name and type " - "
- Tap after the dash and tap "Variables"
- Select "Sail Type" from the variables list
- Tap "Location" and tap "Variables"
- Select "Location" from the variables list
- Tap "Notes" and type "SailTime Reservation at Horn Point Marina"
- Tap "All-day Event" to turn it OFF if it's selected
- Tap "Starts" to set the start time:
  - Tap "Date" and select "Variables"
  - Choose "Start Time" from the variables list
- Tap "Ends" to set the end time:
  - Tap "Date" and select "Variables"
  - Choose "End Time" from the variables list

- Now to add alerts, tap "Alert" and select "Custom"
- Tap "Date" and select "Variables"
- Choose "Week Alert" from the variables list
- Tap "Add Alert" to add another alert
- Tap "Date" and select "Variables"
- Choose "Three Day Alert" from the variables list
- Tap "Add Alert" to add another alert
- Tap "Date" and select "Variables"
- Choose "Two Day Alert" from the variables list
- Tap "Add Alert" to add another alert
- Tap "Date" and select "Variables"
- Choose "Packing Alert" from the variables list
- Tap "Done" to complete the calendar event setup

#### Step 36: Create Preparation Task in Bonobo Actions
- Still inside the "Existing Events count equals 0" If block:
- First, let's create a variable for the day before the sail:
  - Tap the search bar and type "date"
  - Select the "Date" action from the Scripting category
  - Tap "Custom" or "Adjust Date"
  - Tap "Variables" and select "Start Time"
  - Tap "-" and enter "1"
  - Select "Days" from the dropdown
  - Tap "Done" to create the date
  - Tap the "..." button
  - Select "Set as Variable"
  - Type "Day Before Sail" as the variable name
  - Tap "Done" to save

- Now format the date for Bonobo Actions:
  - Tap the search bar and type "format date"
  - Select the "Format Date" action from the Date category
  - Tap "Date" and select "Variables"
  - Choose "Day Before Sail" from your variables
  - For the format, select "Custom"
  - Type "yyyy-MM-dd" as the format string (ISO format required by Bonobo Actions)
  - Tap "Done"
  - Tap the "..." button
  - Select "Set as Variable"
  - Type "Formatted Day Before" as the variable name
  - Tap "Done" to save

- Create the task in Bonobo Actions:
  - Tap the search bar and type "url"
  - Select the "URL" action from the Web category
  - In the URL field, start typing: "bonoboapp://x-callback-url/create?title=Prepare for "
  - Tap after "for ", then tap "Variables" and select "Sail Type"
  - Continue typing: " - "
  - Tap after "- ", then tap "Variables" and select "Location"
  - Continue typing: "&note=Sailing information: "
  - Tap after "information: ", then tap "Variables" and select "Reservation Date"
  - Continue typing: " at "
  - Tap after "at ", then tap "Variables" and select "Reservation Time"
  - Continue typing: ". Pack gear, check weather, and prepare food.&priority=medium&dueDate="
  - Tap after "dueDate=", then tap "Variables" and select "Formatted Day Before"
  - Tap "Done" to complete the URL

- Tap the search bar again and type "get contents"
- Select the "Get Contents of URL" action from the Web category
- The input URL should automatically be set to the previous URL action
- This will execute the task creation in Bonobo Actions "Format Date" action with "Start Time" - 1 day in ISO format
- Add "Get Contents of URL" action to execute the task creation

#### Step 37: Show Success Notification
- Add "Show Notification" action
- Content: "Added sailing on " + variable "Reservation Date" + " to calendar with Bonobo Actions tasks"

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
   - Account: Your Gmail account
   - Sender contains: "embark.sailtime.com"
   - Subject contains: Leave blank to catch all SailTime emails
5. Tap "Next"
6. Add action "Run Shortcut"
7. Select your SailTime processing shortcut
8. If testing, leave "Ask Before Running" enabled
9. For production use, disable "Ask Before Running"
10. Tap "Done"

## Bonobo Actions Integration Notes

### URL Scheme Basics
Bonobo Actions supports URL scheme automation with the following format:
```
bonoboapp://x-callback-url/[command]?[parameters]
```

### Key Commands
1. **Create Task**: bonoboapp://x-callback-url/create
   Parameters:
   - title: Task title (required)
   - note: Task notes (optional)
   - dueDate: Due date in ISO format (optional)
   - priority: low/medium/high (optional)

2. **Search Tasks**: bonoboapp://x-callback-url/search
   Parameters: 
   - query: Search term (required)

3. **Complete Task**: bonoboapp://x-callback-url/complete
   Parameters:
   - id: Task ID (required)

### Implementation Details
- When creating tasks via Shortcuts, use the "URL" action followed by "Get Contents of URL"
- For date parameters, use "Format Date" action with ISO format (YYYY-MM-DD)
- Use URL encoding for special characters in parameters

## Testing Recommendations

1. Forward yourself sample emails of each type to test
2. Run the shortcut manually on these test emails
3. Verify calendar events and Bonobo Actions tasks are created/updated correctly
4. Once confirmed working, enable the automation to run without asking

## Important Notes

- This shortcut relies on regex patterns that match specific email formats
- If SailTime changes their email format, you may need to update the patterns
- Test after any SailTime system updates to ensure continued functionality
- Bonobo Actions URL schemes may require adjustment based on your specific setup

## Version History

- v2.2 (20250426): Updated to use Bonobo Actions instead of iOS Reminders
- v2.1 (20250426): Updated file naming convention
- v2.0 (20250425): Complete revision with detailed step-by-step instructions
- v1.1 (20250425): Updated with more detailed instructions
- v1.0 (20250424): Initial documentation