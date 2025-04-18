// server.js - Simple Node.js server to handle GitHub template uploads
const express = require('express');
const { Octokit } = require('@octokit/rest');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Enable CORS and JSON body parsing
app.use(cors());
app.use(express.json({ limit: '1mb' }));

// GitHub configuration - load from environment variables
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const OWNER = process.env.GITHUB_OWNER;
const REPO = process.env.GITHUB_REPO;
const BRANCH = process.env.GITHUB_BRANCH || 'main';
const FOLDER_PATH = process.env.GITHUB_FOLDER_PATH || 'context initialization templates';

// Validate required environment variables
if (!GITHUB_TOKEN || !OWNER || !REPO) {
  console.error('Missing required environment variables:');
  if (!GITHUB_TOKEN) console.error('- GITHUB_TOKEN');
  if (!OWNER) console.error('- GITHUB_OWNER');
  if (!REPO) console.error('- GITHUB_REPO');
  process.exit(1);
}

// Initialize GitHub API client
const octokit = new Octokit({ auth: GITHUB_TOKEN });

// API endpoint to upload template to GitHub
app.post('/api/upload-template', async (req, res) => {
  try {
    const { content, filename } = req.body;
    
    // Validate request data
    if (!content) {
      return res.status(400).json({ 
        success: false, 
        message: 'Template content is required' 
      });
    }
    
    if (!filename) {
      return res.status(400).json({ 
        success: false, 
        message: 'Filename is required' 
      });
    }
    
    // Ensure filename has .md extension
    const sanitizedFilename = filename.toLowerCase().endsWith('.md') 
      ? filename 
      : `${filename}.md`;
    
    // Path in the repository
    const path = `${FOLDER_PATH}/${sanitizedFilename}`;
    
    console.log(`Attempting to save template "${sanitizedFilename}" to ${OWNER}/${REPO}`);
    
    // Check if file exists to get its SHA (needed for updates)
    let sha;
    try {
      const { data } = await octokit.repos.getContent({
        owner: OWNER,
        repo: REPO,
        path,
        ref: BRANCH
      });
      sha = data.sha;
      console.log(`File exists, will update existing file with SHA: ${sha}`);
    } catch (error) {
      console.log('File does not exist yet, will create new file');
    }
    
    // Create or update file in GitHub
    const result = await octokit.repos.createOrUpdateFileContents({
      owner: OWNER,
      repo: REPO,
      path,
      message: `Add/update template: ${sanitizedFilename}`,
      content: Buffer.from(content).toString('base64'),
      branch: BRANCH,
      sha // Will be undefined for new files, which is fine
    });
    
    console.log(`Template saved successfully: ${result.data.content.html_url}`);
    
    // Return success response with file URL
    res.json({ 
      success: true,
      message: `Template "${sanitizedFilename}" saved successfully!`,
      url: result.data.content.html_url
    });
  } catch (error) {
    console.error('Error uploading to GitHub:', error);
    
    // Provide friendly error message
    let errorMessage = 'An error occurred while uploading the template';
    
    if (error.status === 401) {
      errorMessage = 'Authentication error - check GitHub token';
    } else if (error.status === 404) {
      errorMessage = 'Repository not found - check owner and repo name';
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    res.status(500).json({ 
      success: false, 
      message: errorMessage
    });
  }
});

// Serve the frontend static files
app.use(express.static(path.join(__dirname, 'public')));

// Inject configuration into index.html
app.get('/', (req, res) => {
  // In a real implementation, you would inject the template data here
  // For security, we DON'T expose the GitHub token to the frontend
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Handle all other routes by serving the frontend (for SPA support)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Configured to save templates to ${OWNER}/${REPO}/${BRANCH}/${FOLDER_PATH}`);
});