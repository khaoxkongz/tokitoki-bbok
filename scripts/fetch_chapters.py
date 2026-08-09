#!/usr/bin/env python3
"""
Webnovel Chapter Fetcher / Scraper
Fetches chapters from freewebnovel.com, cleans up HTML & ads, 
formats into Markdown, and saves to content/en/.
"""

import os
import re
import sys
import time
import argparse
from pathlib import Path
from bs4 import BeautifulSoup
from curl_cffi import requests

DEFAULT_NOVEL_SLUG = "surviving-the-game-as-a-barbarian"
DEFAULT_OUT_DIR = "content/en"
BASE_URL = "https://freewebnovel.com"

# Known ad phrases to remove from paragraphs
AD_PATTERNS = [
    re.compile(r"Ads\s+by\s+Pubfuture", re.IGNORECASE),
    re.compile(r"Pubfuture", re.IGNORECASE),
    re.compile(r"googletag", re.IGNORECASE),
    re.compile(r"Sponsored\s+Content", re.IGNORECASE),
    re.compile(r"freewebnovel\.com", re.IGNORECASE),
]

def clean_title(title_raw: str):
    """
    Parses chapter raw title string like 'Chapter 456: Raid (1)' or 'Chapter 456 - Raid (1)'
    Returns (ep_num: str, clean_name: str, full_clean_title: str)
    Example: ('456', 'Raid 1', 'Ep. 456 - Raid 1')
    """
    title_raw = title_raw.strip()
    # Match pattern Chapter 456: Raid (1) or Chapter 456 - Raid (1) or Chapter 456 Raid (1)
    match = re.search(r"Chapter\s+(\d+)\s*[:\-]?\s*(.*)", title_raw, re.IGNORECASE)
    if match:
        ep_num = match.group(1)
        sub_title = match.group(2).strip()
    else:
        # Fallback if no chapter number matched directly
        ep_num = "000"
        sub_title = title_raw

    # Clean up subtitle (1) -> 1 if needed e.g. Raid (1) -> Raid 1
    sub_title_clean = re.sub(r"\((.*?)\)", r"\1", sub_title).strip()
    if not sub_title_clean:
        sub_title_clean = f"Chapter {ep_num}"
    
    filename_title = f"Ep. {ep_num} - {sub_title_clean}"
    heading_title = sub_title_clean
    return ep_num, heading_title, filename_title

def clean_content(soup_article: BeautifulSoup) -> list[str]:
    """
    Extracts paragraphs from article element and strips out unwanted ads/scripts.
    """
    # Remove script, style, iframe, and ad elements
    for elem in soup_article.find_all(['script', 'style', 'iframe', 'ins', 'form']):
        elem.decompose()
        
    for elem in soup_article.find_all(class_=re.compile(r"ad|sponsor|pubfuture", re.IGNORECASE)):
        elem.decompose()

    paragraphs = []
    for p in soup_article.find_all('p'):
        text = p.get_text().strip()
        if not text:
            continue
        
        # Check if text matches known ad patterns
        if any(pattern.search(text) for pattern in AD_PATTERNS):
            continue
            
        paragraphs.append(text)
        
    return paragraphs

def fetch_chapter(session: requests.Session, novel_slug: str, chapter_num: int):
    """
    Fetches a single chapter by number.
    Returns (title_info, paragraphs, next_url)
    """
    url = f"{BASE_URL}/novel/{novel_slug}/chapter-{chapter_num}"
    response = session.get(url, impersonate="chrome")
    
    if response.status_code != 200:
        raise Exception(f"HTTP {response.status_code} when fetching {url}")

    soup = BeautifulSoup(response.text, "html.parser")
    
    # Extract Chapter Title
    chapter_span = soup.find("span", class_="chapter")
    if chapter_span:
        title_raw = chapter_span.get_text()
    else:
        h1 = soup.find("h1")
        title_raw = h1.get_text() if h1 else f"Chapter {chapter_num}"

    ep_num, heading_title, filename_title = clean_title(title_raw)

    # Extract Article Content
    article = soup.find("div", id="article") or soup.find("div", class_="txt")
    if not article:
        raise Exception(f"Could not find chapter content element for chapter {chapter_num}")

    paragraphs = clean_content(article)
    
    # Extract Next Chapter Link
    next_btn = soup.find("a", title=re.compile(r"Next chapter", re.IGNORECASE))
    next_url = next_btn["href"] if next_btn and "href" in next_btn.attrs else None
    if next_url and not next_url.startswith("http"):
        next_url = BASE_URL + next_url

    return {
        "chapter_num": ep_num,
        "heading_title": heading_title,
        "filename": f"{filename_title}.md",
        "paragraphs": paragraphs,
        "next_url": next_url,
    }

def save_markdown(chapter_data: dict, out_dir: Path, overwrite: bool = False):
    out_dir.mkdir(parents=True, exist_ok=True)
    file_path = out_dir / chapter_data["filename"]
    
    if file_path.exists() and not overwrite:
        print(f"  [SKIP] File already exists: {file_path.name}")
        return file_path

    # Construct Markdown
    md_lines = [f"# {chapter_data['heading_title']}\n"]
    for p in chapter_data["paragraphs"]:
        md_lines.append(p)
        md_lines.append("")  # Blank line between paragraphs

    content = "\n".join(md_lines).strip() + "\n"
    
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)
        
    print(f"  [SAVED] {file_path.name} ({len(chapter_data['paragraphs'])} paragraphs)")
    return file_path

def main():
    parser = argparse.ArgumentParser(description="Fetch webnovel chapters as Markdown files.")
    parser.add_argument("--start", type=int, required=True, help="Starting chapter number (e.g. 456)")
    parser.add_argument("--end", type=int, help="Ending chapter number inclusive (e.g. 460)")
    parser.add_argument("--count", type=int, help="Number of chapters to fetch from start")
    parser.add_argument("--novel-slug", type=str, default=DEFAULT_NOVEL_SLUG, help="Novel slug on site")
    parser.add_argument("--out-dir", type=str, default=DEFAULT_OUT_DIR, help="Output directory")
    parser.add_argument("--overwrite", action="store_true", help="Overwrite existing files")
    parser.add_argument("--delay", type=float, default=1.0, help="Delay between requests in seconds")

    args = parser.parse_args()

    start_num = args.start
    if args.end:
        end_num = args.end
    elif args.count:
        end_num = start_num + args.count - 1
    else:
        end_num = start_num

    out_dir = Path(args.out_dir)
    print(f"=== Webnovel Fetcher Starting ===")
    print(f"Target Chapters: {start_num} to {end_num}")
    print(f"Output Directory: {out_dir.resolve()}\n")

    session = requests.Session()

    success_count = 0
    fail_count = 0

    for ch_num in range(start_num, end_num + 1):
        print(f"Fetching Chapter {ch_num}...")
        try:
            ch_data = fetch_chapter(session, args.novel_slug, ch_num)
            save_markdown(ch_data, out_dir, args.overwrite)
            success_count += 1
        except Exception as e:
            print(f"  [ERROR] Failed to fetch Chapter {ch_num}: {e}")
            fail_count += 1

        if ch_num < end_num and args.delay > 0:
            time.sleep(args.delay)

    print(f"\n=== Fetch Completed ===")
    print(f"Successfully fetched: {success_count}")
    if fail_count > 0:
        print(f"Failed: {fail_count}")

if __name__ == "__main__":
    main()
