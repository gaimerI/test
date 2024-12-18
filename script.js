// Global arrays to store topics and groups
let topics = [];
let groups = [];

// Fetch users for login
let currentUser = null;

// Function to load topics from topics.json (initial data)
async function loadTopics() {
    try {
        const response = await fetch('topics.json');
        const initialTopics = await response.json();
        topics = [...initialTopics]; // Store initial topics in global array
        displayTopics();
    } catch (error) {
        console.error('Error loading topics:', error);
    }
}

// Function to load groups from groups.json (initial data)
async function loadGroups() {
    try {
        const response = await fetch('groups.json');
        const initialGroups = await response.json();
        groups = [...initialGroups]; // Store initial groups in global array
        displayGroups();
    } catch (error) {
        console.error('Error loading groups:', error);
    }
}

// Function to display topics in the sidebar
function displayTopics() {
    if (currentUser?.rank === "banned") {
        document.getElementById('post-content').innerHTML = "<p>You are banned from viewing topics.</p>";
        document.getElementById('topic-list').innerHTML = "";
        return;
    }

    const topicList = document.getElementById('topic-list');
    topicList.innerHTML = ''; // Clear any existing list items

    topics.forEach((topic, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = topic.title;
        listItem.onclick = () => loadPostContent(index);
        topicList.appendChild(listItem);
    });
}

// Function to display the selected post content
function loadPostContent(index) {
    if (currentUser?.rank === "banned") {
        document.getElementById('post-content').innerHTML = "<p>You are banned from viewing topics.</p>";
        return;
    }

    const postContent = document.getElementById('post-content');
    const topic = topics[index];

    let rankIcon;
    switch (topic.rank?.toLowerCase()) {
        case 'admin':
            rankIcon = '<span class="glyph glyph-shield-security"></span>';
            break;
        case 'banned':
            rankIcon = '<span class="glyph glyph-shield-cross"></span>';
            break;
        default: // Default to "Member" if rank is missing or not specified
            rankIcon = '<span class="glyph glyph-shield-person"></span>';
            break;
    }

    postContent.innerHTML = `
        <h3>${topic.title}</h3>
        <p><span class="glyph glyph-person"></span> ${topic.author} ${rankIcon}</p>
        <p><span class="glyph glyph-date"></span> ${topic.timestamp}</p>
        <p>${topic.content}</p>
    `;
}

// Function to add a new topic to the forum
function addNewTopic(event) {
    event.preventDefault(); // Prevent form from submitting

    const title = document.getElementById('new-topic-title').value;
    const content = document.getElementById('new-topic-content').value;
    const author = document.getElementById('new-topic-author').value;

    if (title && content && author) {
        const newTopic = {
            title,
            content,
            author,
            rank: currentUser.rank || "member",
            timestamp: new Date().toLocaleString(),
        };

        topics.push(newTopic); // Corrected this line
        displayTopics();

        // Clear the form fields
        document.getElementById('new-topic-title').value = '';
        document.getElementById('new-topic-content').value = '';
        document.getElementById('new-topic-author').value = '';
    } else {
        alert('Please fill in all fields.');
    }
}

// Function to filter topics based on search input
function filterTopics() {
    if (currentUser?.rank === "banned") {
        document.getElementById('post-content').innerHTML = "<p>You are banned from viewing topics.</p>";
        return;
    }

    const searchInput = document.getElementById('search-topic').value.toLowerCase();
    const filteredTopics = topics.filter(topic =>
        topic.title.toLowerCase().includes(searchInput)
    );

    displayFilteredTopics(filteredTopics);
}

// Function to display filtered topics
function displayFilteredTopics(filteredTopics) {
    const topicList = document.getElementById('topic-list');
    topicList.innerHTML = '';

    filteredTopics.forEach((topic, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = topic.title;
        listItem.onclick = () => {
            const originalIndex = topics.indexOf(topic); // Get the original index
            loadPostContent(originalIndex);
        };
        topicList.appendChild(listItem);
    });
}

// Function to display groups in the sidebar
function displayGroups() {
    if (currentUser?.rank === "banned") {
        document.getElementById('group-list').innerHTML = "<p>You are banned from joining groups.</p>";
        return;
    }

    const groupList = document.getElementById('group-list');
    groupList.innerHTML = ''; // Clear any existing list items

    groups.forEach((group, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = group.name;
        listItem.onclick = () => loadGroupContent(index); // Show group details on click
        groupList.appendChild(listItem);
    });
}

// Function to display group details
function loadGroupContent(index) {
    const postContent = document.getElementById('post-content');
    const group = groups[index];

    const memberList = group.members.map(member => `<li>${member}</li>`).join('');

    postContent.innerHTML = `
        <h3>${group.name}</h3>
        <p>${group.description}</p>
        <h4>Members:</h4>
        <ul id="group-members">${memberList || "<li>No members yet.</li>"}</ul>
        <button id="join-group-btn">Join Group</button>
    `;

    // Attach event listener for "Join Group" button
    document.getElementById('join-group-btn').onclick = () => joinGroup(index);
}

// Function to handle joining a group
function joinGroup(index) {
    const group = groups[index];
    const postContent = document.getElementById('post-content');

    if (!group.members.includes(currentUser.username)) {
        group.members.push(currentUser.username);

        // Update the member list in the displayed group details
        const memberList = group.members.map(member => `<li>${member}</li>`).join('');
        document.getElementById('group-members').innerHTML = memberList;

        alert(`You have joined the group: ${group.name}`);
    } else {
        alert(`You are already a member of the group: ${group.name}`);
    }
}

// Fetch users for login
async function fetchUsers() {
    try {
        const response = await fetch('users.json');
        return await response.json();
    } catch (error) {
        console.error('Error fetching users:', error);
        return [];
    }
}

// Show login modal
function showLoginModal() {
    document.getElementById('login-modal').style.display = 'block';
}

// Close login modal
function closeLoginModal() {
    document.getElementById('login-modal').style.display = 'none';
}

// Handle login
async function handleLogin(event) {
    event.preventDefault();

    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    const users = await fetchUsers();

    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        currentUser = user;
        document.getElementById('user-greeting').style.display = 'inline';
        document.getElementById('username').textContent = user.username;
        document.getElementById('login-btn').style.display = 'none';
        document.getElementById('logout-btn').style.display = 'inline';
        document.getElementById('new-topic-author').value = user.username;
        document.getElementById('new-topic-author').disabled = true;
        document.getElementById('submit-topic').disabled = user.rank === "banned";
        displayTopics();
        displayGroups();
        closeLoginModal();
    } else {
        alert('Invalid username or password.');
    }
}

// Handle logout
function handleLogout() {
    currentUser = null;
    document.getElementById('user-greeting').style.display = 'none';
    document.getElementById('login-btn').style.display = 'inline';
    document.getElementById('logout-btn').style.display = 'none';
    document.getElementById('new-topic-author').value = '';
    document.getElementById('new-topic-author').disabled = true;
    document.getElementById('submit-topic').disabled = true;
    displayTopics();
    displayGroups();
}

// Event listeners
document.getElementById('login-btn').addEventListener('click', showLoginModal);
document.getElementById('close-login-modal').addEventListener('click', closeLoginModal);
document.getElementById('login-form').addEventListener('submit', handleLogin);
document.getElementById('logout-btn').addEventListener('click', handleLogout);
document.getElementById('new-topic-form').addEventListener('submit', addNewTopic);
document.getElementById('search-topic').addEventListener('input', filterTopics);

// Initialize the forum
window.onload = function() {
    loadTopics();
    loadGroups();
};
