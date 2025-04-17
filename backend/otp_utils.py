import random
import smtplib
from email.mime.text import MIMEText
from datetime import datetime, timedelta
import os

OTP_LENGTH = 6
OTP_EXPIRY_MINUTES = 5

SMTP_SERVER = os.environ.get('SMTP_SERVER', 'smtp.gmail.com')
SMTP_PORT = int(os.environ.get('SMTP_PORT', 587))
SMTP_USER = os.environ.get('SMTP_USER')
SMTP_PASSWORD = os.environ.get('SMTP_PASSWORD')
SENDER_EMAIL = os.environ.get('SENDER_EMAIL', SMTP_USER)

def generate_otp():
    return str(random.randint(100000, 999999))

def send_otp_email(recipient_email, otp):
    subject = 'Your Fitness App OTP Verification Code'
    body = f'Your OTP code is: {otp}. It is valid for {OTP_EXPIRY_MINUTES} minutes.'
    msg = MIMEText(body)
    msg['Subject'] = subject
    msg['From'] = SENDER_EMAIL
    msg['To'] = recipient_email

    with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
        server.starttls()
        server.login(SMTP_USER, SMTP_PASSWORD)
        server.sendmail(SENDER_EMAIL, recipient_email, msg.as_string())

def otp_expiry_time():
    return datetime.utcnow() + timedelta(minutes=OTP_EXPIRY_MINUTES)
