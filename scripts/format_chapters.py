#!/usr/bin/env python3
"""
Webnovel Markdown Formatter & Verifier
Audits existing .md files, removes ad leftovers, fixes line spacing,
and verifies chapter numbering sequence.
"""

import re
import sys
import argparse
from pathlib import Path

DEFAULT_DIR = "content/en"

AD_PATTERNS = [
    re.compile(r"Ads\s+by\s+Pubfuture.*", re.IGNORECASE),
    re.compile(r"Pubfuture.*", re.IGNORECASE),
    re.compile(r"googletag.*", re.IGNORECASE),
    re.compile(r"Sponsored\s+Content.*", re.IGNORECASE),
]

def audit_and_format_file(file_path: Path, fix: bool = False):
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    original_content = content
    lines = content.splitlines()

    issues = []
    cleaned_lines = []

    for idx, line in enumerate(lines):
        # Check for ads
        matched_ad = False
        for pattern in AD_PATTERNS:
            if pattern.search(line):
                issues.append(f"Line {idx+1}: Found ad phrase '{line.strip()}'")
                matched_ad = True
                break
        
        if not matched_ad:
            cleaned_lines.append(line.rstrip())

    # Reconstruct content with normalized paragraph spacing
    # Join lines and collapse multiple blank lines into standard double linebreaks
    reconstructed = "\n".join(cleaned_lines)
    reconstructed = re.sub(r"\n{3,}", "\n\n", reconstructed).strip() + "\n"

    modified = (reconstructed != original_content)

    if fix and modified:
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(reconstructed)

    return {
        "file_name": file_path.name,
        "issues": issues,
        "modified": modified
    }

def check_chapter_sequence(files: list[Path]):
    ep_numbers = []
    for f in files:
        match = re.search(r"Ep\.\s*(\d+)", f.name, re.IGNORECASE)
        if match:
            ep_numbers.append(int(match.group(1)))

    if not ep_numbers:
        return []

    ep_numbers.sort()
    min_ep, max_ep = ep_numbers[0], ep_numbers[-1]
    full_set = set(range(min_ep, max_ep + 1))
    existing_set = set(ep_numbers)
    missing = sorted(list(full_set - existing_set))

    return {
        "min_ep": min_ep,
        "max_ep": max_ep,
        "total_files": len(ep_numbers),
        "missing": missing
    }

def main():
    parser = argparse.ArgumentParser(description="Audit and format webnovel Markdown files.")
    parser.add_argument("--dir", type=str, default=DEFAULT_DIR, help="Target directory containing Markdown files")
    parser.add_argument("--fix", action="store_true", help="Automatically fix issues and format files")

    args = parser.parse_args()

    target_dir = Path(args.dir)
    if not target_dir.exists():
        print(f"Error: Directory '{target_dir}' does not exist.")
        sys.exit(1)

    md_files = sorted(list(target_dir.glob("*.md")))
    print(f"=== Webnovel Formatter & Verifier ===")
    print(f"Scanning Directory: {target_dir.resolve()}")
    print(f"Found {len(md_files)} Markdown files.\n")

    issues_found = 0
    files_modified = 0

    for md_file in md_files:
        result = audit_and_format_file(md_file, fix=args.fix)
        if result["issues"]:
            issues_found += len(result["issues"])
            print(f"[!] {result['file_name']}:")
            for issue in result["issues"]:
                print(f"    - {issue}")
        
        if result["modified"]:
            files_modified += 1
            if args.fix:
                print(f"  [FIXED] Cleaned and reformatted {result['file_name']}")

    seq_info = check_chapter_sequence(md_files)
    print("\n=== Chapter Sequence Audit ===")
    if seq_info:
        print(f"Range: Ep. {seq_info['min_ep']} to Ep. {seq_info['max_ep']} ({seq_info['total_files']} files)")
        if seq_info["missing"]:
            print(f"[WARNING] Missing {len(seq_info['missing'])} chapters in range:")
            print(f"  Missing IDs: {seq_info['missing']}")
        else:
            print("[OK] All chapters in range are contiguous (no missing sequence gaps).")

    print("\n=== Summary ===")
    print(f"Total Ad/Formatting Issues Found: {issues_found}")
    if args.fix:
        print(f"Files Modified & Saved: {files_modified}")
    else:
        if issues_found > 0:
            print(f"Run with '--fix' to automatically clean and format these files.")

if __name__ == "__main__":
    main()
