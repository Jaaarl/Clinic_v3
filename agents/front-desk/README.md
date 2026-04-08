# AI Front Desk Agent

Autonomous AI agent that handles clinic appointment scheduling via email — acts as a professional receptionist.

## Overview

The agent monitors a clinic email inbox and automatically:
- Reads incoming reservation requests
- Identifies new vs existing patients
- Registers new patients with a registration form
- Checks doctor availability
- Books appointments or suggests alternatives
- Sends confirmation emails

## Tech Stack

| Component | Technology |
|-----------|------------|
| Framework | OpenClaw |
| Email CLI | Himalaya |
| Email Provider | Gmail (IMAP/SMTP) |
| Backend API | Clinic_v3 REST API |
| Memory | Persistent file-based |

## How It Works

```
Email Received → Parse Request → Check Patient → Check Availability → Book/Respond
```

**Example workflow:**
1. Patient emails: "I want to book a checkup tomorrow at 10am"
2. Agent parses: patient name, preferred time, visit reason
3. If new patient → sends registration form
4. If existing → checks available slots → books appointment
5. Sends confirmation email

**When slot is taken:**
- Agent checks remaining slots
- Suggests 2-3 alternative times
- Patient replies with preference
- Agent confirms booking

## Setup

### Prerequisites
- OpenClaw installed
- Himalaya email CLI
- Gmail account with App Password
- Clinic_v3 API running

### Installation

```bash
# 1. Install himalaya
curl -sSL https://github.com/pimalaya/himalaya/releases/latest/download/himalaya.x86_64-linux.tgz | tar xz -C ~/.local/bin

# 2. Configure email account
~/.local/bin/himalaya account configure clinic

# 3. Set up cron to check emails every 5 minutes
*/5 * * * * ~/.local/bin/himalaya envelope list --account gmail
```

### Configuration

Edit `skills/front-desk/CONFIG.md`:
```yaml
clinic_api:
  url: http://localhost:3000
  key: your-api-key

email:
  account: gmail
```

## Agent Files

| File | Purpose |
|------|---------|
| `SOUL.md` | Agent persona, tone, and rules |
| `SKILL.md` | Workflow instructions and API commands |
| `FAQ.md` | Clinic info (parking, hours, contact) |
| `CONFIG.md` | System configuration |
| `memory.md` | Agent's persistent context |

## Project Structure

```
Clinic_v3/
├── app/                      # Next.js clinic app
├── agents/
│   └── front-desk/           # AI Agent module
│       ├── README.md          # This file
│       ├── memory.md          # Agent memory
│       └── skills/
│           └── front-desk/
│               ├── SKILL.md  # Workflow
│               ├── SOUL.md    # Persona
│               ├── FAQ.md     # Clinic info
│               └── CONFIG.md  # Config
└── check_reservations.sh     # Cron script
```

## Features

✅ Natural language email parsing  
✅ Automated patient registration  
✅ Appointment conflict resolution  
✅ Smart alternative slot suggestions  
✅ Thread-based email conversations  
✅ Professional receptionist persona  
✅ Persistent memory across sessions  
✅ FAQ-based responses for general inquiries  

## Running

The agent runs autonomously via OpenClaw. To start:

```bash
openclaw agents start front-desk-agent
```

Monitor logs:
```bash
tail -f ~/.openclaw/logs/front-desk-agent.log
```

## Notes

- Agent requires API key for Clinic_v3 endpoints
- Gmail requires App Password (not regular password)
- Cron job handles periodic email checks
- All emails are replied in-thread for conversation continuity

---

See main [README.md](../../README.md) for full Clinic_v3 setup.
