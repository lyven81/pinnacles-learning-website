#!/usr/bin/env python3
"""
Sync case studies from data-analytics.html to index.html search database.

This script extracts all case studies from data-analytics.html and updates
the case studies array in index.html, ensuring the search function always
includes all available case studies.

Usage:
    python sync_case_studies.py
"""

import re
from pathlib import Path


def extract_case_studies_from_data_analytics(html_content):
    """Extract all case studies from data-analytics.html."""
    case_studies = []

    # Find all case study cards
    card_pattern = r'<div style="background: white;[^>]*>.*?</div>\s*</div>'
    cards = re.findall(card_pattern, html_content, re.DOTALL)

    current_category = ""
    lines = html_content.split('\n')

    for i, line in enumerate(lines):
        # Track current category
        if '<h3 style="color: #403B36; border-bottom: 2px solid #CBA135' in line:
            category_match = re.search(r'>([^<]+)</h3>', line)
            if category_match:
                current_category = category_match.group(1)

        # Find case study cards
        if '<h4 style="color: #403B36; margin: 0 0 0.5rem 0;">' in line:
            # Extract title
            title_match = re.search(r'<h4[^>]*>([^<]+)</h4>', line)
            if not title_match:
                continue
            title = title_match.group(1)

            # Extract description from next line
            description = ""
            for j in range(i+1, min(i+5, len(lines))):
                if '<p style="margin: 0.5rem 0; color: #666' in lines[j]:
                    desc_match = re.search(r'>([^<]+)</p>', lines[j])
                    if desc_match:
                        description = desc_match.group(1)
                    break

            # Extract URLs
            case_study_url = ""
            dashboard_url = ""
            for j in range(i+1, min(i+10, len(lines))):
                if 'href="case-study/' in lines[j]:
                    url_match = re.search(r'href="([^"]+)"', lines[j])
                    if url_match:
                        case_study_url = f"https://www.pauanalytics.com/{url_match.group(1)}"
                elif 'href="dashboard/' in lines[j]:
                    url_match = re.search(r'href="([^"]+)"', lines[j])
                    if url_match:
                        dashboard_url = f"https://www.pauanalytics.com/{url_match.group(1)}"
                        break

            if title and description and case_study_url and dashboard_url:
                case_studies.append({
                    'title': title,
                    'description': description,
                    'category': current_category,
                    'caseStudyUrl': case_study_url,
                    'dashboardUrl': dashboard_url
                })

    return case_studies


def generate_js_array(case_studies):
    """Generate JavaScript array code for case studies."""
    js_code = """    // Complete case studies database - AUTO-GENERATED from data-analytics.html
    // Run sync_case_studies.py after adding new case studies to data-analytics.html
    const caseStudies = [
"""

    # Group by category
    categories = {}
    for study in case_studies:
        category = study['category']
        if category not in categories:
            categories[category] = []
        categories[category].append(study)

    # Generate JS objects
    for category, studies in categories.items():
        js_code += f"      // {category}\n"
        for study in studies:
            js_code += f"""      {{
        title: "{study['title']}",
        description: "{study['description']}",
        category: "{study['category']}",
        caseStudyUrl: "{study['caseStudyUrl']}",
        dashboardUrl: "{study['dashboardUrl']}"
      }},
"""

    # Remove last comma and close array
    js_code = js_code.rstrip(',\n') + '\n    ];'

    return js_code


def update_index_html(index_path, new_js_array):
    """Update the case studies array in index.html."""
    with open(index_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find and replace the case studies array
    pattern = r'(    // Complete case studies database.*?\n    const caseStudies = \[.*?\];)'

    if re.search(pattern, content, re.DOTALL):
        content = re.sub(pattern, new_js_array, content, flags=re.DOTALL)
    else:
        print("ERROR: Could not find case studies array in index.html")
        return False

    with open(index_path, 'w', encoding='utf-8') as f:
        f.write(content)

    return True


def main():
    """Main function to sync case studies."""
    # Get file paths
    script_dir = Path(__file__).parent
    data_analytics_path = script_dir / 'data-analytics.html'
    index_path = script_dir / 'index.html'

    # Check files exist
    if not data_analytics_path.exists():
        print(f"ERROR: {data_analytics_path} not found")
        return 1

    if not index_path.exists():
        print(f"ERROR: {index_path} not found")
        return 1

    # Read data-analytics.html
    print("Reading data-analytics.html...")
    with open(data_analytics_path, 'r', encoding='utf-8') as f:
        data_analytics_content = f.read()

    # Extract case studies
    print("Extracting case studies...")
    case_studies = extract_case_studies_from_data_analytics(data_analytics_content)
    print(f"Found {len(case_studies)} case studies")

    # Generate JavaScript array
    print("Generating JavaScript array...")
    js_array = generate_js_array(case_studies)

    # Update index.html
    print("Updating index.html...")
    if update_index_html(index_path, js_array):
        print("✅ Successfully synced case studies!")
        print(f"   {len(case_studies)} case studies are now searchable on index.html")
        return 0
    else:
        print("❌ Failed to update index.html")
        return 1


if __name__ == '__main__':
    exit(main())
