# RAKSHA AI - Digital Public Safety Intelligence

RAKSHA AI is a cutting-edge platform designed to combat digital fraud, counterfeit currency, and complex scam networks using Generative AI and advanced data visualization.

## 🚀 Key Modules

### 🛡️ Scam Detector
Analyze suspicious messages, emails, or call transcripts.
- **AI Analysis:** Powered by Genkit and Gemini 1.5 Flash.
- **Risk Vectors:** Identifies red flags and provides specific recommended actions.
- **Reliability:** Built-in high-fidelity fallback logic ensures analysis works even during API outages.

### 💵 Currency Inspector
Verify the authenticity of banknotes using visual AI analysis.
- **Feature Detection:** Checks for watermarks, security threads, and microprinting.
- **Risk Scoring:** Provides an authenticity score from 0-100%.

### 🕸️ Network Intelligence
Map and visualize transaction relationships to identify illicit fraud clusters.
- **Dynamic Graphs:** Powered by React Flow.
- **Data Driven:** Supports CSV uploads to reconstruct complex financial networks and detect "smurfing" patterns.

### 📊 Intelligence Dashboard
Real-time monitoring of global threat vectors.
- **Analytics:** Visualized using Recharts.
- **Persistence:** All investigations are saved to Firebase Firestore for an immutable audit trail.

## 🛠️ Tech Stack

- **Framework:** Next.js 15 (App Router)
- **AI Backend:** Google Genkit + Gemini AI
- **Database:** Firebase Firestore
- **Auth:** Firebase Authentication
- **UI:** ShadCN UI + Tailwind CSS
- **Visualization:** React Flow & Recharts

## 📥 Getting Started

1. **Setup Firebase:**
   - Create a project in the Firebase Console.
   - Enable Authentication (Google/Email).
   - Provision a Firestore Database.
   - Add your config to `src/firebase/config.ts`.

2. **Environment Variables:**
   Create a `.env` file and add your `GEMINI_API_KEY`.

3. **Install & Run:**
   ```bash
   npm install
   npm run dev
   ```

## 🔒 Security & Privacy
RAKSHA AI is designed for public safety officials. All data is handled according to strict security rules defined in the Firebase backend configuration.

---
© 2026 RAKSHA AI - Defending the Digital Frontier.