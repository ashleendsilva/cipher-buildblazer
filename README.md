# Cipher Build Blazer 

## How this works

The CIPHER portal is a cyberpunk-themed association website featuring two core experiences:

1. **Public Website**
   - **Bootloader & Interactive Canvas**: Simulated BIOS boot sequence, synthesized Web Audio effects, and dynamic mouse-reactive grid and topographic contour visuals.
   - **Community & Events**: Live announcement broadcasts, department showcase, leadership directory, and events.
   - **Recruitment**: Student membership application modal, matrix visualizers.

2. **Admin Panel**
   - Secure admin dashboard for managing the website content.
   - Admins can manage announcements, events, registrations, memberships, and team information.
   - Dashboard provides an overview of important platform statistics.

## Getting started

```bash
git clone https://github.com/ashleendsilva/cipher-buildblazer.git
cd cipher-buildblazer
npm install
npm run dev
```
2. Start the Frontend
From the project root:
```bash
npm install
npm run dev
```
3. Start the Backend
Open a new terminal and navigate to the backend:
```bash
cd backend
npm install
npm run dev
```
Make sure the required backend environment variables are configured in:
```bash
backend/.env
```
4. Start the Admin Panel
Open another new terminal:
```bash
cd admin
npm install
npm run dev
```
## Team

| Role | Name |
|------|------|
| Team Lead | Ashleen Dsilva |
| Team member 1 | Ceana Venisia Dsouza |
|  Team member 2| Blenisha Cutinha |
           
## Tech stack

- **Framework & Runtime**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS v4
- **Animation & Icons**: Motion (`motion`), Lucide Icons (`lucide-react`), Canvas Confetti (`canvas-confetti`)
- **Backend / Dev Server**: Node.js, Express (`express`)
- **Database**: PostgreSQL, Prisma, Neon
- **Deployment**: Netlify(Frontend & Admin Panel), Render(Backend)

## Deployment

Live links:
- Public Website: https://cipherbuildblazer.netlify.app/
- Admin Panel: https://cipheradminpanel.netlify.app/
- Backend: https://cipher-buildblazer-khoj.onrender.com

---
Organized by **Cipher (CSE Association)**, SJEC, in collaboration with **AgentBlazer Club**.
