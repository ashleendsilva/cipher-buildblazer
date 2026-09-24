# Cipher Build Blazer 

Live build phase for **Cipher (CSE Association)'s** track of the Build Blazer event at SJEC.

This repo is the starting point for Phase 2, where third-year teams fork it and build the winning design into a live, deployed website.

## How this works

The CIPHER portal is a cyberpunk-themed association website featuring two core experiences:

1. **Public Website**:
   - **Bootloader & Interactive Canvas**: Simulated BIOS boot sequence, synthesized Web Audio effects, and dynamic mouse-reactive grid and topographic contour visuals.
   - **Community & Events**: Live announcement broadcasts, department showcase, leadership directory, and hackathon timeline with event registration.
   - **Recruitment**: Student membership application modal, matrix visualizers, and secret terminal access (`Ctrl+Shift+A`).

2. **Admin Panel:**
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
- **Backend / Dev Server**: Express (`express`), TSX (`tsx`)

## Deployment

Live links:
- Public Website: https://cipherbuildblazer.netlify.app/
- Admin Panel: https://cipheradminpanel.netlify.app/
---
Organized by **Cipher (CSE Association)**, SJEC, in collaboration with **AgentBlazer Club**.
