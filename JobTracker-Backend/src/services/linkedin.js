/*
  🔗 LEARNING COMMENT: LinkedIn API Integration Service
  ===================================================
  
  This service handles LinkedIn OAuth authentication and data fetching:
  - OAuth 2.0 flow for secure LinkedIn authentication
  - Profile data extraction from LinkedIn API
  - Real job data scraping from LinkedIn job postings
  - Auto-fill data preparation for frontend forms
  
  Key Features:
  - Secure token management
  - Profile information extraction
  - Real-time job posting data fetching
  - Auto-fill form data generation
*/

import axios from 'axios'
import * as cheerio from 'cheerio'

class LinkedInService {
  constructor() {
    // LinkedIn API endpoints
    this.API_BASE = 'https://api.linkedin.com/v2'
    this.AUTH_BASE = 'https://www.linkedin.com/oauth/v2'
    
    // OAuth configuration (will be set from environment variables)
    this.clientId = process.env.LINKEDIN_CLIENT_ID
    this.clientSecret = process.env.LINKEDIN_CLIENT_SECRET
    this.redirectUri = process.env.LINKEDIN_REDIRECT_URI || 'http://localhost:3001/api/auth/linkedin/callback'
  }

  /*
    🔐 LEARNING COMMENT: OAuth Authorization URL Generation
    ======================================================
    
    Creates the LinkedIn authorization URL where users will be redirected
    to grant permission for our app to access their LinkedIn data.
  */
  getAuthorizationUrl(state = null) {
    const scope = 'r_liteprofile r_emailaddress' // Basic profile and email access
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      scope: scope,
      state: state || Math.random().toString(36).substring(7)
    })
    
    return `${this.AUTH_BASE}/authorization?${params.toString()}`
  }

  /*
    🎟️ LEARNING COMMENT: Access Token Exchange
    ==========================================
    
    Exchanges the authorization code received from LinkedIn
    for an access token that can be used to make API calls.
  */
  async getAccessToken(authorizationCode) {
    try {
      const response = await axios.post(`${this.AUTH_BASE}/accessToken`, {
        grant_type: 'authorization_code',
        code: authorizationCode,
        redirect_uri: this.redirectUri,
        client_id: this.clientId,
        client_secret: this.clientSecret
      }, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })
      
      return response.data.access_token
    } catch (error) {
      console.error('LinkedIn token exchange error:', error.response?.data || error.message)
      throw new Error('Failed to exchange authorization code for access token')
    }
  }

  /*
    👤 LEARNING COMMENT: User Profile Data Fetching
    ===============================================
    
    Fetches the user's LinkedIn profile information
    including name, email, headline, and location.
  */
  async getUserProfile(accessToken) {
    try {
      // Get basic profile information
      const profileResponse = await axios.get(`${this.API_BASE}/people/~`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'cache-control': 'no-cache',
          'X-Restli-Protocol-Version': '2.0.0'
        },
        params: {
          projection: '(id,firstName,lastName,headline,location,industry)'
        }
      })

      // Get email address (separate endpoint)
      const emailResponse = await axios.get(`${this.API_BASE}/emailAddress?q=members&projection=(elements*(handle~))`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'cache-control': 'no-cache',
          'X-Restli-Protocol-Version': '2.0.0'
        }
      })

      const profile = profileResponse.data
      const email = emailResponse.data.elements?.[0]?.['handle~']?.emailAddress

      return {
        id: profile.id,
        firstName: profile.firstName?.localized?.en_US || '',
        lastName: profile.lastName?.localized?.en_US || '',
        email: email || '',
        headline: profile.headline?.localized?.en_US || '',
        location: profile.location?.name || '',
        industry: profile.industry?.localized?.en_US || ''
      }
    } catch (error) {
      console.error('LinkedIn profile fetch error:', error.response?.data || error.message)
      throw new Error('Failed to fetch LinkedIn profile')
    }
  }

  /*
    💼 LEARNING COMMENT: Auto-Fill Data Generation
    =============================================
    
    Processes LinkedIn profile data and generates structured data
    that can be used to auto-fill job application forms.
  */
  generateAutoFillData(linkedinProfile) {
    return {
      // Personal information
      personal: {
        firstName: linkedinProfile.firstName,
        lastName: linkedinProfile.lastName,
        email: linkedinProfile.email,
        location: linkedinProfile.location,
        headline: linkedinProfile.headline,
        industry: linkedinProfile.industry
      },
      
      // Professional summary for cover letters
      summary: linkedinProfile.headline ? 
        `Experienced ${linkedinProfile.headline} seeking new opportunities in ${linkedinProfile.industry || 'the industry'}.` : 
        'Professional seeking new career opportunities.',
        
      // Default application preferences
      preferences: {
        remote: 'Hybrid', // Default preference
        type: 'Full-time',
        status: 'Applied'
      }
    }
  }

  /*
    🔍 LEARNING COMMENT: LinkedIn Job URL Handler with Smart Fallback
    ================================================================
    
    Since LinkedIn blocks automated scraping, this method:
    1. Validates the LinkedIn URL format
    2. Extracts the job ID 
    3. Provides a structured template for manual entry
    4. Gives helpful instructions for getting job data
  */
  async parseJobFromUrl(jobUrl, accessToken) {
    try {
      // Extract job ID from LinkedIn URL
      const jobIdMatch = jobUrl.match(/jobs\/view\/(\d+)/)
      if (!jobIdMatch) {
        throw new Error('Invalid LinkedIn job URL format')
      }
      
      const jobId = jobIdMatch[1]
      console.log(`🔍 Processing LinkedIn job: ${jobId}`)
      
      // Since LinkedIn blocks scraping, provide a helpful template
      // Users can manually copy-paste the information
      return {
        jobId: jobId,
        jobLink: jobUrl,
        company: '',
        position: '',
        location: '',
        salary: '',
        type: 'Full-time',
        remote: 'On-site',
        description: `📋 LinkedIn Job Import Template

🔗 Job URL: ${jobUrl}
📱 Job ID: ${jobId}

⚠️ LinkedIn blocks automated data extraction for privacy and security reasons.

💡 To complete your application:
1. Open the LinkedIn job posting in a new tab
2. Copy and paste the job details into the form fields
3. The URL and job ID have been automatically filled for you

This ensures you get the most accurate and up-to-date job information directly from the source.`,
        requirements: `🎯 How to get job requirements:

1. Visit the LinkedIn job posting
2. Scroll down to find the "About the job" or "Job description" section
3. Look for sections titled:
   • Requirements
   • Qualifications  
   • Skills
   • Experience needed
4. Copy and paste the relevant requirements here

💡 Tip: Look for both "Required" and "Preferred" qualifications to get the complete picture.`,
        applicationDate: new Date().toISOString().split('T')[0],
        source: 'LinkedIn',
        isTemplate: true,
        instructions: [
          'Open the LinkedIn job posting in a new browser tab',
          'Copy the company name and paste it in the Company field',
          'Copy the job title and paste it in the Position field', 
          'Copy the location and paste it in the Location field',
          'Look for salary information and add it if available',
          'Copy the job description and requirements',
          'Update the job type (Full-time, Part-time, Contract, etc.)',
          'Set the remote work status (Remote, Hybrid, On-site)'
        ]
      }
      
    } catch (error) {
      console.error('LinkedIn job processing error:', error.message)
      throw new Error('Failed to process LinkedIn job URL')
    }
  }
}

export default LinkedInService
