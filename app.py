#!/usr/bin/env python3
"""
ChatGPT-like Python Flask Backend using Groq API + ElevenLabs
Endpoints:
- POST /chat          -> AI chat
- POST /api/tts-stream -> Streaming TTS (ElevenLabs Turbo)
- POST /api/stt       -> Speech to Text (Groq Whisper)
- GET  /audio/<file>  -> (optional legacy)
"""

from flask import Flask, request, jsonify, send_from_directory, Response
from flask_cors import CORS
import os
from dotenv import load_dotenv
from groq import Groq
from elevenlabs import ElevenLabs
from io import BytesIO

# Load environment variables
load_dotenv()

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

app = Flask(__name__, static_folder=BASE_DIR, static_url_path='')
CORS(app)

# Clients
groq_api_key = os.getenv('GROQ_API_KEY')
if not groq_api_key:
    print("⚠️ GROQ_API_KEY not set")
groq_client = Groq(api_key=groq_api_key)

eleven_api_key = os.getenv("ELEVENLABS_API_KEY")
if not eleven_api_key:
    print("⚠️ ELEVENLABS_API_KEY not set")
eleven_client = ElevenLabs(api_key=eleven_api_key)


# ===================== CHAT =====================

@app.route('/chat', methods=['POST'])
def chat():
    try:
        data = request.get_json()
        if not data or 'messages' not in data:
            return jsonify({"error": "Missing messages"}), 400

        messages = data['messages']

        resp = groq_client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=messages,
            temperature=0.6,
            max_tokens=800
        )

        reply = resp.choices[0].message.content.strip()
        return jsonify({"reply": reply})

    except Exception as e:
        print("Chat error:", e)
        return jsonify({"error": str(e)}), 500


# ===================== STREAMING TTS =====================

@app.route('/api/tts-stream', methods=['POST'])
def tts_stream():
    try:
        data = request.get_json() or {}
        text = data.get("text", "")
        voice_id = data.get("voice_id", "EXAVITQu4vr4xnSDxMaL")

        if not text:
            return jsonify({"error": "Missing text"}), 400

        audio_stream = eleven_client.text_to_speech.convert(
            voice_id=voice_id,
            model_id="eleven_turbo_v2",
            text=text
        )

        return Response(audio_stream, mimetype="audio/mpeg")

    except Exception as e:
        print("TTS stream error:", e)
        return jsonify({"error": str(e)}), 500


# ===================== STT (WHISPER) =====================

@app.route('/api/stt', methods=['POST'])
def stt():
    try:
        audio_file = request.files.get("audio")
        if not audio_file:
            return jsonify({"error": "Missing audio file"}), 400

        # Convert FileStorage -> BytesIO for Groq SDK
        audio_bytes = audio_file.read()
        audio_buffer = BytesIO(audio_bytes)

        transcription = groq_client.audio.transcriptions.create(
            file=("audio.webm", audio_buffer),
            model="whisper-large-v3"
        )

        return jsonify({"text": transcription.text})

    except Exception as e:
        print("STT error:", e)
        return jsonify({"error": f"STT error: {str(e)}"}), 500


# ===================== HEALTH + HOME =====================

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "ok", "message": "Backend running"}), 200

@app.route('/', methods=['GET'])
def home():
    return send_from_directory(BASE_DIR, 'index.html')


if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    print(f"🚀 Backend running at http://localhost:{port}")
    app.run(debug=True, host='0.0.0.0', port=port)
