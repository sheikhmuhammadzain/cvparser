# Chapter 3: Materials and Methods

## 3.1. Why Using Agile Development?

The CV Shortlister project adopted an **Agile development methodology**, specifically inspired by Scrum principles, to ensure flexibility, continuous improvement, and stakeholder alignment throughout the development lifecycle. The decision to use Agile was driven by several key factors:

### Iterative Development Benefits

**Rapid Prototyping:** Agile allows for quick development of working prototypes that can be tested and refined based on real feedback. Rather than spending months on a complete system design before writing code, we could develop core features in weeks and validate our assumptions early.

**Continuous Feedback Integration:** Regular demonstrations to supervisors and potential users enabled us to incorporate feedback continuously rather than discovering issues only at project completion. This reduced the risk of building features that didn't meet actual user needs.

**Flexibility to Adapt:** As we encountered technical challenges or discovered better implementation approaches, Agile allowed us to pivot without derailing the entire project. For example, when initial resume parsing accuracy was lower than expected, we could dedicate a sprint to improving extraction algorithms.

### Managing Complexity

The CV Shortlister project encompasses multiple technical domains:
- Backend API development
- Frontend UI implementation
- Resume parsing and NLP
- Database design
- User experience design
- Testing and deployment

Agile's sprint-based approach allowed us to tackle these complex, interconnected components incrementally rather than attempting to design everything upfront.

### Team Coordination

With multiple team members working on different aspects of the system, Agile practices like daily stand-ups, sprint planning, and retrospectives ensured:
- Clear communication about progress and blockers
- Coordinated integration of frontend and backend work
- Shared understanding of priorities
- Collective problem-solving for technical challenges

### Risk Mitigation

By delivering working increments every 2-3 weeks, we continuously validated technical feasibility and could identify risks early:
- Integration issues between frontend and backend
- Performance bottlenecks
- Usability problems
- Data quality concerns

Early detection allowed us to address risks before they became critical project-threatening issues.

---

## 3.2. Scrum in Project Management — How Does It Work?

Our adaptation of Scrum for CV Shortlister followed these key practices:

### Sprint Structure

**Sprint Duration:** 2 weeks per sprint, balancing the need for meaningful progress with flexibility to adapt

**Sprint Planning:** At the beginning of each sprint:
1. Review completed work from previous sprint
2. Identify highest-priority features from product backlog
3. Break features into specific tasks
4. Estimate effort required
5. Commit to deliverables for the sprint

**Daily Progress Updates:** Short team check-ins (in-person or via messaging) where each member shared:
- What was accomplished since last update
- What will be worked on next
- Any blockers or challenges

**Sprint Review:** At sprint end:
- Demonstrate working features to supervisor
- Gather feedback
- Assess what was completed vs. planned

**Sprint Retrospective:** Team reflection on:
- What went well
- What could be improved
- Action items for next sprint

### Product Backlog Management

We maintained a prioritized backlog of features and improvements:

**High Priority (Must Have):**
- Resume upload functionality
- Text extraction from PDF/DOCX
- Basic skill detection
- CV list display
- RESTful API endpoints

**Medium Priority (Should Have):**
- Advanced filtering
- Ranking algorithm
- Statistics dashboard
- Multi-file upload
- Responsive design

**Low Priority (Nice to Have):**
- Dark mode
- Export functionality
- Advanced analytics
- Interview scheduling

Priorities were reassessed each sprint based on progress, feedback, and technical discoveries.

### Key Scrum Artifacts in Our Project

**Product Backlog:** Maintained in a shared document/tool listing all features, enhancements, and fixes

**Sprint Backlog:** Subset of product backlog committed to for current sprint, broken into specific tasks

**Increment:** Working software delivered at end of each sprint that adds value to the system

**Definition of Done:** Clear criteria for considering a feature complete:
- Code written and self-reviewed
- Functionality tested manually
- No critical bugs
- Basic documentation added
- Integrated with main codebase
- Demonstrated to team/supervisor

---

## 3.3. Key Benefits of Scrum for Our Project

### Transparency and Visibility

Regular reviews ensured our supervisor always had visibility into project status, reducing surprises and enabling timely guidance.

### Quality Focus

Frequent testing and integration prevented accumulation of technical debt. Issues were addressed immediately rather than being deferred to a "testing phase."

### Motivation and Momentum

Completing working features every 2 weeks provided tangible progress markers, maintaining team morale and motivation throughout the 4-month project.

### Learning and Skill Development

Retrospectives facilitated continuous learning. When we encountered challenges with resume parsing accuracy, we dedicated time to research better algorithms rather than settling for suboptimal solutions.

### Scope Management

The prioritized backlog helped us make explicit trade-off decisions. When time constraints emerged, we could consciously deprioritize lower-value features rather than rushing to complete everything poorly.

---

## 3.4. Methodology Overview

The development of **CV Shortlister** followed a systematic approach encompassing requirement analysis, technology selection, architecture design, iterative development, testing, and deployment. This section outlines each phase of the methodology.

### 3.4.1. Requirement Analysis and Planning

**Initial Research Phase (Week 1-2):**

**Problem Investigation:**
- Conducted interviews with HR professionals to understand pain points
- Reviewed existing ATS solutions to identify gaps
- Surveyed recruitment literature to understand best practices

**Stakeholder Requirements Gathering:**
- Met with project supervisor to establish scope and expectations
- Defined success criteria and deliverables
- Identified constraints (time, resources, technical skills)

**Feature Prioritization:**
Using MoSCoW method:

**Must Have:**
- Resume file upload (PDF, DOCX, TXT, images)
- Text extraction
- Entity identification (skills, education, experience)
- Basic search and filtering
- CV listing with status
- REST API backend

**Should Have:**
- Advanced filtering with multi-criteria
- Ranking/scoring algorithm
- Statistics dashboard
- Responsive UI design
- Real-time processing status

**Could Have:**
- Dark mode
- Export to CSV/Excel
- Advanced analytics
- Candidate comparison view

**Won't Have (This Version):**
- Email integration
- Calendar/scheduling
- Payment processing
- Multi-user authentication with roles

**System Requirements Definition:**
- Functional requirements: What the system should do
- Non-functional requirements: Performance, usability, security, scalability
- Technical constraints: Browser compatibility, file size limits, response times

---

### 3.4.2. Technology Stack Selection

Technology choices were guided by:
- Team expertise and learning goals
- Community support and documentation quality
- Long-term maintainability
- Performance requirements
- Integration capabilities

**Backend Technologies:**

**Django & Django REST Framework**
- **Rationale:** Python-based web framework with excellent documentation, robust ORM, built-in admin interface, and strong security features
- **Version:** Django 4.2 (LTS), Django REST Framework 3.14
- **Key Features Used:**
  - Model-View-Template (MVT) architecture
  - Django ORM for database operations
  - REST Framework serializers for data transformation
  - Class-based views for API endpoints
  - Built-in authentication system

**Python Libraries for Resume Processing:**
- **PyPDF2 (3.0.1):** PDF text extraction
- **python-docx (0.8.11):** Microsoft Word document parsing
- **Pillow (10.0.0):** Image processing and OCR
- **pytesseract (0.3.10):** OCR engine wrapper for text extraction from images

**Database:**
- **SQLite (Development):** Lightweight, file-based database requiring no setup, ideal for development and demonstration
- **PostgreSQL (Production):** Planned for production deployment, offering better concurrency, advanced querying, and scalability

**Frontend Technologies:**

**React with TypeScript**
- **Rationale:** Modern, component-based UI library with strong typing support from TypeScript, reducing runtime errors and improving code maintainability
- **Version:** React 18.2, TypeScript 5.0
- **Key Features Used:**
  - Functional components with React Hooks
  - Context API for state management
  - React Router for client-side routing
  - Custom hooks for API integration

**Styling and UI Components:**
- **TailwindCSS (3.3):** Utility-first CSS framework enabling rapid UI development with consistent design
- **shadcn/ui:** Collection of reusable, accessible components built on Radix UI primitives
- **Lucide React:** Icon library providing consistent, customizable icons

**Build Tools:**
- **Vite (4.4):** Fast development server and optimized build tool
- **Bun:** Modern JavaScript runtime and package manager (alternative to npm/yarn)

**API Communication:**
- **Axios:** Promise-based HTTP client for making API requests
- **TanStack Query (React Query):** Data fetching and caching library providing automatic retries, cache management, and loading states

**Additional Frontend Libraries:**
- **date-fns:** Date formatting and manipulation
- **sonner:** Toast notifications for user feedback
- **react-hook-form:** Form validation and handling

**Development Tools:**

**Version Control:**
- **Git:** Distributed version control
- **GitHub:** Repository hosting and collaboration

**Code Quality:**
- **ESLint:** JavaScript/TypeScript linting
- **Prettier:** Code formatting
- **Python Black:** Python code formatter

**Development Environment:**
- **VS Code:** Primary IDE with extensions for React, Python, and TypeScript
- **Postman:** API testing and documentation
- **Chrome DevTools:** Frontend debugging and performance profiling

---

### 3.4.3. System Architecture

The CV Shortlister system follows a **three-tier architecture** comprising the presentation layer (frontend), application layer (backend API), and data layer (database).

**Architecture Diagram:**

```
┌─────────────────────────────────────────────────────────┐
│                  PRESENTATION LAYER                     │
│  ┌───────────────────────────────────────────────────┐ │
│  │         React Frontend (TypeScript)                │ │
│  │  ┌────────────┐ ┌──────────┐ ┌────────────────┐  │ │
│  │  │  Landing   │ │Dashboard │ │   CV List      │  │ │
│  │  │   Page     │ │  Layout  │ │   & Filter     │  │ │
│  │  └────────────┘ └──────────┘ └────────────────┘  │ │
│  │  ┌────────────┐ ┌──────────┐ ┌────────────────┐  │ │
│  │  │   Upload   │ │   Stats  │ │  CV Detail     │  │ │
│  │  │  Interface │ │Dashboard │ │    View        │  │ │
│  │  └────────────┘ └──────────┘ └────────────────┘  │ │
│  └───────────────────────────────────────────────────┘ │
└──────────────────────┬──────────────────────────────────┘
                       │ HTTP/HTTPS (REST API)
                       │ JSON Data Exchange
┌──────────────────────▼──────────────────────────────────┐
│                  APPLICATION LAYER                      │
│  ┌───────────────────────────────────────────────────┐ │
│  │      Django REST Framework Backend (Python)       │ │
│  │  ┌────────────┐ ┌──────────┐ ┌────────────────┐  │ │
│  │  │   Upload   │ │  Filter  │ │   Statistics   │  │ │
│  │  │    API     │ │   API    │ │      API       │  │ │
│  │  └────────────┘ └──────────┘ └────────────────┘  │ │
│  │  ┌────────────┐ ┌──────────────────────────────┐ │ │
│  │  │    List    │ │      Detail API              │ │ │
│  │  │    API     │ │                              │ │ │
│  │  └────────────┘ └──────────────────────────────┘ │ │
│  │                                                   │ │
│  │  ┌───────────────────────────────────────────┐  │ │
│  │  │      Resume Processing Engine             │  │ │
│  │  │  - Text Extraction (PDF, DOCX, Images)    │  │ │
│  │  │  - Entity Recognition (Skills, Education) │  │ │
│  │  │  - Data Validation & Cleaning             │  │ │
│  │  └───────────────────────────────────────────┘  │ │
│  └───────────────────────────────────────────────────┘ │
└──────────────────────┬──────────────────────────────────┘
                       │ ORM (Django Models)
┌──────────────────────▼──────────────────────────────────┐
│                     DATA LAYER                          │
│  ┌───────────────────────────────────────────────────┐ │
│  │              SQLite / PostgreSQL Database         │ │
│  │  ┌────────────────────────────────────────────┐  │ │
│  │  │  CV Model                                  │  │ │
│  │  │  - file (FileField)                        │  │ │
│  │  │  - uploaded_at (DateTimeField)             │  │ │
│  │  │  - extracted_text (TextField)              │  │ │
│  │  │  - status (CharField)                      │  │ │
│  │  │  - entities (JSONField)                    │  │ │
│  │  │  - processing_time (FloatField)            │  │ │
│  │  │  - top_skills (JSONField)                  │  │ │
│  │  │  - processed_at (DateTimeField)            │  │ │
│  │  └────────────────────────────────────────────┘  │ │
│  └───────────────────────────────────────────────────┘ │
│  ┌───────────────────────────────────────────────────┐ │
│  │              File Storage                         │ │
│  │  - Uploaded CV files (media/cvs/)                │ │
│  └───────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

**Key Architectural Principles:**

**Separation of Concerns:**
- Frontend handles presentation logic and user interaction
- Backend manages business logic, data processing, and persistence
- Clear API contract defines communication between layers

**RESTful API Design:**
- Stateless communication
- Resource-based URLs
- Standard HTTP methods (GET, POST, PUT, DELETE)
- JSON data format
- Appropriate status codes

**Modular Components:**
- Frontend: Reusable React components
- Backend: Django apps with focused responsibilities
- Loose coupling enabling independent development and testing

**Scalability Considerations:**
- Stateless backend enables horizontal scaling
- Database indexing for performance
- File storage separate from database
- Asynchronous processing for long-running operations

---

### 3.4.4. Database Design

The database schema centers around the **CV model**, which stores all resume-related information:

**CV Model Schema:**

```python
class CV(models.Model):
    # Primary key (auto-generated)
    id: AutoField (Primary Key)
    
    # File storage
    file: FileField(upload_to='cvs/')
    # Stores actual resume file in media/cvs/ directory
    # Naming includes random hash to prevent collisions
    
    # Timestamps
    uploaded_at: DateTimeField(auto_now_add=True)
    # Automatically set when CV created
    
    processed_at: DateTimeField(blank=True, null=True)
    # Set when processing completes
    
    # Extracted data
    extracted_text: TextField(blank=True, null=True)
    # Full text extracted from resume
    # Used for searching and entity extraction
    
    # Structured entities
    entities: JSONField(blank=True, null=True)
    # Stores extracted structured information:
    # {
    #   "skills": ["python", "django", "react"],
    #   "education": ["bachelor"],
    #   "experience": ["3 years"],
    #   "keywords": ["leadership", "team"]
    # }
    
    top_skills: JSONField(blank=True, null=True)
    # Deduplicated, normalized skills list
    # Used for statistics aggregation
    
    # Status tracking
    status: CharField(
        max_length=20,
        choices=[
            ('Pending', 'Pending'),
            ('Processed', 'Processed'),
            ('Failed', 'Failed')
        ],
        default='Pending'
    )
    
    # Performance metrics
    processing_time: FloatField(blank=True, null=True)
    # Time in seconds to process the resume
    
    # Indexes for query optimization
    class Meta:
        indexes = [
            models.Index(fields=['status']),
            models.Index(fields=['uploaded_at']),
        ]
```

**Database Indexing Strategy:**

**Status Index:** Frequently queried to filter by processing status (Pending, Processed, Failed)

**Uploaded_at Index:** Used for sorting CV lists by date and calculating statistics

**Benefits of Indexing:**
- O(log n) lookup time vs. O(n) for sequential scan
- Significant performance improvement with 100+ CVs
- Essential for responsive API endpoints

**Database Normalization:**

The schema follows **Third Normal Form (3NF)**:
- No repeating groups (skills stored as JSON array)
- All non-key attributes depend on primary key
- No transitive dependencies

For future scalability, the schema could be denormalized to separate tables:
- Skills table with many-to-many relationship to CVs
- Education table with foreign key to CVs
- Experience table with foreign key to CVs

However, for the current scale (hundreds to thousands of CVs), the JSON approach provides:
- Simpler queries
- Faster development
- Flexibility for varied entity types
- Sufficient performance

---

This completes Part 1 of the Methodology chapter. Continue to the next file for the remaining methodology sections covering the detailed implementation.
