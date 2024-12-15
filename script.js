document.addEventListener("DOMContentLoaded", () => {
    let topics = [];
    const topicList = document.getElementById("topic-list");
    const newTopicForm = document.getElementById("new-topic-form");
    const topicTitle = document.getElementById("topic-title");
    const topicContent = document.getElementById("topic-content");

    const loginButton = document.getElementById('login-button');
    const loginForm = document.getElementById('login-form');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const container = document.querySelector('.container');

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
                <button onclick="viewTopic(${index})">View Topic</button>
                <button onclick="deleteTopic(${index})"><span class=\"glyph glyph-delete\"></span></button>
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

    // Fetch users from users.json
    async function fetchUsers() {
        try {
            const response = await fetch("users.json");
            if (!response.ok) throw new Error("Failed to load users.json");
            return await response.json();
        } catch (error) {
            console.error("Error fetching users:", error);
            return [];
        }
    }

    // Handle login form visibility toggle
    loginButton.addEventListener('click', () => {
        if (loginForm.style.display === 'none' || loginForm.style.display === '') {
            loginForm.style.display = 'block';
        } else {
            loginForm.style.display = 'none';
        }
    });

    // Handle login
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const username = usernameInput.value;
        const password = passwordInput.value;

        const users = await fetchUsers();
        const user = users.find(u => u.username === username && u.password === password);

        if (user) {
            alert(`Welcome, ${user.username}!`);
            loginForm.style.display = 'none';
            displayUserOverview(user);
        } else {
            alert("Invalid username or password.");
        }
    });

    // Display user overview
    function displayUserOverview(user) {
        const userOverview = document.createElement('div');
        userOverview.id = 'user-overview';
        userOverview.innerHTML = `
            <h2>Welcome, ${user.username}</h2>
            <p>Email: ${user.email || "Not provided"}</p>
            <p>Member since: ${user.memberSince || "Unknown"}</p>
            <button id="logout-button">Logout</button>
        `;
        container.replaceChild(userOverview, loginForm);

        const logoutButton = userOverview.querySelector("#logout-button");
        logoutButton.addEventListener("click", () => {
            userOverview.replaceWith(loginForm);
            usernameInput.value = '';
            passwordInput.value = '';
            alert("Logged out successfully.");
        });
    }
});
