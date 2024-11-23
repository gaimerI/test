// URL of the server providing usernames and comments
const connectAddress = 'https://gaimeri17-supportivebrownleopard.web.val.run';

// Function to fetch and display comments
async function fetchComments() {
    const commentsContainer = document.getElementById('commentsContainer');
    commentsContainer.innerHTML = ''; // Clear any existing content

    try {
        // Fetch data from the server
        const response = await fetch(connectAddress);

        // Check if the response is successful
        if (!response.ok) {
            throw new Error(`Failed to fetch data: ${response.statusText}`);
        }

        // Parse the JSON response
        const data = await response.json();

        // Render the comments on the page
        if (Array.isArray(data) && data.length > 0) {
            data.forEach(comment => {
                const commentDiv = document.createElement('div');
                commentDiv.className = 'comment';

                const usernameDiv = document.createElement('div');
                usernameDiv.className = 'username';
                usernameDiv.textContent = comment.username;

                const commentTextDiv = document.createElement('div');
                commentTextDiv.className = 'comment-text';
                commentTextDiv.textContent = comment.text;

                commentDiv.appendChild(usernameDiv);
                commentDiv.appendChild(commentTextDiv);

                commentsContainer.appendChild(commentDiv);
            });
        } else {
            commentsContainer.innerHTML = '<p>No comments available.</p>';
        }
    } catch (error) {
        // Handle any errors
        commentsContainer.innerHTML = `<p>Error: ${error.message}</p>`;
    }
}

// Attach the fetchComments function to the button's click event
document.getElementById('fetchDataButton').addEventListener('click', fetchComments);
