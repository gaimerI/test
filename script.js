// Add a topic to the forum
function addTopic() {
  const topicInput = document.getElementById('new-topic');
  const topicsDiv = document.getElementById('topics');
  
  if (topicInput.value.trim() !== '') {
    const topic = document.createElement('p');
    topic.textContent = topicInput.value;
    topicsDiv.appendChild(topic);
    topicInput.value = '';
  } else {
    alert('Please enter a topic.');
  }
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
