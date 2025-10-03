# Case Studies Search Sync

## Overview

The search function on both `index.html` and `data-analytics.html` allows visitors to search through all your case studies.

- **data-analytics.html**: Auto-extracts case studies from the page itself
- **index.html**: Uses a complete database of all case studies from data-analytics.html

## How to Add New Case Studies

### Step 1: Add to data-analytics.html

Add your new case study to `data-analytics.html` following the existing format:

```html
<div style="background: white; padding: 1.5rem; border-radius: 8px; margin-bottom: 1rem; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
  <h4 style="color: #403B36; margin: 0 0 0.5rem 0;">Your Case Study Title</h4>
  <p style="margin: 0.5rem 0; color: #666; font-size: 0.9rem;">Brief description of the case study.</p>
  <div style="display: flex; gap: 0.5rem; margin-top: 1rem;">
    <a href="case-study/your-case-study.html" style="color: #CBA135; font-size: 0.9rem; text-decoration: none; font-weight: 500;">Read More →</a>
    <a href="dashboard/your-dashboard.html" style="color: #403B36; font-size: 0.9rem; text-decoration: none; font-weight: 500;">Dashboard →</a>
  </div>
</div>
```

### Step 2: Run the Sync Script

After adding new case studies to `data-analytics.html`, run:

```bash
python sync_case_studies.py
```

This script will:
1. Extract all case studies from `data-analytics.html`
2. Update the search database in `index.html`
3. Ensure both pages can search all available case studies

### Step 3: Commit and Deploy

```bash
git add data-analytics.html index.html
git commit -m "Add new case study: [Your Title]"
git push origin main
```

## How the Search Works

### On data-analytics.html:
- **Auto-extraction**: JavaScript automatically finds all case study cards on the page
- **Dynamic**: New case studies are immediately searchable without running any scripts
- **No manual updates needed**

### On index.html:
- **Complete database**: Contains all 24 case studies from data-analytics.html
- **Manual sync required**: Run `sync_case_studies.py` after adding new studies
- **Centralized search**: Visitors can search all case studies from the homepage

## Features

✅ **Real-time filtering** - Results appear as you type (minimum 2 characters)
✅ **Multi-field search** - Searches titles, descriptions, and categories
✅ **Mobile-friendly** - Responsive design that works on all devices
✅ **Direct links** - Each result shows "Read More" and "Dashboard" buttons
✅ **Clean UI** - Seamlessly integrated with your site's design

## Troubleshooting

**Q: New case studies don't appear in search on index.html**
A: Run `python sync_case_studies.py` to update the search database

**Q: Search not working after adding case studies**
A: Check that your HTML follows the exact format shown in Step 1

**Q: Script shows wrong number of case studies**
A: Verify that each case study has all required elements:
   - Title in `<h4>` tag
   - Description in `<p>` tag
   - Two links (case-study and dashboard)

## File Structure

```
pinnacles-learning-website/
├── index.html                  # Homepage with search (needs manual sync)
├── data-analytics.html         # Case studies page with auto-search
├── sync_case_studies.py        # Script to sync case studies
└── README_SEARCH_SYNC.md      # This file
```
