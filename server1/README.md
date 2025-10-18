Lab 5 Client (Server1)

Overview
- Static client page with:
  - Button to POST seed sample patient rows
  - Textarea to enter SQL
  - Auto-uses GET for SELECT and POST for INSERT
  - Displays JSON response from the API server (Server2)

Usage
1) Host `server1` (any static hosting, must be a different origin from Server2 and ideally HTTPS as per lab).
2) Open `index.html` in a browser.
3) Fill in the API Base URL (e.g., https://your-api.example/lab5), then:
   - Click “Insert Sample Rows (POST)” to grow the table
   - Enter `SELECT * FROM patient` and click “Run Query” to read rows

Attribution
- ChatGPT-4o-mini (https://chat.openai.com/) assisted in writing this code.

