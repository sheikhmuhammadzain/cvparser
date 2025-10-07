## Smart AI-Based Resume Parser

### Overview
The **Smart AI-Based Resume Parser** is a Django-powered web application designed to automate and enhance the resume screening process. Leveraging advanced Artificial Intelligence (AI) and Natural Language Processing (NLP) techniques, it extracts structured data—such as skills, experience, education, and personal details—from resumes in various formats. The system enables precise candidate shortlisting by matching resumes to job requirements, reducing processing time, minimizing bias, and improving recruitment efficiency.

---

### Features

- **Multi-Format Resume Upload:** Supports PDF, DOCX, TXT, and scanned documents (JPG, PNG, JPEG).
- **AI-Driven Parsing:** Utilizes Named Entity Recognition (NER) and contextual analysis to extract structured data.
- **Advanced Filtering:** Filters candidates based on:
  - Education Level (e.g., Bachelor, Master, PhD)
  - Minimum Experience (calculated from date ranges like "July 2024 – Dec 2024" or "Dec 2024 – Present")
  - Skills (selectable from dropdown)
  - Keywords (for contextual matching)
- **Candidate Ranking:** Scores and ranks resumes based on relevance to job criteria.
- **Bias Mitigation:** Reduces human bias through automated, data-driven shortlisting.
- **User-Friendly Interface:** Modern, responsive design with AOS animations and toast notifications.
- **Scalable Architecture:** Built for easy integration with HR systems and large-scale recruitment pipelines.

---

### Installation

#### Prerequisites
Ensure the following are installed on your system:

- Python 3.8+
- Django 4.x
- Git
- A virtual environment tool (e.g., `venv`)

#### Steps

1. **Clone the Repository:**
```bash
git clone https://github.com/obaidullah72/smart-ai-resume-parser.git
cd smart-ai-resume-parser
```

2. **Set Up a Virtual Environment:**
```bash
python -m venv env
source env/bin/activate  # On Windows: env\Scripts\activate
```

3. **Install Dependencies:**
```bash
pip install -r requirements.txt
```

4. **Install NLP Models:**
```bash
python -m spacy download en_core_web_sm
```

5. **Apply Database Migrations:**
```bash
cd server
python manage.py migrate
```

6. **Start the Development Server:**
```bash
python manage.py runserver
```

7. **Access the Application:**
Open your browser and go to: [http://127.0.0.1:8000/](http://127.0.0.1:8000/)

---

### Frontend Setup

The frontend is a modern React application built with **Vite**, **TypeScript**, **TailwindCSS**, and **shadcn/ui** components.

#### Prerequisites
Ensure the following are installed on your system:

- Node.js 18+ (or Bun)
- npm, yarn, or bun package manager

#### Steps

1. **Navigate to the Client Directory:**
```bash
cd client
```

2. **Install Dependencies:**

Using npm:
```bash
npm install
```

Using yarn:
```bash
yarn install
```

Using bun:
```bash
bun install
```

3. **Configure Environment Variables:**

Create a `.env.development` file in the `client` folder (if not present) with:
```env
VITE_API_URL=http://127.0.0.1:8000
```

For production, create a `.env.production` file with your production API URL.

4. **Start the Development Server:**

Using npm:
```bash
npm run dev
```

Using yarn:
```bash
yarn dev
```

Using bun:
```bash
bun run dev
```

5. **Access the Frontend:**
Open your browser and go to: [http://localhost:5173/](http://localhost:5173/)

6. **Build for Production:**

Using npm:
```bash
npm run build
```

Using yarn:
```bash
yarn build
```

Using bun:
```bash
bun run build
```

The production build will be generated in the `dist/` folder.

7. **Preview Production Build:**
```bash
npm run preview
```

#### Frontend Tech Stack
- **React 18** - UI library
- **Vite** - Fast build tool and dev server
- **TypeScript** - Type-safe JavaScript
- **TailwindCSS** - Utility-first CSS framework
- **shadcn/ui** - Reusable component library
- **React Router** - Client-side routing
- **TanStack Query** - Data fetching and caching
- **React Hook Form** - Form management
- **Zod** - Schema validation
- **Lucide React** - Icon library
- **Recharts** - Data visualization

---

### Usage

#### Uploading Resumes
- Visit `/upload` to upload one or multiple resumes.
- Supported formats: PDF, DOCX, TXT, JPG, PNG, JPEG.
- Extracted data includes skills, experience, education, etc.
- Toast notifications display success or errors.

#### Viewing Uploaded Resumes
- Visit `/cv_list` to view uploaded resumes.
- Each entry includes file name, upload date, status (Processed/Pending), and actions to view/download.

#### Filtering and Ranking Candidates
- Visit `/filter` to specify job criteria:
  - Education level
  - Minimum experience (e.g., 1.5 years)
  - Up to 5 skills
  - Comma-separated keywords
- View results at `/results`, including candidate rankings and toast messages.

---

### Project Structure
```
smart-ai-resume-parser/
├── env/                     # Virtual environment
├── server/                  # Django project
│   ├── cv_shortlister/      # Main Django app
│   │   ├── migrations/      # Database migrations
│   │   ├── templatetags/    # Custom template tags
│   │   ├── __init__.py
│   │   ├── admin.py
│   │   ├── apps.py
│   │   ├── models.py        # CV database model
│   │   ├── tests.py
│   │   ├── urls.py
│   │   ├── utils.py         # NLP functions
│   │   ├── views.py
│   ├── server/              # Django settings
│   │   ├── settings.py
│   │   ├── urls.py
│   │   ├── asgi.py
│   │   ├── wsgi.py
├── media/                   # Uploaded files
├── templates/               # HTML templates
│   ├── cv_list.html
│   ├── filter.html
│   ├── index.html
│   ├── results.html
│   ├── upload.html
├── db.sqlite3
├── manage.py
├── model-install.txt
├── README.md
├── requirements.txt
```

---

### Dependencies
Install using:
```bash
pip install -r requirements.txt
```

**Core Packages:**
- `django` - Web framework
- `python-docx` - DOCX parsing
- `pdfminer.six` - PDF text extraction
- `easyocr` - OCR for scanned resumes
- `pdf2image` - PDF to image conversion
- `spacy` - NLP/NER engine
- `python-dateutil` - Flexible date parsing

**Additional Requirements:**
- Install poppler for `pdf2image` to work properly (check platform-specific instructions).

---

### License
MIT License. See `LICENSE` file for details.

---

### Contributing
We welcome contributions!

Steps:
1. Fork the repo
2. Create your branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -m "Add your feature"`
4. Push: `git push origin feature/your-feature`
5. Open a pull request

Report bugs or request features via [GitHub Issues](https://github.com/obaidullah72/smart-ai-resume-parser/issues).

---

### Contact
**Email:** obaidullah3372@gmail.com  
**GitHub:** [obaidullah72](https://github.com/obaidullah72)

---

### Acknowledgments
Built using Django, spaCy, and EasyOCR for robust AI parsing.
Inspired by the need to modernize and streamline recruitment through AI.
