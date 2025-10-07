# Chapter 3: Materials and Methods (Part 3)

### 3.5.5. User Interface Design

The frontend user interface was designed following modern UI/UX principles to ensure accessibility, usability, and visual appeal.

**Design System:**

**Color Palette:**
- **Primary Blue:** `hsl(214, 100%, 58%)` - Primary actions, links, focus states
- **Background:** `hsl(0, 0%, 99.2%)` - Main background (light mode)
- **Foreground:** `hsl(0, 0%, 0%)` - Primary text color
- **Muted:** `hsl(0, 0%, 96%)` - Secondary backgrounds
- **Accent:** `hsl(222, 100%, 94%)` - Highlighted elements
- **Success:** Green tones for "Processed" status
- **Warning:** Orange tones for "Pending" status
- **Destructive:** Red tones for "Failed" status

**Typography:**
- **Font Family:** Plus Jakarta Sans (Google Fonts)
- **Weights:** 300 (Light), 400 (Regular), 500 (Medium), 600 (SemiBold), 700 (Bold), 800 (ExtraBold)
- **Hierarchy:**
  - H1: 2.25rem (36px) - Page titles
  - H2: 1.875rem (30px) - Section headings
  - H3: 1.5rem (24px) - Card titles
  - Body: 1rem (16px) - Standard text
  - Small: 0.875rem (14px) - Metadata, labels

**Component Library:**

Leveraging **shadcn/ui** components ensured consistency and accessibility:

**Button Component:**
```typescript
<Button 
  variant="default" // or outline, ghost, destructive
  size="default"    // or sm, lg, icon
  onClick={handleClick}
>
  Action Text
</Button>
```

**Card Component:**
```typescript
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>
    {/* Main content */}
  </CardContent>
  <CardFooter>
    {/* Actions */}
  </CardFooter>
</Card>
```

**Select/Dropdown:**
```typescript
<Select value={value} onValueChange={setValue}>
  <SelectTrigger>
    <SelectValue placeholder="Select option" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option1">Option 1</SelectItem>
    <SelectItem value="option2">Option 2</SelectItem>
  </SelectContent>
</Select>
```

**Page Layouts:**

**Landing Page:**
- Hero section with project title and description
- Features showcase (3-column grid)
- Statistics overview
- Call-to-action buttons
- Responsive: Stacks vertically on mobile

**Dashboard Layout:**
- Sidebar navigation (collapsible on mobile)
- Main content area
- Breadcrumb navigation
- Header with page title
- Consistent across all authenticated pages

**CV List Page:**
- Search bar at top
- Grid of CV cards (responsive: 3 cols → 2 cols → 1 col)
- Each card shows:
  - File name (truncated with tooltip)
  - Status badge
  - Upload date
  - Processing time (if completed)
  - "View Details" button
- Empty state message when no CVs

**Upload Page:**
- Large drag-and-drop zone
- File type and size guidance
- Upload progress indicator
- List of uploaded files with individual status
- Success/error messages

**Filter Page:**
- Filter form with dropdowns at top
- "Search Candidates" button
- Results section:
  - Count of matching CVs
  - Ranked list with score badges
  - Match details (education, skills, experience, keywords)
  - Color-coded match indicators
  - Direct links to CV details

**Statistics Dashboard:**
- 4 metric cards at top (Total, Processed, Pending, Failed)
- Processing progress bar
- Average processing time display
- Top Skills bar chart
- Responsive grid layout

**Responsive Design Strategy:**

**Breakpoints:**
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

**Mobile Optimizations:**
- Hamburger menu for navigation
- Single-column layouts
- Touch-friendly button sizes (min 44x44px)
- Reduced padding/margins
- Simplified data tables

**Accessibility Features:**

**Keyboard Navigation:**
- Tab order follows logical flow
- Focus indicators on all interactive elements
- Escape key closes modals/dropdowns
- Enter/Space activates buttons

**Screen Reader Support:**
- Semantic HTML (nav, main, article, section)
- ARIA labels for icon-only buttons
- Alt text for images
- Live regions for dynamic updates

**Color Contrast:**
- All text meets WCAG AA standards (4.5:1 minimum)
- Status badges use darker text on light backgrounds
- Focus indicators have 3:1 contrast ratio

**Loading States:**

**Skeleton Screens:**
```typescript
{isLoading ? (
  <div className="space-y-4">
    {[...Array(3)].map((_, i) => (
      <Skeleton key={i} className="h-32 w-full" />
    ))}
  </div>
) : (
  <CVList cvs={data} />
)}
```

**Spinners:**
- Used for button actions
- Centered on page for full-page loads
- With descriptive text ("Processing...")

**Toast Notifications:**

Using **sonner** library for user feedback:
```typescript
toast.success('CVs uploaded successfully!');
toast.error('Upload failed. Please try again.');
toast.info('Processing resumes...');
```

**Dark Mode Support:**

CSS variables enable easy theme switching:
```css
.dark {
  --background: 0 0% 3.9%;
  --foreground: 0 0% 98%;
  /* ... other dark mode colors */
}
```

---

## 3.6. Security and Data Protection

Security measures implemented to protect user data and system integrity:

**Input Validation:**

**File Upload Validation:**
```python
# File type whitelist
ALLOWED_TYPES = ['.pdf', '.docx', '.txt', '.jpg', '.jpeg', '.png']

# File size limit
MAX_SIZE = 5 * 1024 * 1024  # 5MB

# Validation logic
if ext not in ALLOWED_TYPES:
    return Response({'error': 'Invalid file type'}, status=400)

if file.size > MAX_SIZE:
    return Response({'error': 'File too large'}, status=400)
```

**API Input Sanitization:**
```python
# Sanitize filter inputs
education = request.data.get('education', '').strip().lower()
skills = [s.strip().lower() for s in skills if isinstance(s, str)]

# Validate experience is numeric
try:
    exp_years = float(experience)
except ValueError:
    return Response({'error': 'Invalid experience value'}, status=400)
```

**CORS Configuration:**

```python
# settings.py
CORS_ALLOWED_ORIGINS = [
    'http://localhost:5173',  # Development frontend
    'http://localhost:3000',
    # Add production domain when deployed
]

CORS_ALLOW_CREDENTIALS = True
```

**Secure File Storage:**

```python
# Media files stored outside web root
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
MEDIA_URL = '/media/'

# Django handles file naming with random hash
# Prevents filename collisions and exposure
```

**SQL Injection Prevention:**

Django ORM automatically parameterizes queries:
```python
# Safe - ORM handles escaping
CV.objects.filter(status='Processed')

# Avoid raw SQL unless necessary
# If needed, use parameterized queries:
CV.objects.raw('SELECT * FROM cv WHERE status = %s', ['Processed'])
```

**XSS Prevention:**

React automatically escapes rendered content:
```typescript
// Safe - React escapes by default
<h3>{cv.file}</h3>

// For raw HTML (avoid unless necessary):
<div dangerouslySetInnerHTML={{__html: sanitizedHtml}} />
```

**Error Handling:**

**Backend:**
```python
try:
    text = extract_text_from_file(cv.file.path)
    cv.extracted_text = text
    cv.status = 'Processed'
except Exception as e:
    logger.error(f"Processing failed for CV {cv.id}: {e}")
    cv.status = 'Failed'
    # Don't expose internal error details to client
    return Response({'error': 'Processing failed'}, status=500)
finally:
    cv.save()
```

**Frontend:**
```typescript
try {
  await uploadCVs(formData);
  toast.success('Upload successful');
} catch (error) {
  console.error('Upload error:', error);
  toast.error('Upload failed. Please try again.');
}
```

**Data Privacy:**

- No collection of personally identifiable information beyond resumes
- Resume data stored locally (not sent to third parties)
- No tracking or analytics implemented
- Users should be informed about data usage in privacy policy

**Future Security Enhancements:**

- User authentication and authorization
- Role-based access control (RBAC)
- Resume encryption at rest
- Audit logging of data access
- Rate limiting on API endpoints
- HTTPS enforcement in production
- Content Security Policy (CSP) headers

---

## 3.7. Testing and Quality Assurance

**Testing Strategy:**

**Manual Testing:**

**Unit Testing (Backend):**
```python
# Example test for entity extraction
class EntityExtractionTests(TestCase):
    def test_skill_extraction(self):
        text = "Proficient in Python, React, and Django"
        entities = extract_entities(text)
        
        self.assertIn('python', entities['skills'])
        self.assertIn('react', entities['skills'])
        self.assertIn('django', entities['skills'])
    
    def test_education_extraction(self):
        text = "Bachelor of Science in Computer Science"
        entities = extract_entities(text)
        
        self.assertIn('bachelor', entities['education'])
```

**API Testing:**

Using **Postman** for manual API testing:

**Test Cases:**
1. Upload single PDF resume
2. Upload multiple files simultaneously
3. Upload invalid file type (should reject)
4. Upload oversized file (should reject)
5. Filter CVs with various criteria combinations
6. Retrieve CV list with no CVs (empty state)
7. Get statistics with zero CVs
8. Get statistics with processed CVs

**Frontend Testing:**

**Component Testing:**
- Verify all buttons clickable and functional
- Test form validation
- Check dropdown selections
- Verify responsive layouts at different screen sizes
- Test keyboard navigation
- Validate accessibility with screen reader

**Integration Testing:**

**End-to-End Workflows:**

**Workflow 1: Upload and View CV**
1. Navigate to Upload page
2. Select CV file
3. Click Upload
4. Verify success message
5. Navigate to CV List
6. Verify CV appears with "Processed" status
7. Click "View Details"
8. Verify extracted information displayed

**Workflow 2: Filter and Rank**
1. Upload 5+ CVs with varying skills
2. Navigate to Filter page
3. Select specific skills
4. Click "Search Candidates"
5. Verify results ranked by score
6. Verify match indicators accurate

**Workflow 3: Statistics**
1. Upload 10+ CVs
2. Navigate to Statistics page
3. Verify counts accurate
4. Verify top skills displayed
5. Verify processing progress percentage

**Performance Testing:**

**Metrics Measured:**
- Resume processing time (target: < 2 seconds)
- API response time (target: < 500ms)
- Page load time (target: < 2 seconds)
- Concurrent user support (target: 50+ users)

**Performance Test Results:**
- Average PDF processing: 1.2 seconds
- Average DOCX processing: 0.8 seconds
- API filter endpoint: 250ms average
- Dashboard load: 1.5 seconds

**Usability Testing:**

**Test Participants:** 3 HR professionals, 2 non-technical users

**Tasks Given:**
1. Upload a resume
2. Find all candidates with Python skills
3. View statistics dashboard
4. Identify top 3 candidates for a job description

**Findings:**
- 4/5 users completed all tasks without assistance
- Average task completion time: 3.5 minutes
- Positive feedback on clean UI design
- Suggestion: Add keyboard shortcuts (noted for future)

**Bug Tracking:**

**Common Issues Found and Fixed:**
1. **CV name overflow** - Fixed with truncation and tooltip
2. **Status badge contrast** - Adjusted text colors for accessibility
3. **Filter returning only 1 result** - Changed AND logic to score-based ranking
4. **Top skills not displaying** - Added fallback aggregation from entities
5. **Mobile navigation issues** - Improved responsive sidebar

---

## 3.8. Deployment Strategy

**Development Environment:**

```bash
# Backend setup
cd server
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver

# Frontend setup
cd client
bun install  # or npm install
bun run dev  # or npm run dev
```

**Production Deployment Plan:**

**Backend Deployment (Django):**

**Option 1: Traditional VPS (DigitalOcean, Linode)**
```bash
# Install dependencies
sudo apt update
sudo apt install python3 python3-pip nginx postgresql

# Setup application
git clone <repository>
cd server
pip install -r requirements.txt
python manage.py migrate
python manage.py collectstatic

# Configure Gunicorn
gunicorn cv_shortlister.wsgi:application --bind 0.0.0.0:8000

# Configure Nginx as reverse proxy
# Setup SSL with Let's Encrypt
```

**Option 2: Platform-as-a-Service (Heroku, Railway)**
```yaml
# Procfile
web: gunicorn cv_shortlister.wsgi
release: python manage.py migrate
```

**Frontend Deployment:**

**Option 1: Vercel / Netlify**
```bash
# Build command
bun run build

# Output directory
dist/

# Environment variables
VITE_API_URL=https://api.cvshortlister.com
```

**Option 2: Static hosting (GitHub Pages, S3)**
```bash
# Build for production
bun run build

# Deploy dist/ folder
```

**Environment Configuration:**

**Backend `.env`:**
```
DEBUG=False
SECRET_KEY=<secure-random-key>
ALLOWED_HOSTS=api.cvshortlister.com,www.cvshortlister.com
DATABASE_URL=postgresql://user:pass@host:5432/dbname
CORS_ALLOWED_ORIGINS=https://cvshortlister.com
```

**Frontend `.env`:**
```
VITE_API_URL=https://api.cvshortlister.com/api
```

**Database Migration:**

```bash
# Backup SQLite data
python manage.py dumpdata > backup.json

# Setup PostgreSQL
createdb cvshortlister

# Update settings.py for PostgreSQL
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'cvshortlister',
        'USER': 'dbuser',
        'PASSWORD': 'dbpass',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}

# Migrate
python manage.py migrate
python manage.py loaddata backup.json
```

**Continuous Integration/Deployment:**

**GitHub Actions Workflow:**
```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to production
        run: |
          # Build and deploy commands
```

**Monitoring:**

**Planned Monitoring Tools:**
- **Sentry:** Error tracking and monitoring
- **LogRocket:** Frontend session replay
- **Uptime monitoring:** Pingdom or UptimeRobot
- **Application metrics:** Django Debug Toolbar (dev only)

---

This completes the Methodology chapter covering all aspects of system design, implementation, security, testing, and deployment.
