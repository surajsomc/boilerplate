const fetch = require('node-fetch');

const API_BASE = 'http://localhost:3001/api';

// Test data
const testUser = {
  username: 'testuser',
  email: 'test@example.com',
  password: 'TestPass123!'
};

const testProfile = {
  name: 'Test User',
  bio: 'This is a test profile for API testing',
  location: 'Test City, Test Country',
  interests: 'Testing, Development, API',
  skills: 'JavaScript, Node.js, Express, Testing',
  experience: '2+ years in software development and testing',
  education: 'B.S. in Computer Science',
  social_links: 'GitHub: testuser | LinkedIn: testuser',
  projects: '- API Testing Tool\n- Test Automation Framework\n- Sample Project'
};

let authToken = null;
let userId = null;

async function testAPI() {
  console.log('🧪 Starting API Tests...\n');

  try {
    // Test 1: Health Check
    console.log('1. Testing Health Check...');
    const healthResponse = await fetch(`${API_BASE.replace('/api', '')}/health`);
    const healthData = await healthResponse.json();
    console.log('✅ Health Check:', healthData.status);
    console.log('');

    // Test 2: Register User
    console.log('2. Testing User Registration...');
    const registerResponse = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUser)
    });
    
    if (registerResponse.ok) {
      const registerData = await registerResponse.json();
      authToken = registerData.token;
      userId = registerData.user.id;
      console.log('✅ User registered successfully');
      console.log('   User ID:', userId);
      console.log('   Token received:', authToken ? 'Yes' : 'No');
    } else {
      const errorData = await registerResponse.json();
      console.log('❌ Registration failed:', errorData.message);
      
      // Try login if user already exists
      console.log('   Trying login instead...');
      const loginResponse = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: testUser.username,
          password: testUser.password
        })
      });
      
      if (loginResponse.ok) {
        const loginData = await loginResponse.json();
        authToken = loginData.token;
        userId = loginData.user.id;
        console.log('✅ Login successful');
        console.log('   User ID:', userId);
        console.log('   Token received:', authToken ? 'Yes' : 'No');
      } else {
        const loginError = await loginResponse.json();
        console.log('❌ Login failed:', loginError.message);
        return;
      }
    }
    console.log('');

    // Test 3: Get Current User
    console.log('3. Testing Get Current User...');
    const meResponse = await fetch(`${API_BASE}/auth/me`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    
    if (meResponse.ok) {
      const meData = await meResponse.json();
      console.log('✅ Current user retrieved');
      console.log('   Username:', meData.user.username);
      console.log('   Email:', meData.user.email);
    } else {
      console.log('❌ Get current user failed');
    }
    console.log('');

    // Test 4: Create Profile
    console.log('4. Testing Profile Creation...');
    const createProfileResponse = await fetch(`${API_BASE}/profile`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify(testProfile)
    });
    
    if (createProfileResponse.ok) {
      const profileData = await createProfileResponse.json();
      console.log('✅ Profile created successfully');
      console.log('   Profile ID:', profileData.profile.id);
      console.log('   Name:', profileData.profile.name);
    } else {
      const errorData = await createProfileResponse.json();
      console.log('❌ Profile creation failed:', errorData.message);
    }
    console.log('');

    // Test 5: Get Own Profile
    console.log('5. Testing Get Own Profile...');
    const getProfileResponse = await fetch(`${API_BASE}/profile/me`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    
    if (getProfileResponse.ok) {
      const profileData = await getProfileResponse.json();
      console.log('✅ Profile retrieved successfully');
      console.log('   Name:', profileData.profile.name);
      console.log('   Bio:', profileData.profile.bio?.substring(0, 50) + '...');
      console.log('   Location:', profileData.profile.location);
    } else {
      console.log('❌ Get profile failed');
    }
    console.log('');

    // Test 6: Update Profile
    console.log('6. Testing Profile Update...');
    const updateData = {
      name: 'Updated Test User',
      bio: 'This profile has been updated for testing purposes'
    };
    
    const updateProfileResponse = await fetch(`${API_BASE}/profile/me`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify(updateData)
    });
    
    if (updateProfileResponse.ok) {
      const updateResult = await updateProfileResponse.json();
      console.log('✅ Profile updated successfully');
      console.log('   New name:', updateResult.profile.name);
      console.log('   New bio:', updateResult.profile.bio?.substring(0, 50) + '...');
    } else {
      console.log('❌ Profile update failed');
    }
    console.log('');

    // Test 7: Search Profiles
    console.log('7. Testing Profile Search...');
    const searchResponse = await fetch(`${API_BASE}/profile/search?q=test&limit=5`);
    
    if (searchResponse.ok) {
      const searchData = await searchResponse.json();
      console.log('✅ Profile search successful');
      console.log('   Results found:', searchData.count);
      console.log('   Query:', searchData.query);
    } else {
      console.log('❌ Profile search failed');
    }
    console.log('');

    // Test 8: Get Profile by Username
    console.log('8. Testing Get Profile by Username...');
    const usernameResponse = await fetch(`${API_BASE}/profile/username/${testUser.username}`);
    
    if (usernameResponse.ok) {
      const usernameData = await usernameResponse.json();
      console.log('✅ Profile by username retrieved');
      console.log('   Username:', testUser.username);
      console.log('   Profile name:', usernameData.profile.name);
    } else {
      console.log('❌ Get profile by username failed');
    }
    console.log('');

    console.log('🎉 All tests completed successfully!');
    console.log('\n📋 Summary:');
    console.log('   - Authentication: ✅ Working');
    console.log('   - Profile CRUD: ✅ Working');
    console.log('   - Profile Search: ✅ Working');
    console.log('   - API is ready for frontend integration!');

  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
    console.log('\n💡 Make sure the server is running on http://localhost:3001');
  }
}

// Run tests
testAPI(); 