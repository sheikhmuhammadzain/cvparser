# Chapter 3: Materials and Methods (Part 2)

## 3.5. Key Features Implementation

### 3.5.1. Resume Upload and Processing

The resume upload system represents the core data ingestion pipeline for CV Shortlister. Implementation involved multiple technical components working together seamlessly.

**Frontend Upload Interface:**

**Drag-and-Drop Component:**
```typescript
// React component with drag-and-drop functionality
<div 
  onDrop={handleDrop}
  onDragOver={handleDragOver}
  onDragLeave={handleDragLeave}
  className="border-2 border-dashed rounded-lg p-8"
>
  <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
  <p>Drag and drop files here, or click to browse</p>
  <input 
    type="file" 
    multiple 
    accept=".pdf,.docx,.txt,.jpg,.jpeg,.png"
    onChange={handleFileSelect}
  />
</div>
```

**Features:**
- Visual feedback during drag operations (border highlight)
- Support for multiple file selection
- File type validation before upload
- File size checking (5MB limit)
- Upload progress indicators
- Real-time status updates

**Multi-File Upload Logic:**
```typescript
const handleUpload = async (files: File[]) => {
  const formData = new FormData();
  files.forEach(file => formData.append('files', file));
  
  try {
    const response = await uploadCVs(formData);
    toast.success(`${response.processed}/${response.total} files processed`);
    refetchCVs(); // Refresh CV list
  } catch (error) {
    toast.error('Upload failed. Please try again.');
  }
};
```

**Backend Upload API:**

**Endpoint:** `POST /api/cvs/upload/`

**Request Format:**
- Content-Type: multipart/form-data
- Field name: "files" (array)
- Supports multiple files in single request

**Processing Pipeline:**

**Step 1: File Validation**
```python
ALLOWED_TYPES = ['.pdf', '.docx', '.txt', '.jpg', '.jpeg', '.png']
MAX_SIZE = 5 * 1024 * 1024  # 5MB

for file in request.FILES.getlist('files'):
    ext = os.path.splitext(file.name)[1].lower()
    
    if ext not in ALLOWED_TYPES:
        return error_response(f'Invalid file type: {ext}')
    
    if file.size > MAX_SIZE:
        return error_response(f'File too large: {file.size/1024/1024:.1f}MB')
```

**Step 2: File Storage**
```python
# Django handles file storage automatically
cv = CV.objects.create(file=file, status='Pending')
# File saved to media/cvs/ with unique hash
# Example: media/cvs/resume_abc123def456.pdf
```

**Step 3: Text Extraction**
```python
def extract_text_from_file(file_path: str) -> Optional[str]:
    """Extract text from PDF, DOCX, TXT, or image files."""
    ext = os.path.splitext(file_path)[1].lower()
    
    try:
        if ext == '.pdf':
            return extract_from_pdf(file_path)
        elif ext == '.docx':
            return extract_from_docx(file_path)
        elif ext == '.txt':
            return extract_from_txt(file_path)
        elif ext in ['.jpg', '.jpeg', '.png']:
            return extract_from_image(file_path)
        else:
            return None
    except Exception as e:
        logger.error(f"Text extraction failed: {e}")
        return None
```

**PDF Extraction:**
```python
def extract_from_pdf(file_path: str) -> str:
    """Extract text from PDF using PyPDF2."""
    text = []
    
    with open(file_path, 'rb') as file:
        pdf_reader = PyPDF2.PdfReader(file)
        
        for page_num in range(len(pdf_reader.pages)):
            page = pdf_reader.pages[page_num]
            page_text = page.extract_text()
            if page_text:
                text.append(page_text)
    
    return ' '.join(text)
```

**DOCX Extraction:**
```python
def extract_from_docx(file_path: str) -> str:
    """Extract text from Word document using python-docx."""
    doc = docx.Document(file_path)
    text = []
    
    for paragraph in doc.paragraphs:
        if paragraph.text.strip():
            text.append(paragraph.text)
    
    # Extract text from tables as well
    for table in doc.tables:
        for row in table.rows:
            for cell in row.cells:
                if cell.text.strip():
                    text.append(cell.text)
    
    return '\n'.join(text)
```

**Image OCR Extraction:**
```python
def extract_from_image(file_path: str) -> str:
    """Extract text from image using Tesseract OCR."""
    try:
        image = Image.open(file_path)
        
        # Preprocess image for better OCR accuracy
        # Convert to grayscale
        image = image.convert('L')
        
        # Apply OCR
        text = pytesseract.image_to_string(image)
        
        return text
    except Exception as e:
        logger.error(f"OCR failed: {e}")
        return ""
```

**Step 4: Performance Tracking**
```python
start_time = time.perf_counter()

# Process resume
text = extract_text_from_file(cv.file.path)
entities = extract_entities(text)

# Calculate processing time
processing_time = time.perf_counter() - start_time
cv.processing_time = round(processing_time, 3)
cv.processed_at = timezone.now()
```

**Response Format:**
```json
{
  "processed": 3,
  "total": 3,
  "results": [
    {
      "name": "john_doe_resume.pdf",
      "success": true,
      "cv": {
        "id": 15,
        "file": "/media/cvs/john_doe_resume_xyz789.pdf",
        "uploaded_at": "2025-02-01T10:30:00Z",
        "status": "Processed",
        "processing_time": 1.42
      }
    },
    {
      "name": "corrupted_file.pdf",
      "success": false,
      "error": "Processing failed: Invalid PDF structure"
    }
  ]
}
```

---

### 3.5.2. Entity Extraction and Skill Detection

Entity extraction transforms unstructured resume text into structured, searchable data. The system identifies skills, education levels, experience, and keywords.

**Entity Extraction Function:**

```python
def extract_entities(text: str) -> dict:
    """Extract structured entities from resume text."""
    if not text:
        return {}
    
    text_lower = text.lower()
    
    entities = {
        'skills': extract_skills(text_lower),
        'education': extract_education(text_lower),
        'experience': extract_experience(text),
        'keywords': extract_keywords(text_lower)
    }
    
    return entities
```

**Skills Extraction:**

**Approach:** Keyword matching with comprehensive skill dictionary

```python
SKILL_KEYWORDS = {
    # Programming Languages
    'python', 'javascript', 'java', 'typescript', 'c++', 'c#', 'ruby', 
    'php', 'swift', 'kotlin', 'go', 'rust', 'sql',
    
    # Web Technologies
    'html', 'css', 'react', 'angular', 'vue', 'node.js', 'django', 
    'flask', 'fastapi', 'express', 'next.js', 'tailwind',
    
    # Databases
    'postgresql', 'mysql', 'mongodb', 'redis', 'elasticsearch',
    
    # Cloud & DevOps
    'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'ci/cd', 'jenkins',
    
    # Data Science & ML
    'machine learning', 'deep learning', 'tensorflow', 'pytorch', 
    'pandas', 'numpy', 'data analysis', 'nlp', 'computer vision',
    
    # Soft Skills
    'leadership', 'communication', 'teamwork', 'project management',
    'agile', 'scrum'
}

def extract_skills(text: str) -> list:
    """Extract skills from text using keyword matching."""
    found_skills = []
    
    for skill in SKILL_KEYWORDS:
        # Use word boundaries to avoid false matches
        # e.g., "react" shouldn't match "reaction"
        pattern = r'\b' + re.escape(skill) + r'\b'
        if re.search(pattern, text, re.IGNORECASE):
            found_skills.append(skill)
    
    return list(set(found_skills))  # Remove duplicates
```

**Education Extraction:**

```python
EDUCATION_PATTERNS = {
    'phd': [r'\bph\.?d\b', r'\bdoctorate\b', r'\bdoctoral\b'],
    'master': [r'\bmaster[\'s]?\b', r'\bm\.?s\b', r'\bmsc\b', r'\bmba\b'],
    'bachelor': [r'\bbachelor[\'s]?\b', r'\bb\.?s\b', r'\bbs\b', r'\bba\b', r'\bbsc\b'],
    'intermediate': [r'\bintermediate\b', r'\bhigher secondary\b', r'\bf\.?sc\b', r'\bi\.?cs\b']
}

def extract_education(text: str) -> list:
    """Extract education levels from text."""
    education_found = []
    
    for level, patterns in EDUCATION_PATTERNS.items():
        for pattern in patterns:
            if re.search(pattern, text, re.IGNORECASE):
                education_found.append(level)
                break  # Found this level, move to next
    
    return education_found
```

**Experience Extraction:**

```python
def extract_experience(text: str) -> list:
    """Extract years of experience from text."""
    experience_patterns = [
        r'(\d+)\+?\s*(?:years?|yrs?)(?:\s+of)?\s+experience',
        r'experience\s*:?\s*(\d+)\+?\s*(?:years?|yrs?)',
        r'(\d+)\+?\s*(?:years?|yrs?)\s+in',
    ]
    
    years = []
    
    for pattern in experience_patterns:
        matches = re.findall(pattern, text, re.IGNORECASE)
        years.extend([int(match) for match in matches])
    
    # Return unique years found
    return list(set(years)) if years else []
```

**Keyword Extraction:**

```python
RELEVANT_KEYWORDS = [
    'leadership', 'team', 'agile', 'scrum', 'communication',
    'api', 'microservices', 'rest', 'restful', 'design patterns',
    'cloud', 'devops', 'testing', 'ci/cd', 'deployment'
]

def extract_keywords(text: str) -> list:
    """Extract relevant keywords from text."""
    found_keywords = []
    
    for keyword in RELEVANT_KEYWORDS:
        if keyword in text:
            found_keywords.append(keyword)
    
    return found_keywords
```

**Persisting Entities:**

After extraction, entities are stored in the CV model:

```python
cv.extracted_text = text
cv.entities = extract_entities(text)

# Also populate top_skills for statistics
skills = cv.entities.get('skills', [])
cv.top_skills = [s.lower() for s in skills if isinstance(s, str)]

cv.status = 'Processed'
cv.save()
```

**Challenges and Solutions:**

**Challenge 1: Ambiguous Skill Names**
- Problem: "Java" could refer to programming language or Indonesian island
- Solution: Use contextual keywords (e.g., "Java programming", "Java developer")

**Challenge 2: Varying Terminology**
- Problem: "JS" vs. "JavaScript", "ML" vs. "Machine Learning"
- Solution: Include synonyms and abbreviations in skill dictionary

**Challenge 3: False Positives**
- Problem: Common words matching skills (e.g., "go" as verb vs. Go language)
- Solution: Word boundary matching, contextual filtering

---

### 3.5.3. Advanced Filtering and Ranking System

The filtering system allows recruiters to search CVs based on multiple criteria and automatically ranks candidates by relevance.

**Frontend Filter Interface:**

**Multi-Select Dropdowns:**
```typescript
// Skills multi-select with 20+ predefined options
const skillOptions: Option[] = [
  { label: 'Python', value: 'python' },
  { label: 'JavaScript', value: 'javascript' },
  { label: 'React', value: 'react' },
  { label: 'Django', value: 'django' },
  // ... more skills
];

<MultiSelect
  options={skillOptions}
  value={selectedSkills}
  onChange={setSelectedSkills}
  placeholder="Select required skills"
/>
```

**Education Selector:**
```typescript
<Select value={education} onValueChange={setEducation}>
  <SelectTrigger>
    <SelectValue placeholder="Select education level" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="Intermediate">Intermediate</SelectItem>
    <SelectItem value="Bachelor">Bachelor's</SelectItem>
    <SelectItem value="Master">Master's</SelectItem>
    <SelectItem value="PhD">PhD</SelectItem>
  </SelectContent>
</Select>
```

**Experience Selector:**
```typescript
// Years 0-15+
<Select value={experience} onValueChange={setExperience}>
  {[...Array(16)].map((_, i) => (
    <SelectItem key={i} value={String(i)}>
      {i} {i === 1 ? 'year' : 'years'}
    </SelectItem>
  ))}
</Select>
```

**Default Filter Values:**

To improve user experience, filters come pre-populated with common requirements:
```typescript
const [education, setEducation] = useState('Bachelor');
const [skills, setSkills] = useState(['python', 'react', 'django']);
const [experience, setExperience] = useState('2');
const [keywords, setKeywords] = useState(['api', 'team']);
```

**Backend Filtering Logic:**

**Endpoint:** `POST /api/cvs/filter/`

**Request Payload:**
```json
{
  "education": "Bachelor",
  "skills": ["python", "react", "django"],
  "experience": "2",
  "keywords": ["api", "team"]
}
```

**Filtering Algorithm:**

```python
def post(self, request):
    # Parse filter criteria
    education = request.data.get('education', '').strip().lower()
    skills = request.data.get('skills', [])
    experience = request.data.get('experience', '')
    keywords = request.data.get('keywords', [])
    
    # Normalize inputs
    skills_list = [s.lower() for s in skills if isinstance(s, str)]
    keywords_list = [k.lower() for k in keywords if isinstance(k, str)]
    
    # Retrieve all processed CVs
    cvs = CV.objects.filter(status='Processed')
    
    shortlisted = []
    
    for cv in cvs:
        text = (cv.extracted_text or '').lower()
        entities = cv.entities or {}
        
        # Initialize match tracking
        matches = {
            'education': False,
            'skills': 0,
            'experience': False,
            'keywords': 0
        }
        
        # Check education match
        if education:
            matches['education'] = (
                education in text or
                any(education in (e or '').lower() 
                    for e in entities.get('education', []))
            )
        else:
            matches['education'] = True  # No filter = match
        
        # Count skill matches
        if skills_list:
            text_skills = sum(1 for s in skills_list if s in text)
            entity_skills = sum(
                1 for s in skills_list 
                if s in [sk.lower() for sk in entities.get('skills', [])]
            )
            matches['skills'] = max(text_skills, entity_skills)
        else:
            matches['skills'] = 1  # No filter = match
        
        # Check experience match
        if experience:
            try:
                exp_years = float(experience)
                matches['experience'] = check_experience(text, exp_years)
            except ValueError:
                matches['experience'] = False
        else:
            matches['experience'] = True
        
        # Count keyword matches
        if keywords_list:
            matches['keywords'] = sum(1 for k in keywords_list if k in text)
        else:
            matches['keywords'] = 1
        
        # Calculate total score
        score = (
            (2 if matches['education'] else 0) +
            matches['skills'] +
            (3 if matches['experience'] else 0) +
            (0.5 * matches['keywords'])
        )
        
        # Include if any positive score
        if score > 0:
            shortlisted.append({
                'cv': CVSerializer(cv).data,
                'score': score,
                'matches': matches
            })
    
    # Sort by score (highest first)
    shortlisted = sorted(shortlisted, key=lambda x: x['score'], reverse=True)
    
    return Response({
        'count': len(shortlisted),
        'results': shortlisted
    })
```

**Scoring Weights Rationale:**

- **Education (2 points):** Reflects importance of formal qualifications
- **Skills (1 point each):** Direct relevance to job requirements
- **Experience (3 points):** Weighted highest as experience is often most critical
- **Keywords (0.5 points each):** Secondary indicators of fit

**Experience Checking Helper:**

```python
def check_experience(text: str, required_years: float) -> bool:
    """Check if resume indicates required years of experience."""
    patterns = [
        r'(\d+)\+?\s*(?:years?|yrs?)(?:\s+of)?\s+experience',
        r'experience\s*:?\s*(\d+)\+?\s*(?:years?|yrs?)',
    ]
    
    for pattern in patterns:
        matches = re.findall(pattern, text, re.IGNORECASE)
        for match in matches:
            try:
                years = float(match)
                if years >= required_years:
                    return True
            except ValueError:
                continue
    
    return False
```

**Response Format:**

```json
{
  "count": 7,
  "results": [
    {
      "cv": {
        "id": 15,
        "file": "/media/cvs/john_doe.pdf",
        "uploaded_at": "2025-02-01T10:30:00Z",
        "status": "Processed"
      },
      "score": 7.0,
      "matches": {
        "education": true,
        "skills": 3,
        "experience": true,
        "keywords": 2
      }
    }
  ]
}
```

---

### 3.5.4. Statistics and Analytics Dashboard

The statistics dashboard provides recruiters with insights into their candidate pool and system performance.

**Metrics Tracked:**

1. **Total CVs Uploaded:** Overall volume of applications
2. **Processed CVs:** Successfully parsed resumes
3. **Pending CVs:** Awaiting processing
4. **Failed CVs:** Processing errors
5. **Processing Progress:** Percentage of completed processing
6. **Average Processing Time:** System performance metric
7. **Top Skills:** Most common skills across all candidates

**Backend Statistics API:**

**Endpoint:** `GET /api/cvs/stats/`

**Implementation:**

```python
class CVStatsAPIView(APIView):
    def get(self, request):
        # Calculate basic counts
        total_cvs = CV.objects.count()
        processed_cvs = CV.objects.filter(status='Processed').count()
        pending_cvs = CV.objects.filter(status='Pending').count()
        failed_cvs = CV.objects.filter(status='Failed').count()
        
        # Calculate processing progress percentage
        processing_progress = (
            (processed_cvs / total_cvs * 100) if total_cvs > 0 else 0.0
        )
        
        # Calculate average processing time
        processed_with_time = CV.objects.filter(
            status='Processed',
            processing_time__isnull=False
        )
        avg_time = (
            processed_with_time.aggregate(Avg('processing_time'))
            ['processing_time__avg']
            if processed_with_time.exists() else 0.0
        )
        
        # Aggregate top skills
        skill_counter = Counter()
        for cv in CV.objects.filter(status='Processed'):
            skills = cv.top_skills or []
            for skill in skills:
                if isinstance(skill, str):
                    skill_counter[skill.lower()] += 1
        
        top_skills = [
            {'skill': skill, 'count': count}
            for skill, count in skill_counter.most_common(5)
        ]
        
        return Response({
            'total_cvs': total_cvs,
            'processed_cvs': processed_cvs,
            'pending_cvs': pending_cvs,
            'failed_cvs': failed_cvs,
            'processing_progress': round(processing_progress, 1),
            'avg_processing_time': round(avg_time, 2) if avg_time else 0.0,
            'top_skills': top_skills
        })
```

**Frontend Statistics Display:**

**Metric Cards:**
```typescript
<Card>
  <CardHeader>
    <CardTitle>Total CVs</CardTitle>
  </CardHeader>
  <CardContent>
    <div className="text-4xl font-bold text-primary">
      {stats.total_cvs}
    </div>
  </CardContent>
</Card>
```

**Top Skills Chart:**
```typescript
<div className="space-y-2">
  {stats.top_skills.map((item) => (
    <div key={item.skill} className="flex items-center gap-3">
      <div className="flex-1">
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium capitalize">
            {item.skill}
          </span>
          <span className="text-sm text-muted-foreground">
            {item.count}
          </span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div 
            className="bg-primary h-2 rounded-full"
            style={{
              width: `${(item.count / maxCount) * 100}%`
            }}
          />
        </div>
      </div>
    </div>
  ))}
</div>
```

This completes Part 2 of the Methodology chapter. The next file will cover UI design, security, testing, and deployment.
