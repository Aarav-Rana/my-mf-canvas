// src/components/NSDLUploader.tsx
import { useState } from 'react';
import { Upload, FileText, Lock, CheckCircle, AlertCircle, Loader2, TrendingUp, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface EquityHolding {
  name: string;
  isin: string;
  shares: number;
  price: number;
  value: number;
  account: string;
}

interface MutualFundHolding {
  name: string;
  isin: string;
  units: number;
  nav: number;
  value: number;
}

interface ParsedData {
  success: boolean;
  file_type: string;
  investor_name: string;
  investor_email: string;
  investor_mobile: string;
  investor_address: string;
  investor_pan: string;
  statement_period: {
    from: string;
    to: string;
  };
  equity_holdings: EquityHolding[];
  mutual_fund_holdings: MutualFundHolding[];
  total_equity_value: number;
  total_mf_value: number;
  total_portfolio_value: number;
  total_holdings: number;
}

const NSDLUploader = () => {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [parsedData, setParsedData] = useState<ParsedData | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      // Validate file type
      if (selectedFile.type !== 'application/pdf') {
        setError('Please select a PDF file');
        return;
      }
      
      // Validate file size (max 16MB)
      if (selectedFile.size > 16 * 1024 * 1024) {
        setError('File size must be less than 16MB');
        return;
      }
      
      setFile(selectedFile);
      setError('');
      setSuccess(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      setError('Please select a file');
      return;
    }
    
    if (!password) {
      setError('Please enter password (PAN or Date of Birth)');
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess(false);
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('password', password);
    
    try {
      // Get API URL from environment variable or use default
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      
      const response = await fetch(`${API_URL}/api/parse-nsdl/summary`, {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to parse PDF');
      }
      
      if (data.success) {
        setParsedData(data);
        setSuccess(true);
        
        // Here you can save to your database or state management
        console.log('Portfolio data:', data);
      }
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const resetForm = () => {
    setSuccess(false);
    setFile(null);
    setPassword('');
    setParsedData(null);
    setError('');
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-3">
            <FileText className="w-8 h-8 text-primary" />
            <div>
              <CardTitle className="text-2xl">Upload NSDL Statement</CardTitle>
              <CardDescription>
                Upload your NSDL CAS PDF to view your complete portfolio
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {!success ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* File Upload */}
              <div className="space-y-2">
                <Label htmlFor="file-upload">NSDL CAS PDF Document</Label>
                <div className="relative">
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="flex items-center justify-center w-full px-4 py-8 border-2 border-dashed border-muted-foreground/25 rounded-lg cursor-pointer hover:border-primary/50 hover:bg-accent transition-colors"
                  >
                    <div className="text-center">
                      <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        {file ? (
                          <span className="font-medium text-foreground">{file.name}</span>
                        ) : (
                          'Click to upload or drag and drop'
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        PDF up to 16MB
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter PAN or Date of Birth"
                    className="pl-10"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Usually your PAN number (e.g., ABCDE1234F) or Date of Birth (DDMMYYYY)
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading || !file || !password}
                className="w-full"
                size="lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing PDF...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload & Parse Statement
                  </>
                )}
              </Button>
            </form>
          ) : (
            /* Success View */
            <div className="space-y-6">
              <Alert className="bg-green-50 border-green-200">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-700">
                  Statement parsed successfully!
                </AlertDescription>
              </Alert>

              {parsedData && (
                <div className="space-y-6">
                  {/* Investor Info */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Investor Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-muted-foreground">Name</p>
                          <p className="font-medium">{parsedData.investor_name}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">PAN</p>
                          <p className="font-medium">{parsedData.investor_pan}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Statement Period</p>
                          <p className="font-medium">
                            {parsedData.statement_period.from} to {parsedData.statement_period.to}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Total Holdings</p>
                          <p className="font-medium">{parsedData.total_holdings} securities</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Portfolio Summary */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                          Total Portfolio
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-green-600" />
                          <p className="text-2xl font-bold">
                            {formatCurrency(parsedData.total_portfolio_value)}
                          </p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                          Equities
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-2xl font-bold text-blue-600">
                          {formatCurrency(parsedData.total_equity_value)}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {parsedData.equity_holdings.length} stocks
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                          Mutual Funds
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-2xl font-bold text-purple-600">
                          {formatCurrency(parsedData.total_mf_value)}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {parsedData.mutual_fund_holdings.length} funds
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Holdings List */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Briefcase className="h-5 w-5" />
                        Holdings Breakdown
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {/* Equities */}
                      {parsedData.equity_holdings.length > 0 && (
                        <div className="mb-6">
                          <h4 className="font-semibold mb-3 text-blue-600">Equity Stocks</h4>
                          <div className="space-y-2 max-h-64 overflow-y-auto">
                            {parsedData.equity_holdings.map((holding, idx) => (
                              <div
                                key={idx}
                                className="flex justify-between items-center p-3 rounded-lg border hover:bg-accent transition-colors"
                              >
                                <div className="flex-1">
                                  <p className="font-medium text-sm">{holding.name.split(' EQ ')[0]}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {holding.shares} shares × ₹{holding.price.toFixed(2)}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="font-semibold">{formatCurrency(holding.value)}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {parsedData.equity_holdings.length > 0 && parsedData.mutual_fund_holdings.length > 0 && (
                        <Separator className="my-4" />
                      )}

                      {/* Mutual Funds */}
                      {parsedData.mutual_fund_holdings.length > 0 && (
                        <div>
                          <h4 className="font-semibold mb-3 text-purple-600">Mutual Funds</h4>
                          <div className="space-y-2 max-h-64 overflow-y-auto">
                            {parsedData.mutual_fund_holdings.map((holding, idx) => (
                              <div
                                key={idx}
                                className="flex justify-between items-center p-3 rounded-lg border hover:bg-accent transition-colors"
                              >
                                <div className="flex-1">
                                  <p className="font-medium text-sm">{holding.name}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {holding.units.toFixed(3)} units × NAV ₹{holding.nav.toFixed(2)}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="font-semibold">{formatCurrency(holding.value)}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Upload Another */}
                  <Button
                    onClick={resetForm}
                    variant="outline"
                    className="w-full"
                  >
                    Upload Another Statement
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default NSDLUploader;