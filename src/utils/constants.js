import { BUILD_TYPE } from '../core/env.configs';

export const DEVICE_TYPE = 3;
export const DEFAULT_PAGE_SIZE = 10;
export const DEFAULT_PAGE = 1;

export const USER_TYPE = [
  { name: 'Select type', value: '' },
  { name: 'Super Admin', value: 0 },
  { name: 'Sub Admin', value: 1 }
];

export const USER_TYPE_B2B = [
  { name: 'Select type', value: '' },
  { name: 'Company Admin', value: 3 },
  { name: 'Company Sub Admin', value: 4 }
];

export const MONTH_NAMES = [
  { name: 'January', value: 1 },
  { name: 'February', value: 2 },
  { name: 'March', value: 3 },
  { name: 'April', value: 4 },
  { name: 'May', value: 5 },
  { name: 'June', value: 6 },
  { name: 'July', value: 7 },
  { name: 'August', value: 8 },
  { name: 'September', value: 9 },
  { name: 'October', value: 10 },
  { name: 'November', value: 11 },
  { name: 'December', value: 12 }
];

export const APPROVAL_STATUS = [
  { name: 'Approved', value: 1 },
  { name: 'Pending', value: 0 },
  { name: 'Declined', value: 2 }
];

export const PEAP_CONTENT = [
  { name: 'Specialist List', value: 1 },
  { name: 'Pending Specialists', value: 2 },
  { name: 'Insights', value: 3 },
  { name: 'Complaints', value: 4 },
  { name: 'Messaging', value: 5 },
  { name: 'Approvals', value: 6 }
];

export const ACCOUNT_TYPE = [
  { name: 'Select subscription status', value: '' },
  { name: 'Free', value: 1 },
  { name: 'In Trial', value: 0 },
  { name: 'Subscribed', value: 2 },
  { name: 'Expired', value: 3 }
];

export const PER_PAGE = [
  { name: '10', value: 10 },
  { name: '25', value: 25 },
  { name: '50', value: 50 },
  { name: '100', value: 100 },
  { name: '150', value: 150 },
  { name: '200', value: 200 },
  { name: '500', value: 500 },
  { name: '1000', value: 1000 },
  { name: '2000', value: 2000 }
];

export const MARITAL_STATUS = [
  { name: 'Married', value: '0' },
  { name: 'Divorced', value: '1' },
  { name: 'Widowed', value: '2' },
  { name: 'Single', value: '3' }
];

export const GENDER = [
  { name: 'Male', value: 1 },
  { name: 'Female', value: 2 },
  { name: 'Non Binary', value: 3 },
  { name: 'Inter Sex', value: 4 },
  { name: 'Trans Gender', value: 5 },
  { name: 'Non Prefer to say', value: 0 }
];
export const EXPERT_PROFILE_STATUS = [
  { name: 'Pending review', value: 0 },
  { name: 'approved', value: 1 },
  { name: 'Declined', value: 2 },
  { name: 'Invited to interview', value: 3 }
];

export const CONTENT_APPROVAL_STATUS = [
  { name: 'Approve', value: 1 },
  { name: 'Reject', value: 2 },
  { name: 'Draft', value: 0 }
];

export const APPROVAL_STATUS_DROPDOWN = [
  { name: 'Select approval status', value: '' },
  { name: 'Approve', value: 1 },
  { name: 'Reject', value: 2 },
  { name: 'Draft', value: 0 }
];

// export const RATING_DROPDOWN = [
//   { name: `0 ★`, value: 0 },
//   { name: `1 ★`, value: 1 },
//   { name: `2 ★`, value: 2 },
//   { name: `3 ★`, value: 3 },
//   { name: `4 ★`, value: 4 },
//   { name: `5 ★`, value: 5 }
// ];

export const STATUS = [
  { name: 'Active', value: 1 },
  { name: 'Inactive', value: 0 }
];

export const STATUS_FOR_DROPDOWN = [
  { name: 'Select status', value: '' },
  { name: 'Active', value: 1 },
  { name: 'Inactive', value: 0 }
];

export const COMPLAINANT_CONTENT = [
  { name: 'All', value: 1 },
  { name: 'Resolved', value: 2 },
  { name: 'Unresolved', value: 3 }
];

export const SPECIALIST_ROLES = [
  { name: 'Forensic psychiatry', value: 'Forensic psychiatry' },
  {
    name: 'Child and adolescent psychiatry ',
    value: 'Child and adolescent psychiatry'
  },
  { name: 'Forensic psychiatry', value: 'Forensic psychiatry' },
  { name: 'General psychiatry', value: 'General psychiatry' },
  { name: 'Liaison psychiatry', value: 'Liaison psychiatry' },
  { name: 'Medical psychotherapy', value: 'Medical psychotherapy' },
  { name: 'Old age psychiatry', value: 'Old age psychiatry' },
  {
    name: 'Psychiatry of intellectual disability (PID)',
    value: 'Psychiatry of intellectual disability (PID)'
  },
  { name: 'Other', value: '' },
  { name: 'Psychotherapist', value: 'Psychotherapist' },
  {
    name: 'cognitive behaviour therapist',
    value: 'cognitive behaviour therapist'
  },
  { name: 'emotional freedom therapy', value: 'emotional freedom therapy' },
  {
    name: 'neuro linguistic practitioner',
    value: 'neuro linguistic practitioner'
  }
];

export const SPECIALISATIONSADD = [
  { id: 'MentalHealth', value: 'Mental Health' },
  { id: 'HealthAndWellbeing', value: 'Health & Wellbeing' }
];

export const SPECIALIST_ROLE = [
  { name: 'other', value: 'Other' },
  { name: 'Clinical Psychologist', value: 'Clinical Psychologist' },
  { name: 'psychiatrist', value: 'Psychiatrist' },
  { name: 'mentalHealthCounselor', value: 'Mental Health Counselor' },
  { name: 'marriageFamilyTherapist', value: 'Marriage and Family Therapist' },
  { name: 'schoolCounselor', value: 'School Counselor' },
  { name: 'socialWorker', value: 'Social Worker' },
  { name: 'substanceAbuseCounselor', value: 'Substance Abuse Counselor' },
  {
    name: 'behavioralHealthTechnician',
    value: 'Behavioral Health Technician'
  },
  { name: 'psychiatricNurse', value: 'Psychiatric Nurse' },
  { name: 'mentalHealthTechnician', value: 'Mental Health Technician' },
  { name: 'artTherapist', value: 'Art Therapist' },
  { name: 'musicTherapist', value: 'Music Therapist' },
  { name: 'psychotherapist', value: 'Psychotherapist' },
  {
    name: 'occupationalTherapistMentalHealth',
    value: 'Occupational Therapist in Mental Health'
  },
  { name: 'caseManager', value: 'Case Manager' },
  { name: 'rehabilitationCounselor', value: 'Rehabilitation Counselor' },
  { name: 'peerSupportSpecialist', value: 'Peer Support Specialist' },
  { name: 'neuropsychologist', value: 'Neuropsychologist' },
  {
    name: 'childAdolescentTherapist',
    value: 'Child and Adolescent Therapist'
  },
  { name: 'griefCounselor', value: 'Grief Counselor' },
  {
    name: 'crisisInterventionSpecialist',
    value: 'Crisis Intervention Specialist'
  },
  {
    name: 'mentalHealthProgramManager',
    value: 'Mental Health Program Manager'
  },
  { name: 'forensicPsychologist', value: 'Forensic Psychologist' },
  { name: 'mentalHealthAdvocate', value: 'Mental Health Advocate' },
  { name: 'psychiatricSocialWorker', value: 'Psychiatric Social Worker' },
  {
    name: 'licensedProfessionalCounselor',
    value: 'Licensed Professional Counselor'
  },
  { name: 'pastoralCounselor', value: 'Pastoral Counselor' },
  { name: 'behavioralAnalyst', value: 'Behavioral Analyst' },
  {
    name: 'mentalHealthOutreachWorker',
    value: 'Mental Health Outreach Worker'
  },
  { name: 'veteransCounselor', value: 'Veterans Counselor' },
  { name: 'familySupportSpecialist', value: 'Family Support Specialist' },
  {
    name: 'cognitiveBehavioralTherapist',
    value: 'Cognitive Behavioral Therapist'
  },
  { name: 'groupTherapist', value: 'Group Therapist' },
  { name: 'playTherapist', value: 'Play Therapist' },
  { name: 'eatingDisorderSpecialist', value: 'Eating Disorder Specialist' },
  { name: 'clinicalDirector', value: 'Clinical Director' },
  { name: 'addictionPsychiatrist', value: 'Addiction Psychiatrist' },
  { name: 'clinicalSocialWorker', value: 'Clinical Social Worker' },
  { name: 'mentalHealthEducator', value: 'Mental Health Educator' },
  { name: 'psychiatricAide', value: 'Psychiatric Aide' },
  { name: 'researchPsychologist', value: 'Research Psychologist' },
  {
    name: 'communityMentalHealthWorker',
    value: 'Community Mental Health Worker'
  },
  {
    name: 'geriatricMentalHealthSpecialist',
    value: 'Geriatric Mental Health Specialist'
  },
  { name: 'traumaTherapist', value: 'Trauma Therapist' },
  { name: 'residentialCounselor', value: 'Residential Counselor' },
  { name: 'rehabilitationSpecialist', value: 'Rehabilitation Specialist' },
  {
    name: 'employeeAssistanceProgramCounselor',
    value: 'Employee Assistance Program Counselor'
  },
  {
    name: 'mentalHealthPolicyAnalyst',
    value: 'Mental Health Policy Analyst'
  },
  { name: 'mentalHealthResearcher', value: 'Mental Health Researcher' },
  {
    name: 'psychosocialRehabilitationSpecialist',
    value: 'Psychosocial Rehabilitation Specialist'
  },
  { name: 'wellnessCoach', value: 'Wellness Coach' },
  { name: 'healthEducator', value: 'Health Educator' },
  { name: 'nutritionist', value: 'Nutritionist' },
  { name: 'dietitian', value: 'Dietitian' },
  { name: 'publicHealthConsultant', value: 'Public Health Consultant' },
  {
    name: 'occupationalHealthSpecialist',
    value: 'Occupational Health Specialist'
  },
  { name: 'physicalTherapist', value: 'Physical Therapist' },
  { name: 'personalTrainer', value: 'Personal Trainer' },
  {
    name: 'healthWellnessCoordinator',
    value: 'Health and Wellness Coordinator'
  },
  { name: 'mentalHealthCounselor', value: 'Mental Health Counselor' },
  { name: 'wellnessProgramManager', value: 'Wellness Program Manager' },
  { name: 'healthPromotionSpecialist', value: 'Health Promotion Specialist' },
  { name: 'exercisePhysiologist', value: 'Exercise Physiologist' },
  {
    name: 'corporateWellnessConsultant',
    value: 'Corporate Wellness Consultant'
  },
  { name: 'healthCoach', value: 'Health Coach' },
  { name: 'yogaInstructor', value: 'Yoga Instructor' },
  { name: 'mindfulnessCoach', value: 'Mindfulness Coach' },
  { name: 'fitnessInstructor', value: 'Fitness Instructor' },
  { name: 'rehabilitationCounselor', value: 'Rehabilitation Counselor' },
  { name: 'healthServicesManager', value: 'Health Services Manager' },
  { name: 'communityHealthWorker', value: 'Community Health Worker' },
  { name: 'medicalSocialWorker', value: 'Medical Social Worker' },
  { name: 'chiropractor', value: 'Chiropractor' },
  { name: 'acupuncturist', value: 'Acupuncturist' },
  { name: 'massageTherapist', value: 'Massage Therapist' },
  { name: 'healthPolicyAnalyst', value: 'Health Policy Analyst' },
  { name: 'epidemiologist', value: 'Epidemiologist' },
  {
    name: 'healthCommunicationsSpecialist',
    value: 'Health Communications Specialist'
  },
  { name: 'clinicalPsychologist', value: 'Clinical Psychologist' },
  {
    name: 'wellnessProgramAdministrator',
    value: 'Wellness Program Administrator'
  },
  { name: 'publicHealthNurse', value: 'Public Health Nurse' },
  { name: 'geriatricCareManager', value: 'Geriatric Care Manager' },
  {
    name: 'healthInformaticsSpecialist',
    value: 'Health Informatics Specialist'
  },
  { name: 'occupationalTherapist', value: 'Occupational Therapist' },
  { name: 'wellnessConsultant', value: 'Wellness Consultant' },
  { name: 'sportsNutritionist', value: 'Sports Nutritionist' },
  { name: 'wellnessStrategist', value: 'Wellness Strategist' },
  {
    name: 'employeeAssistanceProgramCounselor',
    value: 'Employee Assistance Program Counselor'
  },
  { name: 'publicHealthAdvisor', value: 'Public Health Advisor' },
  { name: 'healthResearcher', value: 'Health Researcher' },
  { name: 'fitnessCenterManager', value: 'Fitness Center Manager' },
  { name: 'wellnessRetreatLeader', value: 'Wellness Retreat Leader' },
  { name: 'schoolHealthCoordinator', value: 'School Health Coordinator' },
  {
    name: 'behavioralHealthSpecialist',
    value: 'Behavioral Health Specialist'
  },
  { name: 'healthSafetyOfficer', value: 'Health and Safety Officer' },
  {
    name: 'integrativeHealthPractitioner',
    value: 'Integrative Health Practitioner'
  },
  { name: 'wellnessProductDeveloper', value: 'Wellness Product Developer' },
  { name: 'healthWellnessWriter', value: 'Health and Wellness Writer' },
  { name: 'spaManager', value: 'Spa Manager' },
  {
    name: 'preventiveHealthSpecialist',
    value: 'Preventive Health Specialist'
  }
];
export const SIGN_UP_PLATFORM = [
  { name: 'Select Platform', value: '' },
  { name: 'Email', value: 0 },
  { name: 'Google', value: 2 },
  { name: 'Apple', value: 1 }
];

export const MEDIA_TYPE = [
  { name: 'Audio', value: 1 },
  { name: 'Video', value: 2 }
];

export const CONTENT_TYPE_WITH_TEXT = [
  { name: 'Text', value: 1 },
  { name: 'Image', value: 2 },
  { name: 'Video', value: 3 }
];

export const MEDITATION_BY = [
  { name: 'Shoorah', value: 1 },
  { name: 'Expert', value: 2 }
];

export const FOCUS_TYPE = [
  { name: 'Main', value: 1 },
  { name: 'Affirmation', value: 2 }
];

export const FILTER_FOCUS_TYPE = [
  { name: 'Select focus type', value: '' },
  { name: 'Main', value: 1 },
  { name: 'Affirmation', value: 2 }
];

export const AFFIRMATION_TYPE = [
  { name: 'CSV', value: 1 },
  { name: 'Manual', value: 2 }
];

export const sentToUser = [
  { name: 'All', value: 1 },
  { name: 'In Trial', value: 2 },
  { name: 'Subscribed', value: 3 },
  { name: 'Expired', value: 5 },
  { name: 'Custom Users List', value: 4 },
  { name: 'Not Subscribed', value: 6 }
];

export const BtbSentToUser = [
  { name: 'Select', value: null },
  { name: 'All', value: 1 },
  // { name: "In Trial", value: 2 },
  // { name: "Subscribed", value: 3 },
  // { name: "Expired", value: 5 },
  { name: 'Custom Users List', value: 4 }
  // { name: "Not Subscribed", value: 6 },
];

export const CONTENT_TYPE = [
  { name: 'Select content type', value: '' },
  { name: 'Focus', value: 1 },
  { name: 'Affirmation', value: 2 },
  { name: 'Meditation', value: 3 },
  { name: 'Sound', value: 4 },
  { name: 'Shoorah Pod', value: 5 },
  { name: 'Gratitude', value: 6 },
  { name: 'Rituals', value: 7 },
  { name: 'Pulse Survey', value: 8 },
  { name: 'Vision Ideas', value: 9 },
  { name: 'Breathwork', value: 10 }, // This was used by previous company, and not in use now
  { name: 'Breathwork', value: 11 }
];
export const POD_TYPES = [
  { name: 'Meditation', value: 3 },
  { name: 'Sound', value: 4 },
  { name: 'Shoorah Pod', value: 5 },
  { name: 'Breathwork', value: 11 }
];

export const CONTENT_TYPE_FOR_FEEDBACKS = [
  CONTENT_TYPE[3],
  CONTENT_TYPE[4],
  CONTENT_TYPE[5],
  CONTENT_TYPE[11]
];

export const CONTENT_APPROVAL_TYPE = [
  { name: 'Latest version', value: 2 },
  { name: 'Previous version', value: 1 }
];

export const PERFORMANCE_CONTENT_TYPE = [
  { name: 'Cleanse', value: 1 },
  { name: 'Gratitude', value: 2 },
  { name: 'Goals', value: 3 },
  { name: 'Rituals', value: 4 },
  { name: 'Notes', value: 5 },
  { name: 'Badges', value: 6 }
];

export const USER_FEELS = [
  { name: 'Daily', value: 1 },
  { name: 'Weekly', value: 2 },
  { name: 'Monthly', value: 3 },
  { name: 'Yearly', value: 4 }
];

export const COLORS = [
  'rgba(218, 60, 60, 0.7)',
  'rgba(235, 128, 50, 0.7)',
  'rgba(133, 225, 61, 0.7)',
  'rgba(61, 225, 186, 0.7)',
  'rgba(227, 221, 57, 0.7)',
  'rgba(139, 60, 218, 0.7)',
  'rgba(50, 57, 235, 0.7)',
  'rgba(183, 61, 225, 0.7)',
  'rgba(128, 144, 203, 0.7)',
  'rgba(158, 36, 139, 0.7)',
  'rgba(54, 169, 251, 0.7)',
  'rgba(254, 170, 95, 0.7)',
  'rgba(245, 105, 107, 0.7)',
  'rgba(168, 71, 94, 0.7)',
  'rgba(188, 143, 176, 0.7)',
  'rgba(243, 217, 147, 0.7)',
  'rgba(141, 0, 9, 0.7)',
  'rgba(253, 80, 26, 0.7)',
  'rgba(207, 210, 58, 0.7)',
  'rgba(155, 182, 196, 0.7)',
  'rgba(93, 116, 97, 0.7)',
  'rgba(71, 142, 15, 0.7)',
  'rgba(248, 96, 124, 0.7)',
  'rgba(137, 172, 249, 0.7)',
  'rgba(251, 240, 111, 0.7)'
];

export const SALESMAN = [
  { name: 'Alex', value: 'alex' },
  { name: 'Methew', value: 'methew' },
  { name: 'John', value: 'john' },
  { name: 'Andrew', value: 'andrew' }
];

export const CURRENCY = [
  { name: 'EUR', icon: '€', value: 'eur' },
  { name: 'GBP', icon: '£', value: 'gbp' },
  { name: 'USD', icon: '$', value: 'usd' },
  { name: 'INR', icon: '₹', value: 'inr' },
  { name: 'CNY', icon: '¥', value: 'cny' }
];

export const AGERANGE = [
  { name: '18-25', value: '18-25', content: { min: 18, max: 25 } },
  { name: '25-35', value: '25-35', content: { min: 25, max: 35 } },
  { name: '35-45', value: '35-45', content: { min: 35, max: 45 } },
  { name: '45-55', value: '45-55', content: { min: 45, max: 55 } },
  { name: '55-65', value: '55-65', content: { min: 55, max: 65 } },
  { name: '65-100', value: '65-100', content: { min: 65, max: 100 } }
];

export const DATECREITERIA = [
  { name: 'Weekly', value: '1' },
  { name: 'Monthly', value: '2' },
  { name: 'Yearly', value: '3' },
  { name: 'Custom Dates', value: '4' }
];

export const ETHINICITY = [
  { name: 'African', value: 'african' },
  { name: 'Australian', value: 'australian' },
  { name: 'Asian', value: 'asian' },
  { name: 'British', value: 'british' },
  { name: 'European', value: 'european' },
  { name: 'North American', value: 'north american' },
  { name: 'South American', value: 'south american' }
];

export const DEPARTMENT = [
  { name: 'Select', value: null },
  { name: 'Accounts', value: 'accounts' },
  { name: 'Business Development', value: 'business development' },
  { name: 'Finance', value: 'finance' },
  { name: 'Human Resource', value: 'human resource' },
  { name: 'Information Technology', value: 'information technology' },
  { name: 'Infrastructure', value: 'infrastructure' },
  { name: 'Manufacturing', value: 'manufacturing' },
  { name: 'Marketing', value: 'marketing' },
  { name: 'Operations Management', value: 'operations management' },
  { name: 'Sales', value: 'sales' },
  { name: 'Others', value: 'others' }
];

export const MONTHS = [
  { name: '1 Year', value: 12 },
  { name: '2 Year', value: 24 },
  { name: '3 Year', value: 36 },
  { name: '4 Year', value: 48 },
  { name: '5 Year', value: 60 },
  { name: '6 Year', value: 72 },
  { name: '7 Year', value: 84 },
  { name: '8 Year', value: 96 },
  { name: '9 Year', value: 108 },
  { name: '10 Year', value: 120 }
];

export const CompanyTypeData = [
  '3D Printing',
  'AdTech (Advertising Technology)',
  'Accountant',
  'Adventure Tourism',
  'Aerospace',
  'Aerospace Engineering',
  'AgTech (Agricultural Technology)',
  'Alternative Energy',
  'Alternative Medicine',
  'Ambulance',
  'Animal Health',
  'Aquaculture',
  'Agriculture',
  'Agriculture Equipment',
  'Agrochemicals',
  'Art and Entertainment',
  'Artificial Intelligence',
  'Augmented Reality',
  'Automated Trading',
  'Automotive',
  'Automotive Repair and Maintenance',
  'Automotive Technology',
  'B2B Software',
  'B2C Software',
  'Banking and Finance',
  'Battery Technology',
  'Beauty and Personal Care',
  'Bespoke Tailoring',
  'Biodegradable Packaging',
  'Biodegradable Products',
  'Biometrics',
  'Biomedical Engineering',
  'Biotechnology',
  'Blockchain Technology',
  'Brand Strategy',
  'Broadcasting',
  'Broker',
  'Cannabis Industry',
  'Computer Vision',
  'Carbon Capture',
  'Catering Services',
  'Charitable Organizations',
  'Chatbot Development',
  'Chemicals',
  'Clean Beauty',
  'Clean Energy',
  'Cleantech',
  'Cloud Computing',
  'Cloud Computing Services',
  'Cognitive Computing',
  'Commercial Banking',
  'Commercial Drones',
  'Commercial Real Estate',
  'Construction and Real Estate',
  'Construction Technology',
  'Consumer Electronics',
  'Consumer Goods',
  'Consulting and Business Services',
  'Cosmetics',
  'Councilor',
  'Cruise Lines',
  'Cryptocurrency',
  'Cricket',
  'Culinary Tech',
  'Culinary Tourism',
  'Cybersecurity',
  'Doctor',
  'Data Analytics',
  'Data Science',
  'Dental Care',
  'Direct-to-Consumer (DTC)',
  'Drones and UAVs',
  'Eco-friendly Products',
  'Eco-Tourism',
  'E-commerce Platforms',
  'Education',
  'Educational Technology',
  'Electric Bicycles',
  'Electric Cars',
  'Eco-Friendly Packaging Solutions',
  'Electric Vehicles',
  'Electric Scooters',
  'Electric Vehicle Charging Infrastructure',
  'Electronics Manufacturing',
  'Emerging Technologies',
  'Employee Training',
  'Energy and Utilities',
  'Engineering Services',
  'Entertainment',
  'Environmental Conservation',
  'Environmental Services',
  'Environmental Consulting',
  'Environmental Tech',
  'Event Planning',
  'Event Tech',
  'Exploration and Drilling',
  'Exoskeleton Technology',
  'Fashion Accessories',
  'Fashion Design',
  'Fashion Retail',
  'Fast Food',
  'Film and TV Production',
  'Financial Inclusion',
  'Financial Planning',
  'Financial Technology',
  'Fine Arts',
  'Fitness Centers and Gyms',
  'Fitness Tech',
  'Fitness Wearables',
  'Fire brigade',
  'Food and Beverage',
  'Food Delivery Services',
  'Food Science',
  'Footballer',
  'Forestry',
  'Freight Shipping',
  'Gaming',
  'Geospatial Technology',
  'Generic Pharmaceuticals',
  'Government Administration',
  'Government and Public Sector',
  'Golf',
  'Graphic Design',
  'Green Building',
  'Green Chemistry',
  'Green Technology',
  'Green Building Materials',
  'Grocery and Supermarkets',
  'Health and Fitness Tech',
  'Health and Wellness',
  'Health Information Technology',
  'Health Insurance',
  'Healthcare and Pharmaceuticals',
  'Healthcare IT',
  'Health Monitoring',
  'Hospitals and Healthcare Facilities',
  'Hotels and Lodging',
  'Human Augmentation',
  'Human Resources',
  'Hybrid Vehicles',
  'Impact Investing',
  'Immersive Technology',
  'Impack Tech',
  'Inclusive Tech',
  'Industrial Robotics',
  'Information Technology',
  'Innovative Materials',
  'InsurTech (Insurance Technology)',
  'Insurance',
  'Insurance broker',
  'Intelligent Transportation',
  'Interior Design',
  'Internet of Things (IoT)',
  'Investment Management',
  'Jewelry and Accessories',
  'Landscaping Services',
  'Language Translation Services',
  'Law Firms',
  'Legal Services',
  'Legal Tech',
  'Life Extension',
  'Life Sciences',
  'Logistics',
  'Machine Learning',
  'Manufacturing',
  'Market Research',
  'Marketing and Advertising',
  'Media and Publishing',
  'Media Tech',
  'Medical Devices',
  'Medical Robotics',
  'Medical Technology',
  'Medical specialists',
  'Medical Tourism',
  'Mental Health',
  'Metal Fabrication',
  'Microbiome Technology',
  'Mobile App Development',
  'Mobile Health',
  'Modular Construction',
  'Music Production',
  'Natural Gas Utilities',
  'Natural Language Processing',
  'Natural Resources',
  'Navigation and Mapping',
  'Neurotechnology',
  'Newspapers and Magazines',
  'Non - Profit and Social Services',
  'Nurse',
  'Nutraceuticals',
  'Occupational Health and Safety',
  'Oil and Gas',
  'Oil and Gas Exploration',
  'Oil and Gas Services',
  'Online Education',
  'Online Gaming',
  'Online Marketplaces',
  'Online Retail',
  'Online Grocery Delivery',
  'Organic Beauty Products',
  'Organic Farming',
  'Outdoor Recreation',
  'Packaging Solutions',
  'Payment Solutions',
  'Peer-to-peer Lending',
  'Petroleum Refining',
  'Personal trainer',
  'Pharmaceutical Tech',
  'Pharmaceuticals',
  'Pharmaceuticals Research',
  'Photography',
  'Plastic Alternatives',
  'Podcasting',
  'Police',
  'Political Organizations',
  'Precision Agriculture',
  'Print and Digital Media',
  'Private Equity',
  'Product Design',
  'Property Management',
  'Public Relations',
  'Public Transit and Transportation',
  'Publishing',
  'Quantum Computing',
  'Real Estate',
  'Renewable Energy',
  'Renewable Fuels',
  'Renewable Energy Consulting',
  'Renewable Materials',
  'Renewable Resources',
  'Renovation Services',
  'Residential Construction',
  'Resorts and Casinos',
  'Responsive Web Design',
  'Retail and Ecommerce',
  'Retail Clothing',
  'Retail Technology',
  'Retirement Communities',
  'Robotics',
  'Robotic Process Automation (RPA)',
  'Satellite Technology',
  'SaaS (Software as a Service)',
  'Sales',
  'Science and Technology',
  'Search Engine Optimization (SEO)',
  'Security Services',
  'Semiconductor Manufacturing',
  'Smart Agriculture',
  'Smart Appliances',
  'Smart Buildings',
  'Smart Cities',
  'Smart Clothing',
  'Smart Contracts',
  'Smart Farming',
  'Smart Grid Technology',
  'Social Commerce',
  'Social Impact Investing',
  'Social Media Marketing',
  'Social Networking',
  'Social Services',
  'Shipping',
  'Software Development',
  'Solar Energy',
  'Solar Power',
  'Space Tourism',
  'Space Exploration',
  'Speech Recognition',
  'Sports and Recreation',
  'Sports Equipment',
  'Sports',
  'Subscription Boxes',
  'Subscription Services',
  'Synthetic Biology',
  'Tax and Accounting Services',
  'Technology',
  'Telecommunications',
  'Telemedicine Services',
  'Textiles and Apparel',
  'Theater and Performing Arts',
  'Therapeutics',
  'Therapist',
  'Toy Manufacturing',
  'Transportation and Logistics',
  'Travel Agencies',
  'Travel and Hospitality',
  'Tree Care',
  'Urban Farming',
  'Utilities',
  'Veterinary Pharmaceuticals',
  'Veterinary Services',
  'Video Game Development',
  'Video Streaming',
  'Virtual Assistance',
  'Virtual Events',
  'Virtual Reality',
  'Voice Technology',
  'Waste Management',
  'Wearable Tech',
  'Wearable Technology',
  'Web Development',
  'Wireless Technology',
  'Wholesale and Distribution',
  'Wind Energy',
  'Wind Power',
  'Youth Development'
];

export const gendersCategory = [
  {
    name: 'All',
    value: 6
  },
  {
    name: 'Male',
    value: 1
  },
  {
    name: 'Female',
    value: 2
  },
  {
    name: 'Non Binary',
    value: 3
  },
  {
    name: 'Intersex',
    value: 4
  },
  {
    name: 'Transgenders',
    value: 5
  },

  { name: 'Non Prefer to say', value: 0 }
];

export const badgesCategory = [
  {
    name: 'All',
    value: 0
  },
  {
    name: 'Bronze',
    value: 1
  },
  {
    name: 'Silver',
    value: 2
  },
  {
    name: 'Gold',
    value: 3
  },
  {
    name: 'Platinum',
    value: 4
  },
  {
    name: 'Diamond',
    value: 5
  },
  {
    name: 'Guru',
    value: 6
  }
];

export const JOB_ROLES = [
  { name: 'Account Executive', value: 'account executive' },
  { name: 'Account Manager', value: 'account manager' },
  { name: 'Accountant', value: 'accountant' },
  { name: 'Accounting and Taxation', value: 'accounting and taxation' },
  { name: 'Actuary', value: 'actuary' },
  { name: 'Actor', value: 'actor' },
  { name: 'Actuarial Science', value: 'actuarial science' },
  { name: 'Additive Manufacturing', value: 'additive manufacturing' },
  { name: 'Administrative Assistant', value: 'administrative assistant' },
  { name: 'Advertising and PR', value: 'advertising and pr' },
  { name: 'Advertising', value: 'advertising' },
  { name: 'Aerospace', value: 'aerospace' },
  { name: 'Agriculture and Food', value: 'agriculture and food' },
  { name: 'Agriculture and Farming', value: 'agriculture and farming' },
  { name: 'Agrifood', value: 'agrifood' },
  { name: 'Agrochemicals', value: 'agrochemicals' },
  { name: 'Agricultural', value: 'agricultural' },
  { name: 'AI Ethics Researcher', value: 'ai ethics researcher' },
  { name: 'Air Traffic Controller', value: 'air traffic controller' },
  { name: 'Air Transport', value: 'air transport' },
  { name: 'App Development', value: 'app development' },
  { name: 'Apparel and Textiles', value: 'apparel and textiles' },
  { name: 'Animator', value: 'animator' },
  { name: 'Antiques and Collectibles', value: 'antiques and collectibles' },
  { name: 'Architect', value: 'architect' },
  { name: 'Architecture and Design', value: 'architecture and design' },
  { name: 'Art and Antiques', value: 'art and antiques' },
  { name: 'Art and Design', value: 'art and design' },
  { name: 'Asset Management', value: 'asset management' },
  { name: 'Auction and Sales', value: 'auction and sales' },
  { name: 'Automotive', value: 'automotive' },
  {
    name: 'Automotive Parts and Accessories',
    value: 'automotive parts and accessories'
  },
  { name: 'Automotive Aftermarket', value: 'automotive aftermarket' },
  { name: 'Automation and Robotics', value: 'automation and robotics' },
  { name: 'Author', value: 'author' },
  { name: 'Aviation', value: 'aviation' },

  { name: 'Bakery and Confectionery', value: 'bakery and confectionery' },
  { name: 'Banking', value: 'banking' },
  {
    name: 'Banking and Financial Services',
    value: 'banking and financial services'
  },
  { name: 'Bartender', value: 'bartender' },
  { name: 'Beauty Services', value: 'beauty services' },
  { name: 'Betting and Gambling', value: 'betting and gambling' },
  { name: 'Beauty and Wellness', value: 'beauty and wellness' },
  { name: 'Beauty and Personal Care', value: 'beauty and personal care' },
  { name: 'Biomedical Engineer', value: 'biomedical engineer' },
  { name: 'Biotech Engineer', value: 'biotech engineer' },
  { name: 'Biotechnologist', value: 'biotechnologist' },
  { name: 'Biotechnology', value: 'biotechnology' },
  { name: 'Blockchain Developer', value: 'blockchain developer' },
  { name: 'Book Publishing', value: 'book publishing' },
  { name: 'Boat Building', value: 'boat building' },
  { name: 'Brewing', value: 'brewing' },
  { name: 'Business Services', value: 'business services' },
  { name: 'Business Owner', value: 'business owner' },
  { name: 'Building Materials', value: 'building materials' },
  { name: 'Business Support Services', value: 'business support services' },
  { name: 'Business Analyst', value: 'business analyst' },

  { name: 'Call Center Agent', value: 'call center agent' },
  { name: 'Capital Markets', value: 'capital markets' },
  { name: 'Career Counselor', value: 'career counselor' },
  { name: 'Carpenter', value: 'carpenter' },
  { name: 'Caregiving', value: 'caregiving' },
  { name: 'Cashier', value: 'cashier' },
  { name: 'Cash Handling', value: 'cash handling' },
  { name: 'CEO', value: 'ceo' },
  { name: 'Civil Engineer', value: 'civil engineer' },
  { name: 'Chemical Engineer', value: 'chemical engineer' },
  { name: 'Chemist', value: 'chemist' },
  { name: 'Consulting', value: 'consulting' },
  { name: 'Copywriter', value: 'copywriter' },
  { name: 'Clean Energy', value: 'clean energy' },
  { name: 'Chef', value: 'chef' },
  { name: 'Choreographer', value: 'choreographer' },
  { name: 'Ceramics and Tiles', value: 'ceramics and tiles' },
  { name: 'Ceramics and Glass', value: 'ceramics and glass' },
  { name: 'Charitable Giving', value: 'charitable giving' },
  { name: "Children's Services", value: "children's services" },
  { name: 'Chemical', value: 'chemical' },
  { name: 'Cleaning Services', value: 'cleaning services' },
  { name: 'Clinical Research', value: 'clinical research' },
  { name: 'Coal and Mining', value: 'coal and mining' },
  { name: 'Commercial Printing', value: 'commercial printing' },
  { name: 'Community Services', value: 'community services' },
  { name: 'Computers and Peripherals', value: 'computers and peripherals' },
  { name: 'Construction Materials', value: 'construction materials' },
  { name: 'Corporate Advisory', value: 'corporate advisory' },
  { name: 'College Professor', value: 'college professor' },
  { name: 'Courier Services', value: 'courier services' },
  { name: 'Construction', value: 'construction' },
  { name: 'Charitable Organizations', value: 'charitable organizations' },
  { name: 'Childcare and Education', value: 'childcare and education' },
  {
    name: 'Cleaning and Janitorial Services',
    value: 'cleaning and janitorial services'
  },
  { name: 'Client Relations Manager', value: 'client relations manager' },
  { name: 'Commercial Real Estate', value: 'commercial real estate' },
  { name: 'Computer Hardware', value: 'computer hardware' },
  { name: 'Construction Manager', value: 'construction manager' },
  { name: 'Computer Networking', value: 'computer networking' },
  {
    name: 'Construction and Engineering',
    value: 'construction and engineering'
  },
  { name: 'Contract Manufacturing', value: 'contract manufacturing' },
  { name: 'Corporate Training', value: 'corporate training' },
  { name: 'Content Creator', value: 'content creator' },
  { name: 'Courier and Postal Services', value: 'courier and postal services' },
  { name: 'Consumer Electronics', value: 'consumer electronics' },
  { name: 'Cosmetics', value: 'cosmetics' },
  { name: 'Chief Data Officer', value: 'chief data officer' },
  { name: 'Climate Change Analyst', value: 'climate change analyst' },
  {
    name: 'Creative Arts and Entertainment',
    value: 'creative arts and entertainment'
  },
  { name: 'Creative Services', value: 'creative services' },
  { name: 'Crime Scene Investigator', value: 'crime scene investigator' },
  { name: 'Cryptocurrency Analyst', value: 'cryptocurrency analyst' },
  {
    name: 'Customer Service Representative',
    value: 'customer service representative'
  },
  { name: 'Cybersecurity Specialist', value: 'cybersecurity specialist' },
  { name: 'Cybersecurity Analyst', value: 'cybersecurity analyst' },

  { name: 'Data Analytics', value: 'data analytics' },
  { name: 'Database Administrator', value: 'database administrator' },
  { name: 'Data Scientist', value: 'data scientist' },
  { name: 'Dairy and Frozen Food', value: 'dairy and frozen food' },
  { name: 'Data and Analytics', value: 'data and analytics' },
  { name: 'Defense and Space', value: 'defense and space' },
  { name: 'Defense', value: 'defense' },
  { name: 'Dental Assistant', value: 'dental assistant' },
  { name: 'Dental Hygienist', value: 'dental hygienist' },
  { name: 'Dentist', value: 'dentist' },
  { name: 'Detective', value: 'detective' },
  { name: 'Devops Engineer', value: 'devops engineer' },
  { name: 'Defense Industry', value: 'defense industry' },
  { name: 'Demolition and Dismantling', value: 'demolition and dismantling' },
  { name: 'Document Management', value: 'document management' },
  { name: 'Doctor', value: 'doctor' },
  {
    name: 'Digital Marketing Strategist',
    value: 'digital marketing strategist'
  },
  { name: 'Direct Selling', value: 'direct selling' },
  { name: 'Dispute Resolution', value: 'dispute resolution' },
  { name: 'Durable Medical Equipment', value: 'durable medical equipment' },
  { name: 'Director', value: 'director' },
  { name: 'Digital Marketing', value: 'digital marketing' },
  { name: 'Drone Operator', value: 'drone operator' },

  { name: 'E-commerce', value: 'e-commerce' },
  { name: 'E-commerce Manager', value: 'e-commerce manager' },
  { name: 'Editor', value: 'editor' },
  { name: 'Education', value: 'education' },
  { name: 'Education Technology', value: 'education technology' },
  { name: 'Educational Administrator', value: 'educational administrator' },
  { name: 'Electrical Equipment', value: 'electrical equipment' },
  { name: 'Electrical Services', value: 'electrical services' },
  { name: 'Electronics', value: 'electronics' },
  {
    name: 'Electrical and Electronic Manufacturing',
    value: 'electrical and electronic manufacturing'
  },
  { name: 'Electronic Components', value: 'electronic components' },
  { name: 'Electrician', value: 'electrician' },
  { name: 'Electrical Engineer', value: 'electrical engineer' },
  { name: 'Elementary School Teacher', value: 'elementary school teacher' },
  {
    name: 'Electronic Manufacturing Services',
    value: 'electronic manufacturing services'
  },
  { name: 'Emergency Medical Technician (EMT)', value: 'EMT' },
  { name: 'Employment Services', value: 'employment services' },
  { name: 'Entrepreneur', value: 'entrepreneur' },
  { name: 'Environmental Consulting', value: 'environmental consulting' },
  { name: 'Engineering', value: 'engineering' },
  { name: 'Energy Efficiency Services', value: 'energy efficiency services' },
  { name: 'Engineering Consultancy', value: 'engineering consultancy' },
  { name: 'Environmental Cleanup', value: 'environmental cleanup' },
  { name: 'Energy', value: 'energy' },
  { name: 'Energy and Utilities', value: 'energy and utilities' },
  { name: 'Environmental Services', value: 'environmental services' },
  { name: 'Environmental Scientist', value: 'environmental scientist' },
  { name: 'Epidemiologist', value: 'epidemiologist' },
  { name: 'Ergonomics', value: 'ergonomics' },
  { name: 'Esports', value: 'esports' },
  { name: 'Escrow Services', value: 'escrow services' },
  { name: 'Events Management', value: 'events management' },
  { name: 'Event Management', value: 'event management' },
  { name: 'Event Planner', value: 'event planner' },

  { name: 'Fashion Stylist', value: 'fashion stylist' },
  { name: 'Facilities Management', value: 'facilities management' },
  { name: 'Family Therapist', value: 'family therapist' },
  { name: 'Farm Worker', value: 'farm worker' },
  { name: 'Farmer', value: 'farmer' },
  { name: 'Fashion', value: 'fashion' },
  { name: 'Fashion Accessories', value: 'fashion accessories' },
  { name: 'Fashion and Apparel', value: 'fashion and apparel' },
  { name: 'Financial Services', value: 'financial services' },
  { name: 'Financial Analyst', value: 'financial analyst' },
  { name: 'Financial Consultant', value: 'financial consultant' },
  { name: 'Financial Planner', value: 'financial planner' },
  { name: 'Film Director', value: 'film director' },
  { name: 'Firefighter', value: 'firefighter' },
  { name: 'Financial Planning', value: 'financial planning' },
  { name: 'Fitness Trainer', value: 'fitness trainer' },
  { name: 'Fishery and Aquaculture', value: 'fishery and aquaculture' },
  { name: 'Florist', value: 'florist' },
  { name: 'Food and Beverage', value: 'food and beverage' },
  { name: 'Food and Grocery', value: 'food and grocery' },
  { name: 'Food Delivery', value: 'food delivery' },
  { name: 'Forensic Scientist', value: 'forensic scientist' },
  { name: 'Freight and Logistics', value: 'freight and logistics' },
  { name: 'Furniture and Fixtures', value: 'furniture and fixtures' },

  { name: 'Gaming and Gambling', value: 'gaming and gambling' },
  { name: 'Gems and Jewelry', value: 'gems and jewelry' },
  { name: 'Genetic Counselor', value: 'genetic counselor' },
  { name: 'Geologist', value: 'geologist' },
  { name: 'GIS Analyst', value: 'GIS analyst' },
  { name: 'Glass and Ceramics', value: 'glass and ceramics' },
  { name: 'Graphic Design', value: 'graphic design' },
  { name: 'Graphic Designer', value: 'graphic designer' },
  { name: 'Graphic Illustrator', value: 'graphic illustrator' },
  { name: 'Green Energy Consultant', value: 'green energy consultant' },

  { name: 'Healthcare', value: 'healthcare' },
  { name: 'Healthcare Technology', value: 'healthcare technology' },
  { name: 'Heavy Industry', value: 'heavy industry' },
  { name: 'Help Desk Technician', value: 'help desk technician' },
  { name: 'High School Teacher', value: 'high school teacher' },
  { name: 'Home Improvement', value: 'home improvement' },
  { name: 'Home Furnishings', value: 'home furnishings' },
  { name: 'Home Inspector', value: 'home inspector' },
  { name: 'Hotel Manager', value: 'hotel manager' },
  { name: 'Housekeeper', value: 'housekeeper' },
  { name: 'Human-Centered Designer', value: 'human-centered designer' },
  { name: 'Human Resource Coordinator', value: 'human resource coordinator' },
  { name: 'Human Resources Manager', value: 'human resources manager' },

  { name: 'Industrial Automation', value: 'industrial automation' },
  { name: 'Industrial Engineering', value: 'industrial engineering' },
  { name: 'Industrial Machinery', value: 'industrial machinery' },
  {
    name: 'Information Security Analyst',
    value: 'information security analyst'
  },
  { name: 'Information Technology', value: 'information technology' },
  {
    name: 'Influencer Marketing Manager',
    value: 'influencer marketing manager'
  },
  {
    name: 'Information Technology Consulting',
    value: 'information technology consulting'
  },
  { name: 'Insurance', value: 'insurance' },
  { name: 'Insurance Agent', value: 'insurance agent' },
  { name: 'Insurance Broking', value: 'insurance broking' },
  { name: 'Interior Designer', value: 'interior designer' },
  { name: 'Internet of Things', value: 'internet of things' },
  { name: 'IT Consulting and Services', value: 'it consulting and services' },
  { name: 'IT Consultant', value: 'IT consultant' },

  { name: 'Java Developer', value: 'java developer' },
  { name: 'Java Programmer', value: 'Java programmer' },
  { name: 'Jewelry Designer', value: 'jewelry designer' },
  { name: 'Jewelry and Watches', value: 'jewelry and watches' },
  { name: 'Job Search and Recruitment', value: 'job search and recruitment' },
  { name: 'Journalist', value: 'journalist' },
  { name: 'Judge', value: 'judge' },

  { name: 'K-12 Teacher', value: 'K-12 teacher' },
  { name: 'Key Account Executive', value: 'key account executive' },
  { name: 'Kinesiologist', value: 'kinesiologist' },
  { name: 'Kitchen Manager', value: 'kitchen manager' },

  { name: 'Laboratory Technician', value: 'laboratory technician' },
  { name: 'Lab Technician', value: 'lab technician' },
  { name: 'Landscape Architect', value: 'landscape architect' },
  { name: 'Lawyer', value: 'lawyer' },
  { name: 'Legal Assistant', value: 'legal assistant' },
  { name: 'Legal Secretary', value: 'legal secretary' },
  { name: 'Legal Services', value: 'legal services' },
  { name: 'Lifeguard', value: 'lifeguard' },
  { name: 'Life Sciences', value: 'life sciences' },
  { name: 'Lifestyle and Recreation', value: 'lifestyle and recreation' },
  { name: 'Librarian', value: 'librarian' },
  { name: 'Logistics', value: 'logistics' },

  {
    name: 'Machine Translation Engineer',
    value: 'machine translation engineer'
  },
  { name: 'Medical Illustrator', value: 'medical illustrator' },
  { name: 'Management Consulting', value: 'management consulting' },
  { name: 'Manufacturing', value: 'manufacturing' },
  { name: 'Market Research Analyst', value: 'market research analyst' },
  { name: 'Marketing Coordinator', value: 'marketing coordinator' },
  { name: 'Marine Biologist', value: 'marine biologist' },
  { name: 'Mason', value: 'mason' },
  { name: 'Materials Engineer', value: 'materials engineer' },
  { name: 'Marketing Consulting', value: 'marketing consulting' },
  { name: 'Mechanical Engineer', value: 'mechanical engineer' },
  { name: 'Meteorologist', value: 'meteorologist' },
  { name: 'Medical Devices', value: 'medical devices' },
  { name: 'Medical Diagnostics', value: 'medical diagnostics' },
  { name: 'Medical Tourism', value: 'medical tourism' },
  { name: 'Media and Entertainment', value: 'media and entertainment' },
  { name: 'Mining', value: 'mining' },
  { name: 'Mental Health Counselor', value: 'mental health counselor' },
  { name: 'Mobile App Developer', value: 'mobile app developer' },
  { name: 'Music Producer', value: 'music producer' },
  { name: 'Musician', value: 'musician' },

  { name: 'Nanoengineering Specialist', value: 'nanoengineering specialist' },
  { name: 'Nanotechnology', value: 'nanotechnology' },
  { name: 'Network Administrator', value: 'network administrator' },
  { name: 'Neurologist', value: 'neurologist' },
  { name: 'Nurse', value: 'nurse' },
  { name: 'Nutritionist', value: 'nutritionist' },

  {
    name: 'Occupational Safety Specialist',
    value: 'occupational safety specialist'
  },
  { name: 'Occupational Therapist', value: 'occupational therapist' },
  { name: 'Oceanographer', value: 'oceanographer' },
  { name: 'Office Manager', value: 'office manager' },
  { name: 'Oil and Gas', value: 'oil and gas' },
  { name: 'Operations Manager', value: 'operations manager' },
  { name: 'Organizational Psychologist', value: 'organizational psychologist' },

  { name: 'Painter', value: 'painter' },
  { name: 'Patient Advocate', value: 'patient advocate' },
  { name: 'Paralegal', value: 'paralegal' },
  { name: 'Petroleum Engineer', value: 'petroleum engineer' },
  { name: 'Pharmaceuticals', value: 'pharmaceuticals' },
  { name: 'Pharmacist', value: 'pharmacist' },
  { name: 'Physiotherapist', value: 'physiotherapist' },
  { name: 'Photographer', value: 'photographer' },
  { name: 'Physicist', value: 'physicist' },
  { name: 'Pilot', value: 'pilot' },
  { name: 'Plumber', value: 'plumber' },
  { name: 'Podcast Producer', value: 'podcast producer' },
  { name: 'Police Officer', value: 'police officer' },
  { name: 'Producer', value: 'producer' },
  { name: 'Property Manager', value: 'property manager' },
  { name: 'Production Manager', value: 'production manager' },
  { name: 'Project Manager', value: 'project manager' },
  { name: 'Professional Services', value: 'professional services' },
  { name: 'Product Manager', value: 'product manager' },
  { name: 'Public Administration', value: 'public administration' },

  { name: 'Quality Control Inspector', value: 'quality control inspector' },
  { name: 'Quantitative Analyst', value: 'quantitative analyst' },
  { name: 'Quantum Physicist', value: 'quantum physicist' },

  { name: 'Radiologist', value: 'radiologist' },
  { name: 'Radio Host', value: 'radio host' },
  { name: 'Real Estate', value: 'real estate' },
  { name: 'Real Estate Agent', value: 'real estate agent' },
  { name: 'Real Estate Broker', value: 'real estate broker ' },
  { name: 'Refree', value: 'refree' },
  { name: 'Renewable Energy Engineer', value: 'renewable energy engineer' },
  { name: 'Restaurant Manager', value: 'restaurant manager' },
  { name: 'Retail', value: 'retail' },
  { name: 'Research Scientist', value: 'research scientist' },
  { name: 'Risk Analyst', value: 'risk analyst' },
  { name: 'Robotics Engineer', value: 'robotics engineer' },

  { name: 'Sales Representative', value: 'sales representative' },
  { name: 'School Counselor', value: 'school counselor' },
  { name: 'Security Analyst', value: 'security analyst' },
  { name: 'Security Guard', value: 'security guard' },
  { name: 'Security and Surveillance', value: 'security and surveillance' },
  { name: 'Sharing Economy', value: 'sharing economy' },
  { name: 'Software Developer', value: 'software developer' },
  { name: 'Social Impact Analyst', value: 'social impact analyst' },
  { name: 'Social Media Manager', value: 'social media manager' },
  { name: 'Space Tourism Guide', value: 'space tourism guide' },
  { name: 'Sports and Recreation', value: 'sports and recreation' },
  {
    name: 'Sustainable Fashion Designer',
    value: 'sustainable fashion designer'
  },
  { name: 'Systems Analyst', value: 'systems analyst' },

  { name: 'Tax Examiner', value: 'tax examiner' },
  { name: 'Teacher', value: 'teacher' },
  { name: 'Teacher Assistant', value: 'teacher assistant' },
  {
    name: 'Technical Support Specialist',
    value: 'technical support specialist'
  },
  { name: 'Technical Writer', value: 'technical writer' },
  { name: 'Telecommunications', value: 'telecommunications' },
  { name: 'Tour Guide', value: 'tour guide' },
  { name: 'Travel Agent', value: 'travel agent' },
  { name: 'Transportation', value: 'transportation' },
  { name: 'Travel and Tourism', value: 'travel and tourism' },
  { name: 'Truck Driver', value: 'truck driver' },

  { name: 'UI/UX Architect', value: 'UI/UX architect' },
  { name: 'Underwriter', value: 'underwriter' },
  { name: 'Urban Planner', value: 'urban planner' },
  { name: 'UX/UI Researcher', value: 'ux/ui researcher' },

  { name: 'Vascular Surgeon', value: 'vascular surgeon' },
  { name: 'Veterinarian', value: 'veterinarian' },
  { name: 'Veterinary', value: 'veterinary' },
  { name: 'Videographer', value: 'videographer' },
  { name: 'Video Editor', value: 'video editor' },
  {
    name: 'Virtual and Augmented Reality',
    value: 'virtual and augmented reality'
  },
  { name: 'Virtual Reality Developer', value: 'virtual reality developer' },

  { name: 'Web Developer', value: 'web developer' },
  { name: 'Welder', value: 'welder' },
  { name: 'Wildlife Biologist', value: 'wildlife biologist' },

  { name: 'Xenobiologist', value: 'xenobiologist' },
  { name: 'Xenobotanist', value: 'xenobotanist' },
  { name: 'X-ray Technician', value: 'X-ray technician' },
  { name: 'XML Developer', value: 'XML developer' },

  { name: 'Yoga Instructor', value: 'yoga instructor' },
  { name: 'Youth Counselor', value: 'youth counselor' },
  { name: 'Youth Program Coordinator', value: 'youth program coordinator' },
  { name: 'Youth Mentor', value: 'youth mentor' },

  { name: 'Zipline Pilot', value: 'zipline pilot' },
  { name: 'Zoologist', value: 'zoologist' },
  { name: 'Zookeeper', value: 'zoologist' },
  { name: 'Zumba Instructor', value: 'zumba instructor' },
  { name: 'Others', value: 'others' }
];

export const JOB_ROLES_CATEGORY = [
  {
    name: 'Administration',
    value: [
      'administrative assistant',
      'systems analyst',
      'social media manager',
      'business analyst',
      'business services',
      'business support services',
      'industrial machinery',
      'influencer marketing manager',
      'key account executive',
      'network administrator',
      'office manager',
      'operations manager',
      'public administration',
      'product manager'
    ]
  },
  {
    name: 'Agriculture',
    value: [
      'agriculture and food',
      'agriculture and farming',
      'agrifood',
      'agrochemicals',
      'agricultural',
      'Apparel and Textiles',
      'fishery and aquaculture',
      'food and grocery',
      'farm worker',
      'farmer',
      'food and beverage'
    ]
  },
  {
    name: 'Arts & antiques',
    value: [
      'art and antiques',
      'antiques and collectibles',
      'art and design',
      'betting and gambling',
      'brewing',
      'creative arts and entertainment',
      'media and entertainment'
    ]
  },
  {
    name: 'CEO',
    value: ['business owner', 'ceo', 'chief data officer', 'director']
  },
  {
    name: 'Construction',
    value: [
      'architect',
      'architecture and design',
      'boat building',
      'building materials',
      'mason',
      'carpenter',
      'construction manager',
      'ceramics and tiles',
      'construction materials',
      'construction',
      'real estate agent',
      'real estate broker',
      'ceramics and glass',
      'construction and engineering',
      'demolition and dismantling',
      'glass and ceramics',
      'landscape architect'
    ]
  },
  {
    name: 'Consultancy',
    value: [
      'consulting',
      'corporate advisory',
      'youth counselor',
      'corporate training',
      'environmental consulting',
      'employment services',
      'engineering consultancy',
      'ergonomics',
      'financial consultant',
      'financial planner',
      'financial planning',
      'genetic counselor',
      'IT consultant',
      'job search and recruitment',
      'management consulting',
      'marketing consulting',
      'occupational safety specialist',
      'occupational therapist',
      'risk analyst'
    ]
  },
  {
    name: 'Customer services',
    value: [
      'social impact analyst',
      'welder',
      'firefighter',
      'police officer',
      'quality control inspector',
      'florist',
      'detective',
      'security guard',
      'restaurant manager',
      'tour guide',
      'crime scene investigator',
      'telecommunications',
      'sales representative',
      'security and surveillance',
      'retail',
      'cashier',
      'commercial real estate',
      'contract manufacturing',
      'consumer electronics',
      'dental assistant',
      'dental hygienist',
      'defense industry',
      'professional services',
      'electrical equipment',
      'electrical services',
      'event management',
      'electronic components',
      'environmental services',
      'escrow services',
      'events management',
      'event planner',
      'facilities management',
      'furniture and fixtures',
      'home improvement',
      'heavy industry',
      'home furnishings',
      'insurance broking',
      'insurance agent',
      'journalist',
      'legal services',
      'call center agent',
      'real estate'
    ]
  },
  {
    name: 'Delivery',
    value: ['courier services', 'courier and postal services', 'food delivery']
  },
  {
    name: 'Education and Research',
    value: [
      'childcare and education',
      'zoologist',
      'lab technician',
      'school counselor',
      'youth program coordinator',
      'youth mentor',
      'teacher',
      'librarian',
      'teacher assistant',
      'editor',
      'college professor',
      'author',
      'high school teacher',
      'elementary school teacher',
      'educational administrator',
      'yoga instructor',
      'document management',
      'education technology',
      'education',
      'K-12 teacher'
    ]
  },
  {
    name: 'Engineering',
    value: [
      'additive manufacturing',
      'xenobotanist',
      'xenobiologist',
      'mechanical engineer',
      'aerospace',
      'automotive',
      'automotive aftermarket',
      'automotive parts and accessories',
      'automation and robotics',
      'biomedical engineer',
      'robotics engineer',
      'biotech engineer',
      'biotechnologist',
      'biotechnology',
      'chemical engineer',
      'civil engineer',
      'electrical engineer',
      'engineering',
      'petroleum engineer',
      'electrical engineer',
      'industrial engineering',
      'renewable energy engineer',
      'materials engineer',
      'machine translation engineer',
      'nanoengineering specialist',
      'nanotechnology'
    ]
  },
  {
    name: 'Financial Services',
    value: [
      'account executive',
      'sharing economy',
      'account manager',
      'accountant',
      'accounting and taxation',
      'actuarial science',
      'asset management',
      'auction and sales',
      'banking',
      'banking and financial services',
      'capital markets',
      'cash handling',
      'charitable giving',
      'charitable organizations',
      'financial services',
      'financial analyst'
    ]
  },
  {
    name: 'Food & Services',
    value: [
      'bakery and confectionery',
      'chef',
      'dairy and frozen food',
      'food and beverage',
      'kitchen manager',
      'nutritionist'
    ]
  },
  {
    name: 'Human Resource',
    value: ['human resource coordinator', 'human resources manager']
  },
  {
    name: 'IT & Development',
    value: [
      'ai ethics researcher',
      'mobile app developer',
      'XML developer',
      'video editor',
      'database administrator',
      'web developer',
      'cybersecurity analyst',
      'virtual reality developer',
      'UI/UX architect',
      'ux/ui researcher',
      'technical support specialist',
      'software developer',
      'security analyst',
      'project manager',
      'app development',
      'property manager',
      'production manager',
      'blockchain developer',
      'computers and peripherals',
      'computer hardware',
      'computer networking',
      'cybersecurity specialist',
      'digital marketing strategist',
      'data analytics',
      'devops engineer',
      'data scientist',
      'data and analytics',
      'digital marketing',
      'e-commerce',
      'e-commerce manager',
      'GIS analyst',
      'graphic designer',
      'graphic illustrator',
      'graphic design',
      'information security analyst',
      'information technology',
      'insurance',
      'industrial automation',
      'information technology consulting',
      'internet of things',
      'it consulting and services',
      'java developer',
      'Java programmer',
      'mobile app tester',
      'animator',
      'quantitative analyst'
    ]
  },
  {
    name: 'Legal Services',
    value: ['lawyer', 'legal assistant', 'patient advocate', 'judge', 'legal secretary']
  },
  {
    name: 'Marketting',
    value: [
      'advertising and pr',
      'advertising',
      'customer service representative',
      'commercial printing',
      'community services',
      'creative services',
      'direct selling',
      'market research analyst',
      'marketing coordinator'
    ]
  },
  {
    name: 'Movie Industry',
    value: ['actor', 'choreographer', 'film director', 'musician', 'music producer', 'producer']
  },
  {
    name: 'Publishing',
    value: ['book publishing', 'copywriter', 'content creator', 'technical writer', 'underwriter']
  },
  {
    name: 'Science & Healthcare',
    value: [
      'chemist',
      'X-ray technician',
      'mental health counselor',
      'veterinary',
      'vascular surgeon',
      'clean energy',
      'clinical research',
      'chemical',
      'defense and space',
      'durable medical equipment',
      'defense',
      'EMT',
      'doctor',
      'energy efficiency services',
      'energy',
      'environmental scientist',
      'energy and utilities',
      'research scientist',
      'radiologist',
      'epidemiologist',
      'forensic scientist',
      'quantum physicist',
      'geologist',
      'pharmacist',
      'physiotherapist',
      'green energy consultant',
      'neurologist',
      'oceanographer',
      'nurse',
      'medical devices',
      'medical tourism',
      'medical diagnostics',
      'laboratory technician',
      'pharmaceuticals',
      'healthcare',
      'healthcare technology',
      'human-centered designer',
      'kinesiologist',
      'life sciences',
      'medical illustrator'
    ]
  },
  {
    name: 'Sports',
    value: ['esports', 'gaming and gambling', 'sports and recreation', 'refree']
  },
  {
    name: 'Transport and logistics',
    value: [
      'air traffic controller',
      'travel and tourism',
      'transportation',
      'air transport',
      'aviation',
      'cleaning services',
      'freight and logistics',
      'logistics'
    ]
  },
  {
    name: 'Wellness & Lifestyle',
    value: [
      'beauty and wellness',
      'sustainable fashion designer',
      'beauty and personal care',
      'beauty services',
      'caregiving',
      `children's services`,
      'cosmetics',
      'dentist',
      'fashion and apparel',
      'fashion accessories',
      'fashion stylist',
      'fitness trainer',
      'fashion',
      'insurance',
      'jewelry and watches',
      'lifestyle and recreation'
    ]
  },
  {
    name: 'Others',
    value: [
      'cleaning and janitorial services',
      'others',
      'actuary',
      'entrepreneur',
      'zipline pilot',
      'lifeguard',
      'zumba instructor',
      'bartender',
      'client relations manager',
      'zookeeper',
      'wildlife biologist',
      'career counselor',
      'videographer',
      'virtual and augmented reality',
      'veterinarian',
      'space tourism guide',
      'home inspector',
      'housekeeper',
      'interior designer',
      'urban planner',
      'coal and mining',
      'climate change analyst',
      'cryptocurrency analyst',
      'drone operator',
      'dispute resolution',
      'plumber',
      'painter',
      'pilot',
      'physicist',
      'electronics',
      'electrical and electronic manufacturing',
      'electronic manufacturing services',
      'environmental cleanup',
      'gems and jewelry',
      'hotel manager',
      'jewelry designer',
      'marine biologist',
      'electrician',
      'manufacturing',
      'mining',
      'meteorologist',
      'help desk technician',
      'oil and gas',
      'radio host',
      'organizational psychologist',
      'photographer',
      'family therapist',
      'paralegal',
      'travel agent',
      'tour guide',
      'tax examiner',
      'podcast producer'
    ]
  }
];

export const AREA_LIST = [
  { name: 'In-App', value: 'app' },
  { name: 'Email', value: 'email' },
  { name: 'Website', value: 'website' }
];

export const TIME_LIST = [
  { name: '1 AM - 3 AM', value: 1 },
  { name: '3 AM - 6 AM', value: 2 },
  { name: '6 AM - 9 AM', value: 3 },
  { name: '9 AM - 12 PM', value: 4 },
  { name: '12 PM - 3 PM', value: 5 },
  { name: '3 PM - 6 PM', value: 6 },
  { name: '6 PM - 9 PM', value: 7 },
  { name: '9 PM - 12 AM', value: 8 },
  { name: 'Day', value: 9 }
];

export const BREATHWORK_CATEGORIES = [
  { name: 'Calm', value: 1 },
  { name: 'Sleep', value: 2 },
  { name: 'Energise', value: 3 },
  { name: 'Focus', value: 4 }
];

export const BREATHWORK_LOTTIES = [
  { name: 'Circle', value: 1 },
  { name: 'Square', value: 2 },
  { name: 'Hexagon', value: 3 },
  { name: 'Triangle', value: 4 }
];

export const BREATHWORK_FILTER = [
  { name: 'All', value: '' },
  { name: 'Calm', value: 1 },
  { name: 'Sleep', value: 2 },
  { name: 'Energise', value: 3 },
  { name: 'Focus', value: 4 }
];
export const SURVEY_SCOPE = {
  B2B: 1,
  B2C: 2,
  ALL: 3
};

export const SURVEY_AREA = {
  APP: 1,
  EMAIL: 2,
  WEB: 2
};

export const B2BPLANS = [
  {
    name: 'Team',
    value: 'com.shoorah.teamplan',
    size: '1 - 50 Users',
    min: 1,
    max: 50
  },
  {
    name: 'Business',
    value: 'com.shoorah.businessplan',
    size: '51 - 200 Users',
    min: 51,
    max: 200
  },
  {
    name: 'Corporate',
    value: 'com.shoorah.corporateplan',
    size: '201 - 1000 Users',
    min: 201,
    max: 1000
  },
  {
    name: 'Enterprise',
    value: 'com.shoorah.enterpriseplan',
    size: '1001 + Users',
    min: 1001
  }
];

export const TRIAL_DAYS_COUNTS = [
  { name: '1 Days', value: 1 },
  { name: '3 Days', value: 3 },
  { name: '7 Days', value: 7 },
  { name: '14 Days', value: 14 },
  { name: '30 Days', value: 30 },
  { name: '60 Days', value: 60 },
  { name: '90 Days', value: 90 }
];

export const B2B_PLANS_DROPDOWN = [
  { name: '1', value: '1' },
  { name: '2', value: '3' },
  { name: '3', value: '7' },
  { name: '4', value: '14' },
  { name: '5', value: '30' },
  { name: '5', value: '60' },
  { name: '6', value: '90' },
  { name: '7', value: '90' },
  { name: '8', value: '90' },
  { name: '9', value: '90' },
  { name: '10', value: '90' }
];

export const TEAM_PLAN_ONE_TIME_DROPDOWN = [
  {
    name: '1',
    value:
      BUILD_TYPE === 'PRODUCTION'
        ? 'price_1PEwZEADGIcEMIOufL57muJO'
        : 'price_1PDghFADGIcEMIOuGSKorTMh'
  },
  {
    name: '2',
    value:
      BUILD_TYPE === 'PRODUCTION'
        ? 'price_1PEwZEADGIcEMIOuDQW3kp4o'
        : 'price_1PDghaADGIcEMIOuOdkPZL0w'
  },
  {
    name: '3',
    value:
      BUILD_TYPE === 'PRODUCTION'
        ? 'price_1PEwZEADGIcEMIOuIDN1ZMFm'
        : 'price_1PDghkADGIcEMIOuFg8Zhj7k'
  },
  {
    name: '4',
    value:
      BUILD_TYPE === 'PRODUCTION'
        ? 'price_1PEwZEADGIcEMIOuDQ9RtArU'
        : 'price_1PDghuADGIcEMIOuxvWXOvId'
  },
  {
    name: '5',
    value:
      BUILD_TYPE === 'PRODUCTION'
        ? 'price_1PEwZEADGIcEMIOu04LsJzQb'
        : 'price_1PDgj7ADGIcEMIOuZoP7Rjvg'
  },
  {
    name: '6',
    value:
      BUILD_TYPE === 'PRODUCTION'
        ? 'price_1PEwZEADGIcEMIOuTIqAVM66'
        : 'price_1PDgjMADGIcEMIOucOL1xCnr'
  },
  {
    name: '7',
    value:
      BUILD_TYPE === 'PRODUCTION'
        ? 'price_1PEwZEADGIcEMIOugDNrLIxJ'
        : 'price_1PDgoTADGIcEMIOumrjFzXuC'
  },
  {
    name: '8',
    value:
      BUILD_TYPE === 'PRODUCTION'
        ? 'price_1PEwZEADGIcEMIOuE2zFdhAD'
        : 'price_1PDgocADGIcEMIOuviZijp9a'
  },
  {
    name: '9',
    value:
      BUILD_TYPE === 'PRODUCTION'
        ? 'price_1PEwZEADGIcEMIOut2wxZ47H'
        : 'price_1PDgokADGIcEMIOuGmlgwpY2'
  },
  {
    name: '10',
    value:
      BUILD_TYPE === 'PRODUCTION'
        ? 'price_1PEwZEADGIcEMIOuiQ0tIJ7w'
        : 'price_1PDgorADGIcEMIOuZlcljJJF'
  }
];

export const TEAM_PLAN_MONTHLY_DROPDOWN = [
  {
    name: '1',
    value:
      BUILD_TYPE === 'PRODUCTION'
        ? 'price_1PEwZEADGIcEMIOuHV7R1mEI'
        : 'price_1PE2u7ADGIcEMIOutwmT6AZ5'
  },
  {
    name: '2',
    value:
      BUILD_TYPE === 'PRODUCTION'
        ? 'price_1PEwZEADGIcEMIOuF2a9jPzV'
        : 'price_1PE2u7ADGIcEMIOuzg6a4qzq'
  },
  {
    name: '3',
    value:
      BUILD_TYPE === 'PRODUCTION'
        ? 'price_1PEwZEADGIcEMIOupeiygHOH'
        : 'price_1PE2u7ADGIcEMIOuR9wkZifk'
  },
  {
    name: '4',
    value:
      BUILD_TYPE === 'PRODUCTION'
        ? 'price_1PEwZDADGIcEMIOuQAXWR2nU'
        : 'price_1PE2u7ADGIcEMIOuq1hnxasv'
  },
  {
    name: '5',
    value:
      BUILD_TYPE === 'PRODUCTION'
        ? 'price_1PEwZDADGIcEMIOuDFoZaKkH'
        : 'price_1PE2u7ADGIcEMIOu9FB3JOHH'
  },
  {
    name: '6',
    value:
      BUILD_TYPE === 'PRODUCTION'
        ? 'price_1PEwZDADGIcEMIOuvO5X813a'
        : 'price_1PE2u7ADGIcEMIOuxyKEL2gX'
  },
  {
    name: '7',
    value:
      BUILD_TYPE === 'PRODUCTION'
        ? 'price_1PEwZDADGIcEMIOuxR8ElbQw'
        : 'price_1PE2u7ADGIcEMIOuhQTcRL8p'
  },
  {
    name: '8',
    value:
      BUILD_TYPE === 'PRODUCTION'
        ? 'price_1PEwZDADGIcEMIOuHjkiFQjD'
        : 'price_1PE2u7ADGIcEMIOuBcRZyU5Z'
  },
  {
    name: '9',
    value:
      BUILD_TYPE === 'PRODUCTION'
        ? 'price_1PEwZDADGIcEMIOuJ7zIFQy1'
        : 'price_1PE2u7ADGIcEMIOuzRkBd6v9'
  },
  {
    name: '10',
    value:
      BUILD_TYPE === 'PRODUCTION'
        ? 'price_1PEwZDADGIcEMIOuQFNnDabw'
        : 'price_1PE2u7ADGIcEMIOujfPLpw9M'
  }
];

export const TEAM_PLAN_SIXMONTHS_DROPDOWN = [
  {
    name: '1',
    value:
      BUILD_TYPE === 'PRODUCTION'
        ? 'price_1PEwZDADGIcEMIOuAvM0oycz'
        : 'price_1PE32CADGIcEMIOuOoRdCBrh'
  },
  {
    name: '2',
    value:
      BUILD_TYPE === 'PRODUCTION'
        ? 'price_1PEwZDADGIcEMIOu1iEJO5ee'
        : 'price_1PE32CADGIcEMIOu6pwiqwRO'
  },
  {
    name: '3',
    value:
      BUILD_TYPE === 'PRODUCTION'
        ? 'price_1PEwZDADGIcEMIOuzv846sNv'
        : 'price_1PE32CADGIcEMIOuRRsNflyN'
  },
  {
    name: '4',
    value:
      BUILD_TYPE === 'PRODUCTION'
        ? 'price_1PEwZDADGIcEMIOuKYtq64lg'
        : 'price_1PE32CADGIcEMIOuSv38pBDS'
  },
  {
    name: '5',
    value:
      BUILD_TYPE === 'PRODUCTION'
        ? 'price_1PEwZDADGIcEMIOu6wVkU7Ys'
        : 'price_1PE32CADGIcEMIOue5dBqbCH'
  },
  {
    name: '6',
    value:
      BUILD_TYPE === 'PRODUCTION'
        ? 'price_1PEwZDADGIcEMIOuM2lA5ODP'
        : 'price_1PE32CADGIcEMIOum9GKEPRv'
  },
  {
    name: '7',
    value:
      BUILD_TYPE === 'PRODUCTION'
        ? 'price_1PEwZDADGIcEMIOuHZD1Ky2O'
        : 'price_1PE32CADGIcEMIOudCBHqq5p'
  },
  {
    name: '8',
    value:
      BUILD_TYPE === 'PRODUCTION'
        ? 'price_1PEwZDADGIcEMIOuy0vj2TQH'
        : 'price_1PE32CADGIcEMIOuFe6ZeVek'
  },
  {
    name: '9',
    value:
      BUILD_TYPE === 'PRODUCTION'
        ? 'price_1PEwZDADGIcEMIOuPAxWSiN9'
        : 'price_1PE32CADGIcEMIOuS0S3bWtN'
  },
  {
    name: '10',
    value:
      BUILD_TYPE === 'PRODUCTION'
        ? 'price_1PEwZDADGIcEMIOuM7sI6wtW'
        : 'price_1PE32CADGIcEMIOuyYwy0TC8'
  }
];

export const TEAM_PLAN_ANNUAL_DROPDOWN = [
  {
    name: '1',
    value:
      BUILD_TYPE === 'PRODUCTION'
        ? 'price_1PEwZDADGIcEMIOukKPa8SGi'
        : 'price_1PE36BADGIcEMIOuWqC1FTbA'
  },
  {
    name: '2',
    value:
      BUILD_TYPE === 'PRODUCTION'
        ? 'price_1PEwZDADGIcEMIOu3kFaeBhN'
        : 'price_1PE36BADGIcEMIOuZBI9ARrU'
  },
  {
    name: '3',
    value:
      BUILD_TYPE === 'PRODUCTION'
        ? 'price_1PEwZDADGIcEMIOupVaLxwH8'
        : 'price_1PE36BADGIcEMIOuohlBMDEp'
  },
  {
    name: '4',
    value:
      BUILD_TYPE === 'PRODUCTION'
        ? 'price_1PEwZDADGIcEMIOumyRR3XNt'
        : 'price_1PE36BADGIcEMIOuw9dwRoSS'
  },
  {
    name: '5',
    value:
      BUILD_TYPE === 'PRODUCTION'
        ? 'price_1PEwZDADGIcEMIOu5NgO3WBJ'
        : 'price_1PE36BADGIcEMIOucruiDyyC'
  },
  {
    name: '6',
    value:
      BUILD_TYPE === 'PRODUCTION'
        ? 'price_1PEwZDADGIcEMIOuuYPgt0Ex'
        : 'price_1PE36BADGIcEMIOuA3OxHIk6'
  },
  {
    name: '7',
    value:
      BUILD_TYPE === 'PRODUCTION'
        ? 'price_1PEwZDADGIcEMIOulAIENMl9'
        : 'price_1PE36BADGIcEMIOuUKULZNU1'
  },
  {
    name: '8',
    value:
      BUILD_TYPE === 'PRODUCTION'
        ? 'price_1PEwZCADGIcEMIOuCSTdyvmd'
        : 'price_1PE36BADGIcEMIOuu23Vk2XW'
  },
  {
    name: '9',
    value:
      BUILD_TYPE === 'PRODUCTION'
        ? 'price_1PEwZDADGIcEMIOubGLj0DW5'
        : 'price_1PE36BADGIcEMIOuyJCukHwe'
  },
  {
    name: '10',
    value:
      BUILD_TYPE === 'PRODUCTION'
        ? 'price_1PEwZDADGIcEMIOueTz0ms30'
        : 'price_1PE36BADGIcEMIOuk08D0qcs'
  }
];

export const BUSINESS_PLAN_ONE_TIME_DROPDOWN = [
  {
    name: '1',
    value:
      BUILD_TYPE === 'PRODUCTION'
        ? 'price_1PEwpPADGIcEMIOuCwPeqRjR'
        : 'price_1PDgr9ADGIcEMIOuzFZHiQOx'
  },
  {
    name: '2',
    value:
      BUILD_TYPE === 'PRODUCTION'
        ? 'price_1PEwpPADGIcEMIOuhBuXqQkv'
        : 'price_1PDgroADGIcEMIOu4vKKkQSk'
  },
  {
    name: '3',
    value:
      BUILD_TYPE === 'PRODUCTION'
        ? 'price_1PEwpPADGIcEMIOuGVhWhhUg'
        : 'price_1PDgroADGIcEMIOum5E3jsDt'
  },
  {
    name: '4',
    value:
      BUILD_TYPE === 'PRODUCTION'
        ? 'price_1PEwpPADGIcEMIOuo7rVaGXl'
        : 'price_1PDgswADGIcEMIOu99m8vW5y'
  },
  {
    name: '5',
    value:
      BUILD_TYPE === 'PRODUCTION'
        ? 'price_1PEwpPADGIcEMIOu2hpXMJht'
        : 'price_1PDgswADGIcEMIOuJgsBeMn8'
  },
  {
    name: '6',
    value:
      BUILD_TYPE === 'PRODUCTION'
        ? 'price_1PEwpPADGIcEMIOud5oUAct6'
        : 'price_1PDgswADGIcEMIOuRxj2IsAB'
  },
  {
    name: '7',
    value:
      BUILD_TYPE === 'PRODUCTION'
        ? 'price_1PEwpPADGIcEMIOuobrxkkvH'
        : 'price_1PDgswADGIcEMIOuL8bwo0ek'
  },
  {
    name: '8',
    value:
      BUILD_TYPE === 'PRODUCTION'
        ? 'price_1PEwpPADGIcEMIOuCldff5LI'
        : 'price_1PDgswADGIcEMIOuNiEPhys1'
  },
  {
    name: '9',
    value:
      BUILD_TYPE === 'PRODUCTION'
        ? 'price_1PEwpPADGIcEMIOuC4UFt3TX'
        : 'price_1PDgswADGIcEMIOur8nP7BCF'
  },
  {
    name: '10',
    value:
      BUILD_TYPE === 'PRODUCTION'
        ? 'price_1PEwpPADGIcEMIOuAbIAfjCk'
        : 'price_1PDgswADGIcEMIOuqBrjykGs'
  }
];

export const BUSINESS_PLAN_MONTHLY_DROPDOWN = [
  {
    name: '1',
    value:
      BUILD_TYPE === 'PRODUCTION'
        ? 'price_1PEwpPADGIcEMIOuOB2X1JEo'
        : 'price_1PE3HuADGIcEMIOuhAOCudvP'
  },
  {
    name: '2',
    value:
      BUILD_TYPE === 'PRODUCTION'
        ? 'price_1PEwpPADGIcEMIOu5gMDKntU'
        : 'price_1PE3HuADGIcEMIOu4EuMgZVj'
  },
  {
    name: '3',
    value:
      BUILD_TYPE === 'PRODUCTION'
        ? 'price_1PEwpPADGIcEMIOuOxFkO69q'
        : 'price_1PE3HuADGIcEMIOuRYFAdFIU'
  },
  {
    name: '4',
    value:
      BUILD_TYPE === 'PRODUCTION'
        ? 'price_1PEwpPADGIcEMIOujsgKmJAI'
        : 'price_1PE3HuADGIcEMIOu07Z9uO3X'
  },
  {
    name: '5',
    value:
      BUILD_TYPE === 'PRODUCTION'
        ? 'price_1PEwpPADGIcEMIOutzGnEvN8'
        : 'price_1PE3HuADGIcEMIOuTveelYmd'
  },
  {
    name: '6',
    value:
      BUILD_TYPE === 'PRODUCTION'
        ? 'price_1PEwpPADGIcEMIOuZaA4hQ48'
        : 'price_1PE3HuADGIcEMIOuyIDV1YzE'
  },
  {
    name: '7',
    value:
      BUILD_TYPE === 'PRODUCTION'
        ? 'price_1PEwpPADGIcEMIOulBG8QoFm'
        : 'price_1PE3HuADGIcEMIOusCSLXeiX'
  },
  {
    name: '8',
    value:
      BUILD_TYPE === 'PRODUCTION'
        ? 'price_1PEwpOADGIcEMIOufgUnMMjY'
        : 'price_1PE3HuADGIcEMIOu9uxvIMt5'
  },
  {
    name: '9',
    value:
      BUILD_TYPE === 'PRODUCTION'
        ? 'price_1PEwpPADGIcEMIOu2yTabwh4'
        : 'price_1PE3HuADGIcEMIOuIFoGzqBD'
  },
  {
    name: '10',
    value:
      BUILD_TYPE === 'PRODUCTION'
        ? 'price_1PEwpPADGIcEMIOuYUjdXgcW'
        : 'price_1PE3HuADGIcEMIOueOHQ5Gaz'
  }
];

export const BUSINESS_PLAN_SIXMONTHS_DROPDOWN = [
  {
    name: '1',
    value:
      BUILD_TYPE === 'PRODUCTION'
        ? 'price_1PEwpOADGIcEMIOuylMos4Lj'
        : 'price_1PE4RxADGIcEMIOuBqlI1XpG'
  },
  {
    name: '2',
    value:
      BUILD_TYPE === 'PRODUCTION'
        ? 'price_1PEwpPADGIcEMIOuLnohGIZi'
        : 'price_1PE4RxADGIcEMIOug8Jgtccv'
  },
  {
    name: '3',
    value:
      BUILD_TYPE === 'PRODUCTION'
        ? 'price_1PEwpPADGIcEMIOuXMLvBUDD'
        : 'price_1PE4RxADGIcEMIOus6ka1T88'
  },
  {
    name: '4',
    value:
      BUILD_TYPE === 'PRODUCTION'
        ? 'price_1PEwpPADGIcEMIOuYd38z7f5'
        : 'price_1PE4RxADGIcEMIOuIGwnXGPR'
  },
  {
    name: '5',
    value:
      BUILD_TYPE === 'PRODUCTION'
        ? 'price_1PEwpPADGIcEMIOuVb8kuN5Q'
        : 'price_1PE4RxADGIcEMIOuI0ZIYCZC'
  },
  {
    name: '6',
    value:
      BUILD_TYPE === 'PRODUCTION'
        ? 'price_1PEwpOADGIcEMIOu1n0NoGTK'
        : 'price_1PE4RxADGIcEMIOubo4Ri4JR'
  },
  {
    name: '7',
    value:
      BUILD_TYPE === 'PRODUCTION'
        ? 'price_1PEwpOADGIcEMIOumlRnZoYD'
        : 'price_1PE4RxADGIcEMIOuv7VcvM7f'
  },
  {
    name: '8',
    value:
      BUILD_TYPE === 'PRODUCTION'
        ? 'price_1PEwpOADGIcEMIOuVE9azQ8w'
        : 'price_1PE4RxADGIcEMIOugtZsjyWe'
  },
  {
    name: '9',
    value:
      BUILD_TYPE === 'PRODUCTION'
        ? 'price_1PEwpOADGIcEMIOuvR59Y5U7'
        : 'price_1PE4RxADGIcEMIOukoqNErOE'
  },
  {
    name: '10',
    value:
      BUILD_TYPE === 'PRODUCTION'
        ? 'price_1PEwpOADGIcEMIOu0f9LQ2Wc'
        : 'price_1PE4RxADGIcEMIOu3Z1Z790q'
  }
];

export const BUSINESS_PLAN_ANNUAL_DROPDOWN = [
  {
    name: '1',
    value:
      BUILD_TYPE === 'PRODUCTION'
        ? 'price_1PEwpOADGIcEMIOuKUKfAc8w'
        : 'price_1PE4VKADGIcEMIOu0ncy1DhD'
  },
  {
    name: '2',
    value:
      BUILD_TYPE === 'PRODUCTION'
        ? 'price_1PEwpOADGIcEMIOuj7z0PPeV'
        : 'price_1PE4VKADGIcEMIOutFtuIzEI'
  },
  {
    name: '3',
    value:
      BUILD_TYPE === 'PRODUCTION'
        ? 'price_1PEwpOADGIcEMIOuzVU7MlIr'
        : 'price_1PE4VKADGIcEMIOuLUpfxy61'
  },
  {
    name: '4',
    value:
      BUILD_TYPE === 'PRODUCTION'
        ? 'price_1PEwpOADGIcEMIOubxCkdO7v'
        : 'price_1PE4VKADGIcEMIOuYYaVaRI6'
  },
  {
    name: '5',
    value:
      BUILD_TYPE === 'PRODUCTION'
        ? 'price_1PEwpOADGIcEMIOuzqr1ie4N'
        : 'price_1PE4VKADGIcEMIOukbX65e1q'
  },
  {
    name: '6',
    value:
      BUILD_TYPE === 'PRODUCTION'
        ? 'price_1PEwpOADGIcEMIOuktxaDJH7'
        : 'price_1PE4VKADGIcEMIOuzvge8hkM'
  },
  {
    name: '7',
    value:
      BUILD_TYPE === 'PRODUCTION'
        ? 'price_1PEwpOADGIcEMIOuJrwWwKvh'
        : 'price_1PE4VKADGIcEMIOultEmxiab'
  },
  {
    name: '8',
    value:
      BUILD_TYPE === 'PRODUCTION'
        ? 'price_1PEwpOADGIcEMIOufgUnMMjY'
        : 'price_1PE4VKADGIcEMIOuHWdx9ojA'
  },
  {
    name: '9',
    value:
      BUILD_TYPE === 'PRODUCTION'
        ? 'price_1PEwpOADGIcEMIOuTbfz3p3f'
        : 'price_1PE4VKADGIcEMIOuK3HpjhR1'
  },
  {
    name: '10',
    value:
      BUILD_TYPE === 'PRODUCTION'
        ? 'price_1PEwpOADGIcEMIOuJHqcNlLd'
        : 'price_1PE4VKADGIcEMIOuh4x9YMYf'
  }
];

export const CORPORATE_PLAN_ONE_TIME_DROPDOWN = [
  {
    name: '1',
    value:
      BUILD_TYPE === 'PRODUCTION'
        ? 'price_1PEwpPADGIcEMIOuCwPeqRjR'
        : 'price_1PDgtjADGIcEMIOub5CSED92'
  },
  {
    name: '2',
    value:
      BUILD_TYPE === 'PRODUCTION'
        ? 'price_1PEwpPADGIcEMIOuhBuXqQkv'
        : 'price_1PDguwADGIcEMIOuWiKgDpTI'
  },
  {
    name: '3',
    value:
      BUILD_TYPE === 'PRODUCTION'
        ? 'price_1PEwpPADGIcEMIOuGVhWhhUg'
        : 'price_1PDguwADGIcEMIOuFajyo6p7'
  },
  {
    name: '4',
    value:
      BUILD_TYPE === 'PRODUCTION'
        ? 'price_1PEwpPADGIcEMIOuo7rVaGXl'
        : 'price_1PDguwADGIcEMIOuS70IpYZs'
  },
  {
    name: '5',
    value:
      BUILD_TYPE === 'PRODUCTION'
        ? 'price_1PEwpPADGIcEMIOu2hpXMJht'
        : 'price_1PDguwADGIcEMIOuGZIwJHfS'
  },
  {
    name: '6',
    value:
      BUILD_TYPE === 'PRODUCTION'
        ? 'price_1PEwpPADGIcEMIOud5oUAct6'
        : 'price_1PDguwADGIcEMIOuo4Fry5A8'
  },
  {
    name: '7',
    value:
      BUILD_TYPE === 'PRODUCTION'
        ? 'price_1PEwpPADGIcEMIOuobrxkkvH'
        : 'price_1PDguwADGIcEMIOuZiO19a96'
  },
  {
    name: '8',
    value:
      BUILD_TYPE === 'PRODUCTION'
        ? 'price_1PEwpPADGIcEMIOuCldff5LI'
        : 'price_1PDguwADGIcEMIOuGjOm2DkM'
  },
  {
    name: '9',
    value:
      BUILD_TYPE === 'PRODUCTION'
        ? 'price_1PEwpPADGIcEMIOuC4UFt3TX'
        : 'price_1PDguwADGIcEMIOutwSLqvpq'
  },
  {
    name: '10',
    value:
      BUILD_TYPE === 'PRODUCTION'
        ? 'price_1PEwpPADGIcEMIOuAbIAfjCk'
        : 'price_1PDguwADGIcEMIOuddDX0ZqS'
  }
];

export const CORPORATE_PLAN_MONTHLY_DROPDOWN = [
  {
    name: '1',
    value:
      BUILD_TYPE === 'PRODUCTION'
        ? 'price_1PEwpPADGIcEMIOuOB2X1JEo'
        : 'price_1PE4g7ADGIcEMIOuraWxz204'
  },
  {
    name: '2',
    value:
      BUILD_TYPE === 'PRODUCTION'
        ? 'price_1PEwpPADGIcEMIOu5gMDKntU'
        : 'price_1PE4g7ADGIcEMIOuBQ0vUyB0'
  },
  {
    name: '3',
    value:
      BUILD_TYPE === 'PRODUCTION'
        ? 'price_1PEwpPADGIcEMIOuOxFkO69q'
        : 'price_1PE4g7ADGIcEMIOuacXZhfdx'
  },
  {
    name: '4',
    value:
      BUILD_TYPE === 'PRODUCTION'
        ? 'price_1PEwpPADGIcEMIOujsgKmJAI'
        : 'price_1PE4g7ADGIcEMIOuw3U7Zywj'
  },
  {
    name: '5',
    value:
      BUILD_TYPE === 'PRODUCTION'
        ? 'price_1PEwpPADGIcEMIOutzGnEvN8'
        : 'price_1PE4g7ADGIcEMIOutzcmoYXf'
  },
  {
    name: '6',
    value:
      BUILD_TYPE === 'PRODUCTION'
        ? 'price_1PEwpPADGIcEMIOuZaA4hQ48'
        : 'price_1PE4g7ADGIcEMIOuXKbMAlXo'
  },
  {
    name: '7',
    value:
      BUILD_TYPE === 'PRODUCTION'
        ? 'price_1PEwpPADGIcEMIOulBG8QoFm'
        : 'price_1PE4g7ADGIcEMIOufjCveXep'
  },
  {
    name: '8',
    value:
      BUILD_TYPE === 'PRODUCTION'
        ? 'price_1PEwpOADGIcEMIOufgUnMMjY'
        : 'price_1PE4g8ADGIcEMIOuAjgYaDgc'
  },
  {
    name: '9',
    value:
      BUILD_TYPE === 'PRODUCTION'
        ? 'price_1PEwpPADGIcEMIOu2yTabwh4'
        : 'price_1PE4g7ADGIcEMIOuW8njdG2u'
  },
  {
    name: '10',
    value:
      BUILD_TYPE === 'PRODUCTION'
        ? 'price_1PEwpPADGIcEMIOuYUjdXgcW'
        : 'price_1PE4g7ADGIcEMIOut8nazWpH'
  }
];

export const CORPORATE_PLAN_SIXMONTHS_DROPDOWN = [
  {
    name: '1',
    value:
      BUILD_TYPE === 'PRODUCTION'
        ? 'price_1PEwpOADGIcEMIOuylMos4Lj'
        : 'price_1PE4g8ADGIcEMIOuJ81baSFw'
  },
  {
    name: '2',
    value:
      BUILD_TYPE === 'PRODUCTION'
        ? 'price_1PEwpPADGIcEMIOuLnohGIZi'
        : 'price_1PE4g7ADGIcEMIOuDu8YWPnb'
  },
  {
    name: '3',
    value:
      BUILD_TYPE === 'PRODUCTION'
        ? 'price_1PEwpPADGIcEMIOuXMLvBUDD'
        : 'price_1PE4g7ADGIcEMIOuM1nvnPnL'
  },
  {
    name: '4',
    value:
      BUILD_TYPE === 'PRODUCTION'
        ? 'price_1PEwpPADGIcEMIOuYd38z7f5'
        : 'price_1PE4g7ADGIcEMIOugEHJu6aZ'
  },
  {
    name: '5',
    value:
      BUILD_TYPE === 'PRODUCTION'
        ? 'price_1PEwpPADGIcEMIOuVb8kuN5Q'
        : 'price_1PE4g7ADGIcEMIOuxBd1LBm7'
  },
  {
    name: '6',
    value:
      BUILD_TYPE === 'PRODUCTION'
        ? 'price_1PEwpOADGIcEMIOu1n0NoGTK'
        : 'price_1PE4nqADGIcEMIOu7BHH30px'
  },
  {
    name: '7',
    value:
      BUILD_TYPE === 'PRODUCTION'
        ? 'price_1PEwpOADGIcEMIOumlRnZoYD'
        : 'price_1PE4g7ADGIcEMIOumdJqlLOK'
  },
  {
    name: '8',
    value:
      BUILD_TYPE === 'PRODUCTION'
        ? 'price_1PEwpOADGIcEMIOuVE9azQ8w'
        : 'price_1PE4g7ADGIcEMIOuAD5YJLeY'
  },
  {
    name: '9',
    value:
      BUILD_TYPE === 'PRODUCTION'
        ? 'price_1PEwpOADGIcEMIOuvR59Y5U7'
        : 'price_1PE4g7ADGIcEMIOul0wY1HPZ'
  },
  {
    name: '10',
    value:
      BUILD_TYPE === 'PRODUCTION'
        ? 'price_1PEwpOADGIcEMIOu0f9LQ2Wc'
        : 'price_1PE4g7ADGIcEMIOuBpRgA8PO'
  }
];

export const CORPORATE_PLAN_ANNUAL_DROPDOWN = [
  {
    name: '1',
    value:
      BUILD_TYPE === 'PRODUCTION'
        ? 'price_1PEwpOADGIcEMIOuKUKfAc8w'
        : 'price_1PE4g7ADGIcEMIOuT6Zv5o5i'
  },
  {
    name: '2',
    value:
      BUILD_TYPE === 'PRODUCTION'
        ? 'price_1PEwpOADGIcEMIOuj7z0PPeV'
        : 'price_1PE4g7ADGIcEMIOujEJKWxDN'
  },
  {
    name: '3',
    value:
      BUILD_TYPE === 'PRODUCTION'
        ? 'price_1PEwpOADGIcEMIOuzVU7MlIr'
        : 'price_1PE4g7ADGIcEMIOubMz0lClL'
  },
  {
    name: '4',
    value:
      BUILD_TYPE === 'PRODUCTION'
        ? 'price_1PEwpOADGIcEMIOubxCkdO7v'
        : 'price_1PE4g7ADGIcEMIOuP86PIzFy'
  },
  {
    name: '5',
    value:
      BUILD_TYPE === 'PRODUCTION'
        ? 'price_1PEwpOADGIcEMIOuzqr1ie4N'
        : 'price_1PE4g7ADGIcEMIOu8Cy0rbJp'
  },
  {
    name: '6',
    value:
      BUILD_TYPE === 'PRODUCTION'
        ? 'price_1PEwpOADGIcEMIOuktxaDJH7'
        : 'price_1PE4g7ADGIcEMIOuVnq0ibcN'
  },
  {
    name: '7',
    value:
      BUILD_TYPE === 'PRODUCTION'
        ? 'price_1PEwpOADGIcEMIOuJrwWwKvh'
        : 'price_1PE4g7ADGIcEMIOuLGnzRsNs'
  },
  {
    name: '8',
    value:
      BUILD_TYPE === 'PRODUCTION'
        ? 'price_1PEwpOADGIcEMIOuUWkdAymx'
        : 'price_1PE4g7ADGIcEMIOuWj2MD0pA'
  },
  {
    name: '9',
    value:
      BUILD_TYPE === 'PRODUCTION'
        ? 'price_1PEwpOADGIcEMIOuTbfz3p3f'
        : 'price_1PE4g7ADGIcEMIOuq9zCBEVR'
  },
  {
    name: '10',
    value:
      BUILD_TYPE === 'PRODUCTION'
        ? 'price_1PEwpOADGIcEMIOuJHqcNlLd'
        : 'price_1PE4g7ADGIcEMIOuKArZqpCn'
  }
];

export const ENTERPRICE_PLAN_ONE_TIME_DROPDOWN = [
  {
    name: '1',
    value:
      BUILD_TYPE === 'PRODUCTION'
        ? 'price_1PEwpfADGIcEMIOu6z3Qgjpg'
        : 'price_1PDgwyADGIcEMIOuUuneBRG1'
  },
  {
    name: '2',
    value:
      BUILD_TYPE === 'PRODUCTION'
        ? 'price_1PEwpfADGIcEMIOujYMrVp7O'
        : 'price_1PDgypADGIcEMIOuwZglX2en'
  },
  {
    name: '3',
    value:
      BUILD_TYPE === 'PRODUCTION'
        ? 'price_1PEwpfADGIcEMIOuobJq82rD'
        : 'price_1PDgypADGIcEMIOu2n6iZiSO'
  },
  {
    name: '4',
    value:
      BUILD_TYPE === 'PRODUCTION'
        ? 'price_1PEwpfADGIcEMIOu16iXULbA'
        : 'price_1PDgypADGIcEMIOuUGk5sT3O'
  },
  {
    name: '5',
    value:
      BUILD_TYPE === 'PRODUCTION'
        ? 'price_1PEwpfADGIcEMIOu3So99Eus'
        : 'price_1PDgypADGIcEMIOu3f7ejyU3'
  },
  {
    name: '6',
    value:
      BUILD_TYPE === 'PRODUCTION'
        ? 'price_1PEwpeADGIcEMIOuqs0FDPiS'
        : 'price_1PDgypADGIcEMIOuDAnsZ0Ik'
  },
  {
    name: '7',
    value:
      BUILD_TYPE === 'PRODUCTION'
        ? 'price_1PEwpfADGIcEMIOuCVnUkswt'
        : 'price_1PDgypADGIcEMIOuPQICzHJY'
  },
  {
    name: '8',
    value:
      BUILD_TYPE === 'PRODUCTION'
        ? 'price_1PEwpeADGIcEMIOuuNP7PjHx'
        : 'price_1PDgypADGIcEMIOuefRagKKc'
  },
  {
    name: '9',
    value:
      BUILD_TYPE === 'PRODUCTION'
        ? 'price_1PEwpeADGIcEMIOu3UcGUofD'
        : 'price_1PDgypADGIcEMIOuFQ9RTjgG'
  },
  {
    name: '10',
    value:
      BUILD_TYPE === 'PRODUCTION'
        ? 'price_1PEwpeADGIcEMIOuhByoOvPy'
        : 'price_1PDgypADGIcEMIOumLb64Tv6'
  }
];

export const ENTERPRICE_PLAN_MONTHLY_DROPDOWN = [
  {
    name: '1',
    value:
      BUILD_TYPE === 'PRODUCTION'
        ? 'price_1PEwpeADGIcEMIOuZd2IcfWU'
        : 'price_1PE4vUADGIcEMIOuLLhfNyfW'
  },
  {
    name: '2',
    value:
      BUILD_TYPE === 'PRODUCTION'
        ? 'price_1PEwpeADGIcEMIOuyFbofbpR'
        : 'price_1PE4vUADGIcEMIOuASujMljx'
  },
  {
    name: '3',
    value:
      BUILD_TYPE === 'PRODUCTION'
        ? 'price_1PEwpeADGIcEMIOul28BAYet'
        : 'price_1PE4vUADGIcEMIOuCfzQL4Ub'
  },
  {
    name: '4',
    value:
      BUILD_TYPE === 'PRODUCTION'
        ? 'price_1PEwpeADGIcEMIOuGlGhruev'
        : 'price_1PE4vUADGIcEMIOuhlNX1Yee'
  },
  {
    name: '5',
    value:
      BUILD_TYPE === 'PRODUCTION'
        ? 'price_1PEwpeADGIcEMIOusWSp7ALU'
        : 'price_1PE4vUADGIcEMIOuNE2NlzfH'
  },
  {
    name: '6',
    value:
      BUILD_TYPE === 'PRODUCTION'
        ? 'price_1PEwpeADGIcEMIOu2GJHgDpk'
        : 'price_1PE4vUADGIcEMIOuMnw7L2pO'
  },
  {
    name: '7',
    value:
      BUILD_TYPE === 'PRODUCTION'
        ? 'price_1PEwpeADGIcEMIOuHnnQKfkU'
        : 'price_1PE4vUADGIcEMIOuXFGXUa9f'
  },
  {
    name: '8',
    value:
      BUILD_TYPE === 'PRODUCTION'
        ? 'price_1PEwpeADGIcEMIOuQ1F7Sb9p'
        : 'price_1PE4vUADGIcEMIOuDGrTMpxA'
  },
  {
    name: '9',
    value:
      BUILD_TYPE === 'PRODUCTION'
        ? 'price_1PEwpeADGIcEMIOu68QKElpx'
        : 'price_1PE4vUADGIcEMIOuiqjkAOQU'
  },
  {
    name: '10',
    value:
      BUILD_TYPE === 'PRODUCTION'
        ? 'price_1PEwpeADGIcEMIOuK5VSPIug'
        : 'price_1PE4vUADGIcEMIOu3X0zetVz'
  }
];

export const ENTERPRICE_PLAN_SIXMONTHS_DROPDOWN = [
  {
    name: '1',
    value:
      BUILD_TYPE === 'PRODUCTION'
        ? 'price_1PEwpeADGIcEMIOueuJPEoBg'
        : 'price_1PE4vUADGIcEMIOudSub1k31'
  },
  {
    name: '2',
    value:
      BUILD_TYPE === 'PRODUCTION'
        ? 'price_1PEwpeADGIcEMIOubxehz3BO'
        : 'price_1PE4vUADGIcEMIOuEHyZaGZQ'
  },
  {
    name: '3',
    value:
      BUILD_TYPE === 'PRODUCTION'
        ? 'price_1PEwpeADGIcEMIOuhENkLU5E'
        : 'price_1PE4vUADGIcEMIOuaFRoQWnf'
  },
  {
    name: '4',
    value:
      BUILD_TYPE === 'PRODUCTION'
        ? 'price_1PEwpeADGIcEMIOuomoQnJLF'
        : 'price_1PE4vUADGIcEMIOuaNbhOtEB'
  },
  {
    name: '5',
    value:
      BUILD_TYPE === 'PRODUCTION'
        ? 'price_1PEwpeADGIcEMIOuPE98O7fe'
        : 'price_1PE4vUADGIcEMIOuJ0UmkRjc'
  },
  {
    name: '6',
    value:
      BUILD_TYPE === 'PRODUCTION'
        ? 'price_1PEwpeADGIcEMIOuJryqWy3p'
        : 'price_1PE4vUADGIcEMIOuUzuxNWGF'
  },
  {
    name: '7',
    value:
      BUILD_TYPE === 'PRODUCTION'
        ? 'price_1PEwpeADGIcEMIOujxFMbBwK'
        : 'price_1PE4vVADGIcEMIOukH9ApqY8'
  },
  {
    name: '8',
    value:
      BUILD_TYPE === 'PRODUCTION'
        ? 'price_1PEwpeADGIcEMIOuAI3RiH9j'
        : 'price_1PE4vVADGIcEMIOumRGUa1Vu'
  },
  {
    name: '9',
    value:
      BUILD_TYPE === 'PRODUCTION'
        ? 'price_1PEwpeADGIcEMIOuJzGWagRJ'
        : 'price_1PE4vVADGIcEMIOuMrWKkPbh'
  },
  {
    name: '10',
    value:
      BUILD_TYPE === 'PRODUCTION'
        ? 'price_1PEwpeADGIcEMIOuF54tOwq5'
        : 'price_1PE4vVADGIcEMIOumy9hYzfF'
  }
];

export const ENTERPRICE_PLAN_ANNUAL_DROPDOWN = [
  {
    name: '1',
    value:
      BUILD_TYPE === 'PRODUCTION'
        ? 'price_1PEwpeADGIcEMIOuQo8rm2UQ'
        : 'price_1PE4vVADGIcEMIOuiF7wvZT6'
  },
  {
    name: '2',
    value:
      BUILD_TYPE === 'PRODUCTION'
        ? 'price_1PEwpeADGIcEMIOu3MJ2JRwb'
        : 'price_1PE4vVADGIcEMIOu8N2p9ypD'
  },
  {
    name: '3',
    value:
      BUILD_TYPE === 'PRODUCTION'
        ? 'price_1PEwpeADGIcEMIOunTIyda63'
        : 'price_1PE4vVADGIcEMIOum2vpCZx7'
  },
  {
    name: '4',
    value:
      BUILD_TYPE === 'PRODUCTION'
        ? 'price_1PEwpdADGIcEMIOuG7ZhAkTX'
        : 'price_1PE4vVADGIcEMIOuiRLiF5rl'
  },
  {
    name: '5',
    value:
      BUILD_TYPE === 'PRODUCTION'
        ? 'price_1PEwpdADGIcEMIOu4LG4ZulD'
        : 'price_1PE4vVADGIcEMIOuUhPf7WBe'
  },
  {
    name: '6',
    value:
      BUILD_TYPE === 'PRODUCTION'
        ? 'price_1PEwpdADGIcEMIOuPqOgzw6m'
        : 'price_1PE4vVADGIcEMIOurAc8RDDd'
  },
  {
    name: '7',
    value:
      BUILD_TYPE === 'PRODUCTION'
        ? 'price_1PEwpdADGIcEMIOuahCY6O3v'
        : 'price_1PE4vVADGIcEMIOuwOsFkaJM'
  },
  {
    name: '8',
    value:
      BUILD_TYPE === 'PRODUCTION'
        ? 'price_1PEwpdADGIcEMIOuJtPIhlFw'
        : 'price_1PE4vVADGIcEMIOutgD1DkUP'
  },
  {
    name: '9',
    value:
      BUILD_TYPE === 'PRODUCTION'
        ? 'price_1PEwpdADGIcEMIOupMGNanvf'
        : 'price_1PE4vVADGIcEMIOu9djc8n4L'
  },
  {
    name: '10',
    value:
      BUILD_TYPE === 'PRODUCTION'
        ? 'price_1PEwpdADGIcEMIOuQ44qYYu1'
        : 'price_1PE4vVADGIcEMIOu2sFLHvGD'
  }
];

export const APPLICATION_TITLE = {
  SEND_APPROVAL: 'Send Approval',
  PENDING: 'Pending'
};

export const TIME_SPAN_OPTIONS = [
  { name: 'Today', value: 1 },
  { name: 'Week', value: 2 },
  { name: 'Month', value: 3 },
  { name: 'Year', value: 4 }
];

export const DATE_FORMATS = {
  DATE_QUERY: 'YYYY-MM-DD'
};

export const SURVEY_TYPE = ['Survey', 'Draft', 'Template'];

export const BASIC_BREATHWORK=[
  { name:"True", value: true},
  { name:"False", value: false},
]
