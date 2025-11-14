 document.getElementById('backBtn').addEventListener('click', () => {
  window.location.href = 'index.html';  
});

let subjects = [];
document.getElementById('addSubjectBtn').addEventListener('click', () => {
  const subjectName = document.getElementById('subjectName').value.trim();
  const subjectDurationValue = document.getElementById('subjectDuration').value.trim();

  if (!subjectName) {
    alert("Please enter a subject name.");
    return;
  }

  if (!subjectDurationValue || isNaN(subjectDurationValue) || parseInt(subjectDurationValue) <= 0) {
    alert("Please enter a valid subject duration (positive number).");
    return;
  }

  const subjectDuration = parseInt(subjectDurationValue);

  subjects.push({ name: subjectName, duration: subjectDuration });
  document.getElementById('subjectName').value = '';
  document.getElementById('subjectDuration').value = '';
  renderSubjects();
});


function renderSubjects() {
  const subjectsList = document.getElementById('subjectsList');
  subjectsList.innerHTML = '';

  if (subjects.length === 0) {
    subjectsList.textContent = 'No subjects added yet.';
    return;
  }

  subjects.forEach((sub, i) => {
    const div = document.createElement('div');
    div.className = 'subject-item';
    div.innerHTML = `
      <span><strong>${sub.name}</strong> - ${sub.duration} min</span>
      <button onclick="deleteSubject(${i})">🗑️</button>
    `;
    subjectsList.appendChild(div);
  });
}

window.deleteSubject = function(index) {
  subjects.splice(index, 1);
  renderSubjects();
};

document.getElementById('generateScheduleBtn').addEventListener('click', () => {
  const defaultStudy = parseInt(document.getElementById('defaultDuration').value.trim());
  const breakAfter = parseInt(document.getElementById('breakInterval').value.trim());
  const preferredStart = document.getElementById('startTime').value;

  if (isNaN(defaultStudy) || isNaN(breakAfter) || !preferredStart || subjects.length === 0) {
    alert("Please fill all the fields and add at least one subject.");
    return;
  }

  const table = document.getElementById('scheduleTable');
  const tbody = document.getElementById('scheduleBody');
  table.style.display = 'table';
  tbody.innerHTML = '';

  let current = new Date(`1970-01-01T${preferredStart}:00`);
  let minutesSinceLastBreak = 0;

  subjects.forEach((sub, index) => {
    if (minutesSinceLastBreak >= breakAfter) {
      const breakStart = formatTime(current);
      current.setMinutes(current.getMinutes() + 10);
      const breakEnd = formatTime(current);
      const row = tbody.insertRow();
      row.classList.add('break-row');
      const cell = row.insertCell(0);
      cell.colSpan = 3;
      cell.innerHTML = `${breakStart} - ${breakEnd} : Break`;
      minutesSinceLastBreak = 0;
    }

    const start = formatTime(current);
    current.setMinutes(current.getMinutes() + sub.duration);
    const end = formatTime(current);
    const row = tbody.insertRow();
    row.insertCell(0).textContent = `${start} - ${end}`;
    row.insertCell(1).textContent = sub.name;
    const checkboxCell = row.insertCell(2);
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkboxCell.appendChild(checkbox);

    minutesSinceLastBreak += sub.duration;
  });
});

document.getElementById('resetSchedule').addEventListener('click', () => {
  subjects = [];
  document.getElementById('subjectsList').innerHTML = 'No subjects added yet.';
  document.getElementById('scheduleBody').innerHTML = '';
  document.getElementById('scheduleTable').style.display = 'none';
  document.getElementById('subjectName').value = '';
  document.getElementById('subjectDuration').value = '';
  document.getElementById('defaultDuration').value = '';
  document.getElementById('breakInterval').value = '';
  document.getElementById('startTime').value = '';
});

function formatTime(date) {
  const hours = String(date.getHours()).padStart(2, '0');
  const mins = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${mins}`;
}