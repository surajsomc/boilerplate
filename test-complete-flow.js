const API_BASE = 'http://192.168.68.54:3001/api';

async function testCompleteFlow() {
  console.log('🧪 Testing Complete Authentication & Profile Flow...\n');

  let token = null;
  let userId = null;

  // Step 1: Register a new user
  try {
    console.log('1️⃣ Registering new user...');
    const registerResponse = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'testflow',
        email: 'testflow@example.com',
        password: 'TestPass123!'
      })
    });
    
    const registerData = await registerResponse.json();
    
    if (registerResponse.ok) {
      token = registerData.token;
      userId = registerData.user.id;
      console.log('✅ Registration successful');
      console.log('   User ID:', userId);
      console.log('   Token received:', !!token);
    } else {
      console.log('❌ Registration failed:', registerData.message);
      return;
    }
  } catch (error) {
    console.log('❌ Registration error:', error.message);
    return;
  }

  // Step 2: Create a profile
  try {
    console.log('\n2️⃣ Creating profile...');
    const profileResponse = await fetch(`${API_BASE}/profile`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        firstName: 'Test',
        lastName: 'Flow',
        bio: 'This is a test profile created via API',
        location: 'Test City',
        interests: 'Testing, Development',
        skills: 'JavaScript, React Native, Node.js'
      })
    });
    
    const profileData = await profileResponse.json();
    
    if (profileResponse.ok) {
      console.log('✅ Profile creation successful');
      console.log('   Profile ID:', profileData.profile.id);
      console.log('   Name:', `${profileData.profile.firstName} ${profileData.profile.lastName}`);
    } else {
      console.log('❌ Profile creation failed:', profileData.message);
      return;
    }
  } catch (error) {
    console.log('❌ Profile creation error:', error.message);
    return;
  }

  // Step 3: Get the profile
  try {
    console.log('\n3️⃣ Getting profile...');
    const getProfileResponse = await fetch(`${API_BASE}/profile/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const getProfileData = await getProfileResponse.json();
    
    if (getProfileResponse.ok) {
      console.log('✅ Profile retrieval successful');
      console.log('   Bio:', getProfileData.profile.bio);
      console.log('   Location:', getProfileData.profile.location);
    } else {
      console.log('❌ Profile retrieval failed:', getProfileData.message);
    }
  } catch (error) {
    console.log('❌ Profile retrieval error:', error.message);
  }

  // Step 4: Update the profile
  try {
    console.log('\n4️⃣ Updating profile...');
    const updateResponse = await fetch(`${API_BASE}/profile/me`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        bio: 'Updated bio via API test',
        skills: 'JavaScript, React Native, Node.js, API Testing'
      })
    });
    
    const updateData = await updateResponse.json();
    
    if (updateResponse.ok) {
      console.log('✅ Profile update successful');
      console.log('   Updated Bio:', updateData.profile.bio);
    } else {
      console.log('❌ Profile update failed:', updateData.message);
    }
  } catch (error) {
    console.log('❌ Profile update error:', error.message);
  }

  console.log('\n🎉 Complete flow test finished!');
}

testCompleteFlow(); 