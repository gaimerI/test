// Global array to store topics
let topics = [];

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

// Function to display topics in the sidebar
function displayTopics() {
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
    const postContent = document.getElementById('post-content');
    const topic = topics[index];
    postContent.innerHTML = `
        <h3>${topic.title}</h3>
        <p><strong>Author:</strong> ${topic.author}</p>
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
            author
        };

        topics.push(newTopic); // Add new topic to the global array
        displayTopics(); // Re-render the topic list in the sidebar

        // Clear the form fields
        document.getElementById('new-topic-title').value = '';
        document.getElementById('new-topic-content').value = '';
        document.getElementById('new-topic-author').value = '';
    } else {
        alert('Please fill in all fields.');
    }
}

// Call the function to load initial topics when the page loads
window.onload = loadTopics;

// Attach the event listener to the form
const form = document.getElementById('new-topic-form');
form.addEventListener('submit', addNewTopic);
