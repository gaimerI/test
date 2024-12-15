document.addEventListener("DOMContentLoaded", () => {
    let topics = [];
    const topicList = document.getElementById("topic-list");
    const newTopicForm = document.getElementById("new-topic-form");
    const topicTitle = document.getElementById("topic-title");
    const topicContent = document.getElementById("topic-content");

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
    function renderTopics() {
        topicList.innerHTML = "";
        topics.forEach((topic, index) => {
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
    window.deleteTopic = function (index) {
        topics.splice(index, 1);
        renderTopics();
    };

    // View topic
    window.viewTopic = function (index) {
        alert(`Viewing Topic:\n\n${topics[index].title}\n\n${topics[index].content}`);
    };

    // Load topics from JSON file
    fetchTopics();

    // Login functionality
    const loginButton = document.getElementById('login-button');
    const loginForm = document.getElementById('login-form');
    const userOverview = document.getElementById('user-overview');
    const userNameDisplay = document.getElementById('user-name');
    const logoutButton = document.getElementById('logout-button');

    loginButton.addEventListener('click', () => {
        // Toggle visibility of the login form
        loginForm.style.display = loginForm.style.display === 'block' ? 'none' : 'block';
    });

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch("users.json");
            if (!response.ok) throw new Error("Failed to load users.json");
            const users = await response.json();

            const user = users.find((u) => u.username === username && u.password === password);
            if (user) {
                loginForm.style.display = 'none';
                loginButton.style.diplay = 'none';
                userOverview.style.display = 'block';
                userNameDisplay.textContent = user.username;
            } else {
                alert("Invalid username or password!");
            }
        } catch (error) {
            console.error("Error logging in:", error);
        }
    });

    logoutButton.addEventListener('click', () => {
        userOverview.style.display = 'none';
        loginButton.style.display = 'block';
        alert("You have logged out.");
    });
});
