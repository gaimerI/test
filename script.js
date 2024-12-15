document.addEventListener("DOMContentLoaded", () => {
    let topics = [];
    const topicList = document.getElementById("topic-list");
    const newTopicForm = document.getElementById("new-topic-form");
    const topicTitle = document.getElementById("topic-title");
    const topicContent = document.getElementById("topic-content");
    const searchBar = document.getElementById("search-bar");
    const loginButton = document.getElementById('login-button');
    const loginForm = document.getElementById('login-form');
    const userOverview = document.getElementById('user-overview');
    const userNameDisplay = document.getElementById('user-name');
    const logoutButton = document.getElementById('logout-button');

    // Fetch topics from JSON file
    async function fetchTopics() {
        try {
            const response = await fetch("topics.json");
            if (!response.ok) throw new Error("Failed to load topics.json");
            topics = await response.json();
            renderTopics();
        } catch (error) {
            console.error("Error fetching topics:", error);
        }
    }

    // Render topics
    function renderTopics(filteredTopics = topics) {
        topicList.innerHTML = "";
        filteredTopics.forEach((topic, index) => {
            const li = document.createElement("li");
            li.innerHTML = `
                <h3>${topic.title}</h3>
                <p>${topic.content}</p>
                <hr>
                <i>${topic.author}</i>
                <button onclick="viewTopic(${index})">View Topic</button>
                <button onclick="deleteTopic(${index})"><span class="glyph glyph-delete"></span></button>
            `;
            topicList.appendChild(li);
        });
    }

    // Filter topics based on search input
    searchBar.addEventListener("input", () => {
        const query = searchBar.value.toLowerCase();
        const filteredTopics = topics.filter((topic) =>
            topic.title.toLowerCase().includes(query) || topic.content.toLowerCase().includes(query)
        );
        renderTopics(filteredTopics);
    });

    // Add new topic
    newTopicForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const newTopic = {
            title: topicTitle.value,
            content: topicContent.value,
            author: "Admin",
        };
        topics.push(newTopic);
        topicTitle.value = "";
        topicContent.value = "";
        renderTopics();
    });

    // Delete topic
    function deleteTopic(index) {
        topics.splice(index, 1);
        renderTopics();
    }

    // View topic
    function viewTopic(index) {
        alert(`Viewing Topic:\n\n${topics[index].title}\n\n${topics[index].content}`);
    }

    // Load topics from JSON file
    fetchTopics();

    // Login functionality
    loginButton.addEventListener('click', () => {
        // Toggle visibility of the login form
        loginForm.style.display = loginForm.style.display === 'block' ? 'none' : 'block';
    });

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.get
