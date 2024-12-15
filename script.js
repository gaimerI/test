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
    const topic = topics[index];
    const topicDetails = `
        <h2>${topic.title}</h2>
        <p>${topic.content}</p>
        <hr>
        <i>Author: ${topic.author}</i>
        <h3>Comments</h3>
        <ul id="comment-list"></ul>
    `;
    const commentList = topic.comments.map(
        (comment) => `<li><strong>${comment.author}:</strong> ${comment.content}</li>`
    ).join("");
    
    // Show topic and comments in a modal or a new section
    const modalContent = `
        <div class="modal">
            <div class="modal-content">
                ${topicDetails}
                ${commentList ? commentList : "<p>No comments yet.</p>"}
                <button onclick="closeModal()">Close</button>
            </div>
        </div>
    `;

    // Append modal to the body
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
