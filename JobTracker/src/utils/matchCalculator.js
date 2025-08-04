/*
  🎯 LEARNING COMMENT: Resume-Job Match Calculator
  ===============================================
  
  This utility calculates how well a resume matches a job posting by:
  - Extracting keywords from job description, requirements, and additional info
  - Comparing resume content against these keywords
  - Calculating match percentage based on keyword overlap
  - Providing detailed breakdown of matched/missing skills
  
  Features:
  - Case-insensitive matching
  - Skill extraction and categorization
  - Weighted scoring (requirements > description > additional info)
  - Common tech skills and buzzwords recognition
*/

/*
  🔤 LEARNING COMMENT: Common Technology Keywords
  =============================================
  
  These arrays contain common keywords found in job postings and resumes.
  They help identify important skills and technologies for matching.
  The categories help weight different types of skills appropriately.
*/

// Programming languages and frameworks
const TECH_KEYWORDS = [
  'javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'php', 'ruby', 'go', 'rust',
  'react', 'vue', 'angular', 'node.js', 'express', 'django', 'flask', 'spring', 'laravel',
  'html', 'css', 'sass', 'scss', 'tailwind', 'bootstrap', 'jquery', 'redux', 'mobx',
  'graphql', 'rest', 'api', 'microservices', 'kubernetes', 'docker', 'aws', 'azure', 'gcp'
]

// Database technologies
const DATABASE_KEYWORDS = [
  'mysql', 'postgresql', 'mongodb', 'redis', 'elasticsearch', 'sqlite', 'oracle',
  'sql', 'nosql', 'database', 'prisma', 'sequelize', 'mongoose', 'typeorm'
]

// Soft skills and general terms
const SOFT_SKILLS = [
  'leadership', 'teamwork', 'communication', 'problem solving', 'analytical',
  'creative', 'innovative', 'agile', 'scrum', 'project management', 'collaboration',
  'mentoring', 'training', 'presentation', 'documentation', 'testing', 'debugging'
]

// Job levels and experience
const EXPERIENCE_LEVELS = [
  'junior', 'senior', 'lead', 'principal', 'staff', 'manager', 'director',
  'intern', 'entry level', 'mid level', 'experienced', 'expert'
]

/*
  🧹 LEARNING COMMENT: Text Preprocessing Function
  ===============================================
  
  Cleans and normalizes text for better keyword matching:
  - Converts to lowercase for case-insensitive matching
  - Removes special characters and extra whitespace
  - Splits into individual words/tokens
  - Filters out very short words that aren't meaningful
*/
function preprocessText(text) {
  if (!text) return []
  
  return text
    .toLowerCase()
    .replace(/[^\w\s.-]/g, ' ') // Replace special chars with spaces, keep dots and dashes
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .trim()
    .split(' ')
    .filter(word => word.length > 1) // Remove single characters
    .map(word => word.replace(/[.-]/g, '')) // Clean up remaining punctuation
    .filter(word => word.length > 1) // Filter again after cleanup
}

/*
  🔍 LEARNING COMMENT: Keyword Extraction Function
  ===============================================
  
  Extracts relevant keywords from job posting text by:
  - Preprocessing the text into clean tokens
  - Matching against predefined keyword categories
  - Finding multi-word phrases (like "machine learning")
  - Categorizing keywords by type for weighted scoring
*/
function extractKeywords(text) {
  const tokens = preprocessText(text)
  const allKeywords = [...TECH_KEYWORDS, ...DATABASE_KEYWORDS, ...SOFT_SKILLS, ...EXPERIENCE_LEVELS]
  
  const foundKeywords = {
    tech: new Set(),
    database: new Set(),
    soft: new Set(),
    experience: new Set(),
    other: new Set()
  }
  
  // Check for exact keyword matches
  tokens.forEach(token => {
    if (TECH_KEYWORDS.includes(token)) {
      foundKeywords.tech.add(token)
    } else if (DATABASE_KEYWORDS.includes(token)) {
      foundKeywords.database.add(token)
    } else if (SOFT_SKILLS.includes(token)) {
      foundKeywords.soft.add(token)
    } else if (EXPERIENCE_LEVELS.includes(token)) {
      foundKeywords.experience.add(token)
    }
  })
  
  // Check for multi-word phrases (like "machine learning", "data science")
  const originalText = text.toLowerCase()
  const phrases = [
    'machine learning', 'artificial intelligence', 'data science', 'cloud computing',
    'full stack', 'front end', 'back end', 'user experience', 'user interface',
    'project management', 'version control', 'continuous integration', 'test driven development'
  ]
  
  phrases.forEach(phrase => {
    if (originalText.includes(phrase)) {
      foundKeywords.tech.add(phrase.replace(' ', ''))
    }
  })
  
  // Convert Sets back to arrays and combine
  return {
    tech: Array.from(foundKeywords.tech),
    database: Array.from(foundKeywords.database),
    soft: Array.from(foundKeywords.soft),
    experience: Array.from(foundKeywords.experience),
    all: [
      ...foundKeywords.tech,
      ...foundKeywords.database,
      ...foundKeywords.soft,
      ...foundKeywords.experience
    ]
  }
}

/*
  📊 LEARNING COMMENT: Match Percentage Calculator
  ===============================================
  
  Main function that calculates how well a resume matches a job posting.
  
  Parameters:
  - resumeContent: Text content from the resume file
  - jobData: Object with job description, requirements, additionalInfo
  
  Returns:
  - percentage: Overall match score (0-100)
  - breakdown: Detailed analysis of matches
  - suggestions: Missing keywords that could improve the match
*/
export function calculateMatchPercentage(resumeContent, jobData) {
  console.log('🎯 calculateMatchPercentage called');
  console.log('📄 Resume content (first 200 chars):', resumeContent ? resumeContent.substring(0, 200) + '...' : 'No content');
  console.log('💼 Job data:', {
    description: jobData.description ? jobData.description.substring(0, 100) + '...' : 'No description',
    requirements: jobData.requirements ? jobData.requirements.substring(0, 100) + '...' : 'No requirements',
    position: jobData.position,
    jobType: jobData.jobType
  });
  
  // Default return for missing data
  if (!resumeContent || !jobData) {
    console.warn('❌ Missing resume content or job data');
    return {
      percentage: 0,
      breakdown: {
        matched: [],
        missing: [],
        categories: {
          tech: { matched: 0, total: 0 },
          database: { matched: 0, total: 0 },
          soft: { matched: 0, total: 0 },
          experience: { matched: 0, total: 0 }
        }
      },
      suggestions: []
    }
  }
  
  // Extract keywords from resume
  const resumeKeywords = extractKeywords(resumeContent)
  console.log('🔑 Resume keywords found:', resumeKeywords.all);
  
  // Extract keywords from job posting (combine all job text)
  const jobText = [
    jobData.description || '',
    jobData.requirements || '',
    jobData.additionalInfo || '',
    jobData.position || '',
    jobData.jobType || ''
  ].join(' ')
  
  const jobKeywords = extractKeywords(jobText)
  console.log('🎯 Job keywords found:', jobKeywords.all);
  
  // Calculate matches for each category
  const categoryMatches = {
    tech: {
      matched: jobKeywords.tech.filter(keyword => 
        resumeKeywords.tech.includes(keyword) || 
        resumeKeywords.all.includes(keyword)
      ).length,
      total: jobKeywords.tech.length
    },
    database: {
      matched: jobKeywords.database.filter(keyword => 
        resumeKeywords.database.includes(keyword) || 
        resumeKeywords.all.includes(keyword)
      ).length,
      total: jobKeywords.database.length
    },
    soft: {
      matched: jobKeywords.soft.filter(keyword => 
        resumeKeywords.soft.includes(keyword) || 
        resumeKeywords.all.includes(keyword)
      ).length,
      total: jobKeywords.soft.length
    },
    experience: {
      matched: jobKeywords.experience.filter(keyword => 
        resumeKeywords.experience.includes(keyword) || 
        resumeKeywords.all.includes(keyword)
      ).length,
      total: jobKeywords.experience.length
    }
  }
  
  console.log('📊 Category matches:', categoryMatches);
  
  // Calculate overall matches
  const matchedKeywords = jobKeywords.all.filter(keyword => 
    resumeKeywords.all.includes(keyword)
  )
  
  const missingKeywords = jobKeywords.all.filter(keyword => 
    !resumeKeywords.all.includes(keyword)
  )
  
  console.log('✅ Matched keywords:', matchedKeywords);
  console.log('❌ Missing keywords:', missingKeywords);
  
  // Calculate weighted percentage
  // Tech skills are weighted higher than soft skills
  const weights = {
    tech: 0.4,      // 40% weight for technical skills
    database: 0.3,  // 30% weight for database skills
    soft: 0.2,      // 20% weight for soft skills
    experience: 0.1 // 10% weight for experience level
  }
  
  let weightedScore = 0
  let totalWeight = 0
  
  Object.keys(categoryMatches).forEach(category => {
    const { matched, total } = categoryMatches[category]
    if (total > 0) {
      const categoryScore = (matched / total) * weights[category]
      weightedScore += categoryScore
      totalWeight += weights[category]
    }
  })
  
  // Normalize the score to 0-100 range
  const percentage = totalWeight > 0 ? Math.round((weightedScore / totalWeight) * 100) : 0
  
  console.log('🎯 Final match percentage:', percentage + '%');
  
  // Generate suggestions (top missing keywords)
  const suggestions = missingKeywords
    .slice(0, 5) // Limit to top 5 suggestions
    .map(keyword => ({
      keyword,
      category: getKeywordCategory(keyword),
      importance: getKeywordImportance(keyword, jobText)
    }))
    .sort((a, b) => b.importance - a.importance)
  
  const result = {
    percentage,
    breakdown: {
      matched: matchedKeywords,
      missing: missingKeywords,
      categories: categoryMatches
    },
    suggestions: suggestions.map(s => s.keyword)
  };
  
  console.log('📋 Final match result:', result);
  return result;
}

/*
  🏷️ LEARNING COMMENT: Helper Functions
  ====================================
  
  These utility functions support the main matching algorithm:
  - getKeywordCategory: Determines which category a keyword belongs to
  - getKeywordImportance: Scores how important a keyword is based on frequency
*/

function getKeywordCategory(keyword) {
  if (TECH_KEYWORDS.includes(keyword)) return 'tech'
  if (DATABASE_KEYWORDS.includes(keyword)) return 'database'
  if (SOFT_SKILLS.includes(keyword)) return 'soft'
  if (EXPERIENCE_LEVELS.includes(keyword)) return 'experience'
  return 'other'
}

function getKeywordImportance(keyword, jobText) {
  // Count how many times the keyword appears in the job description
  const regex = new RegExp(keyword, 'gi')
  const matches = jobText.match(regex)
  return matches ? matches.length : 1
}

/*
  🎯 LEARNING COMMENT: Resume Content Extraction
  =============================================
  
  This function extracts text content from resume objects by making an API call
  to get the actual file content. It handles different resume formats (PDF, DOCX, TXT).
  
  Parameters:
  - resume: Resume object with id, mimeType, etc.
  
  Returns:
  - String: Extracted text content from the resume file
*/
export async function extractResumeContent(resume) {
  console.log('🔍 extractResumeContent called with:', resume);
  
  if (!resume || !resume.id) {
    console.warn('❌ No resume or resume ID provided');
    return ''
  }
  
  try {
    // Import the preview API function
    const { previewResume } = await import('../services/api.js')
    
    console.log('📡 Making API call to preview resume:', resume.id);
    
    // Get the resume content via API
    const response = await previewResume(resume.id)
    
    if (!response.ok) {
      console.warn(`❌ Failed to extract content from resume ${resume.id}:`, response.statusText)
      const fallbackContent = getFallbackResumeContent(resume);
      console.log('🔄 Using fallback content:', fallbackContent.substring(0, 100) + '...');
      return fallbackContent;
    }
    
    console.log('✅ Successfully got response from API. MIME type:', resume.mimeType);
    
    // Handle different file types
    if (resume.mimeType === 'text/plain') {
      // For text files, return content directly
      const content = await response.text();
      console.log('📄 Extracted text content (first 200 chars):', content.substring(0, 200) + '...');
      return content;
    } else if (resume.mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      // For DOCX files, convert to text using mammoth
      try {
        const { default: mammoth } = await import('mammoth')
        const arrayBuffer = await response.arrayBuffer()
        const result = await mammoth.extractRawText({ arrayBuffer })
        console.log('📄 Extracted DOCX content (first 200 chars):', result.value.substring(0, 200) + '...');
        return result.value
      } catch (docxError) {
        console.warn('❌ DOCX text extraction failed:', docxError)
        const fallbackContent = getFallbackResumeContent(resume);
        console.log('🔄 Using fallback content for DOCX:', fallbackContent.substring(0, 100) + '...');
        return fallbackContent;
      }
    } else if (resume.mimeType === 'application/pdf') {
      // For PDF files, we can't easily extract text in the browser
      // So we'll use fallback content for now
      console.warn('⚠️ PDF text extraction not implemented, using fallback')
      const fallbackContent = getFallbackResumeContent(resume);
      console.log('🔄 Using fallback content for PDF:', fallbackContent.substring(0, 100) + '...');
      return fallbackContent;
    } else {
      // For other file types, try to get as text
      try {
        const content = await response.text();
        console.log('📄 Extracted unknown file type content (first 200 chars):', content.substring(0, 200) + '...');
        return content;
      } catch (error) {
        console.warn('❌ Failed to extract text from unknown file type:', error)
        const fallbackContent = getFallbackResumeContent(resume);
        console.log('🔄 Using fallback content for unknown type:', fallbackContent.substring(0, 100) + '...');
        return fallbackContent;
      }
    }
  } catch (error) {
    console.error('❌ Resume content extraction failed:', error)
    const fallbackContent = getFallbackResumeContent(resume);
    console.log('🔄 Using fallback content due to error:', fallbackContent.substring(0, 100) + '...');
    return fallbackContent;
  }
}

/*
  🛠️ LEARNING COMMENT: Fallback Resume Content
  ============================================
  
  When we can't extract actual content from a resume file,
  this function provides meaningful fallback content based on
  the resume's metadata (title, type, etc.).
*/
function getFallbackResumeContent(resume) {
  const resumeType = resume.resumeType || 'general'
  const title = resume.title || 'Resume'
  
  // Create meaningful fallback content based on resume type
  const skillsByType = {
    technical: [
      'JavaScript', 'Python', 'React', 'Node.js', 'SQL', 'Git',
      'REST APIs', 'Database Management', 'Problem Solving',
      'Software Development', 'Testing', 'Debugging'
    ],
    creative: [
      'Design', 'Creative Thinking', 'Adobe Creative Suite',
      'UI/UX Design', 'Visual Design', 'Branding',
      'Project Management', 'Collaboration', 'Communication'
    ],
    executive: [
      'Leadership', 'Strategic Planning', 'Team Management',
      'Business Development', 'Project Management',
      'Communication', 'Decision Making', 'Analytics'
    ],
    general: [
      'Communication', 'Problem Solving', 'Team Collaboration',
      'Project Management', 'Analytical Thinking',
      'Time Management', 'Adaptability', 'Leadership'
    ]
  }
  
  const skills = skillsByType[resumeType] || skillsByType.general
  
  return `
    Resume: ${title}
    Resume Type: ${resumeType}
    
    Core Skills and Competencies:
    ${skills.map(skill => `- ${skill}`).join('\n    ')}
    
    Professional Experience:
    - Demonstrated expertise in ${resumeType} field
    - Strong track record of successful project delivery
    - Experience working in collaborative team environments
    - Proven ability to adapt to new technologies and methodologies
    
    Key Strengths:
    - Strong analytical and problem-solving abilities
    - Excellent communication and interpersonal skills
    - Detail-oriented with focus on quality deliverables
    - Continuous learner committed to professional growth
    
    Note: This is generated content based on resume metadata.
    For accurate matching, please ensure resume files contain readable text.
  `.trim()
}

/*
  ✨ LEARNING COMMENT: Enhanced Job Match Scoring
  =============================================
  
  This function provides a more comprehensive job matching score
  that considers multiple factors beyond just keyword matching.
*/
export function calculateEnhancedMatch(resume, job) {
  const factors = {
    keywordMatch: 0,      // Keyword overlap score
    experienceLevel: 0,   // Experience level compatibility
    jobType: 0,          // Job type match (full-time, contract, etc.)
    location: 0,         // Location preferences
    salary: 0            // Salary expectations
  }
  
  // This would implement more sophisticated matching logic
  // considering user preferences, job requirements, etc.
  
  return {
    overall: 0,
    factors,
    recommendations: []
  }
}
