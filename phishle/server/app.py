from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS, cross_origin

app = Flask(__name__)
CORS(app)

# app.config for database
app.config['CORS_HEADERS'] = 'Content-Type'
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://phishle:phishlepasswd@localhost/phishle_database'
db = SQLAlchemy(app)

class Email(db.Model):
    __tablename__ = 'Emails' 
    set_id = db.Column(db.Integer, primary_key=True)
    email_id = db.Column(db.Integer, primary_key=True)
    from_email = db.Column(db.String(120), nullable=False)
    to_email = db.Column(db.String(120), nullable=False)
    subject = db.Column(db.String(120), nullable=False)
    body = db.Column(db.Text, nullable=False)
    closing = db.Column(db.String(120), nullable=False)
    attachment = db.Column(db.String(120), nullable=False)
    link = db.Column(db.String(120), nullable = False)
    is_phishing = db.Column(db.Boolean, nullable = False, default = False)
    feedback = db.Column(db.String(240), nullable = False)

@app.route('/play/<int:set_id>')
@cross_origin()
def play(set_id):
    emails = Email.query.filter_by(set_id=set_id).all()
    email_data = [{
                    'set_id': email.set_id,
                    'email_id': email.email_id,
                    'from_email': email.from_email,
                    'to_email': email.to_email,
                    'subject': email.subject,
                    'body': email.body,
                    'closing': email.closing,
                    'attachment': email.attachment,
                    'link': email.link,
                    'is_phishing': email.is_phishing
                } for email in emails]
    return jsonify(email_data)

@app.route('/latest_set_id')
@cross_origin()
def latest_set_id():
    latest_set_id = db.session.query(db.func.max(Email.set_id)).scalar() or 0
    return jsonify(latest_set_id=latest_set_id)

@app.route('/verify_phishing/<int:set_id>/<int:email_id>')
def verify_phishing(set_id, email_id):
    email = db.session.query(Email).filter_by(set_id=set_id, email_id=email_id).first()

    return jsonify(is_phishing=email.is_phishing)
    
@app.route('/verify_phishing/<int:set_id>/<int:email_id>/feedback')
def feedback(set_id, email_id):
    email = db.session.query(Email).filter_by(set_id=set_id, email_id=email_id).first()

    return jsonify(feedback=email.feedback)

if __name__ == '__main__':
    app.run(debug=True)