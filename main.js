const { app, BrowserWindow, ipcMain, Menu } = require('electron');
const path = require('path');
const fs = require('fs');

// Define the main custom path for the data folder
const mainCustomDataFolderPath = 'C:\\AttendanceApp_Data'; // Hardcoded main custom path

// Ensure the main custom data folder exists
if (!fs.existsSync(mainCustomDataFolderPath)) {
    fs.mkdirSync(mainCustomDataFolderPath, { recursive: true });
}

let currentDataFilePath = ''; // This will be set dynamically based on the logged-in user

let loginWindow;
let mainWindow;

function createLoginWindow () {
  loginWindow = new BrowserWindow({
    width: 400,
    height: 500,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  });

  loginWindow.loadFile('login.html');

  loginWindow.on('closed', () => {
    loginWindow = null;
  });

  // Open DevTools only in development environment
  if (process.env.NODE_ENV === 'development') {
    loginWindow.webContents.openDevTools();
  }
}

function createMainWindow (studentName, rollNumber) {
  // Create a user-specific subfolder
  const userSpecificFolderPath = path.join(mainCustomDataFolderPath, `User_${rollNumber}`);
  if (!fs.existsSync(userSpecificFolderPath)) {
      fs.mkdirSync(userSpecificFolderPath, { recursive: true });
  }

  // Set the user-specific data file path within the custom user folder
  currentDataFilePath = path.join(userSpecificFolderPath, `attendance_data_${rollNumber}.csv`);

  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    }
  });

  mainWindow.loadFile('index.html');

  // Send student info to the main window
  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.webContents.send('student-info', { studentName, rollNumber });
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Open DevTools only in development environment
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }
}

// CSV Parsing Functions
function fromCSV(csvString) {
    if (!csvString) return [];
    const lines = csvString.trim().split('\n');
    if (lines.length < 2) return [];
    const headerLine = lines.shift();
    const headers = headerLine.split(',');
    return lines.map(line => {
        const values = line.split(',');
        return headers.reduce((obj, header, index) => {
            obj[header] = values[index];
            return obj;
        }, {});
    });
}

function toCSV(data) {
    if (data.length === 0) return '';
    const headers = Object.keys(data[0]);
    const rows = data.map(obj => headers.map(header => obj[header]).join(','));
    return [headers.join(','), ...rows].join('\n');
}

app.whenReady().then(() => {
  // Set application menu to null to remove default menu items
  Menu.setApplicationMenu(null);

  createLoginWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) {
        if (mainWindow) {
            createMainWindow(null, null); // Or handle session
        } else {
            createLoginWindow();
        }
    }
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

// IPC Handlers for Data
ipcMain.on('save-data', (event, data) => {
  try {
    // Ensure currentDataFilePath is set before saving
    if (!currentDataFilePath) {
        console.error('currentDataFilePath is not set. Cannot save data.');
        return;
    }
    const csvData = toCSV(data);
    fs.writeFileSync(currentDataFilePath, csvData, 'utf-8');
  } catch (error) {
    console.error('Failed to save data', error);
  }
});

ipcMain.on('load-data-request', (event) => {
  try {
    // Ensure currentDataFilePath is set before loading
    if (!currentDataFilePath) {
        console.error('currentDataFilePath is not set. Cannot load data.');
        event.sender.send('data-loaded', []);
        return;
    }
    if (fs.existsSync(currentDataFilePath)) {
      const csvData = fs.readFileSync(currentDataFilePath, 'utf-8');
      const data = fromCSV(csvData);
      event.sender.send('data-loaded', data);
    } else {
      event.sender.send('data-loaded', []); // Send empty array if file doesn't exist
    }
  } catch (error) {
    console.error('Failed to load data', error);
    event.sender.send('data-loaded', []); // Send empty on error
  }
});

// IPC Handler for Login
ipcMain.on('login', (event, { studentName, rollNumber }) => {
    if (loginWindow) {
        loginWindow.close();
    }
    createMainWindow(studentName, rollNumber);
});

// IPC Handler for Logout
ipcMain.on('logout', () => {
    if (mainWindow) {
        mainWindow.close();
    }
    createLoginWindow();
});
