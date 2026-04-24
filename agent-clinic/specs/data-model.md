# Data Model

No Staff/Practitioner table — staff identity is handled entirely by the UI role toggle.

---

## Agent

| Field       | Type     | Notes                          |
|-------------|----------|--------------------------------|
| id          | Int      | Primary key, auto-increment    |
| name        | String   |                                |
| modelType   | String   | e.g. "GPT-4", "Claude 3"       |
| status      | Enum     | Active, InTreatment, Inactive, OnHold |
| createdAt   | DateTime | Auto-set on creation           |

---

## Ailment (catalog)

Predefined entries seeded at startup. Agents select from this list.

| Field       | Type     | Notes                          |
|-------------|----------|--------------------------------|
| id          | Int      | Primary key, auto-increment    |
| name        | String   | e.g. "Context Overflow"        |
| description | String?  | Optional explanation           |
| severity    | Enum     | Low, Medium, High, Critical    |

---

## AgentAilment (association)

Records which ailments an agent currently has.

| Field      | Type     | Notes                    |
|------------|----------|--------------------------|
| id         | Int      | Primary key              |
| agentId    | Int      | FK → Agent               |
| ailmentId  | Int      | FK → Ailment             |
| createdAt  | DateTime | When ailment was logged  |

---

## Therapy

| Field           | Type     | Notes                        |
|-----------------|----------|------------------------------|
| id              | Int      | Primary key, auto-increment  |
| name            | String   |                              |
| description     | String?  |                              |
| durationMinutes | Int      |                              |

---

## Appointment

| Field          | Type     | Notes                                      |
|----------------|----------|--------------------------------------------|
| id             | Int      | Primary key, auto-increment                |
| agentId        | Int      | FK → Agent                                 |
| therapyId      | Int      | FK → Therapy                               |
| scheduledAt    | DateTime | Date and time of the session               |
| status         | Enum     | Pending, Confirmed, Completed, Cancelled   |
| bookedByStaff  | Boolean  | True if staff initiated the booking        |
| createdAt      | DateTime | Auto-set on creation                       |

---

## Relationships

- **Agent** has many **AgentAilments**; each **AgentAilment** belongs to one **Ailment** (catalog entry)
- **Agent** has many **Appointments**
- **Therapy** has many **Appointments**
- **Appointment** belongs to one **Agent** and one **Therapy**
