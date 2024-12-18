// Global arrays to store topics and groups
let topics = [];
let groups = [];

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
        listItem.onclick = () => joinGroup(index);
        groupList.appendChild(listItem);
    });
}

// Function to handle joining a group
function joinGroup(index) {
    const group = groups[index];
    if (!group.members.includes(currentUser.username)) {
        group.members.push(currentUser.username);
        alert(`You have joined the group: ${group.name}`);
    } else {
        alert(`You are already a member of the group: ${group.name}`);
    }
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

// Call the functions to load initial topics and groups when the page loads
window.onload = () => {
    loadTopics();
    loadGroups();
};
