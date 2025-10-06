const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  saveData: (data) => ipcRenderer.send('save-data', data),
  loadDataRequest: () => ipcRenderer.send('load-data-request'),
  onDataLoaded: (callback) => ipcRenderer.on('data-loaded', (_event, value) => callback(value)),
  login: (studentName, rollNumber) => ipcRenderer.send('login', { studentName, rollNumber }),
  onStudentInfo: (callback) => ipcRenderer.on('student-info', (_event, value) => callback(value)),
  logout: () => ipcRenderer.send('logout')
});
