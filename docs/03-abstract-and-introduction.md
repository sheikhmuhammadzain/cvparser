# Abstract

The recruitment industry has experienced rapid transformation in the digital era, with organizations receiving hundreds to thousands of resumes for single job postings. Traditional manual screening processes are time-consuming, inconsistent, and prone to human bias. The need for an intelligent, automated resume management system that can efficiently process, analyze, and rank candidates has become paramount for modern HR departments.

**CV Shortlister** is an AI-powered resume management and screening system designed to revolutionize the recruitment process. The platform combines advanced text extraction, natural language processing, and intelligent filtering algorithms to automate the candidate screening workflow. Built with a modern technology stack featuring Django REST Framework for the backend and React with TypeScript for the frontend, the system provides a seamless, user-friendly experience for HR professionals and recruiters.

The backend leverages Python libraries including PyPDF2, python-docx, and Pillow for comprehensive resume parsing from multiple file formats (PDF, DOCX, TXT, and image files). Entity extraction algorithms identify key information such as skills, education, experience, and keywords from unstructured resume text. The Django REST Framework provides robust RESTful APIs that handle file uploads, data retrieval, advanced filtering, and statistical analytics.

The frontend application, developed using React with TypeScript and styled with TailwindCSS and shadcn/ui components, offers an intuitive interface featuring:
- **Drag-and-drop resume upload** with real-time processing status
- **Comprehensive CV list view** with search and filtering capabilities
- **Advanced filtering and ranking system** with multi-select dropdowns for skills, education, experience, and keywords
- **Interactive statistics dashboard** displaying processing metrics, completion rates, and top skills visualization
- **Detailed CV viewer** presenting extracted information in an organized format

The filtering system employs a sophisticated scoring algorithm that evaluates candidates based on education match (2 points), skill matches (1 point per skill), experience requirements (3 points), and keyword relevance (0.5 points per keyword). Results are ranked by total score, enabling recruiters to quickly identify the most qualified candidates.

Project development followed an Agile methodology with iterative sprints, allowing continuous feedback integration and feature refinement. The team successfully overcame technical challenges including resume parsing accuracy, entity recognition optimization, and creating an accessible user interface that balances functionality with simplicity.

Key achievements include processing resumes in under 2 seconds on average, achieving high accuracy in skill and education extraction, supporting multiple file formats, and creating a responsive interface that works seamlessly across devices. The system maintains data security through proper authentication mechanisms and complies with data protection best practices.

The platform addresses critical recruitment pain points by reducing screening time by up to 80%, eliminating human bias through consistent scoring criteria, improving candidate ranking accuracy, and providing actionable insights through analytics. Regular feedback mechanisms and usability testing ensure continuous improvement of both functionality and user experience.

Future enhancements planned include integration of advanced machine learning models for semantic candidate matching, natural language query support, automated interview scheduling, mobile application development, and cloud deployment for enterprise scalability. The system's modular architecture facilitates easy integration of these features without major structural changes.

**CV Shortlister** represents a significant step forward in recruitment technology, demonstrating how intelligent automation can enhance HR workflows while maintaining the human element in final candidate selection decisions.

---

# Chapter 1: Introduction

## 1.1. Motivation

The recruitment landscape has undergone a dramatic transformation in recent years, driven by the exponential growth of online job applications and the increasing complexity of talent acquisition processes. Modern organizations face unprecedented challenges in managing the volume of applications received for each position, with some companies reporting thousands of resumes for a single opening.

Traditional manual resume screening processes present several critical limitations:

**Time Inefficiency:** HR professionals spend an average of 6-10 seconds per resume during initial screening, yet reviewing hundreds of applications can consume entire workdays. This time could be better spent on strategic recruitment activities and candidate engagement.

**Human Bias:** Manual screening is inherently susceptible to unconscious biases related to name, gender, age, educational institutions, and other factors that should not influence hiring decisions. This not only creates fairness issues but also limits diversity and potentially violates equal opportunity employment regulations.

**Inconsistency:** Different recruiters may apply varying criteria when evaluating candidates, leading to inconsistent results. A resume rejected by one screener might be considered highly qualified by another, resulting in missed opportunities.

**Scalability Issues:** As organizations grow and hiring demands increase, manual screening becomes unsustainable. The process simply cannot scale effectively without proportionally increasing HR staff.

**Information Overload:** Extracting relevant information from diverse resume formats, identifying key skills, and accurately assessing qualifications across large candidate pools is mentally exhausting and error-prone.

The motivation for developing **CV Shortlister** stems from these real-world recruitment challenges observed in modern organizations. Our team recognized that while Applicant Tracking Systems (ATS) exist in the market, many are:
- Prohibitively expensive for small to medium-sized enterprises
- Overly complex with steep learning curves
- Lacking in intelligent filtering and ranking capabilities
- Poor in user experience and interface design
- Limited in customization options

Additionally, our academic journey in Information Engineering provided us with the technical skills in full-stack development, API design, natural language processing, and UI/UX design. This project represents an opportunity to apply our accumulated knowledge to solve a practical, impactful problem.

The COVID-19 pandemic accelerated the shift to remote work and digital recruitment, making efficient digital hiring tools more critical than ever. Organizations need systems that can:
- Handle high volumes of digital applications efficiently
- Provide objective, data-driven candidate assessments
- Reduce time-to-hire metrics
- Improve quality of hire through better candidate matching
- Offer transparency and auditability in the screening process

**CV Shortlister** was conceived to address these needs by creating an accessible, intelligent, and user-friendly recruitment management platform that democratizes advanced hiring technology. By leveraging open-source technologies and modern development practices, we aimed to build a solution that is both powerful and practical for organizations of all sizes.

The project also served as an educational vehicle, allowing our team to:
- Master full-stack development with modern frameworks
- Implement RESTful API architecture
- Apply natural language processing techniques
- Design intuitive user interfaces
- Practice Agile development methodologies
- Gain experience in project management and teamwork

---

## 1.2. Aims and Objectives

### 1.2.1. Aim

The primary aim of **CV Shortlister** is to develop an intelligent, automated resume management and screening system that streamlines the recruitment process for organizations while improving the quality and consistency of candidate evaluation.

Specifically, the platform seeks to:

**Transform the Resume Screening Workflow** by replacing time-consuming manual processes with automated parsing, extraction, and intelligent ranking, reducing screening time from hours to minutes.

**Enhance Decision Quality** through objective, data-driven candidate assessment based on configurable criteria such as skills, education, experience, and keywords, eliminating unconscious bias and improving hiring outcomes.

**Improve User Experience** for HR professionals and recruiters by providing an intuitive, modern interface that simplifies resume management, offers powerful search and filtering tools, and presents information in clear, actionable formats.

**Provide Actionable Insights** through comprehensive analytics and statistics that help organizations understand their candidate pools, identify skill trends, and optimize recruitment strategies.

**Ensure Accessibility and Affordability** by creating an open-source solution that can be deployed by organizations of all sizes without prohibitive licensing costs.

The platform achieves these aims through:
- **Automated resume parsing** supporting multiple file formats (PDF, DOCX, TXT, images)
- **Intelligent entity extraction** identifying skills, education, experience, and keywords
- **Advanced filtering and ranking** with customizable scoring criteria
- **Real-time processing** providing immediate feedback on uploaded resumes
- **Interactive analytics dashboard** visualizing recruitment metrics and trends
- **Responsive, modern UI** ensuring accessibility across devices and screen sizes

By achieving these aims, CV Shortlister empowers organizations to:
- Reduce cost-per-hire through automation
- Accelerate time-to-hire by streamlining screening
- Improve quality-of-hire through better candidate matching
- Enhance candidate experience with faster response times
- Support data-driven recruitment strategies

---

### 1.2.2. Objectives

To achieve the stated aims, **CV Shortlister** was developed with the following specific, measurable objectives:

#### 1. **Automated Resume Processing**

**Objective:** Develop a robust resume parsing engine capable of extracting text and structured information from multiple file formats with high accuracy.

**Implementation:**
- Support for PDF, DOCX, TXT, and image files (JPG, PNG)
- Text extraction using PyPDF2, python-docx, and Pillow with OCR capabilities
- Validation and error handling for corrupted or unsupported files
- File size limits (5MB) to ensure system performance
- Processing time optimization targeting under 3 seconds per resume

**Success Criteria:**
- Successfully parse 95%+ of uploaded resumes
- Achieve average processing time under 2 seconds
- Handle concurrent uploads without system degradation

#### 2. **Intelligent Entity Extraction**

**Objective:** Implement natural language processing algorithms to identify and extract key entities including skills, education levels, years of experience, and relevant keywords.

**Implementation:**
- Custom entity extraction logic analyzing resume text
- Skills detection using comprehensive keyword matching
- Education level identification (Intermediate, Bachelor's, Master's, PhD)
- Experience calculation from text patterns
- Storage of extracted entities in structured JSON format

**Success Criteria:**
- Accurately identify 85%+ of listed skills
- Correctly categorize education levels in 90%+ of cases
- Extract experience information with 80%+ accuracy

#### 3. **Advanced Filtering and Ranking System**

**Objective:** Create a flexible, powerful filtering system that allows recruiters to define search criteria and automatically ranks candidates based on relevance scores.

**Implementation:**
- Multi-select dropdowns for skills (20+ predefined options)
- Education level selector (Intermediate, Bachelor's, Master's, PhD)
- Experience years selector (0-15+ years)
- Keywords multi-select (13+ predefined options)
- Scoring algorithm: Education (2 pts) + Skills (1 pt each) + Experience (3 pts) + Keywords (0.5 pts each)
- Real-time results ranking by total score

**Success Criteria:**
- Return relevant results in under 1 second
- Rank candidates accurately based on defined criteria
- Support partial matching (any criteria) rather than strict AND logic

#### 4. **User-Friendly Interface Design**

**Objective:** Design and implement an intuitive, modern user interface that requires minimal training and provides seamless user experience.

**Implementation:**
- Landing page with hero section, features, and statistics
- Dashboard with sidebar navigation
- Drag-and-drop file upload with visual feedback
- Card-based CV list with status badges and search
- Filter page with dropdown selectors and result cards
- Statistics dashboard with charts and metrics
- Responsive design supporting mobile, tablet, and desktop
- Dark mode support for reduced eye strain

**Success Criteria:**
- Achieve positive user feedback from usability testing
- Ensure all features accessible within 3 clicks from dashboard
- Maintain consistent design language across all pages
- Support screen readers and accessibility standards

#### 5. **RESTful API Architecture**

**Objective:** Develop a scalable, well-documented REST API that handles all backend operations and can be consumed by frontend or third-party applications.

**Implementation:**
- Django REST Framework providing 5 core endpoints:
  - `POST /api/cvs/upload/` - Multi-file upload and processing
  - `GET /api/cvs/` - List all resumes with pagination
  - `GET /api/cvs/{id}/` - Retrieve detailed CV information
  - `POST /api/cvs/filter/` - Filter and rank CVs by criteria
  - `GET /api/cvs/stats/` - Retrieve system statistics
- JSON serialization for all responses
- Error handling with appropriate HTTP status codes
- CORS configuration for frontend integration

**Success Criteria:**
- All endpoints respond within 500ms under normal load
- API documentation provides clear usage examples
- Handle 50+ concurrent requests without errors

#### 6. **Statistics and Analytics Dashboard**

**Objective:** Provide comprehensive analytics that give recruiters insights into their candidate pool and recruitment process performance.

**Implementation:**
- Total CVs uploaded counter
- Processed vs. pending CV counts
- Processing progress percentage
- Average processing time metric
- Top skills frequency chart
- Failed uploads tracking

**Success Criteria:**
- Statistics update in real-time as CVs are processed
- Top skills visualization displays up to 5 most common skills
- All metrics calculated accurately from database

#### 7. **Data Security and Privacy**

**Objective:** Ensure secure handling of sensitive candidate information and comply with data protection best practices.

**Implementation:**
- Secure file storage with access controls
- Input validation to prevent injection attacks
- CORS configuration for trusted origins only
- No storage of personally identifiable information beyond resumes
- Secure backend-frontend communication

**Success Criteria:**
- Pass basic security vulnerability scans
- No data leakage between user sessions
- Proper error messages without exposing system information

#### 8. **Performance Optimization**

**Objective:** Ensure the system performs efficiently under typical usage loads with minimal resource consumption.

**Implementation:**
- Database indexing on frequently queried fields
- Asynchronous processing for file operations
- Efficient text extraction algorithms
- Frontend code splitting and lazy loading
- Caching strategies for repeated queries

**Success Criteria:**
- Dashboard loads in under 2 seconds
- Support 100+ concurrent users
- Process 50+ resumes in under 2 minutes

---

## 1.3. Organization of The Dissertation

This dissertation is structured into six comprehensive chapters, each addressing critical aspects of the **CV Shortlister** project development and evaluation.

### Chapter 1: Introduction
The opening chapter establishes the foundation of the project by discussing the motivation behind developing an automated resume screening system. It identifies the challenges faced by modern recruitment processes and explains why traditional manual methods are inadequate for today's high-volume hiring environment. The chapter then articulates the project's aims and objectives, providing clear, measurable goals that guide the entire development process. Finally, it outlines the dissertation structure, giving readers a roadmap for the content ahead.

### Chapter 2: Literature Review
This chapter presents a comprehensive review of existing research, technologies, and solutions related to resume parsing, applicant tracking systems, and recruitment automation. It explores various approaches to text extraction from documents, entity recognition techniques, and machine learning applications in HR. The review examines commercial ATS solutions, identifies their strengths and limitations, and establishes the knowledge gaps that CV Shortlister addresses. This chapter justifies the technical decisions made during development and positions the project within the broader context of recruitment technology.

### Chapter 3: Materials and Methods
The methodology chapter provides detailed documentation of the project's technical implementation. It explains the choice of Agile development methodology and describes the iterative sprint-based approach used throughout the project. The chapter thoroughly documents the technology stack, including Django REST Framework, React with TypeScript, TailwindCSS, and various Python libraries. It presents the system architecture, database schema, API design, and frontend component structure. Each major feature—resume upload, entity extraction, filtering, ranking, and statistics—is explained with implementation details. This chapter serves as a technical reference for understanding how the system was built.

### Chapter 4: Results and Discussion
This chapter presents the outcomes of the project development, including implemented features, user interface designs, and system performance metrics. It includes screenshots and visual representations of all major pages: landing page, dashboard, upload interface, CV list, filter page, and statistics dashboard. The chapter discusses the effectiveness of the filtering algorithm, accuracy of entity extraction, and system performance under various loads. It compares CV Shortlister with existing solutions, highlighting its advantages and acknowledging limitations. User feedback from testing sessions is analyzed and discussed.

### Chapter 5: Conclusions and Future Work
The concluding chapter summarizes the project achievements and reflects on the learning outcomes. It evaluates how well the objectives were met and discusses the broader implications of the work. The chapter then outlines future enhancements planned for the system, including advanced AI-powered matching, enhanced natural language processing, mobile app development, cloud deployment, and integration with interview scheduling tools. It acknowledges challenges encountered during development and lessons learned that could benefit future similar projects.

### References
This section provides a complete bibliography of all academic papers, technical documentation, library references, and online resources consulted during research and development.

---

Each chapter builds upon the previous one, creating a cohesive narrative that takes the reader from problem identification through solution design, implementation, evaluation, and future directions. The structure ensures that both technical and non-technical readers can understand the project's significance, methodology, and contributions to recruitment technology.
