// PGPM Program Configuration
export const pgpmConfig = {
  programName: "PGPM",
  totalElectives: 14,
  terms: [4, 5, 6, 7],

  termLimits: {
    4: { min: 3, max: 5 },
    5: { min: 3, max: 5 },
    6: { min: 3, max: 4 },
    7: { min: 2, max: 3 }
  },

  majorCategories: [
    { name: "Analytics", color: "#FFCC99" },
    { name: "Digital Strategy", color: "#9999FF" },
    { name: "Finance", color: "#99FF99" },
    { name: "Marketing", color: "#FF9999" },
    { name: "Operations", color: "#FFFF99" },
    { name: "Open Elective", color: "#A9A9A9" }
  ],

  functionalAreas: ["Marketing", "Finance", "Operations", "Analytics", "Digital Strategy"],

  specialization: {
    majorThreshold: 6,
    minorThreshold: 4,
    generalManagementThreshold: 2
  },

  // true = term limits are ranges (min/max), false = exact required count
  usesRangeLimits: true,

  prerequisites: {
    "Machine Learning II": ["Machine Learning I"],
    "Deep Learning & AI": ["Machine Learning I", "Machine Learning II"],
    "Natural Language Processing": ["Machine Learning I", "Machine Learning II"],
    "Advanced Digital Marketing": ["Digital Marketing"]
  },

  dependentCourses: {
    "Machine Learning I": ["Machine Learning II"],
    "Machine Learning II": ["Deep Learning & AI", "Natural Language Processing"],
    "Digital Marketing": ["Advanced Digital Marketing"]
  },

  mutuallyExclusive: [
    ["Service Operations (SOP)", "Services Marketing"]
  ],

  requireOpenElective: true,

  electivesData: {
    4: [
      { name: "Machine Learning I", major: "Analytics", color: "#FFCC99" },
      { name: "Web and Social Media Analytics", major: "Analytics", color: "#FFCC99" },
      { name: "Marketing & Retail Analytics", major: "Analytics, Marketing", color: "#FFCC99", crossListed: true },
      { name: "Digital Marketing", major: "Digital Strategy, Marketing", color: "#FF9999", crossListed: true },
      { name: "Digital Enterprise & Strategy", major: "Digital Strategy, Operations", color: "#9999FF", crossListed: true },
      { name: "Enterprise Resources Planning", major: "Digital Strategy, Operations", color: "#FFFF99", crossListed: true },
      { name: "Financial Modelling and Valuation", major: "Finance", color: "#99FF99" },
      { name: "Security Analysis & Portfolio Management", major: "Finance", color: "#99FF99" },
      { name: "Product & Brand Management", major: "Marketing", color: "#FF9999" },
      { name: "Consumer Behaviour", major: "Marketing", color: "#FF9999" },
      { name: "Supply Chain Management and Analysis (SCMA)", major: "Operations", color: "#FFFF99" }
    ],
    5: [
      { name: "Machine Learning II", major: "Analytics", color: "#FFCC99" },
      { name: "Big Data & Cloud Analytics", major: "Analytics, Digital Strategy", color: "#FFCC99", crossListed: true },
      { name: "Marketing & Retail Analytics", major: "Analytics, Marketing", color: "#FF9999", crossListed: true },
      { name: "Data Driven Marketing Strategy", major: "Digital Strategy, Marketing", color: "#FF9999", crossListed: true },
      { name: "Design Thinking", major: "Digital Strategy, Open Elective", color: "#9999FF", crossListed: true },
      { name: "Fintech", major: "Digital Strategy, Finance", color: "#99FF99", crossListed: true },
      { name: "Financial Management for Developing Marketing Strategy", major: "Finance, Marketing", color: "#FF9999", crossListed: true },
      { name: "B2B Marketing", major: "Marketing", color: "#FF9999" },
      { name: "Strategic Sourcing and Procurement", major: "Operations", color: "#FFFF99" },
      { name: "Modelling and Simulation in Operations Management", major: "Operations", color: "#FFFF99" },
      { name: "Emotional Intelligence for Leadership", major: "Open Elective", color: "#A9A9A9" }
    ],
    6: [
      { name: "Deep Learning & AI", major: "Analytics", color: "#FFCC99" },
      { name: "Big Data & Cloud Analytics", major: "Analytics, Digital Strategy", color: "#FFCC99", crossListed: true },
      { name: "Financial Risk Analytics", major: "Analytics, Finance", color: "#99FF99", crossListed: true },
      { name: "Technology Product Management", major: "Digital Strategy, Open Elective", color: "#9999FF", crossListed: true },
      { name: "Financial inclusion and Micro Finance", major: "Finance", color: "#99FF99" },
      { name: "Customer Relationship Management", major: "Marketing", color: "#FF9999" },
      { name: "Spatial Computing in Marketing", major: "Marketing, Digital Strategy", color: "#FF9999", crossListed: true },
      { name: "Service Operations (SOP)", major: "Operations", color: "#FFFF99" },
      { name: "Demand Planning & Forecasting", major: "Operations", color: "#FFFF99" },
      { name: "Managing Businesses in an International Context", major: "Open Elective", color: "#A9A9A9" },
      { name: "Strategic Negotiations", major: "Open Elective", color: "#A9A9A9" },
      { name: "Game Theory", major: "Open Elective", color: "#A9A9A9" }
    ],
    7: [
      { name: "Natural Language Processing", major: "Analytics", color: "#FFCC99" },
      { name: "HR Analytics", major: "Analytics, Open Elective", color: "#FFCC99", crossListed: true },
      { name: "Supply Chain Analytics", major: "Analytics, Operations", color: "#FFFF99", crossListed: true },
      { name: "Mergers & Acquisitions", major: "Finance", color: "#99FF99" },
      { name: "Personal and Behavioral Finance", major: "Finance", color: "#99FF99" },
      { name: "Alternative Investments", major: "Finance", color: "#99FF99" },
      { name: "Integrated Marketing Communication", major: "Marketing", color: "#FF9999" },
      { name: "Services Marketing", major: "Marketing", color: "#FF9999" },
      { name: "Business Excellence for Competitive Advantage", major: "Operations", color: "#FFFF99" },
      { name: "Business Ethics in Practice", major: "Open Elective", color: "#A9A9A9" },
      { name: "Sustainability", major: "Open Elective", color: "#A9A9A9" }
    ]
  }
};
