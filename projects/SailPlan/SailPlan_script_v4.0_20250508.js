/**
 * SailPlan Processor - Streamlined Script
 * Version: 4.0
 * Date: May 8, 2025
 * 
 * This script processes SailTime emails and creates calendar events and tasks.
 * Streamlined for better maintainability and performance.
 */

// ========== CONFIGURATION ==========
const CONFIG = {
  // User information
  userEmail: Session.getEffectiveUser().getEmail(),
  boatName: "Time Out",
  location: "Horn Point Marina, 105 Eastern Ave, Annapolis, MD",
  
  // Access codes
  iceBoxCode: "2323",
  bathroomCode: "001985",
  
  // Calendar settings
  calendarId: "primary",
  
  // Gmail label for SailTime emails
  emailLabel: "Sail Away/Embark",
  
  // Email patterns for detection
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
  
  // Date extraction patterns
  datePatterns: {
    // Simplified patterns with better matching
    reservation: "scheduled for\\s+([A-Za-z]+\\s+\\d{1,2}(?:,|)\\s+\\d{4})\\s+at\\s+(\\d{1,2}:\\d{2}\\s*(?:am|pm))",
    cancellation: "reservation on\\s+([A-Za-z]+\\s+\\d{1,2}(?:,|)\\s+\\d{4})\\s+at\\s+(\\d{1,2}:\\d{2}\\s*(?:am|pm))",
    confirmation: "confirm your reservation on\\s+([A-Za-z]+(?:,|)\\s+[A-Za-z]+\\s+\\d{1,2}(?:,|)\\s+\\d{4})\\s+at\\s+(\\d{1,2}:\\d{2}\\s*(?:am|pm))"
  },
  
  // Packing lists
  packingLists: {
    daySail: `## DUFFEL BAG:
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
  -- Moisturizer`,
    
    overnightSail: `## DUFFEL BAG:
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
  -- Moisturizer`
  },
  
  // Task settings
  taskSettings: {
    packingPriority: "Medium",
    confirmationPriority: "High",
    confirmationLeadDays: 3
  },
  
  // Task URL scheme (Bonobo Actions)
  taskURLScheme: "mskactions://create",
  
  // Debug mode
  debug: false
};

// ========== MAIN FUNCTION ==========

/**
 * Main function to process SailTime emails
 * Entry point for the script
 */
function processSailTimeEmails() {
  log("Starting SailTime email processor...");
  
  try {
    // Get all labeled emails from Gmail
    const threads = getEmailThreads();
    if (!threads || threads.length === 0) {
      log("No labeled threads found to process");
      return;
    }
    
    log(`Found ${threads.length} threads to process`);
    
    // Process each thread
    let processedCount = 0;
    for (const thread of threads) {
      const messages = thread.getMessages();
      
      for (const message of messages) {
        // Only process unread messages
        if (!message.isUnread()) {
          continue;
        }
        
        const subject = message.getSubject();
        const body = message.getPlainBody();
        
        log(`Processing message: ${subject}`);
        
        // Determine email type and process accordingly
        let processed = false;
        
        if (body.includes(CONFIG.emailPatterns.cancellation)) {
          processed = processCancellationEmail(body);
        } else if (body.includes(CONFIG.emailPatterns.confirmation)) {
          processed = processConfirmationEmail(body);
        } else if (body.includes(CONFIG.emailPatterns.timeChange)) {
          processed = processTimeChangeEmail(body);
        } else if (body.includes(CONFIG.emailPatterns.reservation)) {
          processed = processReservationEmail(body);
        } else {
          log("Email does not match any known pattern");
        }
        
        // Mark message as read if processed
        if (processed) {
          message.markRead();
          processedCount++;
        }
      }
    }
    
    log(`Finished processing ${processedCount} SailTime emails`);
  } catch (error) {
    logError("Error processing emails", error);
  }
}

// ========== EMAIL PROCESSORS ==========

/**
 * Process a new reservation email
 */
function processReservationEmail(emailBody) {
  try {
    // Extract date and time from email
    const dateInfo = extractDateTimeFromEmail(emailBody, CONFIG.datePatterns.reservation);
    if (!dateInfo) {
      log("Could not extract date/time from reservation email");
      return false;
    }
    
    const { date, time } = dateInfo;
    const startDateTime = parseDateAndTime(date, time);
    if (!startDateTime) {
      log("Could not parse date/time");
      return false;
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
      log("Event already exists, skipping creation");
      return true;
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
      log(`Created event: ${eventTitle}`);
      return true;
    }
    
    return false;
  } catch (error) {
    logError("Error processing reservation email", error);
    return false;
  }
}

/**
 * Process a cancellation email
 */
function processCancellationEmail(emailBody) {
  try {
    // Extract date and time from email
    const dateInfo = extractDateTimeFromEmail(emailBody, CONFIG.datePatterns.cancellation);
    if (!dateInfo) {
      log("Could not extract date/time from cancellation email");
      return false;
    }
    
    const { date, time } = dateInfo;
    const startDateTime = parseDateAndTime(date, time);
    if (!startDateTime) {
      log("Could not parse date/time for cancellation");
      return false;
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
        log(`Deleted event: ${event.getTitle()}`);
      }
      
      // Send notification email about cancellation
      sendNotificationEmail(
        "Sailing Reservation Cancelled",
        `Your sailing reservation for ${formatDate(startDateTime)} has been cancelled and removed from your calendar.`
      );
      
      return true;
    } else {
      log("No matching events found to delete");
      return false;
    }
  } catch (error) {
    logError("Error processing cancellation email", error);
    return false;
  }
}

/**
 * Process a confirmation reminder email
 */
function processConfirmationEmail(emailBody) {
  try {
    // Extract date and time from email
    const dateInfo = extractDateTimeFromEmail(emailBody, CONFIG.datePatterns.confirmation);
    if (!dateInfo) {
      log("Could not extract date/time from confirmation email");
      return false;
    }
    
    const { date, time } = dateInfo;
    const reservationDate = parseDateAndTime(date, time);
    if (!reservationDate) {
      log("Could not parse date/time for confirmation");
      return false;
    }
    
    // Create a confirmation event for today
    const today = new Date();
    const confirmationStart = new Date(today.getTime());
    confirmationStart.setHours(20, 0, 0, 0); // 8:00 PM
    
    const confirmationEnd = new Date(today.getTime());
    confirmationEnd.setHours(20, 15, 0, 0); // 8:15 PM
    
    const eventTitle = `⚠️ CONFIRM SAILING RESERVATION ⚠️`;
    const eventDescription = `Log into https://embark.sailtime.com to confirm your sailing reservation for ${
      formatDate(reservationDate)
    } at ${
      formatTime(reservationDate)
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
    
    // Send confirmation task email
    sendConfirmationTaskEmail(reservationDate);
    
    log("Created confirmation reminder");
    return true;
    
  } catch (error) {
    logError("Error processing confirmation email", error);
    return false;
  }
}

/**
 * Process a time change email
 */
function processTimeChangeEmail(emailBody) {
  try {
    log("Processing time change email");
    
    // The time change email format is complex, so we'll update all future events
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
      
      log(`Updated ${updatedCount} events with new times`);
      
      // Send notification
      if (updatedCount > 0) {
        sendNotificationEmail(
          "Sailing Reservation Times Updated",
          `${updatedCount} sailing events have been updated with new end times in your calendar.`
        );
        return true;
      }
    } else {
      log("No future sailing events found to update");
    }
    
    return false;
  } catch (error) {
    logError("Error processing time change email", error);
    return false;
  }
}

// ========== TASK CREATION ==========

/**
 * Sends an email with task creation information for Bonobo Actions
 */
function sendTaskCreationEmail(eventTitle, eventDate, eventType) {
  try {
    // Format the date for display
    const formattedDate = formatDate(eventDate);
    
    // Create task titles
    const packingTaskTitle = `Pack for ${eventType} on ${formattedDate}`;
    const confirmTaskTitle = `⚠️ CONFIRM SAILING RESERVATION for ${formattedDate}`;
    
    // Determine packing list based on sail type
    const packingList = eventType === "Day Sail" ? 
                       CONFIG.packingLists.daySail : 
                       CONFIG.packingLists.overnightSail;
    
    // Create Bonobo Actions URL for packing task
    const packingTaskURL = CONFIG.taskURLScheme;
    
    // Calculate confirmation due date
    const confirmationDate = new Date(eventDate);
    confirmationDate.setDate(confirmationDate.getDate() - CONFIG.taskSettings.confirmationLeadDays);
    
    // Create the email with improved design
    const emailSubject = `Sailing Tasks: ${formattedDate}`;
    
    const emailBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #2A6FDB; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0;">
          <h1 style="margin: 0;">Sailing on ${formattedDate}</h1>
          <p style="margin: 5px 0 0;">Your calendar event has been created</p>
        </div>
        
        <div style="background-color: #f9f9f9; padding: 20px; border-left: 1px solid #ddd; border-right: 1px solid #ddd;">
          <h2>Create Tasks in Bonobo Actions</h2>
          
          <div style="background-color: white; margin: 20px 0; padding: 20px; border-radius: 5px; border: 1px solid #e3e3e3;">
            <h3 style="color: #2A6FDB; border-bottom: 1px solid #e3e3e3; padding-bottom: 10px; margin-top: 0;">Packing Task</h3>
            <p><strong>Task Title:</strong> ${packingTaskTitle}</p>
            <p><a href="${packingTaskURL}" style="display: inline-block; background-color: #2A6FDB; color: white; padding: 10px 15px; text-decoration: none; border-radius: 5px;">Open Bonobo Actions</a></p>
            <div style="margin-top: 15px;">
              <p><strong>Instructions:</strong></p>
              <ol style="padding-left: 20px;">
                <li>Click the button above to open Bonobo Actions</li>
                <li>Type "${packingTaskTitle}" as the task title</li>
                <li>Copy and paste the packing list below into the task notes</li>
                <li>Set the due date to: ${formattedDate}</li>
                <li>Set priority to: ${CONFIG.taskSettings.packingPriority}</li>
              </ol>
            </div>
            <div style="margin-top: 15px; background-color: #f5f5f5; padding: 10px; border-radius: 5px; white-space: pre-wrap; font-family: monospace; font-size: 12px; max-height: 200px; overflow-y: auto;">
${packingList}
            </div>
          </div>
          
          <div style="background-color: white; margin: 20px 0; padding: 20px; border-radius: 5px; border: 1px solid #e3e3e3;">
            <h3 style="color: #D9930D; border-bottom: 1px solid #e3e3e3; padding-bottom: 10px; margin-top: 0;">Confirmation Task</h3>
            <p><strong>Task Title:</strong> ${confirmTaskTitle}</p>
            <p><a href="${packingTaskURL}" style="display: inline-block; background-color: #D9930D; color: white; padding: 10px 15px; text-decoration: none; border-radius: 5px;">Open Bonobo Actions</a></p>
            <div style="margin-top: 15px;">
              <p><strong>Instructions:</strong></p>
              <ol style="padding-left: 20px;">
                <li>Click the button above to open Bonobo Actions</li>
                <li>Type "${confirmTaskTitle}" as the task title</li>
                <li>Add this to notes: "Log into https://embark.sailtime.com to confirm reservation"</li>
                <li>Set the due date to: ${formatDate(confirmationDate)}</li>
                <li>Set priority to: ${CONFIG.taskSettings.confirmationPriority}</li>
              </ol>
            </div>
          </div>
        </div>
        
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 0 0 5px 5px; border: 1px solid #ddd; border-top: none;">
          <h3 style="margin-top: 0;">Event Details</h3>
          <p><strong>Event:</strong> ${eventTitle}</p>
          <p><strong>Date:</strong> ${formattedDate}</p>
          <p><strong>Location:</strong> ${CONFIG.location}</p>
          <p><strong>Ice Box Code:</strong> ${CONFIG.iceBoxCode}</p>
          <p><strong>Bathroom Code:</strong> ${CONFIG.bathroomCode}</p>
        </div>
      </div>
    `;
    
    // Send the email
    sendHtmlEmail(
      CONFIG.userEmail,
      emailSubject,
      "Your sailing event has been added to your calendar. Please view in HTML format to see task creation instructions.",
      emailBody
    );
    
    log('Sent task creation email for: ' + eventTitle);
    return true;
  } catch (error) {
    logError('Error sending task creation email', error);
    return false;
  }
}

/**
 * Sends a confirmation task email
 */
function sendConfirmationTaskEmail(reservationDate) {
  try {
    const formattedDate = formatDate(reservationDate);
    const confirmTaskTitle = `⚠️ CONFIRM SAILING RESERVATION for ${formattedDate}`;
    const confirmTaskURL = CONFIG.taskURLScheme;
    
    const emailSubject = `⚠️ ACTION REQUIRED: Confirm Sailing for ${formattedDate}`;
    
    const emailBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #D9930D; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0;">
          <h1 style="margin: 0;">Confirmation Required</h1>
          <p style="margin: 5px 0 0;">Your sailing reservation needs confirmation</p>
        </div>
        
        <div style="background-color: #f9f9f9; padding: 20px; border-left: 1px solid #ddd; border-right: 1px solid #ddd;">
          <div style="background-color: white; margin: 20px 0; padding: 20px; border-radius: 5px; border: 1px solid #e3e3e3;">
            <h2 style="color: #D9930D; margin-top: 0;">Important: Confirm Your Reservation</h2>
            <p>Your sailing reservation for <strong>${formattedDate}</strong> needs to be confirmed as soon as possible, or it will be released.</p>
            
            <div style="margin: 25px 0; text-align: center;">
              <a href="https://embark.sailtime.com" style="display: inline-block; background-color: #D9930D; color: white; padding: 15px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px;">Confirm Reservation Now</a>
            </div>
            
            <p><strong>Create a reminder in Bonobo Actions:</strong></p>
            <p><a href="${confirmTaskURL}" style="display: inline-block; background-color: #2A6FDB; color: white; padding: 10px 15px; text-decoration: none; border-radius: 5px;">Create Task in Bonobo Actions</a></p>
            <div style="margin-top: 15px;">
              <p><strong>Instructions:</strong></p>
              <ol style="padding-left: 20px;">
                <li>Click the button above to open Bonobo Actions</li>
                <li>Type "${confirmTaskTitle}" as the task title</li>
                <li>Add this to notes: "Log into https://embark.sailtime.com to confirm reservation"</li>
                <li>Set the due date to: Today</li>
                <li>Set priority to: ${CONFIG.taskSettings.confirmationPriority}</li>
              </ol>
            </div>
          </div>
        </div>
        
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 0 0 5px 5px; border: 1px solid #ddd; border-top: none;">
          <p><strong>Reservation Date:</strong> ${formattedDate}</p>
          <p><strong>Location:</strong> ${CONFIG.location}</p>
          <p><strong>Warning:</strong> If not confirmed, your reservation will be released.</p>
        </div>
      </div>
    `;
    
    // Send the email
    sendHtmlEmail(
      CONFIG.userEmail,
      emailSubject,
      "Your sailing reservation needs confirmation. Please confirm it immediately at https://embark.sailtime.com.",
      emailBody
    );
    
    log('Sent confirmation task email for: ' + formattedDate);
    return true;
  } catch (error) {
    logError('Error sending confirmation task email', error);
    return false;
  }
}

// ========== HELPER FUNCTIONS ==========

/**
 * Gets labeled email threads
 */
function getEmailThreads() {
  try {
    // Create the label if it doesn't exist
    let label = GmailApp.getUserLabelByName(CONFIG.emailLabel);
    if (!label) {
      log(`Creating label: ${CONFIG.emailLabel}`);
      label = GmailApp.createLabel(CONFIG.emailLabel);
    }
    
    // Get threads with the label
    return label.getThreads();
  } catch (error) {
    logError("Error getting email threads", error);
    return [];
  }
}

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
    logError("Error extracting date/time", error);
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
    log(`Failed to parse date: ${dateTimeStr}`);
    return null;
  } catch (error) {
    logError("Error parsing date/time", error);
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
    logError("Error checking for existing events", error);
    return false; // If error occurs, assume event doesn't exist
  }
}

/**
 * Creates a calendar event with optional alerts
 */
function createCalendarEvent(title, description, startTime, endTime, location, withAlert = true) {
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
  } catch (error)