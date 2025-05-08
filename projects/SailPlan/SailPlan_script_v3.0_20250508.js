/**
 * SailPlan Processor - Complete Script
 * Version: 3.0
 * Date: May 8, 2025
 * 
 * This script processes SailTime emails and creates calendar events and tasks.
 * All functions are contained in a single file to prevent CONFIG reference errors.
 */

// ========== CONFIGURATION SECTION ==========
const CONFIG = {
  // User information
  userEmail: Session.getEffectiveUser().getEmail(),
  boatName: "Time Out",
  location: "Horn Point Marina, 105 Eastern Ave, Annapolis, MD",
  
  // Access codes
  iceBoxCode: "2323",
  bathroomCode: "001985",
  
  // Calendar settings
  calendarId: "primary", // Use "primary" or specific calendar ID
  
  // Gmail label for SailTime emails
  emailLabel: "Sail Away/Embark",
  
  // Email patterns
  emailPatterns: {
    reservation: "Embark reservation scheduled for",
    cancellation: "has been canceled",
    confirmation: "Confirmation Has Opened",
    timeChange: "Time Change"
  },
  
  // Duration settings
  sailDurations: {
    daySail: 7.5, // hours
    overnightSail: 16.5 // hours
  },
  
  // Date patterns for extraction
  datePatterns: {
    // Matches various date formats in emails
    reservation: "scheduled for\\s+([A-Za-z]+\\s+\\d{1,2}(?:,|)\\s+\\d{4})\\s+at\\s+(\\d{1,2}:\\d{2}\\s*(?:am|pm))",
    cancellation: "reservation on\\s+([A-Za-z]+\\s+\\d{1,2}(?:,|)\\s+\\d{4})\\s+at\\s+(\\d{1,2}:\\d{2}\\s*(?:am|pm))",
    confirmation: "confirm your reservation on\\s+([A-Za-z]+(?:,|)\\s+[A-Za-z]+\\s+\\d{1,2}(?:,|)\\s+\\d{4})\\s+at\\s+(\\d{1,2}:\\d{2}\\s*(?:am|pm))"
  },
  
  // Feature toggles
  sendTaskEmails: true,
  useCalendarAlerts: true,
  processCancellations: true,
  processTimeChanges: true,
  
  // Task creation settings
  taskSettings: {
    packingPriority: "Medium",
    confirmationPriority: "High",
    confirmationLeadDays: 3 // Days before sail to confirm
  },
  
  // Debug mode
  debug: false
};

// ========== MAIN FUNCTIONS ==========

/**
 * Main function that processes SailTime emails
 * This is the entry point for the script
 */
function processSailTimeEmails() {
  Logger.log("Starting SailTime email processor...");
  
  try {
    // Get all labeled emails from Gmail
    const threads = getEmailThreads();
    if (!threads || threads.length === 0) {
      Logger.log("No labeled threads found to process");
      return;
    }
    
    Logger.log(`Found ${threads.length} threads to process`);
    
    // Process each thread
    for (const thread of threads) {
      const messages = thread.getMessages();
      
      for (const message of messages) {
        // Only process unread messages
        if (!message.isUnread()) {
          continue;
        }
        
        const subject = message.getSubject();
        const body = message.getPlainBody();
        
        Logger.log(`Processing message: ${subject}`);
        
        // Determine email type and process accordingly
        if (body.includes(CONFIG.emailPatterns.cancellation) && CONFIG.processCancellations) {
          processCancellationEmail(body);
        } else if (body.includes(CONFIG.emailPatterns.confirmation)) {
          processConfirmationEmail(body);
        } else if (body.includes(CONFIG.emailPatterns.timeChange) && CONFIG.processTimeChanges) {
          processTimeChangeEmail(body);
        } else if (body.includes(CONFIG.emailPatterns.reservation)) {
          processReservationEmail(body);
        } else {
          Logger.log("Email does not match any known pattern");
        }
        
        // Mark message as read
        message.markRead();
      }
    }
    
    Logger.log("Finished processing SailTime emails");
  } catch (error) {
    Logger.log("Error processing emails: " + error.toString());
  }
}

/**
 * Gets all email threads with the SailTime label
 */
function getEmailThreads() {
  // Create the label if it doesn't exist
  let label = GmailApp.getUserLabelByName(CONFIG.emailLabel);
  if (!label) {
    Logger.log(`Creating label: ${CONFIG.emailLabel}`);
    label = GmailApp.createLabel(CONFIG.emailLabel);
  }
  
  // Get threads with the label
  return label.getThreads();
}

/**
 * Processes a new reservation email
 */
function processReservationEmail(emailBody) {
  try {
    // Extract date and time from email
    const dateInfo = extractDateTimeFromEmail(emailBody, CONFIG.datePatterns.reservation);
    if (!dateInfo) {
      Logger.log("Could not extract date/time from reservation email");
      return;
    }
    
    const { date, time } = dateInfo;
    const startDateTime = parseDateAndTime(date, time);
    if (!startDateTime) {
      Logger.log("Could not parse date/time");
      return;
    }
    
    // Determine sail type and duration
    const isMorningSail = time.toLowerCase().includes("10:30") || 
                          time.toLowerCase().includes("10:00");
    
    const sailType = isMorningSail ? "Day Sail" : "Overnight Sail";
    const durationHours = isMorningSail ? 
                           CONFIG.sailDurations.daySail : 
                           CONFIG.sailDurations.overnightSail;
    
    // Create end time
    const endDateTime = new Date(startDateTime.getTime());
    endDateTime.setHours(endDateTime.getHours() + durationHours);
    
    // Check for existing events
    if (eventExists(startDateTime, CONFIG.boatName)) {
      Logger.log("Event already exists, skipping creation");
      return;
    }
    
    // Create calendar event
    const eventTitle = `Sailing: ${CONFIG.boatName} - ${sailType}`;
    const eventDescription = `SailTime Reservation
Location: ${CONFIG.location}
Ice Box Code: ${CONFIG.iceBoxCode}
Bathroom Code: ${CONFIG.bathroomCode}`;
    
    const calendarEvent = createCalendarEvent(
      eventTitle, 
      eventDescription, 
      startDateTime, 
      endDateTime, 
      CONFIG.location
    );
    
    // Send email for task creation
    if (calendarEvent) {
      sendTaskCreationEmail(eventTitle, startDateTime, sailType);
      Logger.log(`Created event: ${eventTitle}`);
    }
  } catch (error) {
    Logger.log("Error processing reservation email: " + error.toString());
  }
}

/**
 * Processes a cancellation email
 */
function processCancellationEmail(emailBody) {
  try {
    // Extract date and time from email
    const dateInfo = extractDateTimeFromEmail(emailBody, CONFIG.datePatterns.cancellation);
    if (!dateInfo) {
      Logger.log("Could not extract date/time from cancellation email");
      return;
    }
    
    const { date, time } = dateInfo;
    const startDateTime = parseDateAndTime(date, time);
    if (!startDateTime) {
      Logger.log("Could not parse date/time for cancellation");
      return;
    }
    
    // Find and delete matching events
    const calendar = CalendarApp.getCalendarById(CONFIG.calendarId);
    const nextDay = new Date(startDateTime.getTime());
    nextDay.setDate(nextDay.getDate() + 1);
    
    const events = calendar.getEvents(startDateTime, nextDay, {
      search: CONFIG.boatName
    });
    
    if (events && events.length > 0) {
      for (const event of events) {
        event.deleteEvent();
        Logger.log(`Deleted event: ${event.getTitle()}`);
      }
    } else {
      Logger.log("No matching events found to delete");
    }
    
    // Send notification email about cancellation
    GmailApp.sendEmail(
      CONFIG.userEmail,
      "Sailing Reservation Cancelled",
      `Your sailing reservation for ${Utilities.formatDate(
        startDateTime, 
        Session.getScriptTimeZone(), 
        'MMMM d, yyyy'
      )} has been cancelled and removed from your calendar.`
    );
    
  } catch (error) {
    Logger.log("Error processing cancellation email: " + error.toString());
  }
}

/**
 * Processes a confirmation reminder email
 */
function processConfirmationEmail(emailBody) {
  try {
    // Extract date and time from email
    const dateInfo = extractDateTimeFromEmail(emailBody, CONFIG.datePatterns.confirmation);
    if (!dateInfo) {
      Logger.log("Could not extract date/time from confirmation email");
      return;
    }
    
    const { date, time } = dateInfo;
    const reservationDate = parseDateAndTime(date, time);
    if (!reservationDate) {
      Logger.log("Could not parse date/time for confirmation");
      return;
    }
    
    // Create a confirmation event for today
    const today = new Date();
    const confirmationStart = new Date(today.getTime());
    confirmationStart.setHours(20, 0, 0, 0); // 8:00 PM
    
    const confirmationEnd = new Date(today.getTime());
    confirmationEnd.setHours(20, 15, 0, 0); // 8:15 PM
    
    const eventTitle = `⚠️ CONFIRM SAILING RESERVATION ⚠️`;
    const eventDescription = `Log into https://embark.sailtime.com to confirm your sailing reservation for ${
      Utilities.formatDate(reservationDate, Session.getScriptTimeZone(), 'MMMM d, yyyy')
    } at ${
      Utilities.formatDate(reservationDate, Session.getScriptTimeZone(), 'h:mm a')
    }. 
    
IMPORTANT: If not confirmed, your reservation will be released!`;
    
    createCalendarEvent(
      eventTitle, 
      eventDescription, 
      confirmationStart, 
      confirmationEnd, 
      null, // No location
      true  // With alert
    );
    
    // Send email reminder as well
    GmailApp.sendEmail(
      CONFIG.userEmail,
      "⚠️ ACTION REQUIRED: Confirm Your Sailing Reservation",
      `Please confirm your sailing reservation for ${
        Utilities.formatDate(reservationDate, Session.getScriptTimeZone(), 'MMMM d, yyyy')
      }. Log into https://embark.sailtime.com to confirm. If not confirmed, your reservation will be released!`
    );
    
    Logger.log("Created confirmation reminder");
    
  } catch (error) {
    Logger.log("Error processing confirmation email: " + error.toString());
  }
}

/**
 * Processes a time change email
 */
function processTimeChangeEmail(emailBody) {
  try {
    Logger.log("Processing time change email");
    
    // The time change email format is complex and varied, so we'll update all future events
    const calendar = CalendarApp.getCalendarById(CONFIG.calendarId);
    
    // Get date range for the next year
    const now = new Date();
    const oneYearLater = new Date(now.getTime());
    oneYearLater.setFullYear(now.getFullYear() + 1);
    
    // Find all sailing events in the next year
    const events = calendar.getEvents(now, oneYearLater, {
      search: CONFIG.boatName
    });
    
    if (events && events.length > 0) {
      let updatedCount = 0;
      
      for (const event of events) {
        const startDateTime = event.getStartTime();
        const startHour = startDateTime.getHours();
        
        // Determine the correct duration based on start time
        const isMorningSail = startHour >= 9 && startHour <= 11;
        const durationHours = isMorningSail ? 
                               CONFIG.sailDurations.daySail : 
                               CONFIG.sailDurations.overnightSail;
        
        // Calculate new end time
        const newEndTime = new Date(startDateTime.getTime());
        newEndTime.setHours(newEndTime.getHours() + durationHours);
        
        // Update the event
        event.setEndTime(newEndTime);
        updatedCount++;
      }
      
      Logger.log(`Updated ${updatedCount} events with new times`);
      
      // Send notification
      if (updatedCount > 0) {
        GmailApp.sendEmail(
          CONFIG.userEmail,
          "Sailing Reservation Times Updated",
          `${updatedCount} sailing events have been updated with new end times in your calendar.`
        );
      }
    } else {
      Logger.log("No future sailing events found to update");
    }
    
  } catch (error) {
    Logger.log("Error processing time change email: " + error.toString());
  }
}

// ========== HELPER FUNCTIONS ==========

/**
 * Extracts date and time from email body using regex pattern
 */
function extractDateTimeFromEmail(emailBody, pattern) {
  try {
    const regex = new RegExp(pattern);
    const match = regex.exec(emailBody);
    
    if (match && match.length >= 3) {
      return {
        date: match[1],
        time: match[2]
      };
    }
    
    return null;
  } catch (error) {
    Logger.log("Error extracting date/time: " + error.toString());
    return null;
  }
}

/**
 * Parses date and time strings into a Date object
 */
function parseDateAndTime(dateStr, timeStr) {
  try {
    // Format the date and time to make it more consistent
    const formattedDateStr = dateStr.replace(/\s+/g, ' ').trim();
    const formattedTimeStr = timeStr.replace(/\s+/g, ' ').trim();
    
    // Combine date and time
    const dateTimeStr = `${formattedDateStr} ${formattedTimeStr}`;
    
    // Try multiple formats
    const formats = [
      'MMMM d, yyyy h:mm a',
      'MMMM d yyyy h:mm a',
      'MMM d, yyyy h:mm a',
      'MMM d yyyy h:mm a'
    ];
    
    for (const format of formats) {
      try {
        return Utilities.parseDate(dateTimeStr, Session.getScriptTimeZone(), format);
      } catch (e) {
        // Continue to next format
      }
    }
    
    // If all parsing attempts fail, log and return null
    Logger.log(`Failed to parse date: ${dateTimeStr}`);
    return null;
  } catch (error) {
    Logger.log("Error parsing date/time: " + error.toString());
    return null;
  }
}

/**
 * Checks if an event already exists at the specified time
 */
function eventExists(startDateTime, boatName) {
  try {
    const calendar = CalendarApp.getCalendarById(CONFIG.calendarId);
    
    // Look for events 15 minutes before and after the start time
    const buffer = 15 * 60 * 1000; // 15 minutes in milliseconds
    const searchStart = new Date(startDateTime.getTime() - buffer);
    const searchEnd = new Date(startDateTime.getTime() + buffer);
    
    const events = calendar.getEvents(searchStart, searchEnd, {
      search: boatName
    });
    
    return events && events.length > 0;
  } catch (error) {
    Logger.log("Error checking for existing events: " + error.toString());
    return false; // If error occurs, assume event doesn't exist
  }
}

/**
 * Creates a calendar event with optional alerts
 */
function createCalendarEvent(title, description, startTime, endTime, location, withAlert = CONFIG.useCalendarAlerts) {
  try {
    const calendar = CalendarApp.getCalendarById(CONFIG.calendarId);
    
    // Create the event
    const event = calendar.createEvent(
      title,
      startTime,
      endTime,
      {
        description: description,
        location: location
      }
    );
    
    // Add alerts if enabled
    if (withAlert) {
      // Alert at time of event
      event.addPopupReminder(0);
      
      // For sailing events (not confirmation reminders), add more alerts
      if (title.includes("Sailing:")) {
        // Add various alerts
        event.addPopupReminder(60 * 18); // 18 hours before
        event.addPopupReminder(60 * 24 * 2); // 2 days before
        event.addPopupReminder(60 * 24 * 3); // 3 days before
        event.addPopupReminder(60 * 24 * 7); // 7 days before
      }
    }
    
    return event;
  } catch (error) {
    Logger.log("Error creating calendar event: " + error.toString());
    return null;
  }
}

/**
 * Sends an email with hybrid task creation approach for Bonobo Actions
 * This gets called after a calendar event is created
 */
function sendTaskCreationEmail(eventTitle, eventDate, eventType) {
  if (!CONFIG.sendTaskEmails) {
    return;  // Skip if email sending is disabled
  }
  
  try {
    // Format the date for display
    const formattedDate = Utilities.formatDate(
      eventDate, 
      Session.getScriptTimeZone(), 
      'MMMM d, yyyy'
    );
    
    // Format date for task due dates (ISO format)
    const isoDate = Utilities.formatDate(
      eventDate, 
      Session.getScriptTimeZone(), 
      'yyyy-MM-dd'
    );
    
    // Calculate confirmation due date (3 days before event)
    const confirmationDate = new Date(eventDate);
    confirmationDate.setDate(confirmationDate.getDate() - CONFIG.taskSettings.confirmationLeadDays);
    const isoConfirmationDate = Utilities.formatDate(
      confirmationDate,
      Session.getScriptTimeZone(),
      'yyyy-MM-dd'
    );
    
    // Create HTML email with hybrid approach
    const emailSubject = `Sailing Task Creation: ${formattedDate}`;
    
    // Create packing list text for copy-paste
    let packingListText = '';
    
    if (eventType === "Day Sail") {
      // Day Sail packing list
      packingListText = `## DUFFEL BAG:
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

## DAY PACK:
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
  -- Moisturizer`;
    } else {
      // Overnight Sail packing list
      packingListText = `## DUFFEL BAG:
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

## DAY PACK:
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
  -- Moisturizer`;
    }
    
    // Create task titles for copying
    const packingTaskTitle = `Pack for ${eventType} on ${formattedDate}`;
    const confirmTaskTitle = `⚠️ CONFIRM SAILING RESERVATION for ${formattedDate}`;
    
    // Create the email body with clickable links and copy-paste content
    const emailBody = `
      <h2>Sailing Task Creation for ${formattedDate}</h2>
      <p>Your sailing event has been added to your calendar. Follow these steps to create tasks in Bonobo Actions:</p>
      
      <div style="margin: 20px 0; padding: 20px; border: 1px solid #ccc; background-color: #f8f8f8; border-radius: 5px;">
        <h3>Packing Task</h3>
        
        <p><strong>Step 1:</strong> Copy this task title:</p>
        <div style="background-color: #ffffff; padding: 10px; border: 1px solid #ddd; margin: 10px 0; border-radius: 3px; font-family: monospace;">
          ${packingTaskTitle}
        </div>
        
        <p><strong>Step 2:</strong> <a href="mskactions://create" style="display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px; margin: 10px 0;">
          Click here to open Bonobo Actions
        </a></p>
        
        <p><strong>Step 3:</strong> Paste the title into the new task</p>
        
        <p><strong>Step 4:</strong> Copy this packing list for the task notes:</p>
        <div style="background-color: #ffffff; padding: 10px; border: 1px solid #ddd; margin: 10px 0; border-radius: 3px; font-family: monospace; white-space: pre-wrap;">
${packingListText}
        </div>
        
        <p><strong>Step 5:</strong> Set the due date to: ${formattedDate}</p>
        <p><strong>Step 6:</strong> Set priority to: ${CONFIG.taskSettings.packingPriority}</p>
      </div>
      
      <div style="margin: 20px 0; padding: 20px; border: 1px solid #ccc; background-color: #f8f8f8; border-radius: 5px;">
        <h3>Confirmation Task</h3>
        
        <p><strong>Step 1:</strong> Copy this task title:</p>
        <div style="background-color: #ffffff; padding: 10px; border: 1px solid #ddd; margin: 10px 0; border-radius: 3px; font-family: monospace;">
          ${confirmTaskTitle}
        </div>
        
        <p><strong>Step 2:</strong> <a href="mskactions://create" style="display: inline-block; padding: 10px 20px; background-color: #f44336; color: white; text-decoration: none; border-radius: 5px; margin: 10px 0;">
          Click here to open Bonobo Actions
        </a></p>
        
        <p><strong>Step 3:</strong> Paste the title into the new task</p>
        
        <p><strong>Step 4:</strong> Copy this note:</p>
        <div style="background-color: #ffffff; padding: 10px; border: 1px solid #ddd; margin: 10px 0; border-radius: 3px; font-family: monospace;">
Log into https://embark.sailtime.com to confirm reservation.
        </div>
        
        <p><strong>Step 5:</strong> Set the due date to: ${Utilities.formatDate(confirmationDate, Session.getScriptTimeZone(), 'MMMM d, yyyy')}</p>
        <p><strong>Step 6:</strong> Set priority to: ${CONFIG.taskSettings.confirmationPriority}</p>
      </div>
      
      <p><strong>Calendar event details:</strong></p>
      <ul>
        <li><strong>Event:</strong> ${eventTitle}</li>
        <li><strong>Date:</strong> ${formattedDate}</li>
        <li><strong>Location:</strong> ${CONFIG.location}</li>
        <li><strong>Ice Box Code:</strong> ${CONFIG.iceBoxCode}</li>
        <li><strong>Bathroom Code:</strong> ${CONFIG.bathroomCode}</li>
      </ul>
    `;
    
    // Send the email
    GmailApp.sendEmail(
      CONFIG.userEmail,
      emailSubject,
      "Your sailing event has been added to your calendar. Please view in HTML format to see task creation instructions.",
      {htmlBody: emailBody}
    );
    
    Logger.log('Sent task creation email for: ' + eventTitle);
    
  } catch (error) {
    Logger.log('Error sending task creation email: ' + error.toString());
  }
}

// ========== TRIGGER SETUP ==========

/**
 * Sets up triggers to run the script automatically
 * Call this function manually once to set up scheduled execution
 */
function setupTriggers() {
  // Clear any existing triggers
  const triggers = ScriptApp.getProjectTriggers();
  for (const trigger of triggers) {
    ScriptApp.deleteTrigger(trigger);
  }
  
  // Create triggers to run at specified times
  // Morning run at 9:00 AM
  ScriptApp.newTrigger('processSailTimeEmails')
    .timeBased()
    .atHour(9)
    .everyDays(1)
    .create();
  
  // Afternoon run at 3:00 PM
  ScriptApp.newTrigger('processSailTimeEmails')
    .timeBased()
    .atHour(15)
    .everyDays(1)
    .create();
  
  // Evening run at 9:00 PM
  ScriptApp.newTrigger('processSailTimeEmails')
    .timeBased()
    .atHour(21)
    .everyDays(1)
    .create();
  
  Logger.log("Triggers set up successfully");
}

// Uncomment this to run the script manually for testing
// function test() {
//   processSailTimeEmails();
// }
