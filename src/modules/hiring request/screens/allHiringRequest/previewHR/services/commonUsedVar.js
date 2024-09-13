
// Common function to get data from localStorage
export const getDataFromLocalStorage = () => {
    try {
      const data = localStorage.getItem('user');
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error("Error fetching data from localStorage:", error);
      localStorage.clear();
      return null;
    }
};

export const trackingDetailsAPI = () => {
    try {
      const data = localStorage.getItem("TrackData");
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error("Error parsing tracking details from localStorage:", error);
      return null;
    }
};

export const isEmptyOrWhitespace = (str) => {
  const div = document.createElement('div');
  div.innerHTML = str;
  const text = div.textContent || div.innerText || '';
  return text.trim().length === 0;
};

export const mapCountryToCurrency = (country) => {
  const countryCurrencyMap = {
    'GB': 'GBP', 
    'CA': 'CAD',
    'AU': 'AUD', 
    'US': 'USD',
    'AD': 'EUR', 
    'HK': 'HKD',
    'IN': 'INR', 
    'AE': 'AED', 
    'ZA': 'ZAR',
    'AF': 'AFN',
    'DZ': 'DZD', 
    'AS': 'USD',
    'AO': 'AOA', 
    'AI': 'XCD', 
    'AR': 'ARS',
    'AM': 'AMD', 
    'AW': 'AWG', 
    'AZ': 'AZN',
    'BS': 'BSD',
    'BH': 'BHD', 
    'BD': 'BDT',
    'BB': 'BBD', 
    'BY': 'BYR', 
    'BZ': 'BZD',
    'BJ': 'XOF', 
    'BM': 'BMD', 
    'BT': 'BTN',
    'BO': 'BOB',
    'BA': 'BAM', 
    'BW': 'BWP',
    'GU': 'USD', 
    'GP': 'EUR', 
    'GR': 'EUR',
    'DE': 'EUR', 
    'TF': 'EUR', 
    'GF': 'EUR',
    'FR': 'EUR',
    'FI': 'EUR',
  };
  return countryCurrencyMap[country] || 'INR';
};

export const convertCurrency = (from, to, amount,rates) => {
  if (!rates[from] || !rates[to]) {
    return 
  }  
  // Convert to USD, then to target currency
  const usdEquivalent = amount / rates[from];
  const converted = usdEquivalent * rates[to];
  return converted ? Math.round(converted) : '0';
}; 

export const seriesOptions = [
  { value: "Seed Round", label: "Seed Round" },
  { value: "Series A Round", label: "Series A Round" },
  { value: "Series B Round", label: "Series B Round" },
  { value: "Series C Round", label: "Series C Round" },
  { value: "Series D Round", label: "Series D Round" },
  { value: "Series E Round", label: "Series E Round" },
  { value: "Series F Round", label: "Series F Round" },
  { value: "Series G Round", label: "Series G Round" },
  { value: "Series H Round", label: "Series H Round" },
  { value: "Series I Round", label: "Series I Round" },
  { value: "Private equity", label: "Private equity" },
  { value: "IPO", label: "IPO" },
];

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const monthOptions = monthNames?.map((month, index) => ({
  label: month,
  value: month,
}));

export const foundedIn = [
  { value: 2024, label: "2024" },
  { value: 2023, label: "2023" },
  { value: 2022, label: "2022" },
  { value: 2021, label: "2021" },
  { value: 2020, label: "2020" },
  { value: 2019, label: "2019" },
  { value: 2018, label: "2018" },
  { value: 2017, label: "2017" },
  { value: 2016, label: "2016" },
  { value: 2015, label: "2015" },
  { value: 2014, label: "2014" },
  { value: 2013, label: "2013" },
  { value: 2012, label: "2012" },
  { value: 2011, label: "2011" },
  { value: 2010, label: "2010" },
  { value: 2009, label: "2009" },
  { value: 2008, label: "2008" },
  { value: 2007, label: "2007" },
  { value: 2006, label: "2006" },
  { value: 2005, label: "2005" },
  { value: 2004, label: "2004" },
  { value: 2003, label: "2003" },
  { value: 2002, label: "2002" },
  { value: 2001, label: "2001" },
  { value: 2000, label: "2000" },
  { value: 1999, label: "1999" },
  { value: 1998, label: "1998" },
  { value: 1997, label: "1997" },
  { value: 1996, label: "1996" },
  { value: 1995, label: "1995" },
  { value: 1994, label: "1994" },
  { value: 1993, label: "1993" },
  { value: 1992, label: "1992" },
  { value: 1991, label: "1991" },
  { value: 1990, label: "1990" },
  { value: 1989, label: "1989" },
  { value: 1988, label: "1988" },
  { value: 1987, label: "1987" },
  { value: 1986, label: "1986" },
  { value: 1985, label: "1985" },
  { value: 1984, label: "1984" },
  { value: 1983, label: "1983" },
  { value: 1982, label: "1982" },
  { value: 1981, label: "1981" },
  { value: 1980, label: "1980" },
  { value: 1979, label: "1979" },
  { value: 1978, label: "1978" },
  { value: 1977, label: "1977" },
  { value: 1976, label: "1976" },
  { value: 1975, label: "1975" },
  { value: 1974, label: "1974" },
  { value: 1973, label: "1973" },
  { value: 1972, label: "1972" },
  { value: 1971, label: "1971" },
  { value: 1970, label: "1970" },
  { value: 1969, label: "1969" },
  { value: 1968, label: "1968" },
  { value: 1967, label: "1967" },
  { value: 1966, label: "1966" },
  { value: 1965, label: "1965" },
  { value: 1964, label: "1964" },
  { value: 1963, label: "1963" },
  { value: 1962, label: "1962" },
  { value: 1961, label: "1961" },
  { value: 1960, label: "1960" },
  { value: 1959, label: "1959" },
  { value: 1958, label: "1958" },
  { value: 1957, label: "1957" },
  { value: 1956, label: "1956" },
  { value: 1955, label: "1955" },
  { value: 1954, label: "1954" },
  { value: 1953, label: "1953" },
  { value: 1952, label: "1952" },
  { value: 1951, label: "1951" },
  { value: 1950, label: "1950" },
  { value: 1949, label: "1949" },
  { value: 1948, label: "1948" },
  { value: 1947, label: "1947" },
  { value: 1946, label: "1946" },
  { value: 1945, label: "1945" },
  { value: 1944, label: "1944" },
  { value: 1943, label: "1943" },
  { value: 1942, label: "1942" },
  { value: 1941, label: "1941" },
  { value: 1940, label: "1940" },
  { value: 1939, label: "1939" },
  { value: 1938, label: "1938" },
  { value: 1937, label: "1937" },
  { value: 1936, label: "1936" },
  { value: 1935, label: "1935" },
  { value: 1934, label: "1934" },
  { value: 1933, label: "1933" },
  { value: 1932, label: "1932" },
  { value: 1931, label: "1931" },
  { value: 1930, label: "1930" },
  { value: 1929, label: "1929" },
  { value: 1928, label: "1928" },
  { value: 1927, label: "1927" },
  { value: 1926, label: "1926" },
  { value: 1925, label: "1925" },
  { value: 1924, label: "1924" },
  { value: 1923, label: "1923" },
  { value: 1922, label: "1922" },
  { value: 1921, label: "1921" },
  { value: 1920, label: "1920" },
  { value: 1919, label: "1919" },
  { value: 1918, label: "1918" },
  { value: 1917, label: "1917" },
  { value: 1916, label: "1916" },
  { value: 1915, label: "1915" },
  { value: 1914, label: "1914" },
  { value: 1913, label: "1913" },
  { value: 1912, label: "1912" },
  { value: 1911, label: "1911" },
  { value: 1910, label: "1910" },
  { value: 1909, label: "1909" },
  { value: 1908, label: "1908" },
  { value: 1907, label: "1907" },
  { value: 1906, label: "1906" },
  { value: 1905, label: "1905" },
  { value: 1904, label: "1904" },
  { value: 1903, label: "1903" },
  { value: 1902, label: "1902" },
  { value: 1901, label: "1901" },
  { value: 1900, label: "1900" }
];  

export const sanitizeLinks = (val) => {
  let html = val?.replace(/<img\b[^>]*>/gi, '');
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;
  tempDiv.innerHTML = tempDiv.innerHTML.replace(/●/g, '&#8226;');
  const links = tempDiv.getElementsByTagName('a');
  for (let link of links) {
    const originalHref = link.getAttribute('href'); 
    if (!originalHref.startsWith('http://') && !originalHref.startsWith('https://')) {
      link.href = 'http://' + originalHref;
    }
  }
  return tempDiv.innerHTML;
};

export const compensationOptions = [
  { value: "Performance Bonuses", label: "Performance Bonuses" },
  { value: "Stock Options (ESOPs/ESPPs)", label: "Stock Options (ESOPs/ESPPs)" },
  { value: "Incentives / Variable Pay", label: "Incentives / Variable Pay" },
  { value: "Profit Sharing", label: "Profit Sharing" },
  { value: "Signing Bonus", label: "Signing Bonus"},
  { value: "Retention Bonus", label: "Retention Bonus" },
  {value:"Overtime Pay", label:"Overtime Pay"},
  {value:"Allowances (e.g. Travel, Housing, Medical, Education, WFH)", label:"Allowances (e.g. Travel, Housing, Medical, Education, WFH)"},
  {value:"Restricted Stock Units (RSUs)", label:"Restricted Stock Units (RSUs)"},
];

export const industryOptions = [
  { value: "Service", label: "Service" },
  {value:"Product", label:"Product"},
  // {value:"Manufacturing", label:"Manufacturing"},
]
let TrackData = {
  trackingDetails: trackingDetailsAPI()
};
export const EngOptions = [
  { value: 1, label: "Hire a contractor  |  35% monthly of talent's pay"},
  { value: 2, label: "Hire an employee on Uplers payroll | 35% monthly of talent's pay"},
  { value: 3, label: `Direct-hire | ${TrackData?.trackingDetails?.country == "IN" ? "7.5%" : "10%"} one-time of annual salary`}
]

export const formatSkill = (skill) => {
  if (skill.toUpperCase() === skill) return skill; // Keep upper case words as is
  return skill
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
};