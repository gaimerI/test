// Global array to store topics and groups
let topics = [];
let groups = [];

// Function to load groups from groups.json
async function loadGroups() {
    try {
        const response = await fetch('groups.json');
        const initialGroups = await response.json();
        groups = [...initialGroups]; // Store initial groups in global array
    } catch (error) {
        console.error('Error loading groups:', error);
    }
}

// Modified loadTopics to also load groups
async function loadTopics() {
    try {
        const response = await fetch('topics.json');
        const initialTopics = await response.json();
        topics = [...initialTopics]; // Store initial topics in global array
        await loadGroups(); // Load groups
        displayTopics();
    } catch (error) {
        console.error('Error loading topics:', error);
    }
}

// Function to display topics and their groups in the sidebar
function displayTopics() {
    if (currentUser?.rank === "banned") {
        document.getElementById('post-content').innerHTML = "<p>You are banned from viewing topics.</p>";
        document.getElementById('topic-list').innerHTML = "";
        return;
    }

    const topicList = document.getElementById('topic-list');
    topicList.innerHTML = ''; // Clear existing list items

    topics.forEach((topic, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = topic.title;

        // Show topic details and associated groups on click
        listItem.onclick = () => loadPostContent(index);
        topicList.appendChild(listItem);
    });
}

// Function to display the selected post content and its groups
function loadPostContent(index) {
    if (currentUser?.rank === "banned") {
        document.getElementById('post-content').innerHTML = "<p>You are banned from viewing topics.</p>";
        return;
    }

    const postContent = document.getElementById('post-content');
    const topic = topics[index];

    // Find groups associated with the topic
    const topicGroups = groups.filter(group => group.topicId === topic.id);

    let rankIcon;
    switch (topic.rank?.toLowerCase()) {
        case 'admin':
            rankIcon = '<span class="glyph glyph-shield-security"></span>';
            break;
        case 'banned':
            rankIcon = '<span class="glyph glyph-shield-cross"></span>';
            break;
        default:
            rankIcon = '<span class="glyph glyph-shield-person"></span>';
            break;
    }

    // Render post content with groups
    postContent.innerHTML = `
        <h3>${topic.title}</h3>
        <p><span class="glyph glyph-person"></span> ${topic.author} ${rankIcon}</p>
        <p><span class="glyph glyph-date"></span> ${topic.timestamp}</p>
        <p>${topic.content}</p>
        <h4>Groups:</h4>
        <ul>
            ${topicGroups.map(group => `
                <li>
                    ${group.name}
                    <button onclick="joinGroup(${group.id})">
                        ${group.members.includes(currentUser?.id) ? 'Leave' : 'Join'}
                    </button>
                </li>`).join('')}
        </ul>
    `;
}

// Function to join or leave a group
function joinGroup(groupId) {
    if (!currentUser) {
        alert('You must be logged in to join a group.');
        return;
    }

    const group = groups.find(g => g.id === groupId);
    if (!group) return;

    const isMember = group.members.includes(currentUser.id);

    if (isMember) {
        // Leave the group
        group.members = group.members.filter(id => id !== currentUser.id);
        alert(`You have left the group "${group.name}".`);
    } else {
        // Join the group
        group.members.push(currentUser.id);
        alert(`You have joined the group "${group.name}".`);
    }

    // Re-render the post content to update the join/leave button
    const topicIndex = topics.findIndex(topic => topic.id === group.topicId);
    loadPostContent(topicIndex);
}
