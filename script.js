document.addEventListener("DOMContentLoaded", () => {
    let topics = [];
    let pinnedTopics = [];
    const topicList = document.getElementById("topic-list");
    const pinnedTopicList = document.getElementById("pinned-topic-list");
    const newTopicForm = document.getElementById("new-topic-form");
    const topicTitle = document.getElementById("topic-title");
    const topicContent = document.getElementById("topic-content");
    const searchBar = document.getElementById("search-bar");

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

    // Render all topics
    function renderTopics(filteredTopics = topics) {
        topicList.innerHTML = "";
        filteredTopics.forEach((topic, index) => {
            const li = document.createElement("li");
            li.innerHTML = `
                <h3>${topic.title}</h3>
                <p>${topic.content}</p>
                <hr>
                <i>${topic.author}</i>
                <button onclick="pinTopic(${index})">Pin</button>
                <button onclick="deleteTopic(${index})"><span class="glyph glyph-delete"></span></button>
            `;
            topicList.appendChild(li);
        });
    }

    // Render pinned topics
    function renderPinnedTopics() {
        pinnedTopicList.innerHTML = "";
        pinnedTopics.forEach((topic, index) => {
            const li = document.createElement("li");
            li.innerHTML = `
                <h3>${topic.title}</h3>
                <p>${topic.content}</p>
                <hr>
                <i>${topic.author}</i>
                <button onclick="unpinTopic(${index})">Unpin</button>
            `;
            pinnedTopicList.appendChild(li);
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

    // Pin topic
    window.pinTopic = function (index) {
        const topic = topics.splice(index, 1)[0];
        pinnedTopics.push(topic);
        renderTopics();
        renderPinnedTopics();
    };

    // Unpin topic
    window.unpinTopic = function (index) {
        const topic = pinnedTopics.splice(index, 1)[0];
        topics.unshift(topic); // Add it back to the top of the topics list
        renderPinnedTopics();
        renderTopics();
    };

    // Delete topic
    window.deleteTopic = function (index) {
        topics.splice(index, 1);
        renderTopics();
    };

    // Filter topics based on search input
    searchBar.addEventListener("input", () => {
        const query = searchBar.value.toLowerCase();
        const filteredTopics = topics.filter((topic) =>
            topic.title.toLowerCase().includes(query) || topic.content.toLowerCase().includes(query)
        );
        renderTopics(filteredTopics);
    });

    // Fetch topics from JSON file
    fetchTopics();
});
