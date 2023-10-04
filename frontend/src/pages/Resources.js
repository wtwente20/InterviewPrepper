import React from 'react';

function Resources() {
  return (
    <div className="resources">
      <h2>Resources and Tips for Job Seekers</h2>
      <p>
        Preparing for interviews is a critical step in securing a new job, regardless of the field.
        It not only helps you perform better but also builds confidence. Below are some curated resources
        to aid in your preparation journey.
      </p>

      <details>
        <summary>Books</summary>
        <ul>
          <li><a href="https://example.com/book1">Book Title 1</a> - Brief description about the book.</li>
          <li><a href="https://example.com/book2">Book Title 2</a> - Brief description about the book.</li>
          {/* ... more books */}
        </ul>
      </details>

      <details>
        <summary>YouTube Channels</summary>
        <ul>
          <li><a href="https://youtube.com/channel1">Channel Name 1</a> - Description about the channel.</li>
          <li><a href="https://youtube.com/channel2">Channel Name 2</a> - Description about the channel.</li>
          {/* ... more channels */}
        </ul>
      </details>

      <details>
        <summary>Articles</summary>
        <ul>
          <li><a href="https://example.com/article1">Article Title 1</a> - Brief summary of the article.</li>
          <li><a href="https://example.com/article2">Article Title 2</a> - Brief summary of the article.</li>
          {/* ... more articles */}
        </ul>
      </details>

      <details>
        <summary>Other Resources</summary>
        <ul>
          <li><a href="https://example.com/resource1">Resource 1</a> - Description.</li>
          <li><a href="https://example.com/resource2">Resource 2</a> - Description.</li>
          {/* ... more resources */}
        </ul>
      </details>
    </div>
  );
}

export default Resources;
