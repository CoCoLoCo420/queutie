document.addEventListener("DOMContentLoaded", () => {
    const logoutMenu = document.getElementById("logout-menu");
    let offsetX, offsetY, isDragging = false;

    if (!logoutMenu) {
        console.error("logout-menu element not found");
        return;
    }

    // Start dragging (Mouse and Touch)
    const startDragging = (e) => {
        const event = e.type === "mousedown" ? e : e.touches[0];
        if (logoutMenu.style.display !== "block") return; // Only drag if visible
        isDragging = true;
        offsetX = event.clientX - logoutMenu.getBoundingClientRect().left;
        offsetY = event.clientY - logoutMenu.getBoundingClientRect().top;
        logoutMenu.style.cursor = "grabbing";
    };

    // Dragging (Mouse and Touch)
    const dragging = (e) => {
        if (!isDragging) return;
        const event = e.type === "mousemove" ? e : e.touches[0];

        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const menuWidth = logoutMenu.offsetWidth;
        const menuHeight = logoutMenu.offsetHeight;

        let newX = event.clientX - offsetX;
        let newY = event.clientY - offsetY;

        // Constrain horizontally
        if (newX < 0) newX = 0;
        if (newX > viewportWidth - menuWidth) newX = viewportWidth - menuWidth;

        // Constrain vertically
        if (newY < 0) newY = 0;
        if (newY > viewportHeight - menuHeight) newY = viewportHeight - menuHeight;

        // Apply the constrained position
        logoutMenu.style.left = `${newX}px`;
        logoutMenu.style.top = `${newY}px`;
        logoutMenu.style.transform = "none"; // Remove initial centering transform
    };

    // Stop dragging (Mouse and Touch)
    const stopDragging = () => {
        isDragging = false;
        if (logoutMenu.style.display === "block") {
            logoutMenu.style.cursor = "grab";
        }
    };

    // Add Event Listeners for Mouse
    logoutMenu.addEventListener("mousedown", startDragging);
    document.addEventListener("mousemove", dragging);
    document.addEventListener("mouseup", stopDragging);

    // Add Event Listeners for Touch
    logoutMenu.addEventListener("touchstart", startDragging);
    document.addEventListener("touchmove", dragging);
    document.addEventListener("touchend", stopDragging);

    // Functions to show and hide the logout menu
    window.showLogoutMenu = () => {
        if (logoutMenu) {
            logoutMenu.style.display = "block";
            logoutMenu.style.left = "50%"; // Center horizontally
            logoutMenu.style.top = "50%"; // Center vertically
            logoutMenu.style.transform = "translate(-50%, -50%)"; // Center transform
        }
    };

    window.closeLogoutMenu = () => {
        if (logoutMenu) logoutMenu.style.display = "none";
    };

    window.confirmLogout = () => {
        alert("Logged out successfully!");
        window.closeLogoutMenu();
    };

    // Add interactive functionality for containers
    const containers = document.querySelectorAll('.queue-container, .video-sidebar, .friends-sidebar');

    containers.forEach(container => {
        container.addEventListener('click', () => {
            // Check if the clicked container is already expanded
            const isExpanded = container.classList.contains('expanded');

            // Reset all containers to the default size
            containers.forEach(c => {
                c.style.flex = "0.5";
                c.classList.remove('expanded');

                // Reset flex-wrap for .friends-sidebar children and lock scroll on collapse
                if (c.classList.contains('friends-sidebar')) {
                    const children = c.querySelectorAll(':scope > *');
                    children.forEach(child => {
                        child.style.flexWrap = "nowrap"; // Default state
                    });
                    c.style.overflowY = "hidden"; // Lock vertical scroll
                    c.style.overflowX = "auto"; // Allow horizontal scroll
                }
            });

            // Expand the clicked container only if it wasn't already expanded
            if (!isExpanded) {
                container.style.flex = "5";
                container.classList.add('expanded');

                // Apply flex-wrap: wrap for .friends-sidebar children and unlock scroll
                if (container.classList.contains('friends-sidebar')) {
                    const children = container.querySelectorAll(':scope > *');
                    children.forEach(child => {
                        child.style.display = "flex"; // Ensure it's a flex container
                        child.style.flexWrap = "wrap";
                    });
                    container.style.overflowY = "auto"; // Unlock vertical scroll
                    container.style.overflowX = "hidden"; // Lock horizontal scroll
                }
            }
        });
    });
});

