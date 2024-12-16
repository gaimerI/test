// Function to load topics from topics.json
async function loadTopics() {
    try {
        const response = await fetch('topics.json');
        const topics = await response.json();
        
        const topicList = document.getElementById('topic-list');
        topicList.innerHTML = ''; // Clear any existing list items

        topics.forEach((topic, index) => {
            const listItem = document.createElement('li');
            listItem.textContent = topic.title;
            listItem.onclick = () => loadPostContent(index, topics);
            topicList.appendChild(listItem);
        });
    } catch (error) {
        console.error('Error loading topics:', error);
    }
}

// Function to display the selected post content
function loadPostContent(index, topics) {
    const postContent = document.getElementById('post-content');
    const topic = topics[index];
    postContent.innerHTML = `
        <h3>${topic.title}</h3>
        <p><strong>Author:</strong> ${topic.author}</p>
        <p>${topic.content}</p>
    `;
}

// Call the function to load topics when the page loads
window.onload = loadTopics;
