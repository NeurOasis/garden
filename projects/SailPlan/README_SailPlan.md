# SailPlan Automation System

## 👋 Welcome!

Welcome to the SailPlan Automation System! This powerful tool automatically processes your sailing reservation emails, creates calendar events, and helps you prepare for your time on the water with minimal effort.

## 📝 What's This All About?

SailPlan is a personal automation system designed to:

- **Process emails** from SailTime's Embark platform
- **Create calendar events** for your sailing reservations
- **Set up reminders** to confirm your bookings
- **Generate packing lists** for day sails and overnight trips
- **Handle cancellations** and time changes automatically

Think of it as your personal sailing assistant that makes sure you never miss a reservation or forget to bring essential gear on your sailing trips!

## 🗂️ What's Included

### Core Components

- **SailPlan Script**: Google Apps Script that processes emails and manages your calendar
- **Implementation Guide**: Step-by-step instructions for setting up the automation
- **Context Initialization Template**: Reference document with all configuration details

### Key Features

- **Email Processing**: Automatically detects reservation, cancellation, confirmation, and time change emails
- **Calendar Integration**: Creates and updates events with proper timing and alerts
- **Task Creation**: Generates packing and confirmation tasks with appropriate due dates
- **Dual Sail Types**: Different handling for day sails and overnight sails

## ⚙️ System Overview

SailPlan works as a complete pipeline:

1. **Email Detection**: Monitors your Gmail account for emails from SailTime
2. **Type Classification**: Identifies what kind of email was received
3. **Date Extraction**: Pulls reservation details from email text
4. **Calendar Management**: Creates/updates/deletes events as needed
5. **Task Generation**: Sets up reminders for packing and confirmation

## 🔄 Types of Emails Handled

SailPlan processes four types of SailTime emails:

- **New Reservation**: Creates calendar events and sends task creation emails
- **Cancellation**: Removes calendar events and notifies you
- **Confirmation Reminder**: Creates urgent reminders to confirm your reservation
- **Time Change**: Updates calendar event durations and start times

## 📅 Calendar Event Management

The system creates detailed calendar events with:

- **Smart Naming**: "Sailing: [Boat Name] - [Sail Type]"
- **Multiple Reminders**: 7 days, 3 days, 2 days, and 18 hours before sailing
- **Complete Details**: Location, access codes, and reservation information
- **Appropriate Duration**: Different lengths for day sails and overnight sails

## 📋 Task Creation

SailPlan helps you prepare for your sailing trip by:

- **Creating Packing Lists**: Comprehensive lists of what to bring
- **Setting Confirmation Reminders**: High-priority tasks for timely reservation confirmation
- **Assigning Due Dates**: Automatically calculated based on sail date

## 🛠️ Implementation Options

There are two ways to implement SailPlan:

### Google Apps Script (Recommended)
- Runs directly in Google's cloud
- Works with Gmail and Google Calendar
- No need for your devices to be on
- Processes emails automatically

### iOS Shortcuts
- Runs on your iPhone/iPad
- Works with your email app and Apple Calendar
- Requires manual triggering or specific automation setup
- Good for users who prefer direct control

## 🚀 Getting Started

To get started with SailPlan:

1. Decide whether to use Google Apps Script or iOS Shortcuts
2. Follow the Implementation Guide for your chosen platform
3. Configure the system with your personal details (boat name, marina, etc.)
4. Test with a sample email to ensure everything works
5. Let the system handle your sailing reservations automatically!

## 🙋 Common Questions

**Q: Will this work with email providers other than Gmail?**  
A: The Google Apps Script version requires Gmail. The iOS Shortcuts version works with most email providers.

**Q: Do I need programming experience to set this up?**  
A: No! The Implementation Guide walks you through every step with clear instructions.

**Q: Can I customize the packing lists?**  
A: Yes, you can edit the packing lists in the script to match your personal needs.

**Q: What happens if the system doesn't recognize an email?**  
A: The email remains unprocessed and you'll need to handle it manually. You can improve recognition by updating the patterns in the configuration.

## ✨ Remember

The SailPlan system is designed to save you time and reduce stress around your sailing reservations. Once set up, it requires minimal maintenance - just check your calendar and pack for your sailing adventures!

Happy Sailing! ⛵