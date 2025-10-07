import threading
import logging
from .models import CV
from .utils import extract_text_from_file, extract_entities

def process_cv(cv_id):
    """Process CV file in a separate thread."""
    try:
        cv = CV.objects.get(id=cv_id)
        text = extract_text_from_file(cv.file.path)
        if text:
            cv.extracted_text = text
            cv.entities = extract_entities(text)
            cv.save()
            print(f"CV {cv_id} processed successfully.")
    except Exception as e:
        print(f"Error processing CV {cv_id}: {str(e)}")

def start_cv_processing(cv_id):
    """Start CV processing in a background thread."""
    thread = threading.Thread(target=process_cv, args=(cv_id,))
    thread.start()  # Start the thread
    print(f"Started processing CV {cv_id} in background thread.")