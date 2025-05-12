# CIT_SailPlan_20250511

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
Task Manager: iOS Reminders
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
- Create preparation tasks: Yes (in iOS Reminders)
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
Reminders Integration:
- Use iOS native Reminders app for tasks
- Key parameters for tasks:
  - title: Task title
  - notes: Task details
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
Structure: See SailPlan_Shortcut Structure Ref_v5.1_20250504.md
Implementation: See SailPlan_Shortcut Builder_v5.1_20250504.md
```

## 🕒 Implementation Status
```
Date Created: April 24, 2025
Last Updated: May 11, 2025
Current Status: Implementation testing
Linked Documents:
- SailPlan_Shortcut Builder_v5.1_20250504.md
- SailPlan_Shortcut Structure Ref_v5.1_20250504.md

Known Issues:
- Regex patterns need testing with actual emails
- iOS Reminders task ID extraction needs refinement

Desired Improvements:
- Add support for reservation changes (not just time changes)
- Improve error handling and notifications
```

## 📋 Update History
```
20250511: Updated to reflect current standards for quick reference cards (4x6 index cards)
20250510: Updated to use iOS Reminders instead of Bonobo Actions
20250504: Updated to v5.1 with improved regex patterns and robustness
20250501: Updated to standardize naming conventions
20250426: Updated documentation to use markdown format
20250425: Added implementation details and step-by-step instructions
20250424: Initial template creation
```

## 🤖 Note for Claude
- This template provides essential context for the SailPlan project
- Use extremely specific and granular instructions when describing iOS Shortcuts steps
- Always format reference materials and documentation in markdown
- Remember that quick reference materials should be designed for 4x6 index cards
- Refer to this CIT when continuing work on the SailPlan project in new conversations