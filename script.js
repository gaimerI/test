// Add a topic to the forum
function addTopic() {
  const titleInput = document.getElementById('new-topic-title');
  const contentInput = document.getElementById('new-topic-content');
  const topicsDiv = document.getElementById('topics');
  const username = document.getElementById('user-name').textContent;

  if (titleInput.value.trim() === '' || contentInput.value.trim() === '') {
    alert('Please enter both a title and content for the topic.');
    return;
  }

  // Create a new topic element
  const topicElement = document.createElement('div');
  topicElement.className = 'topic';

  const titleElement = document.createElement('h3');
  titleElement.textContent = titleInput.value;

  const contentElement = document.createElement('p');
  contentElement.textContent = contentInput.value;

  const authorElement = document.createElement('small');
  authorElement.textContent = `By: ${username || 'Anonymous'}`;

  topicElement.appendChild(titleElement);
  topicElement.appendChild(contentElement);
  topicElement.appendChild(authorElement);

  // Add the new topic to the forum
  topicsDiv.appendChild(topicElement);

  // Clear the input fields
  titleInput.value = '';
  contentInput.value = '';
}


// Load topics from topics.json
function loadTopics() {
  const topicsDiv = document.getElementById('topics');
  
  // Fetch topics from the JSON file
  fetch('topics.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to load topics.');
      }
      return response.json();
    })
    .then(topics => {
      // Loop through topics and add them to the topics section
      topics.forEach(topic => {
        const topicElement = document.createElement('div');
        topicElement.className = 'topic';

        const titleElement = document.createElement('h3');
        titleElement.textContent = topic.title;

        const contentElement = document.createElement('p');
        contentElement.textContent = topic.content;

        const authorElement = document.createElement('small');
        authorElement.textContent = `By: ${topic.author}`;

        topicElement.appendChild(titleElement);
        topicElement.appendChild(contentElement);
        topicElement.appendChild(authorElement);

        topicsDiv.appendChild(topicElement);
      });
    })
    .catch(error => {
      console.error('Error loading topics:', error);
      alert('Unable to load topics. Please try again later.');
    });
}

// Handle user login
document.getElementById('login-form').addEventListener('submit', function (e) {
  e.preventDefault();
  
  const username = document.getElementById('username').value.trim();
  if (username) {
    document.getElementById('user-name').textContent = username;
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('settings').style.display = 'block';
  } else {
    alert('Please enter your username.');
  }
});

// Handle user logout
function logout() {
  document.getElementById('login-form').style.display = 'block';
  document.getElementById('settings').style.display = 'none';
}

// Load topics on page load
document.addEventListener('DOMContentLoaded', loadTopics);
