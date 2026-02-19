# Python ChatGPT Backend - Setup Guide

## Project Structure

```
html/
├── app.py                 # Main Flask backend
├── chat.js               # Frontend chat interface
├── index.html            # Main HTML page
├── style.css             # CSS styling
├── requirements.txt      # Python dependencies
├── .env.example          # Environment variables template
├── .env                  # Your actual API key (create from .env.example)
├── login page/           # Login page files
└── sign up/              # Sign up page files
```

## Setup Instructions

### 1. Install Python (if not already installed)
- Download from: https://www.python.org/downloads/
- During installation, check "Add Python to PATH"

### 2. Install Dependencies
Open PowerShell in the `html` directory and run:
```powershell
pip install -r requirements.txt
```

### 3. Create .env File
Copy `.env.example` to `.env`:
```powershell
Copy-Item .env.example .env
```

Edit `.env` and add your OpenAI API key:
```
OPENAI_API_KEY=sk-your-actual-api-key-here
```

Get your key from: https://platform.openai.com/api-keys

### 4. Run the Python Backend
```powershell
python app.py
```

You should see:
```
🚀 Starting Python ChatGPT backend on http://localhost:5000
📝 API Key Status: ✅ Loaded
 * Running on http://0.0.0.0:5000
```

### 5. Open Your Chat Interface
- Open `index.html` in your browser
- Or navigate to: `http://localhost:5000/`
- Start chatting!

## Features

✅ **ChatGPT-like Interface** - Clean, modern chat UI similar to OpenAI's ChatGPT  
✅ **Python Backend** - Secure API key handling on the server  
✅ **Flask Framework** - Lightweight and fast  
✅ **CORS Enabled** - Works with any frontend origin  
✅ **Error Handling** - Graceful error messages  
✅ **Persistent Chat** - Messages stay until you refresh  

## Troubleshooting

**"ModuleNotFoundError: No module named 'flask'"**
- Solution: Run `pip install -r requirements.txt`

**"OPENAI_API_KEY not set"**
- Solution: Make sure `.env` file exists and has a valid API key

**"Connection refused on http://localhost:5000"**
- Solution: Make sure the Flask server is running (check terminal)

**Chat returns "Error: Invalid OpenAI API key"**
- Solution: Verify your API key in `.env` is correct and not expired

## Stopping the Server
Press `Ctrl+C` in the terminal where `app.py` is running.

## Optional: Run on Different Port
Edit `.env`:
```
PORT=8000
```
Then restart `app.py`
