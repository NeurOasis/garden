# Automated Shortcut: Transfer Reminders to Bonobo Actions

This guide explains how to create an iOS shortcut automation that regularly checks for new reminders, transfers them to Bonobo Actions, and then deletes the original reminders from the Reminders app.

## Overview

Since the "When Reminder is Added" trigger isn't available, we'll use a time-based automation that:
1. Runs automatically every few minutes
2. Checks for all recent, incomplete reminders
3. Creates a new Action in Bonobo Actions for each reminder found
4. Deletes the original reminders from the Reminders app

## Requirements

- iPhone 16 Pro with latest iOS version
- Shortcuts app (pre-installed on iOS)
- Reminders app (Apple's native app)
- Bonobo Actions app (installed and set up)

## Step 1: Create a Time-Based Automation

Since "When Reminder is Added" isn't available, we'll use a time-based trigger:

1. Open the Shortcuts app on your iPhone
2. Tap the "Automation" tab at the bottom of the screen
3. Tap the "+" icon in the top right corner
4. Select "Create Personal Automation"
5. Select "Time of Day" as your trigger
6. Choose "Repeat" and set it to "Every 5 Minutes" 
   - This will run the automation regularly to check for new reminders
   - You can adjust the interval based on how quickly you want reminders processed
7. Make sure "Run Immediately" is selected (not "Run After Confirmation")
8. Toggle OFF "Notify When Run" to reduce notification clutter
9. Tap "Next" to continue

## Step 2: Configure the Shortcut Actions

Now you'll need to build the sequence of actions that will process the reminder:

1. **Find Reminders**
   - Add the "Find Reminders" action
   - Set it to find "All" reminders 
   - Add a filter for "Is Not Completed"
   - Optionally, add a filter for "Due Date is Set"
   - Sort by "Date Created" with "Newest First"
   - Limit to "1 Item" to get only the most recently created reminder

2. **Process Each Reminder**
   - Add a "Repeat with Each" action
   - This will allow processing of each reminder found

3. **Extract Reminder Details** (inside the Repeat loop)
   - Add "Get Details of Reminder" action
   - Select "Name" from the dropdown to get the reminder title
   - Add another "Get Details of Reminder" action
   - Select "Notes" from the dropdown to get any notes
   - Add a third "Get Details of Reminder" action
   - Select "Due Date" from the dropdown to get any scheduled date/time

4. **Format the Due Date** (inside the Repeat loop)
   - Add an "If" action that checks if the Due Date variable "has any value"
   - Inside the "If" block, add "Format Date" action
   - Set the Format Date action to use the Due Date variable
   - Try using "Short Date" format instead of custom format
   - This will use a simpler date format that Bonobo Actions might accept better
   - Alternatively, try these formats:
     * "MM/dd/yyyy"
     * "yyyy-MM-dd" (without the time component)
     * "MM/dd/yyyy HH:mm"

5. **Create Action in Bonobo** (inside the Repeat loop)
   - Add "URL" action
   - For the basic URL without due date (outside the "If" block):
     ```
     mskactions://create?title=[Reminder Name]&notes=[Notes]&list=Inbox
     ```
   - If using due date, in the "If" block, use:
     ```
     mskactions://create?title=[Reminder Name]&notes=[Notes]&list=Inbox
     ```
   - Try not including the due date parameter at all for now
   - Replace the placeholders with variables:
     * Replace [Reminder Name] with the Reminder Name variable
     * Replace [Notes] with the Notes variable
   - Add "Open URLs" action to execute the URL

6. **Delete Original Reminder** (inside the Repeat loop)
   - Add "Remove Reminder" action
   - Use the "Current Item from Repeat" as the reminder to remove

## Step 3: Configure Automation Settings

1. Review your automation to ensure all steps are correct
2. At the bottom of the setup screen, toggle OFF "Ask Before Running"
   - This is critical to make the automation run completely automatically without requiring your confirmation
   - When this is disabled, the shortcut will execute immediately whenever the time trigger occurs
   - iOS will display a brief notification when the shortcut is triggered, but no interaction is required
3. Tap "Done" to save your automation

## Testing the Automation

To test if your automation works correctly:

1. Create a new reminder in the native Reminders app
2. Wait for the next scheduled run of your automation (up to 5 minutes if that's the interval you set)
3. Check your Bonobo Actions app - a new Action should appear in the Inbox list
4. Verify that the original reminder has been deleted from the Reminders app

## Additional Troubleshooting for Due Date Issues

Based on the error you're seeing ("Invalid URL: 2025-05-08T13:00:00"), it appears Bonobo Actions isn't accepting the date format. Here are some approaches to fix this:

1. **Try without any due date**
   - The simplest solution is to not include the due date at all
   - Remove the &dueDate parameter completely from your URL
   - This will create Actions without scheduling, which you can manually schedule later

2. **Try URL encoding the date**
   - Add a "URL Encode" action to the formatted date
   - This will properly escape special characters that might be causing the issue

3. **Contact Bonobo support**
   - The most reliable solution may be to contact Bonobo support
   - Ask them for the exact date format their URL scheme expects
   - They might provide documentation for their URL scheme

4. **Experiment with different formats**
   - Try simpler date formats like:
     * "MM/dd/yyyy"
     * Unix timestamp (seconds since 1970)
     * Just the date portion without time: "yyyy-MM-dd"

## Alternative Approaches

If the time-based approach doesn't meet your needs, here are two other options:

1. **Manual Shortcut (Non-Automated)**
   - Create a regular shortcut (not an automation)
   - Add the same actions as described in Step 2
   - Run this shortcut manually whenever you want to process new reminders
   - Add it to your Home Screen or use the Action button on iPhone 16 Pro for quick access

2. **Focus Mode Automation**
   - Create an automation triggered by a Focus Mode change
   - For example, "When Sleep Focus is turned off" (morning) 
   - This would process any reminders created overnight
   - You could also use other Focus Modes you regularly toggle

## Notes

- The time-based automation will use some battery power as it runs regularly
- Reminders will only be processed at the scheduled intervals, not immediately as they're created
- You might miss some reminders if your device is powered off during a scheduled run
- This automation works best when Bonobo Actions is already installed and set up
- Consider setting a longer interval (like 15 minutes) if battery life is a concern