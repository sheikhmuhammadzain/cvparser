import os
import re
from datetime import datetime
from dateutil import parser
from django.core.files.storage import default_storage
from pdfminer.high_level import extract_text as pdf_extract_text
from docx import Document
import easyocr
from pdf2image import convert_from_path
import spacy

# Initialize EasyOCR reader
try:
    reader = easyocr.Reader(['en'])
except Exception as e:
    print(f"Failed to initialize EasyOCR: {str(e)}")
    reader = None

# Load spaCy model
try:
    nlp = spacy.load("en_core_web_sm")
except OSError as e:
    print(f"Failed to load spaCy model 'en_core_web_sm': {str(e)}")
    print("Please run 'python -m spacy download en_core_web_sm' to install the model.")
    nlp = None

def extract_text_from_file(file_path):
    """Extract text from uploaded file (PDF, DOCX, TXT, JPG, PNG, or JPEG)."""
    try:
        if not default_storage.exists(file_path):
            raise FileNotFoundError(f"File not found at {file_path}")

        ext = os.path.splitext(file_path)[1].lower()
        
        if ext == '.pdf':
            try:
                text = pdf_extract_text(file_path)
                if not text.strip() and reader:
                    pages = convert_from_path(file_path)
                    text = ""
                    for page in pages:
                        result = reader.readtext(page)
                        text += ' '.join([res[1] for res in result])
                return text
            except Exception as e:
                print(f"PDF extraction failed, trying fallback: {str(e)}")
                return pdf_extract_text(file_path)
                
        elif ext == '.docx':
            doc = Document(file_path)
            return '\n'.join([para.text for para in doc.paragraphs])
            
        elif ext == '.txt':
            with default_storage.open(file_path, 'r') as f:
                return f.read()
                
        elif ext in ('.jpg', '.jpeg', '.png'):
            if reader is None:
                raise Exception("EasyOCR not initialized for image processing")
            with default_storage.open(file_path, 'rb') as f:
                image_bytes = f.read()
            result = reader.readtext(image_bytes)
            return ' '.join([res[1] for res in result])
            
        else:
            raise ValueError(f"Unsupported file type: {ext}")
            
    except Exception as e:
        print(f"Error extracting text from {file_path}: {str(e)}")
        return None

def extract_entities(text):
    """Extract structured data using spaCy NER."""
    if nlp is None:
        print("spaCy model not loaded. Entity extraction unavailable.")
        return {'error': 'NLP model not available'}

    try:
        doc = nlp(text)
        entities = {
            'name': [],
            'education': [],
            'skills': [],
            'experience': [],
            'organizations': []
        }
        
        # Extract entities using spaCy
        for ent in doc.ents:
            if ent.label_ == "PERSON":
                entities['name'].append(ent.text)
            elif ent.label_ in ["ORG", "GPE"]:
                entities['organizations'].append(ent.text)
            elif ent.label_ == "DATE":
                # Capture date ranges like "July 2024 – Dec 2024"
                if "–" in ent.text or "-" in ent.text:
                    entities['experience'].append(ent.text)

        # Extract skills and education using keyword matching
        skill_keywords = {'python', 'java', 'sql', 'django', 'machine learning'}
        education_keywords = {'bachelor', 'master', 'phd', 'high school', 'degree'}
        
        for token in doc:
            if token.text.lower() in skill_keywords:
                entities['skills'].append(token.text)
            if token.text.lower() in education_keywords:
                entities['education'].append(token.text)

        # Deduplicate entities
        for key in entities:
            entities[key] = list(set(entities[key]))
            
        return entities
    except Exception as e:
        print(f"Error extracting entities: {str(e)}")
        return None

def check_experience(text, min_years):
    """Check if total experience meets minimum requirement by parsing date ranges."""
    try:
        # Regex to match date ranges like "July 2024 – Dec 2024" or "Dec 2024 – Present"
        date_range_pattern = r'([A-Za-z]+\s+\d{4})\s*[–-]\s*([A-Za-z]+\s+\d{4}|Present)'
        matches = re.findall(date_range_pattern, text, re.IGNORECASE)
        
        total_months = 0
        current_date = datetime.now()

        for start, end in matches:
            try:
                # Parse start date
                start_date = parser.parse(start, fuzzy=True)
                
                # Handle "Present" as current date
                if end.lower() == 'present':
                    end_date = current_date
                else:
                    end_date = parser.parse(end, fuzzy=True)
                
                # Calculate months of experience
                delta = (end_date.year - start_date.year) * 12 + end_date.month - start_date.month
                total_months += max(delta, 0)  # Ensure no negative months
            except ValueError as e:
                print(f"Error parsing date range {start} – {end}: {str(e)}")
                continue

        # Convert total months to years
        total_years = total_months / 12
        return total_years >= min_years
    except Exception as e:
        print(f"Error checking experience: {str(e)}")
        return False