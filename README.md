# Clinic_v3

AI-powered clinic management system with autonomous appointment scheduling agent.

## Features

### Management System (Next.js)
- Patient records management
- SOAP documentation
- Appointment scheduling
- Prescription handling
- Medical certificate issuance
- Analytics dashboard
- Inventory management

### AI Scheduling Agent
- Autonomous email-based appointment booking
- Natural language processing for reservation requests
- Automated patient registration
- Smart conflict resolution with alternative suggestions
- Email confirmations and notifications

## Tech Stack

**Frontend:** Next.js 14, React, Tailwind CSS  
**Backend:** MongoDB, REST API  
**AI Agent:** OpenClaw, Himalaya (Email CLI)

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/Jaaarl/Clinic_v3.git
cd Clinic_v3

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your MongoDB URI and API key

# Start development server
npm run dev
```

### Environment Variables

```env
MONGODB_URI=mongodb://localhost:27017/clinic
ALLOWED_ORIGIN=http://localhost:3000
API_KEY=your-secret-api-key
```

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/doctor` | List all doctors |
| POST | `/api/doctor` | Add new doctor |
| GET | `/api/patient` | Search patients |
| POST | `/api/patient` | Register patient |
| GET | `/api/appointments` | List appointments |
| POST | `/api/appointments` | Book appointment |
| GET | `/api/doctors/:id/schedule/slots` | Get available slots |

## AI Agent Setup

The scheduling agent runs separately and monitors email for reservation requests.

```bash
# Install himalaya (email CLI)
curl -sSL https://github.com/pimalaya/himalaya/releases/latest/download/himalaya.x86_64-linux.tgz | tar xz -C ~/.local/bin

# Configure email account
~/.local/bin/himalaya account configure clinic
```

See `skills/front-desk/` for agent configuration.

## Project Structure

```
Clinic_v3/
├── app/                    # Next.js app router
│   └── api/               # API routes
│       ├── doctor/
│       ├── patient/
│       └── appointments/
├── lib/                    # Utilities & services
│   ├── models/            # MongoDB models
│   └── services/          # Business logic
├── models/                 # Mongoose schemas
└── skills/                # AI agent skills
    └── front-desk/
```

## License

MIT
