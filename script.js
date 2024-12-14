document.addEventListener("DOMContentLoaded", () => {
    const topics = [
        { title: "Welcome to the Forum!", content: "Feel free to introduce yourself and get to know other members." },
        { title: "JavaScript Tips and Tricks", content: "Share your favorite JavaScript tips or ask for advice here." },
        { title: "General Discussion", content: "Talk about anything that doesn't fit into other categories." },
    ];
    const topicList = document.getElementById("topic-list");
    const newTopicForm = document.getElementById("new-topic-form");
    const topicTitle = document.getElementById("topic-title");
    const topicContent = document.getElementById("topic-content");

    // Render topics
    function renderTopics() {
        topicList.innerHTML = "";
        topics.forEach((topic, index) => {
            const li = document.createElement("li");
            li.innerHTML = `
                <h3>${topic.title}</h3>
                <p>${topic.content}</p>
                <button onclick="viewTopic(${index})">View Topic</button>
                <button onclick="deleteTopic(${index})">Delete</button>
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

    // View topic (for future expansion)
    window.viewTopic = function (index) {
        alert(`Viewing Topic:\n\n${topics[index].title}\n\n${topics[index].content}`);
    };

    // Render initial sample topics
    renderTopics();
});
