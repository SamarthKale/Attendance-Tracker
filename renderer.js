document.addEventListener('DOMContentLoaded', () => {
    const icons = {
        attended: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-circle" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/><path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z"/></svg>',
        absent: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-circle" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/><path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/></svg>',
        undo: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-counterclockwise" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M8 3a5 5 0 1 1-4.546 2.914.5.5 0 0 0-.908-.417A6 6 0 1 0 8 2v1z"/><path d="M8 4.466V.534a.25.25 0 0 0-.41-.192L5.23 2.308a.25.25 0 0 0 0 .384l2.36 1.966A.25.25 0 0 0 8 4.466z"/></svg>',
        delete: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16"><path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/><path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/></svg>',
        edit: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16"><path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.813z"/><path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/></svg>'
    };
    const subjectsContainer = document.getElementById('subjects-container');
    const addSubjectForm = document.getElementById('add-subject-form');
    const subjectNameInput = document.getElementById('subject-name');

    // Month Navigation Elements
    const monthDisplay = document.getElementById('month-display');
    const prevMonthBtn = document.getElementById('prev-month-btn');
    const nextMonthBtn = document.getElementById('next-month-btn');

    // Summary Elements
    const overallProgressBar = document.getElementById('overall-progress-bar');
    const overallPercentageSpan = document.getElementById('overall-percentage');
    const overallHoursSpan = document.getElementById('overall-hours');

    // Modal Elements
    const modal = document.getElementById('edit-modal');
    const editForm = document.getElementById('edit-form');
    const cancelEditBtn = document.getElementById('cancel-edit');
    const editSubjectNameSpan = document.getElementById('edit-subject-name');
    const attendedHoursInput = document.getElementById('attended-hours');
    const totalHoursInput = document.getElementById('total-hours');

    // Student Info Display
    const studentInfoDisplay = document.getElementById('student-info-display');
    const logoutBtn = document.getElementById('logout-btn');

    let subjects = {};
    let records = [];
    let viewDate = new Date();
    let subjectToEdit = null;

    // --- Data Loading and Saving ---
    window.api.onDataLoaded((data) => {
        records = data.map((r, index) => ({ ...r, id: index }));
        reconstructSubjects();
        render();
    });

    window.api.loadDataRequest();

    function saveData() {
        const recordsToSave = records.map(({ id, ...rest }) => rest);
        window.api.saveData(recordsToSave);
    }

    function reconstructSubjects() {
        const subjectMap = new Map();
        records.forEach(r => {
            if (!subjectMap.has(r.subjectId)) {
                subjectMap.set(r.subjectId, { name: r.subjectId });
            }
        });
        subjects = Object.fromEntries(subjectMap.entries());
    }

    // --- Rendering ---
    function render() {
        updateMonthDisplay();
        subjectsContainer.innerHTML = '';
        const sortedSubjects = Object.keys(subjects).sort();
        for (const subjectId of sortedSubjects) {
            const subject = subjects[subjectId];
            const card = document.createElement('div');
            card.className = 'card subject-card';
            card.innerHTML = createSubjectCardHTML(subjectId, subject.name);
            subjectsContainer.appendChild(card);
        }
        updateOverallSummary();
    }

    function createSubjectCardHTML(subjectId, subjectName) {
        const { attended, total } = getAttendanceForSubject(subjectId);
        const percentage = total > 0 ? Math.round((attended / total) * 100) : 0;
        const progressBarClass = percentage < 60 ? 'low' : 'high';

        return `
            <div class="subject-card-header">
                <h3>${subjectName}</h3>
                <div class="subject-card-actions">
                    <button class="attended" data-action="attended" data-id="${subjectId}">${icons.attended} Attended</button>
                    <button class="absent" data-action="absent" data-id="${subjectId}">${icons.absent} Absent</button>
                    <button data-action="undo" data-id="${subjectId}">${icons.undo} Undo</button>
                    <button data-action="edit" data-id="${subjectId}">${icons.edit} Edit</button>
                    <button class="delete" data-action="delete" data-id="${subjectId}">${icons.delete}</button>
                </div>
            </div>
            <div class="progress-container">
                <div class="progress-bar-container">
                    <div class="progress-bar ${progressBarClass}" style="width: ${percentage}%;"></div>
                </div>
                <span>${percentage}%</span>
            </div>
            <p class="hours-text">Hours: ${attended} / ${total}</p>
            <p class="goal-text">Goal: 60%</p>
        `;
    }

    function updateOverallSummary() {
        const allMonthRecords = records.filter(r => isSameMonth(new Date(r.timestamp), viewDate));
        const attended = allMonthRecords.filter(r => r.status === 'ATTENDED').length;
        const total = allMonthRecords.length;
        const percentage = total > 0 ? Math.round((attended / total) * 100) : 0;
        const progressBarClass = percentage < 75 ? 'low' : 'high';

        overallProgressBar.className = `progress-bar ${progressBarClass}`;
        overallProgressBar.style.width = `${percentage}%`;
        overallPercentageSpan.textContent = `${percentage}%`;
        overallHoursSpan.textContent = `Hours: ${attended} / ${total}`;
    }

    function updateMonthDisplay() {
        const monthYear = viewDate.toLocaleString('default', { month: 'long', year: 'numeric' });
        monthDisplay.textContent = monthYear;
    }

    // --- Event Handling ---
    addSubjectForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const newSubjectName = subjectNameInput.value.trim();
        if (newSubjectName && !Object.values(subjects).some(s => s.name === newSubjectName)) {
            subjects[newSubjectName] = { name: newSubjectName };
            subjectNameInput.value = '';
            render();
        }
    });

    subjectsContainer.addEventListener('click', (e) => {
        const button = e.target.closest('button[data-action]');
        if (!button) return;

        const action = button.dataset.action;
        const subjectId = button.dataset.id;

        if (action === 'attended' || action === 'absent') {
            records.push({
                id: records.length,
                subjectId: subjectId,
                status: action === 'attended' ? 'ATTENDED' : 'ABSENT',
                timestamp: new Date().toISOString()
            });
        } else if (action === 'undo') {
            const lastRecordIndex = findLastIndex(records, r => r.subjectId === subjectId);
            if (lastRecordIndex > -1) {
                records.splice(lastRecordIndex, 1);
            }
        } else if (action === 'delete') {
            if (confirm(`Are you sure you want to delete the subject "${subjectId}"? This action cannot be undone.`)) {
                records = records.filter(r => r.subjectId !== subjectId);
            }
        } else if (action === 'edit') {
            openEditModal(subjectId);
            return; // Don't re-render immediately
        }
        saveData();
        reconstructSubjects();
        render();
    });

    prevMonthBtn.addEventListener('click', () => {
        viewDate.setMonth(viewDate.getMonth() - 1);
        render();
    });

    nextMonthBtn.addEventListener('click', () => {
        viewDate.setMonth(viewDate.getMonth() + 1);
        render();
    });

    // --- Modal Logic ---
    function openEditModal(subjectId) {
        subjectToEdit = subjectId;
        const { attended, total } = getAttendanceForSubject(subjectId);
        editSubjectNameSpan.textContent = subjectId;
        attendedHoursInput.value = attended;
        totalHoursInput.value = total;
        modal.classList.remove('hidden');
    }

    function closeEditModal() {
        modal.classList.add('hidden');
        subjectToEdit = null;
    }

    editForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const newAttended = parseInt(attendedHoursInput.value, 10);
        const newTotal = parseInt(totalHoursInput.value, 10);

        if (newAttended > newTotal) {
            alert('Attended hours cannot be greater than total hours.');
            return;
        }

        handleManualEdit(subjectToEdit, newAttended, newTotal);
        closeEditModal();
    });

    cancelEditBtn.addEventListener('click', closeEditModal);

    function handleManualEdit(subjectId, newAttended, newTotal) {
        // 1. Remove all records for the current subject in the current month
        records = records.filter(r => !(r.subjectId === subjectId && isSameMonth(new Date(r.timestamp), viewDate)));

        // 2. Add new records to match the desired state
        const newAbsent = newTotal - newAttended;
        const month = viewDate.getMonth();
        const year = viewDate.getFullYear();

        for (let i = 0; i < newAttended; i++) {
            records.push({ id: records.length, subjectId, status: 'ATTENDED', timestamp: new Date(year, month, 1).toISOString() });
        }
        for (let i = 0; i < newAbsent; i++) {
            records.push({ id: records.length, subjectId, status: 'ABSENT', timestamp: new Date(year, month, 1).toISOString() });
        }

        saveData();
        reconstructSubjects();
        render();
    }

    // --- Utility Functions ---
    function getAttendanceForSubject(subjectId) {
        const subjectRecords = records.filter(r => r.subjectId === subjectId && isSameMonth(new Date(r.timestamp), viewDate));
        const attended = subjectRecords.filter(r => r.status === 'ATTENDED').length;
        return { attended, total: subjectRecords.length };
    }

    function isSameMonth(date1, date2) {
        return date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth();
    }

    function findLastIndex(array, predicate) {
        for (let i = array.length - 1; i >= 0; i--) {
            if (predicate(array[i])) {
                return i;
            }
        }
        return -1;
    }

    // Initial Render
    render();

    // Handle student info from main process
    window.api.onStudentInfo((studentInfo) => {
        if (studentInfoDisplay) {
            // Clear existing content but keep the logout button
            studentInfoDisplay.innerHTML = `
                <p>Welcome, <strong>${studentInfo.studentName}</strong>!</p>
                <p>Roll Number: <strong>${studentInfo.rollNumber}</strong></p>
            `;
            studentInfoDisplay.appendChild(logoutBtn); // Re-append the logout button
        }
    });

    // Add event listener for logout button
    logoutBtn.addEventListener('click', () => {
        saveData(); // Save current user's data before logging out
        window.api.logout(); // Send IPC message to main process to logout
    });
});