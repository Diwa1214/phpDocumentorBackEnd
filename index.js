const express = require('express');
const axios = require('axios');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();

app.use(cors());




const projectPath = path.join(__dirname, '../mso/app');

// Function to recursively read all file paths in the project folder
function readProjectFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      readProjectFiles(filePath, fileList);
    } else {
      fileList.push(filePath);
    }
  });
  return fileList;
}

// Endpoint to get project data (list of file paths)
app.get('/getProjectData', (req, res) => {
  const projectData = readProjectFiles(projectPath);
  res.json(projectData);
});

// Endpoint to get file content
app.get('/getFileContent', (req, res) => {
  const filePath = req.query.filePath;
  fs.readFile(filePath, 'utf-8', (err, data) => {
    if (err) {
      res.status(500).send('Error reading file');
    } else {
      res.send(data);
    }
  });
});

// Endpoint to search filenames based on content query
app.get('/searchFilenames', (req, res) => {
  const searchQuery = req.query.query.toLowerCase();
  const projectData = readProjectFiles(projectPath);
  const matchingFiles = [];

  projectData.forEach(filePath => {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    if (fileContent.toLowerCase().includes(searchQuery)) {
      matchingFiles.push(filePath);
    }
  });

  res.json(matchingFiles);
});

const port = 3001;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});