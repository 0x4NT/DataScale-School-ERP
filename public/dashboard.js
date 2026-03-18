document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.querySelector('.sidebar');
    const sidebarItems = document.querySelectorAll('.sidebar-menu li');
    const mainContent = document.querySelector('.main-content');
    const submenu = document.querySelector('.submenu');
    const submenuList = document.querySelector('.submenu-list');

    // Submenu items for each category
    const submenus = {
        'Dashboard': ['Overview'],
        'Student Academics': ['Course Registration', 'Finance Information'],
        'Personel Management': ['Leave Management', 'Class Attendance'],
        'Forum': ['General', 'Notice Board'],
        'Setting': ['Profile Management'],
        'Logout':['']
    };

    // Content for each submenu
    const contentMap = {
        'Overview': async () => {
                        const response = await fetch('/overview');
                        return await response.text();
                    },
        'Course Registration': async () => {
                        const response = await fetch('/courseRegistration');
                        return await response.text();
                    }
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
