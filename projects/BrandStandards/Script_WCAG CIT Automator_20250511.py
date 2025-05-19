#!/usr/bin/env python3
"""
CIT Auto-Update Script for WCAG Guidelines
-------------------------------------------
This script automatically checks for updates to the WCAG guidelines and updates
your Context Initialization Template (CIT) file accordingly.

How it works:
1. Fetches the WCAG guidelines webpage
2. Checks for changes in version numbers or dates
3. Updates the CIT file with new information
4. Saves with a new date in the filename format: CIT_ADAcompliance_YYYYMMDD.md

Requirements:
- Python 3.6+
- Required packages: requests, beautifulsoup4, python-dateutil

To set up as a scheduled job:
- On macOS/Linux: Use cron
- On Windows: Use Task Scheduler
"""

import os
import re
import sys
import json
import logging
import requests
import datetime
from pathlib import Path
from bs4 import BeautifulSoup
from dateutil.parser import parse

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("wcag_update.log"),
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger("wcag_updater")

# Configuration - Edit these values
CONFIG = {
    "wcag_url": "https://www.w3.org/TR/WCAG21/",
    "cit_directory": "context-initialization-templates/Behind The Scenes/",
    "cit_filename_pattern": "CIT_ADAcompliance_*.md",
    "min_check_interval_days": 30,  # Only check once a month
    "github_repo_owner": "",        # Your GitHub username (optional)
    "github_repo_name": "",         # Your repo name (optional)
    "github_token": "",             # Your GitHub token (optional)
    "github_push_updates": False    # Whether to push to GitHub
}

def find_latest_cit_file():
    """Find the most recent CIT file based on date in filename."""
    directory = Path(CONFIG["cit_directory"])
    pattern = CONFIG["cit_filename_pattern"].replace("*", "[0-9]*")
    
    if not directory.exists():
        logger.warning(f"Directory {directory} does not exist, using current directory")
        directory = Path(".")
    
    cit_files = list(directory.glob(pattern))
    
    if not cit_files:
        logger.error("No matching CIT files found")
        return None
    
    # Sort by the date in the filename
    latest_file = max(cit_files, key=lambda f: re.search(r"\d{8}", f.name).group(0) if re.search(r"\d{8}", f.name) else "00000000")
    logger.info(f"Latest CIT file: {latest_file}")
    
    return latest_file

def read_cit_file(filepath):
    """Read the CIT file content."""
    try:
        with open(filepath, 'r', encoding='utf-8') as file:
            content = file.read()
        return content
    except Exception as e:
        logger.error(f"Error reading CIT file: {e}")
        return None

def extract_cit_data(content):
    """Extract key information from CIT content."""
    cit_data = {}
    
    # Extract version
    version_match = re.search(r"Current Version: (v[\d\.]+)", content)
    if version_match:
        cit_data["version"] = version_match.group(1)
    
    # Extract last verified date
    last_verified_match = re.search(r"Last Verified: ([A-Za-z]+ \d+, \d{4})", content)
    if last_verified_match:
        cit_data["last_verified"] = last_verified_match.group(1)
    
    # Extract WCAG version
    wcag_version_match = re.search(r"Current required standard: WCAG (\d+\.\d+)", content)
    if wcag_version_match:
        cit_data["wcag_version"] = wcag_version_match.group(1)
    
    return cit_data

def check_wcag_updates():
    """Check WCAG website for updates."""
    try:
        response = requests.get(CONFIG["wcag_url"], timeout=30)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Find the latest version and date
        wcag_data = {}
        
        # Extract WCAG version
        title_element = soup.find("h1", class_="title")
        if title_element:
            version_match = re.search(r"WCAG (\d+\.\d+)", title_element.text)
            if version_match:
                wcag_data["wcag_version"] = version_match.group(1)
        
        # Extract latest date
        date_element = soup.find("time")
        if date_element:
            wcag_data["last_updated"] = date_element.text
        
        # Extract version history if available
        version_history = []
        history_section = soup.find("section", id="changelog") or soup.find("section", id="revision-history")
        if history_section:
            for item in history_section.find_all("li"):
                version_history.append(item.text.strip())
        
        wcag_data["version_history"] = version_history
        
        return wcag_data
    
    except Exception as e:
        logger.error(f"Error checking WCAG updates: {e}")
        return None

def should_update_cit(cit_data, wcag_data):
    """Determine if CIT should be updated based on changes."""
    if not cit_data or not wcag_data:
        return False
    
    # Check if WCAG version has changed
    if "wcag_version" in wcag_data and "wcag_version" in cit_data:
        if wcag_data["wcag_version"] != cit_data["wcag_version"]:
            logger.info(f"WCAG version changed from {cit_data['wcag_version']} to {wcag_data['wcag_version']}")
            return True
    
    # Check if it's been at least a month since last update
    if "last_verified" in cit_data:
        try:
            last_date = parse(cit_data["last_verified"])
            days_since_update = (datetime.datetime.now() - last_date).days
            
            if days_since_update >= CONFIG["min_check_interval_days"]:
                logger.info(f"It's been {days_since_update} days since last update")
                return True
        except Exception as e:
            logger.error(f"Error parsing date: {e}")
    
    # Check if it's the 1st of the month (scheduled update)
    today = datetime.datetime.now()
    if today.day == 1:
        logger.info("It's the first day of the month - scheduled update")
        return True
    
    return False

def update_cit_content(content, wcag_data):
    """Update the CIT content with new WCAG information."""
    today = datetime.datetime.now()
    today_formatted = today.strftime("%B %d, %Y")  # e.g., May 10, 2025
    
    # Update the version
    current_version_match = re.search(r"Current Version: (v[\d\.]+)", content)
    if current_version_match:
        version_parts = current_version_match.group(1).split('.')
        version_parts[-1] = str(int(version_parts[-1]) + 1)  # Increment patch version
        new_version = '.'.join(version_parts)
        content = content.replace(current_version_match.group(0), f"Current Version: {new_version}")
    
    # Update the date
    date_match = re.search(r"Date: (\d{8})", content)
    if date_match:
        today_date = today.strftime("%Y%m%d")
        content = content.replace(date_match.group(0), f"Date: {today_date}")
    
    # Update Last Verified date
    last_verified_match = re.search(r"Last Verified: ([A-Za-z]+ \d+, \d{4})", content)
    if last_verified_match:
        content = content.replace(last_verified_match.group(0), f"Last Verified: {today_formatted}")
    
    # Update Next Auto-Update date
    next_month = today.replace(day=1) + datetime.timedelta(days=32)
    next_month = next_month.replace(day=1)
    next_month_formatted = next_month.strftime("%B %d, %Y")
    
    next_update_match = re.search(r"Next Auto-Update: ([A-Za-z]+ \d+, \d{4})", content)
    if next_update_match:
        content = content.replace(next_update_match.group(0), f"Next Auto-Update: {next_month_formatted}")
    
    # Update WCAG version if needed
    if "wcag_version" in wcag_data:
        wcag_version_match = re.search(r"Current required standard: WCAG (\d+\.\d+)", content)
        if wcag_version_match and wcag_version_match.group(1) != wcag_data["wcag_version"]:
            content = content.replace(
                wcag_version_match.group(0), 
                f"Current required standard: WCAG {wcag_data['wcag_version']}"
            )
    
    # Update version history
    version_history_match = re.search(r"## 📝 Version History\s+```([\s\S]*?)```", content)
    if version_history_match:
        version_history = version_history_match.group(1)
        today_date = today.strftime("%Y%m%d")
        
        # Check if this specific update already exists
        if today_date not in version_history:
            new_history = f"{today_date}: Updated via auto-update script (WCAG verification)\n{version_history}"
            content = content.replace(version_history_match.group(1), new_history)
    
    return content

def save_updated_cit(content):
    """Save the updated CIT file with new date in filename."""
    today = datetime.datetime.now()
    today_date = today.strftime("%Y%m%d")
    new_filename = f"CIT_ADAcompliance_{today_date}.md"
    
    try:
        output_path = Path(CONFIG["cit_directory"]) / new_filename
        
        # Create directory if it doesn't exist
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        
        with open(output_path, 'w', encoding='utf-8') as file:
            file.write(content)
        
        logger.info(f"Updated CIT saved to {output_path}")
        return output_path
    except Exception as e:
        logger.error(f"Error saving updated CIT: {e}")
        return None

def push_to_github(file_path):
    """Push the updated CIT to GitHub if configured."""
    if not CONFIG["github_push_updates"] or not CONFIG["github_token"]:
        logger.info("GitHub push is disabled or token not provided")
        return False
    
    try:
        from github import Github
        
        g = Github(CONFIG["github_token"])
        repo = g.get_user(CONFIG["github_repo_owner"]).get_repo(CONFIG["github_repo_name"])
        
        with open(file_path, 'r', encoding='utf-8') as file:
            content = file.read()
        
        # Get the path relative to the repository
        repo_path = str(file_path)
        if repo_path.startswith(CONFIG["cit_directory"]):
            repo_path = repo_path.replace(CONFIG["cit_directory"], "")
        
        # Check if file exists in repo
        try:
            repo.get_contents(repo_path)
            # File exists, update it
            repo.update_file(
                repo_path,
                f"Auto-update CIT_ADAcompliance_{datetime.datetime.now().strftime('%Y%m%d')}",
                content,
                repo.get_contents(repo_path).sha
            )
        except:
            # File doesn't exist, create it
            repo.create_file(
                repo_path,
                f"Auto-update CIT_ADAcompliance_{datetime.datetime.now().strftime('%Y%m%d')}",
                content
            )
        
        logger.info(f"Successfully pushed to GitHub: {repo_path}")
        return True
    
    except Exception as e:
        logger.error(f"Error pushing to GitHub: {e}")
        return False

def save_execution_record():
    """Save a record of this execution for future reference."""
    try:
        execution_log = Path("wcag_execution_history.json")
        
        # Read existing log if it exists
        if execution_log.exists():
            with open(execution_log, 'r') as f:
                history = json.load(f)
        else:
            history = []
        
        # Add this execution to the log
        history.append({
            "timestamp": datetime.datetime.now().isoformat(),
            "success": True
        })
        
        # Save the log
        with open(execution_log, 'w') as f:
            json.dump(history, f, indent=2)
        
        logger.info("Execution record saved")
    except Exception as e:
        logger.error(f"Error saving execution record: {e}")

def main():
    """Main function to check for updates and update CIT if needed."""
    logger.info("=== Starting WCAG CIT Auto-Update ===")
    
    # Find latest CIT file
    latest_cit = find_latest_cit_file()
    if not latest_cit:
        logger.error("Cannot proceed without a CIT file")
        return False
    
    # Read CIT content
    cit_content = read_cit_file(latest_cit)
    if not cit_content:
        logger.error("Cannot proceed without CIT content")
        return False
    
    # Extract CIT data
    cit_data = extract_cit_data(cit_content)
    logger.info(f"Extracted CIT data: {cit_data}")
    
    # Check WCAG for updates
    wcag_data = check_wcag_updates()
    logger.info(f"WCAG data: {wcag_data}")
    
    # Determine if update needed
    if should_update_cit(cit_data, wcag_data):
        logger.info("Update needed, updating CIT content")
        
        # Update content
        updated_content = update_cit_content(cit_content, wcag_data)
        
        # Save updated CIT
        new_cit_path = save_updated_cit(updated_content)
        if new_cit_path:
            logger.info(f"CIT updated successfully: {new_cit_path}")
            
            # Push to GitHub if configured
            if CONFIG["github_push_updates"]:
                push_to_github(new_cit_path)
            
            # Save execution record
            save_execution_record()
            
            return True
    else:
        logger.info("No update needed at this time")
    
    return False

if __name__ == "__main__":
    success = main()
    if success:
        logger.info("=== WCAG CIT Auto-Update completed successfully ===")
    else:
        logger.info("=== WCAG CIT Auto-Update completed without updates ===")
    sys.exit(0 if success else 1)