/**
 * Updated sendTaskCreationEmail function with mskactions:// URL scheme
 * This function should replace the existing sendTaskCreationEmail in your main script.
 * 
 * Version: 2.3
 * Date: May 7, 2025
 */

/**
 * Sends an email with MSK Actions task creation links
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
    
    // Format date for MSK Actions (ISO format)
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
      // Overnight Sail packing list
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
    
    // Create the email body with clickable links and fallback text templates
    const emailBody = `
      <h2>Sailing Task Creation for ${formattedDate}</h2>
      <p>Your sailing event has been added to your calendar. Click the links below to create tasks in Bonobo Actions:</p>
      
      <div style="margin: 20px 0; padding: 15px; border: 1px solid #ccc; background-color: #f8f8f8; border-radius: 5px;">
        <h3>1. Create Packing Task</h3>
        <p><a href="mskactions://create?title=Pack for ${eventType} on ${formattedDate}&note=Sailing Packing List:%0A${packingList}&dueDate=${isoDate}" style="display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px; margin: 10px 0;">
          Create Packing Task
        </a></p>
        
        <h3>2. Create Confirmation Task</h3>
        <p><a href="mskactions://create?title=⚠️ CONFIRM SAILING RESERVATION for ${formattedDate}&note=Log into https://embark.sailtime.com to confirm reservation.&priority=high&dueDate=${isoConfirmationDate}" style="display: inline-block; padding: 10px 20px; background-color: #f44336; color: white; text-decoration: none; border-radius: 5px; margin: 10px 0;">
          Create Confirmation Task
        </a></p>
      </div>
      
      <p><i>Note: These links will open Bonobo Actions. If the links don't work, try the text templates below.</i></p>
      
      <h3>Manual Task Creation (Backup)</h3>
      <p>If the links above don't work, you can manually create the tasks with this information:</p>
      
      <div style="border: 1px solid #ddd; background-color: #f9f9f9; padding: 15px; margin: 10px 0; border-radius: 5px;">
        <p><strong>Packing Task:</strong></p>
        <p>Title: Pack for ${eventType} on ${formattedDate}</p>
        <p>Due Date: ${isoDate}</p>
        <p>Priority: Medium</p>
        <p>Notes: See email for packing list</p>
      </div>
      
      <div style="border: 1px solid #ddd; background-color: #f9f9f9; padding: 15px; margin: 10px 0; border-radius: 5px;">
        <p><strong>Confirmation Task:</strong></p>
        <p>Title: ⚠️ CONFIRM SAILING RESERVATION for ${formattedDate}</p>
        <p>Due Date: ${isoConfirmationDate}</p>
        <p>Priority: High</p>
        <p>Notes: Log into https://embark.sailtime.com to confirm reservation.</p>
      </div>
      
      <p>Calendar event details:</p>
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
      "Your sailing event has been added to your calendar. Please view in HTML format to see task creation links.",
      {htmlBody: emailBody}
    );
    
    Logger.log('Sent task creation email for: ' + eventTitle);
    
  } catch (error) {
    Logger.log('Error sending task creation email: ' + error.toString());
  }
}