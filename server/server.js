import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import admin from 'firebase-admin';
import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ─── Firebase Admin Initialization ───────────────────────────────────────────
const serviceAccountPath = join(__dirname, 'serviceAccountKey.json');

if (existsSync(serviceAccountPath)) {
  const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  console.log('✅ Firebase Admin initialized with service account');
} else {
  console.error('');
  console.error('╔══════════════════════════════════════════════════════════════════╗');
  console.error('║  ⚠️  serviceAccountKey.json NOT FOUND!                          ║');
  console.error('║                                                                  ║');
  console.error('║  To fix this:                                                    ║');
  console.error('║  1. Go to Firebase Console → Project Settings → Service Accounts ║');
  console.error('║  2. Click "Generate new private key"                             ║');
  console.error('║  3. Save the downloaded JSON file as:                            ║');
  console.error('║     server/serviceAccountKey.json                                ║');
  console.error('╚══════════════════════════════════════════════════════════════════╝');
  console.error('');
  process.exit(1);
}

// ─── Express App Setup ───────────────────────────────────────────────────────
const app = express();
const PORT = process.env.PORT || 3002;

// Session duration: 2 hours (in milliseconds)
const SESSION_EXPIRY_MS = 2 * 60 * 60 * 1000;

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:5173', 'http://localhost:5174', 'http://127.0.0.1:5173', 'http://127.0.0.1:5174'],
  credentials: true,
}));

// ─── POST /api/session/login ─────────────────────────────────────────────────
// Receives a Firebase ID token, creates a server-side session cookie (httpOnly)
app.post('/api/session/login', async (req, res) => {
  const { idToken } = req.body;

  if (!idToken) {
    return res.status(400).json({ error: 'ID token is required' });
  }

  try {
    // Create a Firebase session cookie with 2-hour expiry
    const sessionCookie = await admin.auth().createSessionCookie(idToken, {
      expiresIn: SESSION_EXPIRY_MS,
    });

    // Set the cookie as httpOnly — NOT accessible via JavaScript
    res.cookie('__session', sessionCookie, {
      maxAge: SESSION_EXPIRY_MS,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });

    // Return user info so the client can display it immediately
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    res.status(200).json({
      status: 'success',
      user: {
        uid: decodedToken.uid,
        email: decodedToken.email,
        name: decodedToken.name || decodedToken.email,
        picture: decodedToken.picture || null,
      },
    });
  } catch (error) {
    console.error('Error creating session cookie:', error.message);
    res.status(401).json({ error: 'Failed to create session. Please try again.' });
  }
});

// ─── GET /api/session/verify ─────────────────────────────────────────────────
// Checks if the session cookie is valid. Returns user info if authenticated.
app.get('/api/session/verify', async (req, res) => {
  const sessionCookie = req.cookies.__session;

  if (!sessionCookie) {
    return res.status(401).json({ error: 'No active session' });
  }

  try {
    // checkRevoked = true → ensures revoked sessions are rejected
    const decodedClaims = await admin.auth().verifySessionCookie(sessionCookie, true);
    res.status(200).json({
      uid: decodedClaims.uid,
      email: decodedClaims.email,
      name: decodedClaims.name || decodedClaims.email,
      picture: decodedClaims.picture || null,
    });
  } catch (error) {
    console.error('Session verification failed:', error.message);
    // Clear the invalid cookie
    res.clearCookie('__session', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });
    res.status(401).json({ error: 'Session expired or invalid' });
  }
});

// ─── POST /api/session/logout ────────────────────────────────────────────────
// Clears the session cookie and revokes the user's refresh tokens
app.post('/api/session/logout', async (req, res) => {
  const sessionCookie = req.cookies.__session;

  // Always clear the cookie
  res.clearCookie('__session', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  });

  // Optionally revoke refresh tokens for extra security
  if (sessionCookie) {
    try {
      const decodedClaims = await admin.auth().verifySessionCookie(sessionCookie);
      await admin.auth().revokeRefreshTokens(decodedClaims.uid);
    } catch (error) {
      // Cookie might already be invalid — that's fine
    }
  }

  res.status(200).json({ status: 'logged out' });
});

// ─── Start Server ────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log('');
  console.log(`🚀 Session server running on http://localhost:${PORT}`);
  console.log(`   Session cookie duration: 2 hours`);
  console.log(`   Cookie type: httpOnly (not accessible via JavaScript)`);
  console.log('');
});
