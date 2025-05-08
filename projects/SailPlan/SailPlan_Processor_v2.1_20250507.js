/**
 * SailPlan_Processor_v2.1_20250507.js
 * 
 * This script automatically processes SailTime reservation emails and 
 * creates calendar events with supporting tasks.
 * 
 * Created: May 7, 2025
 * Version: 2.1
 * 
 * Update notes:
 * - Combined separate scripts into single file to fix CONFIG reference error
 * - Implemented scheduled triggers (9 AM, 3 PM, 9 PM)
 * - Added comprehensive packing lists for day and overnight sails
 * - Included access codes in calendar events
 */

// Configuration - modify these to match your preferences
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
  ],
  sendTaskEmails: true,           // Whether to send emails with task links
  userEmail: Session.getActiveUser().getEmail(),  // Your email address
  // Access codes and notes
  iceBoxCode: '2323',             // Code for the ice box 
  bathroomCode: '001985'          // Code for the bathroom doors
};

/**
 * Main function - processes all unprocessed SailTime emails
 * Set this to run on a time-based trigger (e.g., hourly)
 */
function processSailTimeEmails() {
  // Create the processed label if it doesn't exist
  createLabelIfNeeded(CONFIG.processedLabel);
  
  // Get all unprocessed SailTime emails
  const threads = getUnprocessedEmails();
  
  // Process each thread
  let processedCount = 0;
  for (const thread of threads) {
    const emails = thread.getMessages();
    
    // Process each email in the thread (typically just one)
    for (const email of emails) {
      const emailType = determineEmailType(email);
      
      // Process based on email type
      if (emailType === 'new_reservation') {
        if (processNewReservation(email)) {
          processedCount++;
        }
      } else if (emailType === 'cancellation') {
        if (processCancellation(email)) {
          processedCount++;
        }
      } else if (emailType === 'confirmation_reminder') {
        if (processConfirmationReminder(email)) {
          processedCount++;
        }
      } else {
        // Unknown email type, skip processing
        Logger.log('Unknown email type: ' + email.getSubject());
        continue;
      }
    }
    
    // Mark the thread as processed
    markAsProcessed(thread);
  }
  
  // Log the processing results
  Logger.log('Processed ' + processedCount + ' emails');
}

/**
 * Determines the type of SailTime email
 */
function determineEmailType(email) {
  const subject = email.getSubject();
  const body = email.getPlainBody();
  
  if (subject.includes('Reservation Created') || body.includes('reservation scheduled for')) {
    return 'new_reservation';
  } else if (subject.includes('Reservation Canceled') || body.includes('has been canceled')) {
    return 'cancellation';
  } else if (subject.includes('Confirmation') || body.includes('time to confirm your reservation')) {
    return 'confirmation_reminder';
  }
  
  return 'unknown';
}

/**
 * Processes a new reservation email
 */
function processNewReservation(email) {
  try {
    // Extract the date and time from the email
    const body = email.getPlainBody();
    const extractionResult = extractReservationDateTime(body);
    
    if (!extractionResult.success) {
      Logger.log('Failed to extract date/time: ' + extractionResult.message);
      return false;
    }
    
    // Determine if it's a day sail or overnight based on time
    const startDateTime = extractionResult.dateTime;
    const startHour = startDateTime.getHours();
    
    let eventTitle, duration;
    if (startHour >= 6 && startHour <= 12) {
      // Morning sail (day sail)
      eventTitle = 'Sailing: ' + CONFIG.boatName + ' - Day Sail';
      duration = CONFIG.daySailDuration;
    } else {
      // Evening sail (overnight)
      eventTitle = 'Sailing: ' + CONFIG.boatName + ' - Overnight Sail';
      duration = CONFIG.overnightDuration;
    }
    
    // Calculate end time
    const endDateTime = new Date(startDateTime.getTime());
    endDateTime.setHours(endDateTime.getHours() + Math.floor(duration));
    endDateTime.setMinutes(endDateTime.getMinutes() + (duration % 1) * 60);
    
    // Create calendar event
    createCalendarEvent(eventTitle, startDateTime, endDateTime);
    
    return true;
  } catch (error) {
    Logger.log('Error processing new reservation: ' + error.toString());
    return false;
  }
}

/**
 * Processes a cancellation email
 */
function processCancellation(email) {
  try {
    // Extract the date and time from the email
    const body = email.getPlainBody();
    const extractionResult = extractCancellationDateTime(body);
    
    if (!extractionResult.success) {
      Logger.log('Failed to extract cancellation date/time: ' + extractionResult.message);
      return false;
    }
    
    // Find and delete the calendar event
    const startDateTime = extractionResult.dateTime;
    const endOfDay = new Date(startDateTime);
    endOfDay.setHours(23, 59, 59);
    
    // Search for events on this day with the boat name
    const events = CalendarApp.getCalendarById(CONFIG.calendarId)
      .getEvents(startDateTime, endOfDay, {search: CONFIG.boatName});
    
    if (events.length === 0) {
      Logger.log('No matching events found for cancellation.');
      return true; // Mark as processed even if we didn't find an event
    }
    
    // Delete all matching events
    for (const event of events) {
      event.deleteEvent();
    }
    
    Logger.log('Deleted ' + events.length + ' events for cancellation.');
    return true;
  } catch (error) {
    Logger.log('Error processing cancellation: ' + error.toString());
    return false;
  }
}

/**
 * Processes a confirmation reminder email
 */
function processConfirmationReminder(email) {
  try {
    // Extract the date and time from the email
    const body = email.getPlainBody();
    const extractionResult = extractReservationDateTime(body);
    
    if (!extractionResult.success) {
      Logger.log('Failed to extract confirmation date/time: ' + extractionResult.message);
      return false;
    }
    
    // Create a reminder event for today
    const now = new Date();
    const reminderStart = new Date(now);
    reminderStart.setHours(20, 0, 0); // 8:00 PM today
    
    const reminderEnd = new Date(reminderStart);
    reminderEnd.setMinutes(reminderStart.getMinutes() + 15); // 15-minute event
    
    // Format the date for the title
    const reservationDateStr = Utilities.formatDate(
      extractionResult.dateTime, 
      Session.getScriptTimeZone(), 
      'MMM dd'
    );
    
    const reminderTitle = '⚠️ CONFIRM SAILTIME RESERVATION for ' + reservationDateStr;
    
    // Create calendar event
    const event = CalendarApp.getCalendarById(CONFIG.calendarId)
      .createEvent(
        reminderTitle,
        reminderStart,
        reminderEnd,
        {
          description: 'Log into https://embark.sailtime.com to confirm your sailing reservation.',
          location: 'https://embark.sailtime.com'
        }
      );
    
    // Add popup notification
    event.addPopupReminder(0); // Notify at event time
    
    return true;
  } catch (error) {
    Logger.log('Error processing confirmation reminder: ' + error.toString());
    return false;
  }
}

/**
 * Extracts reservation date and time from email body
 */
function extractReservationDateTime(body) {
  try {
    // Pattern for "You have an Embark reservation scheduled for May 06, 2025 at 10:30 am."
    const pattern = /(?:scheduled|reservation on|confirm your reservation on)[^A-Za-z0-9]+((?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},?\s+\d{4})[^0-9]+((?:\d{1,2}:\d{2})\s*(?:am|pm|AM|PM))/i;
    
    const match = body.match(pattern);
    if (!match) {
      // Try fallback patterns
      return extractWithFallbackPatterns(body);
    }
    
    const dateStr = match[1].trim();
    const timeStr = match[2].trim();
    
    // Parse the date and time
    const dateTime = parseDateTime(dateStr, timeStr);
    if (!dateTime) {
      return {
        success: false,
        message: 'Failed to parse date/time: ' + dateStr + ' ' + timeStr
      };
    }
    
    return {
      success: true,
      dateTime: dateTime
    };
  } catch (error) {
    return {
      success: false,
      message: 'Error extracting date/time: ' + error.toString()
    };
  }
}

/**
 * Extracts cancellation date and time from email body
 */
function extractCancellationDateTime(body) {
  try {
    // Pattern for cancellation emails
    const pattern = /(?:your boat name|your) [^"]+ reservation on ([A-Za-z]+ \d{1,2} \d{4} \d{1,2}:\d{2}(?:am|pm))/i;
    
    const match = body.match(pattern);
    if (!match) {
      // Try fallback patterns
      return extractWithFallbackPatterns(body);
    }
    
    const dateTimeStr = match[1].trim();
    
    // Parse the combined date and time
    const dateTime = new Date(dateTimeStr);
    if (isNaN(dateTime.getTime())) {
      return {
        success: false,
        message: 'Failed to parse cancellation date/time: ' + dateTimeStr
      };
    }
    
    return {
      success: true,
      dateTime: dateTime
    };
  } catch (error) {
    return {
      success: false,
      message: 'Error extracting cancellation date/time: ' + error.toString()
    };
  }
}

/**
 * Fallback patterns for date/time extraction
 */
function extractWithFallbackPatterns(body) {
  // First try to extract a date
  const datePattern = /(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},?\s+\d{4}/i;
  const dateMatch = body.match(datePattern);
  
  if (!dateMatch) {
    return {
      success: false,
      message: 'Could not find a date in the email'
    };
  }
  
  // Then try to extract a time
  const timePattern = /(\d{1,2}:\d{2}\s*(?:am|pm|AM|PM))/i;
  const timeMatch = body.match(timePattern);
  
  if (!timeMatch) {
    return {
      success: false,
      message: 'Could not find a time in the email'
    };
  }
  
  // Parse the date and time
  const dateStr = dateMatch[0].trim();
  const timeStr = timeMatch[0].trim();
  
  const dateTime = parseDateTime(dateStr, timeStr);
  if (!dateTime) {
    return {
      success: false,
      message: 'Failed to parse date/time: ' + dateStr + ' ' + timeStr
    };
  }
  
  return {
    success: true,
    dateTime: dateTime
  };
}

/**
 * Parse date and time strings into a Date object
 */
function parseDateTime(dateStr, timeStr) {
  try {
    // Normalize the date string (remove any extra commas, spaces)
    dateStr = dateStr.replace(/\s+/g, ' ').trim();
    
    // Normalize the time string (ensure space before am/pm)
    timeStr = timeStr.replace(/([ap]m)/i, ' $1').replace(/\s+/g, ' ').trim();
    
    // Combine date and time
    const dateTimeStr = dateStr + ' ' + timeStr;
    
    // Parse the date
    const dateTime = new Date(dateTimeStr);
    
    // Validate the date
    if (isNaN(dateTime.getTime())) {
      Logger.log('Invalid date: ' + dateTimeStr);
      return null;
    }
    
    return dateTime;
  } catch (error) {
    Logger.log('Error parsing date/time: ' + error.toString());
    return null;
  }
}

/**
 * Creates a calendar event for the sailing reservation
 */
function createCalendarEvent(title, startDateTime, endDateTime) {
  // Check if an event already exists to avoid duplicates
  const existingEvents = CalendarApp.getCalendarById(CONFIG.calendarId)
    .getEvents(
      startDateTime, 
      new Date(startDateTime.getTime() + 60000), // 1 minute after start
      {search: CONFIG.boatName}
    );
  
  if (existingEvents.length > 0) {
    Logger.log('Event already exists for this time.');
    return;
  }
  
  // Create description with access codes
  const description = `SailTime Reservation at Horn Point Marina\n\n` +
                      `Important Access Codes:\n` +
                      `- Ice Box Code: ${CONFIG.iceBoxCode}\n` +
                      `- Bathroom Code: ${CONFIG.bathroomCode}`;
  
  // Create the event
  const event = CalendarApp.getCalendarById(CONFIG.calendarId)
    .createEvent(
      title,
      startDateTime,
      endDateTime,
      {
        description: description,
        location: CONFIG.location
      }
    );
  
  // Add reminders
  for (const minutes of CONFIG.calendarAlerts) {
    event.addPopupReminder(minutes);
  }
  
  // After creating the event, send task creation email
  // Determine the sail type from the title
  const eventType = title.includes("Day Sail") ? "Day Sail" : "Overnight Sail";
  sendTaskCreationEmail(title, startDateTime, eventType);
  
  Logger.log('Created calendar event: ' + title + ' at ' + startDateTime);
}

/**
 * Sends an email with Bonobo Actions task creation links
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
    
    // Format date for Bonobo Actions (ISO format)
    const isoDate = Utilities.formatDate(
      eventDate, 
      Session.getScriptTimeZone(), 
      'yyyy-MM-dd'
    );
    
    // Calculate confirmation due date (3 days before event)
    const confirmationDate = new Date(eventDate);
    confirmationDate.setDate(confirmationDate.getDate() - 3);
    const isoConfirmationDate = Utilities.formatDate(
      confirmationDate,
      Session.getScriptTimeZone(),
      'yyyy-MM-dd'
    );
    
    // Create HTML email with links
    const emailSubject = `Sailing Task Creation: ${formattedDate}`;
    
    // Create packing list based on sail type
    let packingList = '';
    
    if (eventType === "Day Sail") {
      // Day Sail packing list
      packingList = [
        '## DUFFEL BAG:%0A',
        'Life jacket (mine)',
        "Zach's life jacket",
        'Extra beach towel',
        'External monitor',
        'Extra solar battery',
        'Extra water bottle',
        'Land shoes',
        'Chappy wrap blanket',
        'Sailing safety tether',
        'Spring line trainer',
        'Dop kit containing:%0A-- Deodorant%0A-- Solid cologne%0A-- Shampoo%0A-- Dr. Bronners soap%0A-- Body wash',
        '%0A## DAY PACK:%0A',
        'Sunglasses',
        'Hat',
        'Hat clip',
        'Croakies',
        'Sailing gloves',
        'Multitool',
        'Knife',
        'Nav setup',
        'Nav kit',
        'Sailing logs',
        'Notebook',
        'Pencil',
        'Wax pencil',
        'Pen',
        'Multi-charger',
        'Power adapter',
        'Solar battery',
        'Solar battery clamp',
        'Flashlight',
        'Hand bearing compass',
        'Packable cooler bag',
        'Hand towel',
        'Beach towel',
        'Hand sanitizer',
        'Dop kit containing:%0A-- Sunscreen%0A-- First aid kit%0A-- Moleskine%0A-- Blister balm%0A-- Seasickness pills%0A-- Arnica cream%0A-- Foot cream%0A-- Moisturizer'
      ].map(item => `- ${item}`).join('%0A');
    } else {
      // Overnight Sail packing list - can be updated later
      packingList = [
        '## DUFFEL BAG:%0A',
        'Life jacket (mine)',
        "Zach's life jacket",
        'Extra beach towel',
        'External monitor',
        'Extra solar battery',
        'Extra water bottle',
        'Land shoes',
        'Chappy wrap blanket',
        'Sailing safety tether',
        'Dop kit containing:%0A-- Deodorant%0A-- Solid cologne%0A-- Shampoo%0A-- Dr. Bronners soap%0A-- Body wash',
        'Extra clothes for overnight',
        'Sleeping bag',
        'Pillow',
        '%0A## DAY PACK:%0A',
        'Sunglasses',
        'Hat',
        'Hat clip',
        'Croakies',
        'Sailing gloves',
        'Multitool',
        'Knife',
        'Nav setup',
        'Nav kit',
        'Sailing logs',
        'Notebook',
        'Pencil',
        'Wax pencil',
        'Pen',
        'Multi-charger',
        'Power adapter',
        'Solar battery',
        'Solar battery clamp',
        'Flashlight',
        'Hand bearing compass',
        'Packable cooler bag',
        'Hand towel',
        'Beach towel',
        'Hand sanitizer',
        'Dop kit containing:%0A-- Sunscreen%0A-- First aid kit%0A-- Moleskine%0A-- Blister balm%0A-- Seasickness pills%0A-- Arnica cream%0A-- Foot cream%0A-- Moisturizer'
      ].map(item => `- ${item}`).join('%0A');
    }
    
    // Create the email body with clickable links
    const emailBody = `
      <h2>Sailing Task Creation for ${formattedDate}</h2>
      <p>Your sailing event has been added to your calendar. Click the links below to create tasks in Bonobo Actions:</p>
      
      <h3>Create Packing Task</h3>
      <p><a href="bonoboapp://x-callback-url/create?title=Pack for ${eventType} on ${formattedDate}&note=Sailing Packing List:%0A${packingList}&dueDate=${isoDate}">
        Create Packing Task in Bonobo Actions
      </a></p>
      
      <h3>Create Confirmation Task</h3>
      <p><a href="bonoboapp://x-callback-url/create?title=⚠️ CONFIRM SAILING RESERVATION for ${formattedDate}&note=Log into https://embark.sailtime.com to confirm reservation.&priority=high&dueDate=${isoConfirmationDate}">
        Create Confirmation Task in Bonobo Actions
      </a></p>
      
      <p><i>Note: These links will only work when opened on your iOS device with Bonobo Actions installed.</i></p>
    `;
    
    // Send the email
    GmailApp.sendEmail(
      CONFIG.userEmail,
      emailSubject,
      "This email contains links to create tasks in Bonobo Actions. Please view in HTML.",
      {htmlBody: emailBody}
    );
    
    Logger.log('Sent task creation email for: ' + eventTitle);
    
  } catch (error) {
    Logger.log('Error sending task creation email: ' + error.toString());
  }
}

/**
 * Gets unprocessed SailTime emails
 */
function getUnprocessedEmails() {
  const sailTimeLabel = GmailApp.getUserLabelByName(CONFIG.emailLabel);
  
  if (!sailTimeLabel) {
    Logger.log('SailTime label not found. Please create the label first.');
    return [];
  }
  
  const processedLabel = GmailApp.getUserLabelByName(CONFIG.processedLabel);
  
  // Get all threads with the SailTime label
  const allThreads = sailTimeLabel.getThreads();
  
  // Filter out processed threads
  const unprocessedThreads = [];
  for (const thread of allThreads) {
    // Skip threads that have the processed label
    if (processedLabel && thread.getLabels().some(label => label.getName() === CONFIG.processedLabel)) {
      continue;
    }
    
    unprocessedThreads.push(thread);
  }
  
  return unprocessedThreads;
}

/**
 * Marks a thread as processed
 */
function markAsProcessed(thread) {
  const processedLabel = GmailApp.getUserLabelByName(CONFIG.processedLabel);
  if (processedLabel) {
    thread.addLabel(processedLabel);
  }
}

/**
 * Creates a Gmail label if it doesn't already exist
 */
function createLabelIfNeeded(labelName) {
  // Check if the label already exists
  let label = GmailApp.getUserLabelByName(labelName);
  
  // If not, create it
  if (!label) {
    label = GmailApp.createLabel(labelName);
  }
  
  return label;
}

/**
 * Sets up a time-based trigger to run the script three times daily
 * Run this function once to set up the trigger
 */
function setupTrigger() {
  // Delete any existing triggers
  const triggers = ScriptApp.getProjectTriggers();
  for (const trigger of triggers) {
    if (trigger.getHandlerFunction() === 'processSailTimeEmails') {
      ScriptApp.deleteTrigger(trigger);
    }
  }
  
  // Create 3 new triggers to run at specific times
  // Morning check (9 AM)
  ScriptApp.newTrigger('processSailTimeEmails')
    .timeBased()
    .atHour(9)
    .everyDays(1)
    .create();
    
  // Afternoon check (3 PM)
  ScriptApp.newTrigger('processSailTimeEmails')
    .timeBased()
    .atHour(15)
    .everyDays(1)
    .create();
    
  // Evening check (9 PM)
  ScriptApp.newTrigger('processSailTimeEmails')
    .timeBased()
    .atHour(21)
    .everyDays(1)
    .create();
  
  Logger.log('Triggers set up to run processSailTimeEmails three times per day');
}