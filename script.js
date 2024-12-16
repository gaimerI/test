document.addEventListener("DOMContentLoaded", () => {
    let topics = [];
    const topicList = document.getElementById("topic-list");
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

            // Load pinned state from local storage
            const pinnedTopics = JSON.parse(localStorage.getItem("pinnedTopics") || "[]");
            topics.forEach((topic) => {
                topic.isPinned = pinnedTopics.includes(topic.title);
            });

            renderTopics();
        } catch (error) {
            console.error("Error fetching topics:", error);
        }
    }

    // Render topics
    function renderTopics(filteredTopics = topics) {
        topicList.innerHTML = "";

        // Sort topics by pinned state
        const sortedTopics = [...filteredTopics].sort((a, b) => b.isPinned - a.isPinned);

        sortedTopics.forEach((topic, index) => {
            const li = document.createElement("li");
            li.className = topic.isPinned ? "pinned" : "";
            li.innerHTML = `
                <h3>${topic.title}</h3>
                <p>${topic.content}</p>
                <hr>
                <i>${topic.author}</i>
                <button onclick="viewTopic(${index})">View Topic</button>
                <button onclick="deleteTopic(${index})"><span class="glyph glyph-delete"></span></button>
                <button onclick="togglePin(${index})"><span class="glyph glyph-pin"></span> ${topic.isPinned ? "Unpin" : "Pin"}</button>
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
            isPinned: false,
        };
        topics.push(newTopic);
        topicTitle.value = "";
        topicContent.value = "";
        savePinnedState();
        renderTopics();
    });

    // Delete topic
    window.deleteTopic = function (index) {
        topics.splice(index, 1);
        savePinnedState();
        renderTopics();
    };

    // Toggle pin state
    window.togglePin = function (index) {
        topics[index].isPinned = !topics[index].isPinned;
        savePinnedState();
        renderTopics();
    };

    // Save pinned state to local storage
    function savePinnedState() {
        const pinnedTopics = topics.filter((topic) => topic.isPinned).map((topic) => topic.title);
        localStorage.setItem("pinnedTopics", JSON.stringify(pinnedTopics));
    }

    // View topic
    window.viewTopic = function (index) {
        const topic = topics[index];
        const modalContent = `
            <div class="modal">
                <div class="modal-content">
                    <h2>${topic.title}</h2>
                    <p>${topic.content}</p>
                    <hr>
                    <i>Author: ${topic.author}</i>
                    <button onclick="closeModal()">Close</button>
                </div>
            </div>
        `;

        // Ensure no duplicate modals
        closeModal();

        const modal = document.createElement("div");
        modal.innerHTML = modalContent;
        document.body.appendChild(modal);
    };

    // Close modal
    window.closeModal = function () {
        const modal = document.querySelector(".modal");
        if (modal) modal.remove();
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
