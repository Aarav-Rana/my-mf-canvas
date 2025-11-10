"""
Flask API for NSDL CAS PDF Parsing
Install: pip install flask casparser flask-cors PyMuPDF
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import casparser
import os
import tempfile
from werkzeug.utils import secure_filename
import json

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend requests

# Configuration
UPLOAD_FOLDER = tempfile.gettempdir()
ALLOWED_EXTENSIONS = {'pdf'}

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({"status": "healthy", "message": "NSDL Parser API is running"})

@app.route('/api/parse-nsdl', methods=['POST'])
def parse_nsdl():
    """
    Parse NSDL CAS PDF - Full Data
    Expected: multipart/form-data with 'file' and 'password'
    """
    try:
        # Check if file is present
        if 'file' not in request.files:
            return jsonify({"error": "No file provided"}), 400
        
        file = request.files['file']
        password = request.form.get('password', '')
        
        if file.filename == '':
            return jsonify({"error": "No file selected"}), 400
        
        if not allowed_file(file.filename):
            return jsonify({"error": "Only PDF files are allowed"}), 400
        
        if not password:
            return jsonify({"error": "Password is required"}), 400
        
        # Save file temporarily
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        try:
            # Parse the CAS PDF using casparser
            # casparser returns JSON string by default
            parsed_json = casparser.read_cas_pdf(filepath, password, output='json')
            parsed_data = json.loads(parsed_json)
            
            # Clean up temporary file
            os.remove(filepath)
            
            return jsonify({
                "success": True,
                "data": parsed_data
            }), 200
            
        except Exception as parse_error:
            # Clean up temporary file
            if os.path.exists(filepath):
                os.remove(filepath)
            
            error_message = str(parse_error)
            
            # Check for common errors
            if "password" in error_message.lower() or "decrypt" in error_message.lower():
                return jsonify({
                    "error": "Invalid password. Please check your PAN or Date of Birth",
                    "details": error_message
                }), 401
            elif "parse" in error_message.lower():
                return jsonify({
                    "error": "Failed to parse PDF. File may be corrupted or in unsupported format",
                    "details": error_message
                }), 400
            else:
                return jsonify({
                    "error": "Failed to process PDF",
                    "details": error_message
                }), 500
    
    except Exception as e:
        return jsonify({
            "error": "Server error",
            "details": str(e)
        }), 500

@app.route('/api/parse-nsdl/summary', methods=['POST'])
def parse_nsdl_summary():
    """
    Parse NSDL CAS PDF and return only summary (faster)
    """
    try:
        if 'file' not in request.files:
            return jsonify({"error": "No file provided"}), 400
        
        file = request.files['file']
        password = request.form.get('password', '')
        
        if not password:
            return jsonify({"error": "Password is required"}), 400
        
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        try:
            # Parse with JSON output
            parsed_json = casparser.read_cas_pdf(filepath, password, output='json')
            parsed_data = json.loads(parsed_json)
            
            # Extract summary information
            statement_period = parsed_data.get('statement_period', {})
            investor_info = parsed_data.get('investor_info', {})
            file_type = parsed_data.get('file_type', 'UNKNOWN')
            accounts = parsed_data.get('accounts', [])
            
            summary = {
                "success": True,
                "file_type": file_type,
                "investor_name": investor_info.get('name', ''),
                "investor_email": investor_info.get('email', ''),
                "investor_mobile": investor_info.get('mobile', ''),
                "investor_address": investor_info.get('address', ''),
                "investor_pan": "",
                "statement_period": {
                    "from": statement_period.get('from', ''),
                    "to": statement_period.get('to', '')
                },
                "equity_holdings": [],
                "mutual_fund_holdings": [],
                "total_equity_value": 0,
                "total_mf_value": 0,
                "total_portfolio_value": 0
            }
            
            # Process each account
            for account in accounts:
                account_name = account.get('name', '')
                account_type = account.get('type', '')
                
                # Get owner PAN from first owner
                owners = account.get('owners', [])
                if owners and not summary['investor_pan']:
                    summary['investor_pan'] = owners[0].get('PAN', '')
                
                # Process Equities
                equities = account.get('equities', [])
                for equity in equities:
                    value = float(equity.get('value', 0))
                    if value > 0:
                        summary['equity_holdings'].append({
                            "name": equity.get('name', ''),
                            "isin": equity.get('isin', ''),
                            "shares": int(equity.get('num_shares', 0)),
                            "price": float(equity.get('price', 0)),
                            "value": value,
                            "account": account_name
                        })
                        summary['total_equity_value'] += value
                
                # Process Mutual Funds
                mutual_funds = account.get('mutual_funds', [])
                for mf in mutual_funds:
                    value = float(mf.get('value', 0))
                    if value > 0:
                        summary['mutual_fund_holdings'].append({
                            "name": mf.get('name', ''),
                            "isin": mf.get('isin', ''),
                            "units": float(mf.get('balance', 0)),
                            "nav": float(mf.get('nav', 0)),
                            "value": value
                        })
                        summary['total_mf_value'] += value
            
            # Calculate total portfolio value
            summary['total_portfolio_value'] = summary['total_equity_value'] + summary['total_mf_value']
            summary['total_holdings'] = len(summary['equity_holdings']) + len(summary['mutual_fund_holdings'])
            
            os.remove(filepath)
            return jsonify(summary), 200
            
        except Exception as parse_error:
            if os.path.exists(filepath):
                os.remove(filepath)
            
            error_message = str(parse_error)
            
            if "password" in error_message.lower() or "decrypt" in error_message.lower():
                return jsonify({
                    "error": "Invalid password. Try your PAN (e.g., BEQPS9675J) or DOB (DDMMYYYY format)",
                    "details": error_message
                }), 401
            else:
                return jsonify({
                    "error": "Failed to parse PDF",
                    "details": error_message
                }), 500
    
    except Exception as e:
        return jsonify({
            "error": "Server error",
            "details": str(e)
        }), 500

if __name__ == '__main__':
    print("🚀 NSDL Parser API Server Starting...")
    print("📋 Endpoints:")
    print("   GET  /api/health - Health check")
    print("   POST /api/parse-nsdl - Full parsing")
    print("   POST /api/parse-nsdl/summary - Summary only")
    print("\n💡 Test with:")
    print('   curl -X POST http://localhost:5000/api/parse-nsdl/summary -F "file=@path/to/nsdl.pdf" -F "password=YOUR_PAN"')
    app.run(debug=True, host='0.0.0.0', port=5000)
    