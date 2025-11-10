"""
NSDL PDF Text Parser - Fallback for when casparser doesn't work
Install: pip install PyPDF2 pdfplumber
"""

import pdfplumber
import re
from decimal import Decimal

def parse_nsdl_text(pdf_path, password):
    """
    Parse NSDL CAS PDF by extracting and parsing text
    """
    result = {
        "success": False,
        "investor_info": {},
        "equity_holdings": [],
        "mutual_fund_holdings": [],
        "total_equity_value": 0,
        "total_mf_value": 0,
        "portfolio_value": 0
    }
    
    try:
        with pdfplumber.open(pdf_path, password=password) as pdf:
            all_text = ""
            for page in pdf.pages:
                all_text += page.extract_text() + "\n"
            
            # Extract investor name
            name_match = re.search(r'NSDL ID:.*?\n([A-Z\s]+)', all_text)
            if name_match:
                result['investor_info']['name'] = name_match.group(1).strip()
            
            # Extract PAN
            pan_match = re.search(r'PAN:([A-Z0-9]+)', all_text)
            if pan_match:
                result['investor_info']['pan'] = pan_match.group(1)
            
            # Extract total portfolio value
            portfolio_match = re.search(r'YOUR CONSOLIDATED\s+PORTFOLIO VALUE\s+[`₹]\s*([\d,]+\.?\d*)', all_text)
            if portfolio_match:
                value_str = portfolio_match.group(1).replace(',', '')
                result['portfolio_value'] = float(value_str)
            
            # Extract statement period
            period_match = re.search(r'Statement for the period from (\d{2}-\w{3}-\d{4}) to (\d{2}-\w{3}-\d{4})', all_text)
            if period_match:
                result['statement_period'] = {
                    'from': period_match.group(1),
                    'to': period_match.group(2)
                }
            
            # Parse equity holdings
            equity_section = re.search(r'Equity Shares.*?(?=Corporate Bonds|Mutual Fund Folios|$)', all_text, re.DOTALL)
            if equity_section:
                equity_text = equity_section.group(0)
                # Pattern: Stock name, shares, price, value
                equity_pattern = r'([A-Z\s&\.\-]+LIMITED)\s+[\d\.]+\s+(\d+)\s+([\d,\.]+)\s+([\d,\.]+)'
                
                for match in re.finditer(equity_pattern, equity_text):
                    company = match.group(1).strip()
                    shares = int(match.group(2))
                    price = float(match.group(3).replace(',', ''))
                    value = float(match.group(4).replace(',', ''))
                    
                    result['equity_holdings'].append({
                        'company': company,
                        'shares': shares,
                        'price': price,
                        'value': value
                    })
                    result['total_equity_value'] += value
            
            # Parse mutual fund holdings
            mf_section = re.search(r'Mutual Fund Folios.*?(?=NSDL NATIONAL INSURANCE|$)', all_text, re.DOTALL)
            if mf_section:
                mf_text = mf_section.group(0)
                # Pattern: Fund name, folio, units, value
                mf_pattern = r'([\w\s\-]+Fund.*?(?:Growth|Plan))\s+(\d+)\s+([\d,\.]+)\s+.*?([\d,\.]+)\s+([\d,\.]+)'
                
                for match in re.finditer(mf_pattern, mf_text):
                    fund_name = match.group(1).strip()
                    folio = match.group(2)
                    units = float(match.group(3).replace(',', ''))
                    value = float(match.group(5).replace(',', ''))
                    
                    result['mutual_fund_holdings'].append({
                        'fund_name': fund_name,
                        'folio': folio,
                        'units': units,
                        'value': value
                    })
                    result['total_mf_value'] += value
            
            result['success'] = True
            
    except Exception as e:
        result['error'] = str(e)
    
    return result


