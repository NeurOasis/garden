# Installing Python on macOS for the WCAG Update Script

This guide will walk you through installing Python on your macOS system and setting up the environment for the WCAG update script.

## Step 1: Install Python using Homebrew (Recommended)

Homebrew is a package manager for macOS that makes installing Python and other software easy.

### Install Homebrew (if not already installed)

1. Open Terminal (you can find it using Spotlight or in Applications > Utilities)
2. Paste the following command and press Enter:

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

3. Follow the prompts to complete the installation
4. After installation, you may need to add Homebrew to your PATH. The installer will tell you if this is necessary and provide the commands.

### Install Python using Homebrew

Once Homebrew is installed, installing Python is simple:

```bash
brew install python
```

This installs the latest version of Python 3. To verify the installation:

```bash
python3 --version
```

You should see output like `Python 3.11.4` (version may vary).

## Step 2: Install Required Python Packages

Now that Python is installed, you'll need to install the required packages for the WCAG update script:

```bash
pip3 install requests beautifulsoup4 python-dateutil
```

If you want GitHub integration (optional):

```bash
pip3 install PyGithub
```

## Step 3: Set Up the WCAG Update Script

1. Create a directory for the script:

```bash
mkdir -p ~/Documents/scripts
```

2. Create the script file:

```bash
touch ~/Documents/scripts/wcag_update.py
```

3. Open the file in a text editor:

```bash
open -a TextEdit ~/Documents/scripts/wcag_update.py
```

4. Copy and paste the WCAG update script from our earlier conversation into this file

5. Save the file and close the text editor

6. Make the script executable:

```bash
chmod +x ~/Documents/scripts/wcag_update.py
```

## Step 4: Configure the Script

Edit the script to update the `CONFIG` section with your specific settings:

```bash
open -a TextEdit ~/Documents/scripts/wcag_update.py
```

Find the `CONFIG` section and update these values:

```python
CONFIG = {
    "wcag_url": "https://www.w3.org/TR/WCAG21/",
    "cit_directory": "/Users/YOUR_USERNAME/Documents/context-initialization-templates/Behind The Scenes/",
    "cit_filename_pattern": "CIT_ADAcompliance_*.md",
    "min_check_interval_days": 30,  # Only check once a month
    "github_repo_owner": "",        # Your GitHub username (optional)
    "github_repo_name": "",         # Your repo name (optional)
    "github_token": "",             # Your GitHub token (optional)
    "github_push_updates": False    # Whether to push to GitHub
}
```

Replace `YOUR_USERNAME` with your actual macOS username, and adjust other paths as needed.

## Step 5: Test the Script

Run the script manually to make sure it works:

```bash
python3 ~/Documents/scripts/wcag_update.py
```

Check the output to ensure it's working as expected.

## Step 6: Set Up Automatic Execution with cron

1. Open Terminal and edit your crontab:

```bash
crontab -e
```

This will open an editor (likely vi or nano). If you're not familiar with these editors, you can use:

```bash
EDITOR=nano crontab -e
```

2. Add the following line to run the script on the 1st of each month at midnight:

```
0 0 1 * * /usr/bin/python3 ~/Documents/scripts/wcag_update.py >> ~/Documents/scripts/wcag_update.log 2>&1
```

3. Save and exit the editor:
   - If using vi: Press `Esc`, then type `:wq` and hit Enter
   - If using nano: Press `Ctrl+O` to save, then `Ctrl+X` to exit

## Step 7: Verify Your cron Job

Check that your cron job has been successfully added:

```bash
crontab -l
```

You should see the line you added in step 6.

## Troubleshooting

If you encounter any issues:

1. **Python Path**: If cron can't find Python, use the full path:
   ```
   which python3
   ```
   Use the output as the python path in your cron job.

2. **Permission Issues**: Ensure your script has execute permissions and your user has permission to access the CIT directory.

3. **Logging**: Check the log file after the script runs:
   ```
   cat ~/Documents/scripts/wcag_update.log
   ```

4. **Manual Testing**: Try running the exact command from your crontab manually to see if there are any errors.

## Additional Resources

- [Official Python Documentation](https://docs.python.org/3/)
- [Homebrew Documentation](https://docs.brew.sh/)
- [Cron Documentation](https://man.freebsd.org/crontab/5)
