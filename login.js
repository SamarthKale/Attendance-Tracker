document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const studentNameInput = document.getElementById('student-name');
    const rollNumberInput = document.getElementById('roll-number');

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const studentName = studentNameInput.value.trim();
        const rollNumber = rollNumberInput.value.trim();

        if (studentName && rollNumber) {
            window.api.login(studentName, rollNumber);
        }
    });
});
