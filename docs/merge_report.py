"""
CV Shortlister Final Report Merger
This script merges all separate markdown report files into a single complete document.
"""

import os
from pathlib import Path

# Define the order of files to merge
REPORT_FILES = [
    '01-front-matter.md',
    '02-table-of-contents.md',
    '03-abstract-and-introduction.md',
    '04-literature-review.md',
    '05-methodology-part1.md',
    '05-methodology-part2.md',
    '05-methodology-part3.md',
    '06-results-and-discussion.md',
    '07-conclusion-and-future-work.md',
    '08-references.md'
]

# Output file name
OUTPUT_FILE = 'final-report-complete.md'

# Page break separator (optional - uncomment if you want page breaks)
PAGE_BREAK = '\n\n---\n\n'  # Markdown horizontal rule as separator
# PAGE_BREAK = '\n\n<div style="page-break-after: always;"></div>\n\n'  # HTML page break

def merge_report_files():
    """Merge all report files into a single markdown document."""
    
    # Get the directory where this script is located
    script_dir = Path(__file__).parent
    
    print("=" * 60)
    print("CV Shortlister Final Report Merger")
    print("=" * 60)
    print()
    
    # Check if all files exist
    missing_files = []
    for filename in REPORT_FILES:
        file_path = script_dir / filename
        if not file_path.exists():
            missing_files.append(filename)
    
    if missing_files:
        print("❌ ERROR: The following files are missing:")
        for filename in missing_files:
            print(f"   - {filename}")
        return False
    
    print("✓ All report files found")
    print()
    
    # Read and merge all files
    merged_content = []
    
    for i, filename in enumerate(REPORT_FILES, 1):
        file_path = script_dir / filename
        
        print(f"[{i}/{len(REPORT_FILES)}] Reading {filename}...")
        
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
                
                # Add content
                merged_content.append(content)
                
                # Add separator between files (except after the last file)
                if i < len(REPORT_FILES):
                    merged_content.append(PAGE_BREAK)
                
        except Exception as e:
            print(f"❌ ERROR reading {filename}: {e}")
            return False
    
    # Write merged content to output file
    output_path = script_dir / OUTPUT_FILE
    
    print()
    print(f"Writing merged report to {OUTPUT_FILE}...")
    
    try:
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write('\n'.join(merged_content))
        
        # Get file size
        file_size = output_path.stat().st_size
        file_size_kb = file_size / 1024
        file_size_mb = file_size_kb / 1024
        
        print()
        print("=" * 60)
        print("✅ SUCCESS! Report merged successfully")
        print("=" * 60)
        print()
        print(f"📄 Output file: {OUTPUT_FILE}")
        print(f"📊 File size: {file_size_kb:.2f} KB ({file_size_mb:.2f} MB)")
        print(f"📑 Files merged: {len(REPORT_FILES)}")
        print()
        print(f"📍 Location: {output_path}")
        print()
        print("You can now:")
        print("  1. Open the file in a markdown editor")
        print("  2. Convert to PDF using Pandoc or Typora")
        print("  3. Copy to Word/Google Docs for final formatting")
        print()
        
        return True
        
    except Exception as e:
        print(f"❌ ERROR writing output file: {e}")
        return False

def main():
    """Main function."""
    success = merge_report_files()
    
    if not success:
        print()
        print("❌ Report merging failed. Please check the errors above.")
        exit(1)
    
    print("=" * 60)

if __name__ == '__main__':
    main()
