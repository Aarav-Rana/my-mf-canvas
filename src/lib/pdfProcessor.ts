interface ExtractedFund {
  schemeCode: string;
  schemeName: string;
  folioNumber: string | null;
  units: number;
  currentNAV: number;
  investedAmount: number;
  currentValue: number;
  returns: number;
  returnsPercentage: number;
  category: string | null;
}

export const processPDFFile = async (file: File, password: string): Promise<ExtractedFund[]> => {
  try {
    // Prepare form data for edge function
    const formData = new FormData();
    formData.append('file', file);
    
    // Only append password if provided and not empty (for encrypted PDFs)
    if (password && password.trim().length > 0) {
      formData.append('password', password);
    }

    // Call edge function proxy (avoids CORS issues)
    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/parse-cas`, {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('CAS Parser error:', response.status, errorData);
      
      // Refined error handling:
      // Only throw "Incorrect password" if a password was actually provided AND we get a 401/403
      if (password && password.trim().length > 0 && (response.status === 401 || response.status === 403)) {
        throw new Error("Incorrect password. Please try again."); 
      } else if (response.status === 400) {
        throw new Error("This doesn't appear to be a valid NSDL statement.");
      }
      // For other non-OK statuses (including 401/403 when no password was given),
      // or if the errorData has a specific message, use that.
      throw new Error(errorData.error || `Failed to parse document. Please ensure it's a valid NSDL CAS statement.`);
    }

    const data = await response.json();

    // Parse the CAS Parser response
    const funds = parseCASParserResponse(data);

    if (funds.length === 0) {
      throw new Error("No mutual fund data found in the statement");
    }

    return funds;
  } catch (error: any) {
    // Re-throw the specific error generated above
    throw error; 
  }
};

const parseCASParserResponse = (data: any): ExtractedFund[] => {
  const funds: ExtractedFund[] = [];
  
  try {
    // CAS Parser API returns data in a specific format
    // Navigate through the response structure
    const folios = data?.cas_data?.folios || [];
    
    for (const folio of folios) {
      const folioNumber = folio?.folio || null;
      const schemes = folio?.schemes || [];
      
      for (const scheme of schemes) {
        const schemeName = scheme?.scheme || 'Unknown Scheme';
        const schemeCode = scheme?.isin || generateSchemeCode();
        const units = parseFloat(scheme?.close_calculated?.units || 0);
        const currentNAV = parseFloat(scheme?.close_calculated?.nav || 0);
        const currentValue = parseFloat(scheme?.close_calculated?.value || 0);
        const investedAmount = parseFloat(scheme?.valuation?.cost || 0);
        const returns = currentValue - investedAmount;
        const returnsPercentage = investedAmount ? (returns / investedAmount) * 100 : 0;
        const category = detectCategory(schemeName);
        
        if (units > 0) {
          funds.push({
            schemeCode,
            schemeName,
            folioNumber,
            units,
            currentNAV,
            investedAmount,
            currentValue,
            returns,
            returnsPercentage,
            category,
          });
        }
      }
    }
  } catch (error) {
    console.error('Error parsing CAS Parser response:', error);
    throw new Error('Failed to parse CAS statement data');
  }
  
  return funds;
};

const generateSchemeCode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const detectCategory = (schemeName: string): string => {
  const name = schemeName.toLowerCase();
  if (name.includes('equity') || name.includes('elss')) return 'Equity';
  if (name.includes('debt') || name.includes('bond')) return 'Debt';
  if (name.includes('hybrid') || name.includes('balanced')) return 'Hybrid';
  if (name.includes('liquid') || name.includes('money')) return 'Liquid';
  return 'Other';
};