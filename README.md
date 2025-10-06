## 📝 Introduction
**Attendance App** is a simple cross-platform desktop attendance tracker built with **Electron**.  
It provides a lightweight UI for adding subjects, tracking attended/total hours, and saving per-user CSV data to a local folder.

---
## 🔗 Connect with Us

Show us some love by starring the repository on GitHub and connecting with us on LinkedIn!

**Abhinaya Gowda**

[![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/AbhinayaGowda)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/abhinaya-gowda)

**Samarth Kale**

[![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/SamarthKale)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/samarth-n-kale)
## 📦 Download

You can download the latest **Windows EXE installer** from Google Drive:

🔗 **[Download Attendance App (Google Drive)](https://drive.google.com/drive/folders/19NKG79RGutCyJBh1Ta5asYE2D4QF5u-2?usp=sharing)**  

[![Download EXE](https://img.shields.io/badge/Download-Windows%20EXE-blue?style=for-the-badge&logo=windows)](https://drive.google.com/drive/folders/19NKG79RGutCyJBh1Ta5asYE2D4QF5u-2?usp=sharing)

---

## 📚 Table of Contents
- [Introduction](#-introduction)
- [Download](#-download)
- [Installation (Dev)](#-installation-dev)
- [Running the App (Dev)](#-running-the-app-dev)
- [Building a Windows Installer (EXE)](#-building-a-windows-installer-exe)
- [Usage](#-usage)
- [Features](#-features)
- [Project Structure](#-project-structure)
- [Configuration](#-configuration)
- [Dependencies](#-dependencies)
- [Troubleshooting](#-troubleshooting)
- [Examples](#-examples)
- [Contributors](#-contributors)
- [License](#-license)

---

## ⚙️ Installation (Dev)
To run the project in development mode:

```bash
git clone <your-repo-url>
cd attendance-app
npm install
▶️ Running the App (Dev)
Start the app in development mode with:

bash
Copy code
npm run start
After launching, a login window appears (login.html) where you enter your Name and Roll Number.
Once logged in, the main attendance window (index.html) opens and displays the attendance management interface.

🏗️ Building a Windows Installer (EXE)
To package the app into a Windows installer using electron-builder:

bash
Copy code
npm run build
The output .exe file will be located in the dist/ directory.
You can then upload it to Google Drive or any cloud service to share.

💻 Usage
Launch the app.

Enter your Name and Roll Number on the login screen.

Add subjects and track attendance (attended vs. total classes).

Data automatically saves to a CSV file in:

php-template
Copy code
C:\AttendanceApp_Data\User_<rollNumber>\attendance_data_<rollNumber>.csv
The folder is created automatically the first time you log in.

✨ Features
✅ Simple login system
✅ Add, edit, and delete subjects
✅ Track attendance per subject
✅ Saves data locally in CSV format
✅ Electron-based desktop UI
✅ Automatically creates per-user folders
✅ Windows EXE build available

📁 Project Structure
perl
Copy code
├── index.html           # Main window UI
├── login.html           # Login page
├── login.js             # Login logic
├── main.js              # Electron main process
├── preload.js           # Context bridge and APIs
├── renderer.js          # Frontend logic for main window
├── style.css            # Main window styling
├── login.css            # Login page styling
├── package.json         # App metadata and build scripts
├── package-lock.json    # Dependency lock file
⚙️ Configuration
Data Folder Path:
Default: C:\AttendanceApp_Data
To change it, modify mainCustomDataFolderPath in main.js.

Per-user CSV Path:
attendance_data_<rollNumber>.csv stored in User_<rollNumber> folder.

Build Options:
Defined in package.json under the build section (e.g. productName, appId, etc.).

📦 Dependencies
Install all dependencies with:

bash
Copy code
npm install
Key dependencies:

electron

electron-builder

You can view all dependencies inside package.json.

🧰 Troubleshooting
❌ App doesn’t create data folder
→ Run as Administrator or verify write permissions for C:\AttendanceApp_Data.

❌ CSV not saving
→ Ensure you have successfully logged in (roll number is required to create the folder).

❌ DevTools not opening
→ Set the environment variable:

bash
Copy code
set NODE_ENV=development
and then run:

bash
Copy code
npm run start
🧾 Examples
After logging in with roll number 123, data is saved to:

makefile
Copy code
C:\AttendanceApp_Data\User_123\attendance_data_123.csv
Open the CSV file in Excel or any text editor to view your attendance records.

👥 Contributors
👤 Samarth Kale
👤 Abhinaya Gowda

📜 License
Licensed under the ISC License.
See the LICENSE file or package.json for more details.

🧩 Notes
The application is built using Electron and packaged using Electron Builder.
The default data directory is Windows-specific but can be modified for other OS environments.

Future updates may include cloud sync support and percentage-based attendance visualization.

