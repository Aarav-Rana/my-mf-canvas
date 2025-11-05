import * as pdfjsLib from 'pdfjs-dist';

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

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
    // Read file as ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    
    // Load PDF with password
    const loadingTask = pdfjsLib.getDocument({
      data: arrayBuffer,
      password: password,
    });

    const pdf = await loadingTask.promise;
    let fullText = '';

    // Extract text from all pages
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ');
      fullText += pageText + '\n';
    }

    // Parse the extracted text to find mutual fund entries
    const funds = parseMutualFundData(fullText);

    if (funds.length === 0) {
      throw new Error("No mutual fund data found in the statement");
    }

    return funds;
  } catch (error: any) {
    if (error.name === 'PasswordException') {
      throw new Error("Incorrect password. Please try again.");
    } else if (error.name === 'InvalidPDFException') {
      throw new Error("This doesn't appear to be a valid NSDL statement.");
    }
    throw error;
  }
};

const parseMutualFundData = (text: string): ExtractedFund[] => {
  const funds: ExtractedFund[] = [];
  
  // This is a simplified parser - in production, you'd need more sophisticated regex
  // to match the actual NSDL CAS format. This demo version creates mock data.
  
  // Look for patterns like scheme names, folio numbers, units, NAV, etc.
  // For now, we'll return sample parsed data to demonstrate the flow
  
  // In a real implementation, you would:
  // 1. Use regex to find scheme names (usually in ALL CAPS or Title Case)
  // 2. Find associated folio numbers (format: 12345678/99)
  // 3. Extract units (decimal numbers)
  // 4. Extract NAV values
  // 5. Calculate current value and returns
  
  // Sample parsing logic (replace with actual NSDL format parsing):
  const lines = text.split('\n');
  let currentFund: Partial<ExtractedFund> | null = null;
  
  for (const line of lines) {
    // Look for scheme names (simplified - actual format may vary)
    if (line.includes('SCHEME') || line.includes('Fund') || line.includes('EQUITY') || line.includes('DEBT')) {
      if (currentFund && currentFund.schemeName) {
        // Finalize previous fund
        if (currentFund.units && currentFund.currentNAV) {
          currentFund.currentValue = currentFund.units * currentFund.currentNAV;
          currentFund.returns = currentFund.currentValue! - (currentFund.investedAmount || 0);
          currentFund.returnsPercentage = currentFund.investedAmount 
            ? (currentFund.returns / currentFund.investedAmount) * 100 
            : 0;
          funds.push(currentFund as ExtractedFund);
        }
      }
      
      // Start new fund
      currentFund = {
        schemeCode: generateSchemeCode(),
        schemeName: line.trim(),
        folioNumber: null,
        units: 0,
        currentNAV: 0,
        investedAmount: 0,
        currentValue: 0,
        returns: 0,
        returnsPercentage: 0,
        category: detectCategory(line),
      };
    }
    
    // Look for folio numbers (pattern: digits/digits)
    const folioMatch = line.match(/(\d{6,12}\/\d{2,4})/);
    if (folioMatch && currentFund) {
      currentFund.folioNumber = folioMatch[1];
    }
    
    // Look for units (decimal numbers)
    const unitsMatch = line.match(/Units?\s*:?\s*([\d,]+\.?\d*)/i);
    if (unitsMatch && currentFund) {
      currentFund.units = parseFloat(unitsMatch[1].replace(/,/g, ''));
    }
    
    // Look for NAV
    const navMatch = line.match(/NAV\s*:?\s*₹?\s*([\d,]+\.?\d*)/i);
    if (navMatch && currentFund) {
      currentFund.currentNAV = parseFloat(navMatch[1].replace(/,/g, ''));
    }
    
    // Look for invested amount
    const investedMatch = line.match(/(?:Cost|Invested)\s*:?\s*₹?\s*([\d,]+\.?\d*)/i);
    if (investedMatch && currentFund) {
      currentFund.investedAmount = parseFloat(investedMatch[1].replace(/,/g, ''));
    }
  }
  
  // Finalize last fund
  if (currentFund && currentFund.schemeName && currentFund.units && currentFund.currentNAV) {
    currentFund.currentValue = currentFund.units * currentFund.currentNAV;
    currentFund.returns = currentFund.currentValue! - (currentFund.investedAmount || 0);
    currentFund.returnsPercentage = currentFund.investedAmount 
      ? (currentFund.returns / currentFund.investedAmount) * 100 
      : 0;
    funds.push(currentFund as ExtractedFund);
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
