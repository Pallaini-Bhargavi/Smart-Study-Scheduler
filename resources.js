        const form = document.getElementById('resourceForm');
        const subjectInput = document.getElementById('subjectInput');
        const topicInput = document.getElementById('topicInput');
        const linkInput = document.getElementById('linkInput');
        const resourcesTableBody = document.querySelector('#resourcesTable tbody');

        let resources = JSON.parse(localStorage.getItem('studyResources')) || [];

        function formatDate(dateString) {
            const d = new Date(dateString);
            return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
        }

        function formatTime(dateString) {
            const d = new Date(dateString);
            return d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
        }

        function renderResources() {
            resourcesTableBody.innerHTML = '';

            resources.forEach(({ subject, topic, link, createdAt }, index) => {
                const tr = document.createElement('tr');

                const tdSubject = document.createElement('td');
                tdSubject.textContent = subject;

                const tdTopic = document.createElement('td');
                tdTopic.textContent = topic;

                const tdLink = document.createElement('td');
                const a = document.createElement('a');
                a.href = link;
                a.textContent = link;
                a.target = "_blank";
                tdLink.appendChild(a);

                const tdDate = document.createElement('td');
                tdDate.textContent = formatDate(createdAt);

                const tdTime = document.createElement('td');
                tdTime.textContent = formatTime(createdAt);

                const tdAction = document.createElement('td');
                const delBtn = document.createElement('button');
                delBtn.classList.add('delete-btn');
                delBtn.textContent = 'Delete';
                delBtn.addEventListener('click', () => {
                    if (confirm(`Delete resource "${topic}" for "${subject}"?`)) {
                        resources.splice(index, 1);
                        localStorage.setItem('studyResources', JSON.stringify(resources));
                        renderResources();
                    }
                });
                tdAction.appendChild(delBtn);

                tr.appendChild(tdSubject);
                tr.appendChild(tdTopic);
                tr.appendChild(tdLink);
                tr.appendChild(tdDate);
                tr.appendChild(tdTime);
                tr.appendChild(tdAction);

                resourcesTableBody.appendChild(tr);
            });
        }

        form.addEventListener('submit', e => {
            e.preventDefault();
            const subject = subjectInput.value.trim();
            const topic = topicInput.value.trim();
            const link = linkInput.value.trim();
            const createdAt = new Date().toISOString();

            if (subject && topic && link) {
                resources.push({ subject, topic, link, createdAt });
                localStorage.setItem('studyResources', JSON.stringify(resources));
                renderResources();
                form.reset();
            }
        });

        renderResources();
        document.getElementById('backBtn').addEventListener('click', () => {
            window.location.href = 'index.html';
        });
