# 📊 SailPlan Shortcut Structure Reference v2.2

```
┌─ Shortcut Start
│  ├─ When this shortcut runs (Initial Step)
│  ├─ Get Shortcut Input with "Get" action
│  ├─ Set Boat Name to "Time Out" as Variable
│  └─ Set Location to "Horn Point Marina..." as Variable
│
├─ EMAIL TYPE DETECTION
│  │
│  ├─ If (Input contains "Reservation Canceled")
│  │  └─ Set Email Type to "Cancellation"
│  │
│  └─ Otherwise
│     ├─ If (Input contains "Confirmation Has Opened")
│     │  └─ Set Email Type to "Confirmation Reminder"
│     │
│     └─ Otherwise
│        ├─ If (Input contains "Boat Reservation Time Change")
│        │  └─ Set Email Type to "Time Change"
│        │
│        └─ Otherwise
│           └─ Set Email Type to "New Reservation"
│
├─ MAIN PROCESSING SECTION (Separate flow, not nested)
│  │
│  ├─ If (Email Type equals "Cancellation")
│  │  ├─ Match Text to extract cancellation date
│  │  ├─ Format Date from Match Group 1
│  │  ├─ Find Calendar Events containing Boat Name
│  │  ├─ If (Events To Delete count > 0)
│  │  │  ├─ Delete Calendar Events
│  │  │  └─ Show Notification: "Removed canceled sailing event"
│  │  │
│  │  ├─ Use URL scheme to search Bonobo Actions
│  │  └─ If (Search Results contains Canceled Date Text)
│  │     ├─ Use URL scheme to complete task in Bonobo Actions
│  │     └─ Show Notification: "Removed preparation task..."
│  │
│  └─ Otherwise
│     ├─ If (Email Type equals "Confirmation Reminder")
│     │  ├─ Match Text to extract reservation date (Group 1)
│     │  ├─ Match Text to extract reservation time (Group 2)
│     │  ├─ Calculate Tomorrow's Date (Current Date + 1 day)
│     │  ├─ Format Tomorrow's Date in ISO format for Bonobo
│     │  ├─ Use URL scheme to create task in Bonobo Actions
│     │  ├─ Create Calendar Event (10:00 PM reminder with alert)
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
│           ├─ Match Text to extract reservation date (Group 1)
│           ├─ Match Text to extract reservation time (Group 2)
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
│           │     ├─ Calculate day before sail date
│           │     ├─ Format date for Bonobo Actions
│           │     ├─ Use URL scheme to create task in Bonobo Actions
│           │     └─ Show Notification: "Added sailing event..."
│           │     Otherwise
│           │     └─ Show Notification: "Event already exists..."
│           │
└─ Shortcut End
```

## 🔑 Key Structure Elements

1. **Two-Part Structure**:
   - First determine the email type (EMAIL TYPE DETECTION)
   - Then process based on that type (MAIN PROCESSING SECTION)

2. **Email Type Detection**:
   - Uses nested If/Otherwise statements
   - Checks for specific text in the email content
   - Sets the "Email Type" variable to one of four values

3. **Main Processing Section**:
   - Separate from (not nested within) the email type detection
   - Uses If/Otherwise statements based on the "Email Type" variable
   - Each branch handles a specific email type

4. **Bonobo Actions Integration**:
   - Uses URL scheme calls through "URL" and "Get Contents of URL" actions
   - Formats dates in ISO format (YYYY-MM-DD) for compatibility
   - Different URL paths for different operations (create, search, complete)

## ⚠️ Critical Implementation Notes

- The EMAIL TYPE DETECTION and MAIN PROCESSING SECTION are sequential, not nested
- Proper variable handling is essential for data flow between sections
- Regex patterns must exactly match email formats
- Date formatting must be precise for both Calendar and Bonobo Actions

## 📱 Automation Configuration

- Trigger: Email
- Account: Gmail
- Sender contains: "embark.sailtime.com"
- Action: Run Shortcut (SailTime Processing)
- For testing: Enable "Ask Before Running"
- For production: Disable "Ask Before Running"