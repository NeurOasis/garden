# CIT_SailPlan_20250426

## 👤 User Information
```
Name: [User's Name]
Email: [User's Email Address]
Boat Name: Time Out
Marina: Horn Point Marina, 105 Eastern Ave, Annapolis, MD
SailTime Base: Annapolis
```

## 🔧 Technical Environment
```
Device: iPhone 16 Pro (latest iOS non-beta release)
Email Provider: Gmail
Task Manager: Bonobo Actions App
Calendar: Apple Calendar
Automation Tools: iOS Shortcuts
```

## 📨 SailTime Email Configuration
```
Email Domain: embark.sailtime.com
From Address: embark@embark.sailtime.com
Key Subject Lines:
- New Reservation: "You have an Embark reservation scheduled for"
- Cancellation: "Reservation Canceled"
- Time Change: "Boat Reservation Time Change"
- Confirmation: "Your Embark Reservation Confirmation Has Opened"
```

## ⚙️ Automation Requirements
```
Calendar Management:
- Create events: Yes
- Delete canceled events: Yes
- Update on time changes: Yes
- Preferred alerts: 7 days, 3 days, 2 days, 18 hours before

Task Management:
- Create preparation tasks: Yes (in Bonobo Actions)
- Create confirmation reminders: Yes
- Priority level: Medium for prep tasks, High for confirmations

Sail Types:
- Day Sail: 10:30am start, 7.5 hour duration
- Overnight Sail: 6:30pm start, 16.5 hour duration

Duplicate Prevention:
- Check before creating: Yes
- Strategy: Title and date match
```

## 📝 Special Instructions
```
Bonobo Actions Integration:
- Use URL scheme: bonoboapp://x-callback-url/[command]?[parameters]
- Date format required: yyyy-MM-dd (ISO format)
- Key commands: create, search, complete
- Parameters for tasks:
  - title: Task title
  - note: Task details
  - dueDate: Due date in ISO format
  - priority: low/medium/high

Confirmation Window:
- Confirmation needed several days before sailing
- Critical to confirm or reservation is released

Time Change Handling:
- Update all future events automatically
- Handle both morning and evening sail times
```

## 📄 Reference Email Formats
```
New Reservation Format:
"You have an Embark reservation scheduled for [Month Day, Year] at [Time]"

Cancellation Format:
"SailTime would like to inform you that your boat name [Boat Name] reservation on [Month DD YYYY HH:MMam/pm] date has been canceled."

Confirmation Reminder Format:
"Embark would like to inform you that the time to confirm your reservation on [Day, Month Day, Year] at [Time] has arrived."

Time Change Format:
"Boat '[Boat Name]' reservation time has been changed to morning sailtime from [Time] - [Time] to [Time] - [Time] and for the evening sail time from [Time] - [Time] to [Time] to [Time]"
```

## 🚢 Shortcut Components
The SailPlan shortcut has four main sections:
1. **Email Type Detection**: Identifies what kind of email was received
2. **Cancellation Processing**: Removes calendar events and tasks
3. **Confirmation Processing**: Creates reminders to confirm reservation
4. **Time Change Processing**: Updates calendar event durations
5. **New Reservation Processing**: Creates calendar events and preparation tasks

## 📱 Implementation Details
```
Shortcut Name: SailTime Processing
Trigger: Email from embark.sailtime.com
Structure: See SailPlan_Shortcut Structure Ref_v2.2_20250426.md
Implementation: See SailPlan_Shortcut Builder_v2.2_20250426.md
```

## 🕒 Implementation Status
```
Date Created: April 24, 2025
Last Updated: April 26, 2025
Current Status: Implementation testing
Linked Documents:
- SailPlan_Shortcut Builder_v2.2_20250426.md
- SailPlan_Shortcut Structure Ref_v2.2_20250426.md

Known Issues:
- Regex patterns need testing with actual emails
- Bonobo Actions task ID extraction needs refinement

Desired Improvements:
- Add support for reservation changes (not just time changes)
- Improve error handling and notifications
```

## 📋 Update History
```
20250426: Updated to use Bonobo Actions instead of iOS Reminders
20250426: Updated documentation to use markdown format
20250425: Added implementation details and step-by-step instructions
20250424: Initial template creation
```

## 🤖 Note for Claude
- This template provides essential context for the SailPlan project
- Use extremely specific and granular instructions when describing iOS Shortcuts steps
- Always format reference materials and documentation in markdown
- Refer to this CIT when continuing work on the SailPlan project in new conversations