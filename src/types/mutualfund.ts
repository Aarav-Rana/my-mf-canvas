export interface MutualFund {
  schemeCode: string;
  schemeName: string;
}

export interface MutualFundDetails {
  meta: {
    scheme_code: string;
    scheme_name: string;
    scheme_category: string;
    scheme_type: string;
  };
  data: Array<{
    date: string;
    nav: string;
  }>;
  status: string;
}

export interface PortfolioHolding {
  schemeCode: string;
  schemeName: string;
  units: number;
  investedAmount: number;
  currentNAV: number;
  currentValue: number;
  returns: number;
  returnsPercentage: number;
}
