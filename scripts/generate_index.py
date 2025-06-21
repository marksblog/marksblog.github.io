import os
import markdown
import yaml

ARTICLES_DIR = "content/articles/"
OUTPUT_FILE = "index.html"

def parse_frontmatter(md_path):
    with open(md_path, 'r') as f:
        lines = f.readlines()
    if lines[0].strip() == "---":
        end = lines[1:].index("---\n") + 1
        frontmatter = "".join(lines[1:end])
        body = "".join(lines[end+1:])
        meta = yaml.safe_load(frontmatter)
        return meta, body
    return {}, "".join(lines)

articles = []
for fname in os.listdir(ARTICLES_DIR):
    if fname.endswith(".md"):
        meta, body = parse_frontmatter(os.path.join(ARTICLES_DIR, fname))
        articles.append((meta, body))

articles.sort(key=lambda x: x[0].get("created_at", ""), reverse=True)

with open(OUTPUT_FILE, 'w') as f:
    f.write("<html><head><link rel='stylesheet' href='style.css'></head><body>")
    f.write("<h1>Mark's Blog</h1><ul>")
    for meta, _ in articles:
        url = f"content/articles/{meta['slug']}.md".replace(".md", ".html")
        f.write(f"<li><a href='{url}'>{meta['title']}</a> - {meta.get('preview_description','')}</li>")
    f.write("</ul></body></html>")
