document.addEventListener('DOMContentLoaded', function () {
  const subjectsContainer = document.getElementById('subjectsContainer');
  const addSubjectBtn = document.getElementById('addSubject');
  const form = document.getElementById('studyForm');
  const scheduleOutput = document.getElementById('scheduleOutput');
  const resetBtn = document.getElementById('resetSchedule');

  document.getElementById('backBtn').addEventListener('click', () => {
    window.location.href = 'index.html';
  });

  function createSubjectInput() {
    const div = document.createElement('div');
    div.classList.add('subject');

    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.placeholder = 'Subject Name';
    nameInput.className = 'subjectName';
    nameInput.required = true;

    const hourInput = document.createElement('input');
    hourInput.type = 'number';
    hourInput.placeholder = 'Hours Needed';
    hourInput.className = 'subjectHours';
    hourInput.min = 1;
    hourInput.required = true;

    const delBtn = document.createElement('button');
    delBtn.type = 'button';
    delBtn.textContent = '🗑️';
    delBtn.className = 'delete-btn';
    delBtn.style.marginLeft = '8px';
    delBtn.onclick = () => {
      const allSubjects = subjectsContainer.querySelectorAll('.subject');
      if (allSubjects.length > 1) {
        div.remove();
      } else {
        alert('At least one subject must be added.');
      }
    };

    div.appendChild(nameInput);
    div.appendChild(hourInput);
    div.appendChild(delBtn);
    return div;
  }

  subjectsContainer.innerHTML = '';
  subjectsContainer.appendChild(createSubjectInput());

  addSubjectBtn.addEventListener('click', () => {
    subjectsContainer.appendChild(createSubjectInput());
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const startTime = document.getElementById('startTime').value;
    const totalHours = parseInt(document.getElementById('totalHours').value);
    const subjectNames = Array.from(document.getElementsByClassName('subjectName'));
    const subjectHours = Array.from(document.getElementsByClassName('subjectHours'));

    if (!startTime || !totalHours || subjectNames.some(s => !s.value.trim()) || subjectHours.some(h => !h.value)) {
      alert('Please fill out all fields before submitting.');
      return;
    }

    const subjects = subjectNames.map((el, idx) => ({
      name: el.value.trim(),
      hours: parseInt(subjectHours[idx].value)
    }));

    generateSchedule(startTime, totalHours, subjects);
    resetBtn.style.display = 'inline-block';
  });

  resetBtn.addEventListener('click', () => {
    scheduleOutput.innerHTML = '';
    form.reset();
    subjectsContainer.innerHTML = '';
    subjectsContainer.appendChild(createSubjectInput());
    resetBtn.style.display = 'none';
  });
});

function generateSchedule(startTime, totalHours, subjects) {
  const output = document.getElementById('scheduleOutput');
  output.innerHTML = '<h3>Generated Schedule</h3>';

  const table = document.createElement('table');
  const headerRow = table.insertRow();
  headerRow.innerHTML = '<th>Time</th><th>Subject</th><th>Done</th>';

  let [hours, minutes] = startTime.split(':').map(Number);
  const totalSubjectHours = subjects.reduce((sum, s) => sum + s.hours, 0);
  const hourPerUnit = totalHours / totalSubjectHours;

  let slotCount = 0;

  subjects.forEach(subject => {
    const slots = Math.round(subject.hours * hourPerUnit);
    for (let i = 0; i < slots; i++) {
      // Add study row
      const row = table.insertRow();
      const timeCell = row.insertCell();
      const subjectCell = row.insertCell();
      const checkboxCell = row.insertCell();

      const currentTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
      timeCell.textContent = currentTime;
      subjectCell.textContent = subject.name;

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkboxCell.appendChild(checkbox);

      // Increment time
      hours++;
      if (hours >= 24) hours = 0;

      slotCount++;

      // After every 2 study slots, add a break
      if (slotCount % 2 === 0) {
        const breakRow = table.insertRow();
        const breakCell = breakRow.insertCell();
        breakCell.colSpan = 3;
        breakCell.textContent = 'Break';

        breakRow.classList.add('break');
        breakCell.classList.add('break-cell');

        hours++;
        if (hours >= 24) hours = 0;
      }
    }
  });

  output.appendChild(table);
}
