from flask import Flask, render_template, url_for, send_file, request, redirect
import smtplib
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import psycopg2


def send_email(recipient_email, subject, body):
    # This is the email_id used to send mails. change it to yours and your app password.
    sender_email = 'thedummyboss@gmail.com' 
    sender_password='vvflxrjbgeaysest'
    smtp_server = 'smtp.gmail.com'
    smtp_port = 587  
    msg = MIMEMultipart()
    msg['From'] = sender_email
    msg['To'] = recipient_email
    msg['Subject'] = subject
    msg.attach(MIMEText(body, 'plain'))
    server = smtplib.SMTP(smtp_server, smtp_port)
    server.starttls()  
    server.login(sender_email, sender_password)
    server.sendmail(sender_email, recipient_email, msg.as_string())
    server.quit()

def get_images():
    try:
        with psycopg2.connect(
                dbname="harsha",
                user="sirppi",
                password="incorrect",
                host="127.0.0.1",
                port="5432"
            ) as conn:
            with conn.cursor() as cursor:
                cursor.execute("SELECT * FROM images")
                return cursor.fetchall()

    except (Exception, psycopg2.DatabaseError) as error:
        print(error)
        return "</p>Failed to fetch data </p>"

def _insert_image(image_path):
    try:
        with psycopg2.connect(
                dbname="harsha",
                user="sirppi",
                password="incorrect",
                host="127.0.0.1",
                port="5432"
            ) as conn:
            with conn.cursor() as cursor:
                cursor.execute(f"INSERT INTO images VALUES ('{image_path}')")
    except (Exception, psycopg2.DatabaseError) as error:
        pass

def _delete_image(image_path):
    try:
        with psycopg2.connect(
                dbname="harsha",
                user="sirppi",
                password="incorrect",
                host="127.0.0.1",
                port="5432"
            ) as conn:
            with conn.cursor() as cursor:
                cursor.execute(f"DELETE FROM images")
    except (Exception, psycopg2.DatabaseError) as error:
        pass

app = Flask('Harsha')
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/<path:path>')
def file(path):
    return send_file(f'/home/woxtoxfox/harsha/pro/{path}')

@app.route('/sendmail', methods=['POST'])
def sendmail():
    send_email('softwaresirppi@gmail.com', f'Customer: {request.form["name"]}, {request.form["phone"]}, {request.form["email"]}', request.form['message'])
    return redirect('/')


@app.route('/insert_image', methods=['POST'])
def insert_image():
    if not(request.form['username'] == 'Ayyappan' and request.form['password'] == '123456'):
        return 'Not an admin'
    img = request.files['image']
    img.save(f'images/{img.filename}')
    _insert_image(img.filename)
    return redirect('/admin')

@app.route('/delete_image', methods=['POST'])
def delete_image():
    if not(request.form['username'] == 'Ayyappan' and request.form['password'] == '123456'):
        return 'Not an admin'
    try:
        os.remove(f'images/{request.form["path"]}')
        _delete_image(f'images/{request.form["path"]}')
    except:
        return 'ERROR'
    return redirect('/admin')

@app.route('/images', methods=['GET'])
def images_page():
    return get_images()
app.run()
