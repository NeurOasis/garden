# SailTime Google Apps Script Implementation Guide

This guide walks you through setting up the Google Apps Script to process SailTime reservation emails and create calendar events automatically.

## Step 1: Create Gmail Label and Filter

First, let's set up the Gmail label and filter to identify SailTime emails:

1. Go to Gmail (mail.google.com)
2. On the left sidebar, scroll down to the "Labels" section
3. Click "Create new label"
4. Enter "Sail Away/Embark" as the label name
5. Click "Create"

Now, set up a filter to automatically apply this label:

1. In the Gmail search bar, type: `from:embark@embark.sailtime.com`
2. Click the search options dropdown (down arrow) in the search bar
3. Click "Create filter"
4. Check "Apply the label" and select "Sail Away/Embark" from the dropdown
5. Optionally check "Never send to Spam" to ensure you don't miss important emails
6. Click "Create filter"

## Step 2: Create a Google Apps Script Project

1. Go to [Google Apps Script](https://script.google.com)
2. Click "New Project" to create a blank project
3. Rename the project by clicking on "Untitled project" at the top and entering "SailTime Processor"
4. Delete any default code in the editor (usually it starts with `function myFunction() {`)

## Step 3: Add the Script Code

1. Copy the entire script code from the previous artifact
2. Paste it into the script editor, replacing any existing code
3. Click File > Save or press Ctrl+S (Cmd+S on Mac) to save the project

## Step 4: Configure the Script

The script has a configuration section at the top that you can customize. We've already updated it to use "Sail Away/Embark" as the label:

```javascript
const CONFIG = {
  emailLabel: 'Sail Away/Embark',   // Gmail label for SailTime emails
  processedLabel: 'SailTimeProcessed',  // Label to mark processed emails
  boatName: 'Time Out',            // Your boat's name
  location: 'Horn Point Marina, 105 Eastern Ave, Annapolis, MD',  // Marina location
  daySailDuration: 7.5,            // Duration in hours for day sails
  overnightDuration: 16.5,         // Duration in hours for overnight sails
  calendarId: 'primary',           // Calendar ID (use 'primary' for your main calendar)
  // Calendar alerts in minutes before event
  calendarAlerts: [
    7 * 24 * 60,    // 7 days
    3 * 24 * 60,    // 3 days
    2 * 24 * 60,    // 2 days
    18 * 60         // 18 hours
  ]
};
```

Modify any of these settings if needed:
- `processedLabel`: The label applied to emails after they're processed
- `boatName`: Your boat's name (currently set to "Time Out")
- `location`: The marina location
- `daySailDuration` and `overnightDuration`: Duration in hours for different sail types
- `calendarId`: Your calendar ID (use "primary" for your main calendar)
- `calendarAlerts`: Reminder times in minutes before the event

## Step 5: Set Up the Trigger

To make the script run automatically every hour:

1. In the script editor, select the function dropdown at the top (just above the code)
2. Select "setupTrigger" from the dropdown
3. Click the Run button (▶️) or press Ctrl+R (Cmd+R on Mac)
4. When prompted, click "Review permissions"
5. Select your Google account
6. You might see a warning that "Google hasn't verified this app" - click "Advanced" and then "Go to SailTime Processor (unsafe)"
7. Click "Allow" to grant the necessary permissions

The script now has a time-based trigger that will run hourly to check for new SailTime emails.

## Step 6: Test the Script

Let's manually run the script to test it with any existing emails:

1. In the function dropdown, select "processSailTimeEmails"
2. Click the Run button (▶️)
3. To see what happened, click View > Logs in the menu or press Ctrl+Enter (Cmd+Enter on Mac)
4. The logs will show information about emails processed and calendar events created

## Step 7: Verify Results

After running the script:

1. Check your Gmail to see if the "SailTimeProcessed" label was applied to any emails
2. Check your Google Calendar for any new sailing events
3. Verify that the events have the correct title, date, time, duration, and reminders

## Troubleshooting

If the script doesn't work as expected, here are some things to check:

1. **Script Errors**: 
   - Check the execution logs for error messages
   - Common issues include permission problems or Gmail label not found

2. **No Emails Found**:
   - Make sure the "Sail Away/Embark" label exists and is applied to your SailTime emails
   - Check the spelling of the label name in the CONFIG object

3. **Date/Time Extraction Issues**:
   - The script uses several patterns to extract dates and times
   - If extraction fails, you may need to modify the regex patterns to match your specific email format

4. **Calendar Event Issues**:
   - Check that the script has permission to access your calendar
   - Verify the calendarId in the CONFIG object (use "primary" for your main calendar)

## Monitoring and Maintenance

The script will run automatically every hour. To monitor its activity:

1. In the Google Apps Script editor, click on "Triggers" in the left sidebar
2. You'll see the hourly trigger for the "processSailTimeEmails" function
3. Click "Executions" to see a history of when the script ran and if there were any errors

If you need to make changes to the script:

1. Edit the code in the script editor
2. Save the changes (Ctrl+S or Cmd+S)
3. The updated code will be used the next time the trigger runs

The script includes detailed logging, so you can always check the execution logs to see what it did.