# AI Front Desk Agent

Autonomous AI agent that handles clinic appointment scheduling via email.

## What It Does

- Monitors email inbox for reservation requests
- Parses natural language appointment requests
- Registers new patients automatically
- Books appointments with conflict resolution
- Sends confirmation emails
- Suggests alternative slots when conflicts occur

## Tech Stack

- **Framework:** OpenClaw
- **Email:** Himalaya CLI + Gmail IMAP/SMTP
- **API:** Clinic_v3 REST API
- **Logic:** AI agent with persistent memory

## Setup

```bash
# Install himalaya
curl -sSL https://github.com/pimalaya/himalaya/releases/latest/download/himalaya.x86_64-linux.tgz | tar xz -C ~/.local/bin

# Configure email
~/.local/bin/himalaya account configure clinic
```

## Agent Structure

```
front-desk/
├── memory.md           # Agent context/memory
├── skills/
│   └── front-desk/
│       ├── SKILL.md   # Workflow & commands
│       ├── SOUL.md    # Persona & rules
│       ├── FAQ.md     # Clinic info
│       └── CONFIG.md  # System config
└── README.md
```

## Running

The agent runs via OpenClaw and checks emails every 5 minutes via cron:

```bash
*/5 * * * * /home/jarl/check_reservations.sh
```

See main [README.md](../../README.md) for full project setup.
