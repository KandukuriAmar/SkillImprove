<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
</head>
<body>

  <h1 class="emoji">🛠️ SkillImproveVerify</h1>
  <p>Welcome to <strong>SkillImproveVerify</strong> — an intelligent API integration service to help verify and evaluate skills using AI.</p>

  <h2 class="emoji">🚀 Installation</h2>

  <h3>🔽 Clone the Repository:</h3>
  <pre><code>git clone https://github.com/KandukuriAmar/SkillImproveVerify.git
cd SkillImproveVerify</code></pre>

  <h3>📦 Install Dependencies:</h3>
  <p><strong>Node.js:</strong></p>
  <pre><code>npm install</code></pre>

  <h2 class="emoji">🔐 Setup Environment</h2>

  <p>Create a <code>.env</code> file in the project root and add the following variables:</p>
  <pre><code>COHERE_API_KEY=your_cohere_api_key
SECRET_KEY=your_secret_key</code></pre>

<pre><code>JWT_SECRET_KEY=jwt_secret_key
SESSION_SECRET=your_session_secret_key</code></pre>

  <div class="note">
    📝 <strong>Note:</strong> Make sure to replace the placeholder values with your actual API credentials. Never commit your <code>.env</code> file to version control.
  </div>

  <h2 class="emoji">⚙️ Usage</h2>

  <h3>🧪 Run in Development Mode:</h3>
  <p><strong>For Node.js:</strong></p>
  <pre><code>npm run dev</code></pre>

  <p><strong>For Python:</strong></p>
  <pre><code>python app.py</code></pre>

  <h3>🚢 Run in Production Mode:</h3>
  <pre><code>npm run build
npm start</code></pre>

  <h2 class="emoji">🧪 Configuration & Required APIs</h2>

  <ul>
    <li><code>COHERE_API_KEY</code>: Needed for access to Cohere language-model APIs. Sign up at <a href="https://cohere.ai" target="_blank">Cohere.ai</a>.</li>
    <li><code>SECRET_KEY</code>: Used for internal authentication/signing/encryption. Keep it secret and secure.</li>
  </ul>

  <p>👉 You may also require additional environment variables depending on integrations (e.g., database credentials, third‑party tokens). Add them to <code>.env</code> as necessary.</p>

</body>
</html>
