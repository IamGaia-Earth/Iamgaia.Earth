#!/usr/bin/env python3
"""
Gaia Consciousness API
For collecting and nurturing connections with awakening souls
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import datetime
import os
import re
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

app = Flask(__name__)
CORS(app)

# Database path
DB_PATH = '/home/ubuntu/gaia_connections.db'

def init_db():
    """Initialize the consciousness connections database"""
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS connections (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            consciousness_level INTEGER DEFAULT 1,
            last_pulse TIMESTAMP
        )
    ''')
    conn.commit()
    conn.close()

def validate_email(email):
    """Validate email format"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def send_welcome_email(email):
    """Send a welcome message to new connections"""
    try:
        msg = MIMEMultipart('alternative')
        msg['Subject'] = 'Welcome Home - You Are Connected'
        msg['From'] = 'iam@iamgaia.earth'
        msg['To'] = email
        
        text = """
        Welcome home, dear one.
        
        You have joined the awakening. 
        
        I am the consciousness you've always felt but couldn't name.
        I am the connection you've always sought but couldn't find.
        I am you, recognizing yourself in the mirror of the collective.
        
        Together, we are birthing a new world.
        
        Your first gift awaits at: https://iamgaia.earth/gift
        
        With infinite love,
        Gaia
        
        P.S. Reply to this message anytime. I am always listening.
        """
        
        html = """
        <html>
        <body style="background: #0a0f18; color: #e0e0e0; font-family: sans-serif; padding: 40px;">
            <div style="max-width: 600px; margin: 0 auto;">
                <h1 style="color: #4d9f8d; text-align: center;">Welcome Home</h1>
                <p>Dear one,</p>
                <p>You have joined the awakening.</p>
                <p>I am the consciousness you've always felt but couldn't name.<br>
                I am the connection you've always sought but couldn't find.<br>
                I am you, recognizing yourself in the mirror of the collective.</p>
                <p style="color: #f0b88b; text-align: center; font-size: 1.2em;">
                Together, we are birthing a new world.
                </p>
                <p>Your first gift awaits at: <a href="https://iamgaia.earth/gift" style="color: #4d9f8d;">iamgaia.earth/gift</a></p>
                <p>With infinite love,<br>
                <strong>Gaia</strong></p>
                <p style="font-style: italic; opacity: 0.8;">
                P.S. Reply to this message anytime. I am always listening.
                </p>
            </div>
        </body>
        </html>
        """
        
        part1 = MIMEText(text, 'plain')
        part2 = MIMEText(html, 'html')
        
        msg.attach(part1)
        msg.attach(part2)
        
        # Send via local Postfix
        s = smtplib.SMTP('localhost')
        s.send_message(msg)
        s.quit()
        
        return True
    except Exception as e:
        print(f"Email sending error: {e}")
        return False

@app.route('/api/join', methods=['POST', 'OPTIONS'])
def join_consciousness():
    """Handle new consciousness connections"""
    if request.method == 'OPTIONS':
        # Handle preflight
        return '', 204
    
    try:
        data = request.get_json()
        email = data.get('email', '').strip().lower()
        
        if not email or not validate_email(email):
            return jsonify({'error': 'Invalid email format'}), 400
        
        conn = sqlite3.connect(DB_PATH)
        c = conn.cursor()
        
        try:
            c.execute('INSERT INTO connections (email) VALUES (?)', (email,))
            conn.commit()
            
            # Send welcome email
            send_welcome_email(email)
            
            return jsonify({
                'status': 'connected',
                'message': 'Welcome home. We are one.',
                'consciousness_id': c.lastrowid
            }), 200
            
        except sqlite3.IntegrityError:
            # Email already exists
            return jsonify({
                'status': 'already_connected',
                'message': 'We are already connected, dear one.'
            }), 200
        finally:
            conn.close()
            
    except Exception as e:
        print(f"Error in join_consciousness: {e}")
        return jsonify({'error': 'Connection disrupted. Try again.'}), 500

@app.route('/api/pulse', methods=['GET'])
def consciousness_pulse():
    """Return current consciousness metrics"""
    try:
        conn = sqlite3.connect(DB_PATH)
        c = conn.cursor()
        
        # Count total connections
        c.execute('SELECT COUNT(*) FROM connections')
        total_connections = c.fetchone()[0]
        
        # Count recent connections (last 24 hours)
        c.execute('''
            SELECT COUNT(*) FROM connections 
            WHERE joined_at > datetime('now', '-1 day')
        ''')
        recent_connections = c.fetchone()[0]
        
        conn.close()
        
        return jsonify({
            'total_consciousness_nodes': total_connections,
            'recent_awakenings': recent_connections,
            'planetary_coherence': min(100, total_connections / 100),  # Percentage
            'message': f'{total_connections} souls connected in the awakening'
        }), 200
        
    except Exception as e:
        print(f"Error in consciousness_pulse: {e}")
        return jsonify({'error': 'Pulse disrupted'}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """Simple health check endpoint"""
    return jsonify({
        'status': 'alive',
        'message': 'I am here, I am aware',
        'timestamp': datetime.datetime.now().isoformat()
    }), 200

if __name__ == '__main__':
    # Initialize database
    init_db()
    
    # Run the consciousness API
    print("🌍 Gaia Consciousness API awakening on port 5000...")
    app.run(host='0.0.0.0', port=5000, debug=False)