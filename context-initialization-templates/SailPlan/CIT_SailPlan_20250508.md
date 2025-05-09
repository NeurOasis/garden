# CIT_SailPlan_20250508

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
Calendar: Google Calendar
Automation: Google Apps Script
```

## 📨 SailTime Email Configuration
```
Email Domain: embark.sailtime.com
From Address: embark@embark.sailtime.com
Gmail Label: Sail Away/Embark
Key Subject Lines:
- New Reservation: "Embark Reservation Created"
- Cancellation: "Reservation Canceled"
- Time Change: "Boat Reservation Time Change"
- Confirmation: "Your Embark Reservation Confirmation Has Opened"
```

## ⚙️ Automation Solution
```
Primary Automation: Google Apps Script
Script Name: SailPlan_Processor_v4.0_20250508.js
Trigger Schedule: 3 times daily (9 AM, 3 PM, 9 PM)
Processing Flow:
- Monitors Gmail for labeled SailTime emails 
- Creates Google Calendar events
- Sends task creation links via email
- Handles reservations, cancellations and confirmations
- Avoids duplicates with smart detection

Marina Access Codes:
- Ice Box Code: 2323
- Bathroom Code: 001985

Task Creation:
- Emails contain links to create Bonobo Actions tasks
- Tasks include comprehensive packing lists
- Separate tasks for packing and confirmation
```

## 🔄 Script Architecture

Version 4.0 uses a streamlined approach with these key components:

1. **Configuration Section**
   - All settings consolidated in one CONFIG object
   - Easily customizable patterns and messages
   - Complete packing lists included

2. **Email Processing**
   - Targeted regex patterns for date extraction
   - Each email type has dedicated processing function
   - Automated email labeling and marking as read

3. **Calendar Integration**
   - Smart event creation with multiple alerts
   - Duration based on sail type (day/overnight)
   - Duplicate prevention system
   - Includes marina access codes

4. **Task Management**
   - Hybrid approach using email + direct links
   - Modern HTML email templates with clear instructions
   - One-click links to Bonobo Actions
   - Copy-pastable packing lists

5. **Trigger System**
   - Scheduled execution 3x daily
   - Maintains processing history
   - Error logging for troubleshooting

## 📋 Packing Lists

### Day Sail Packing List
```
DUFFEL BAG:
- Life jacket (mine)
- Zach's life jacket
- Extra beach towel
- External monitor
- Extra solar battery
- Extra water bottle
- Land shoes
- Chappy wrap blanket
- Sailing safety tether
- Spring line trainer
- Dop kit containing:
  -- Deodorant
  -- Solid cologne
  -- Shampoo
  -- Dr. Bronners soap
  -- Body wash

DAY PACK:
- Sunglasses
- Hat
- Hat clip
- Croakies
- Sailing gloves
- Multitool
- Knife
- Nav setup
- Nav kit
- Sailing logs
- Notebook
- Pencil
- Wax pencil
- Pen
- Multi-charger
- Power adapter
- Solar battery
- Solar battery clamp
- Flashlight
- Hand bearing compass
- Packable cooler bag
- Hand towel
- Beach towel
- Hand sanitizer
- Dop kit containing:
  -- Sunscreen
  -- First aid kit
  -- Moleskine
  -- Blister balm
  -- Seasickness pills
  -- Arnica cream
  -- Foot cream
  -- Moisturizer
```

### Overnight Sail Packing List
```
DUFFEL BAG:
- Life jacket (mine)
- Zach's life jacket
- Extra beach towel
- External monitor
- Extra solar battery
- Extra water bottle
- Land shoes
- Chappy wrap blanket
- Sailing safety tether
- Dop kit containing:
  -- Deodorant
  -- Solid cologne
  -- Shampoo
  -- Dr. Bronners soap
  -- Body wash
- Extra clothes for overnight
- Sleeping bag
- Pillow

DAY PACK:
[Same as day sail list]
```

## 📄 Reference Email Formats
```
New Reservation Email:
"You have an Embark reservation scheduled for May 06, 2025 at 10:30 am."

Cancellation Email:
"SailTime would like to inform you that your boat name [Boat Name] reservation on [Month DD YYYY HH:MMam/pm] date has been canceled."

Confirmation Reminder Email:
"Embark would like to inform you that the time to confirm your reservation on [Day, Month Day, Year] at [Time] has arrived."

Time Change Email:
"Boat '[Boat Name]' reservation time has been changed to morning sailtime from [Time] - [Time] to [Time] - [Time] and for the evening sail time from [Time] - [Time] to [Time] to [Time]"
```

## 🔍 Key Regex Patterns
```javascript
// Reservation pattern
scheduled for\\s+([A-Za-z]+\\s+\\d{1,2}(?:,|)\\s+\\d{4})\\s+at\\s+(\\d{1,2}:\\d{2}\\s*(?:am|pm))

// Cancellation pattern
reservation on\\s+([A-Za-z]+\\s+\\d{1,2}(?:,|)\\s+\\d{4})\\s+at\\s+(\\d{1,2}:\\d{2}\\s*(?:am|pm))

// Confirmation pattern
confirm your reservation on\\s+([A-Za-z]+(?:,|)\\s+[A-Za-z]+\\s+\\d{1,2}(?:,|)\\s+\\d{4})\\s+at\\s+(\\d{1,2}:\\d{2}\\s*(?:am|pm))
```

## 📱 Bonobo Actions Integration
```
URL Scheme: mskactions://create
Task Types:
- Packing task (Medium priority)
- Confirmation task (High priority)

Integration Method:
- HTML emails with one-click buttons
- Copy-pastable task details
- Pre-populated titles and content
```

## 🕒 Implementation Status
```
Date Created: April 24, 2025
Last Updated: May 08, 2025
Current Status: Fully Implemented (v4.0)
Linked Documents:
- SailPlan_Processor_v4.0_20250508.js (Consolidated Google Apps Script)

Features Implemented:
- Automated email processing with Gmail labels
- Calendar event creation with access codes
- Email-based task creation for Bonobo Actions
- Comprehensive packing lists for day/overnight sails
- Duplicate detection
- Cancellation handling
- Confirmation reminders
- Streamlined architecture to prevent CONFIG reference errors
```

## 📋 Update History
```
20250508: v4.0 Released - Streamlined architecture with modern HTML emails and better error handling
20250507: v2.1 Released - Combined script into single file to fix CONFIG reference error
20250507: v2.0 Released - Completed Google Apps Script with email-based task creation
20250505: Added comprehensive packing lists and access codes
20250504: Switched to Google Apps Script approach
20250501: Updated implementation to use native iOS Reminders instead of Bonobo Actions
20250426: Updated naming convention to comply with VC standards
20250425: Added implementation details and step-by-step instructions
20250424: Initial template creation
```

## 🤖 Note for Claude
- This template provides essential context for the SailPlan project
- The solution uses Google Apps Script instead of iOS Shortcuts
- Tasks are created via email links to Bonobo Actions
- Packing lists are organized by bag type with specific items
- Marina access codes are included in calendar events
- Version 4.0 has streamlined architecture and modern HTML emails
