document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.querySelector('.sidebar');
    const sidebarItems = document.querySelectorAll('.sidebar-menu li');
    const mainContent = document.querySelector('.main-content');
    const submenu = document.querySelector('.submenu');
    const submenuList = document.querySelector('.submenu-list');

    // Submenu items for each category
    const submenus = {
        'Dashboard': ['Overview', 'Reports', 'Statistics'],
        'Student Academics': ['Enrollments', 'Grades', 'Attendance'],
        'Human Resource': ['Staff List', 'Leaves', 'Recruitment'],
        'Work Flow Management': ['Tasks', 'Processes', 'Approval']
    };

    // Content for each submenu
    const contentMap = {
        'Overview': async () => {
                        const response = await fetch('/overview');
                        return await response.text();
                    },
        'Reports': async () => {
                        const response = await fetch('/reports');
                        return await response.text();
                    },
        'Statistics': `<div class="topbar"><h3>Dashboard Statistics</h3></div><p>Statistics content goes here.</p>`,

        'Enrollments': `<div class="topbar"><h3>Student Enrollments</h3></div><p>Enrollment data here.</p>`,
        'Grades': `<div class="topbar"><h3>Student Grades</h3></div><p>Grades content here.</p>`,
        'Attendance': `<div class="topbar"><h3>Student Attendance</h3></div><p>Attendance content here.</p>`,

        'Staff List': `<div class="topbar"><h3>Staff List</h3></div><p>Staff List content here.</p>`,
        'Leaves': `<div class="topbar"><h3>Staff Leaves</h3></div><p>Leaves content here.</p>`,
        'Recruitment': `<div class="topbar"><h3>Recruitment</h3></div><p>Recruitment content here.</p>`,

        'Tasks': `<div class="topbar"><h3>Tasks</h3></div><p>Tasks content here.</p>`,
        'Processes': `<div class="topbar"><h3>Processes</h3></div><p>Processes content here.</p>`,
        'Approval': `<div class="topbar"><h3>Approval</h3></div><p>Approval content here.</p>`
    };

    // Function to populate submenu when a sidebar category is clicked
    function populateSubmenu(category) {
        submenuList.innerHTML = '';
        submenus[category].forEach(sub => {
            const li = document.createElement('li');
            li.textContent = sub;
            submenuList.appendChild(li);

            // Click on submenu item updates sub-content
            li.addEventListener('click', async () => {
                mainContent.innerHTML = await contentMap[sub]() || `<p>Content not found</p>`;

                // Highlight the selected submenu item
                submenuList.querySelectorAll('li').forEach(i => i.classList.remove('active'));
                li.classList.add('active');
            });
        });
        submenu.classList.add('active');
    }

    // Sidebar item click to show submenu
    sidebarItems.forEach(item => {
        item.addEventListener('click', () => {
            // Highlight active sidebar
            sidebarItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');

            // Expand sidebar
            sidebar.classList.add('active');

            const category = item.dataset.category;
            populateSubmenu(category);

            // Optionally clear main content when selecting a new category
            mainContent.innerHTML = `<p>Select a submenu item to view content.</p>`;
        });
    });

    // Collapse sidebar on mouse leave
    sidebar.addEventListener('mouseleave', () => {
        sidebar.classList.remove('active');
    });

    // Load default category and submenu
    sidebarItems[0].click(); // Simulate click on first sidebar item
});
