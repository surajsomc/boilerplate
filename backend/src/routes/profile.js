const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { runQuery, getRow, getAll } = require('../database/database');
const { validate, profileSchemas } = require('../middleware/validation');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Create profile
router.post('/', authenticateToken, validate(profileSchemas.create), async (req, res, next) => {
  try {
    const userId = req.user.id;
    const profileData = req.body;

    // Check if profile already exists
    const existingProfile = await getRow(
      'SELECT id FROM profiles WHERE user_id = ?',
      [userId]
    );

    if (existingProfile) {
      return res.status(409).json({
        error: 'Profile already exists',
        message: 'A profile already exists for this user. Use PUT to update.'
      });
    }

    // Create profile with frontend field names
    const profileId = uuidv4();
    await runQuery(
      `INSERT INTO profiles (
        id, user_id, name, bio, location, interests, skills, 
        experience, education, social_links, projects
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        profileId, 
        userId, 
        `${profileData.firstName || ''} ${profileData.lastName || ''}`.trim(), // Combine first and last name
        profileData.bio || null,
        profileData.location || null,
        profileData.interests || null,
        profileData.skills || null,
        profileData.experience || null,
        profileData.education || null,
        profileData.social || null, // Map social to social_links
        profileData.projects || null
      ]
    );

    // Get created profile
    const profile = await getRow(
      'SELECT * FROM profiles WHERE id = ?',
      [profileId]
    );

    // Transform to match frontend expectations
    const transformedProfile = {
      id: profile.id,
      userId: profile.user_id,
      firstName: profile.name ? profile.name.split(' ')[0] : null,
      lastName: profile.name ? profile.name.split(' ').slice(1).join(' ') : null,
      bio: profile.bio,
      location: profile.location,
      interests: profile.interests,
      skills: profile.skills,
      experience: profile.experience,
      education: profile.education,
      social: profile.social_links,
      projects: profile.projects,
      profilePicture: profile.profile_picture,
      createdAt: profile.created_at,
      updatedAt: profile.updated_at
    };

    res.status(201).json({
      message: 'Profile created successfully',
      profile: transformedProfile
    });
  } catch (error) {
    next(error);
  }
});

// Get user's own profile
router.get('/me', authenticateToken, async (req, res, next) => {
  try {
    const userId = req.user.id;

    const profile = await getRow(
      'SELECT * FROM profiles WHERE user_id = ?',
      [userId]
    );

    if (!profile) {
      return res.status(404).json({
        error: 'Profile not found',
        message: 'No profile found for this user'
      });
    }

    // Transform to match frontend expectations
    const transformedProfile = {
      id: profile.id,
      userId: profile.user_id,
      firstName: profile.name ? profile.name.split(' ')[0] : null,
      lastName: profile.name ? profile.name.split(' ').slice(1).join(' ') : null,
      bio: profile.bio,
      location: profile.location,
      interests: profile.interests,
      skills: profile.skills,
      experience: profile.experience,
      education: profile.education,
      social: profile.social_links,
      projects: profile.projects,
      profilePicture: profile.profile_picture,
      createdAt: profile.created_at,
      updatedAt: profile.updated_at
    };

    res.json({
      profile: transformedProfile
    });
  } catch (error) {
    next(error);
  }
});

// Get profile by user ID
router.get('/user/:userId', async (req, res, next) => {
  try {
    const { userId } = req.params;

    const profile = await getRow(
      'SELECT * FROM profiles WHERE user_id = ?',
      [userId]
    );

    if (!profile) {
      return res.status(404).json({
        error: 'Profile not found',
        message: 'No profile found for this user'
      });
    }

    res.json({
      profile
    });
  } catch (error) {
    next(error);
  }
});

// Get profile by username
router.get('/username/:username', async (req, res, next) => {
  try {
    const { username } = req.params;

    // First get user by username
    const user = await getRow(
      'SELECT id FROM users WHERE username = ?',
      [username]
    );

    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        message: 'No user found with this username'
      });
    }

    // Then get profile
    const profile = await getRow(
      'SELECT * FROM profiles WHERE user_id = ?',
      [user.id]
    );

    if (!profile) {
      return res.status(404).json({
        error: 'Profile not found',
        message: 'No profile found for this user'
      });
    }

    res.json({
      profile
    });
  } catch (error) {
    next(error);
  }
});

// Update profile
router.put('/me', authenticateToken, validate(profileSchemas.update), async (req, res, next) => {
  try {
    const userId = req.user.id;
    const profileData = req.body;

    // Check if profile exists
    const existingProfile = await getRow(
      'SELECT id FROM profiles WHERE user_id = ?',
      [userId]
    );

    if (!existingProfile) {
      return res.status(404).json({
        error: 'Profile not found',
        message: 'No profile found for this user. Create one first.'
      });
    }

    // Update profile with frontend field names
    await runQuery(
      `UPDATE profiles SET 
        name = COALESCE(?, name),
        bio = COALESCE(?, bio),
        location = COALESCE(?, location),
        interests = COALESCE(?, interests),
        skills = COALESCE(?, skills),
        experience = COALESCE(?, experience),
        education = COALESCE(?, education),
        social_links = COALESCE(?, social_links),
        projects = COALESCE(?, projects),
        updated_at = CURRENT_TIMESTAMP
      WHERE user_id = ?`,
      [
        `${profileData.firstName || ''} ${profileData.lastName || ''}`.trim(), // Combine first and last name
        profileData.bio || null,
        profileData.location || null,
        profileData.interests || null,
        profileData.skills || null,
        profileData.experience || null,
        profileData.education || null,
        profileData.social || null, // Map social to social_links
        profileData.projects || null,
        userId
      ]
    );

    // Get updated profile
    const profile = await getRow(
      'SELECT * FROM profiles WHERE user_id = ?',
      [userId]
    );

    // Transform to match frontend expectations
    const transformedProfile = {
      id: profile.id,
      userId: profile.user_id,
      firstName: profile.name ? profile.name.split(' ')[0] : null,
      lastName: profile.name ? profile.name.split(' ').slice(1).join(' ') : null,
      bio: profile.bio,
      location: profile.location,
      interests: profile.interests,
      skills: profile.skills,
      experience: profile.experience,
      education: profile.education,
      social: profile.social_links,
      projects: profile.projects,
      profilePicture: profile.profile_picture,
      createdAt: profile.created_at,
      updatedAt: profile.updated_at
    };

    res.json({
      message: 'Profile updated successfully',
      profile: transformedProfile
    });
  } catch (error) {
    next(error);
  }
});

// Update profile picture
router.patch('/me/picture', authenticateToken, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { profile_picture } = req.body;

    if (!profile_picture) {
      return res.status(400).json({
        error: 'Profile picture required',
        message: 'Please provide a profile picture URL'
      });
    }

    // Check if profile exists
    const existingProfile = await getRow(
      'SELECT id FROM profiles WHERE user_id = ?',
      [userId]
    );

    if (!existingProfile) {
      return res.status(404).json({
        error: 'Profile not found',
        message: 'No profile found for this user. Create one first.'
      });
    }

    // Update profile picture
    await runQuery(
      'UPDATE profiles SET profile_picture = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?',
      [profile_picture, userId]
    );

    // Get updated profile
    const profile = await getRow(
      'SELECT * FROM profiles WHERE user_id = ?',
      [userId]
    );

    res.json({
      message: 'Profile picture updated successfully',
      profile
    });
  } catch (error) {
    next(error);
  }
});

// Delete profile
router.delete('/me', authenticateToken, async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Check if profile exists
    const existingProfile = await getRow(
      'SELECT id FROM profiles WHERE user_id = ?',
      [userId]
    );

    if (!existingProfile) {
      return res.status(404).json({
        error: 'Profile not found',
        message: 'No profile found for this user'
      });
    }

    // Delete profile
    await runQuery(
      'DELETE FROM profiles WHERE user_id = ?',
      [userId]
    );

    res.json({
      message: 'Profile deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

// Search profiles
router.get('/search', async (req, res, next) => {
  try {
    const { q, limit = 10, offset = 0 } = req.query;

    if (!q) {
      return res.status(400).json({
        error: 'Search query required',
        message: 'Please provide a search query'
      });
    }

    const searchQuery = `%${q}%`;
    const profiles = await getAll(
      `SELECT p.*, u.username, u.email 
       FROM profiles p 
       JOIN users u ON p.user_id = u.id 
       WHERE p.name LIKE ? OR p.bio LIKE ? OR p.skills LIKE ? OR p.interests LIKE ?
       LIMIT ? OFFSET ?`,
      [searchQuery, searchQuery, searchQuery, searchQuery, parseInt(limit), parseInt(offset)]
    );

    res.json({
      profiles,
      count: profiles.length,
      query: q
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router; 