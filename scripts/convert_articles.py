import os
import markdown
import yaml

ARTICLES_DIR = "content/articles/"

for fname in os.listdir(ARTICLES_DIR):
    if fname.endswith(".md"):
        path = os.path.join(ARTICLES_DIR, fname)
        with open(path, 'r') as f:
            lines = f.readlines()
        if lines[0].strip() == "---":
            end = lines[1:].index("---\n") + 1
            frontmatter = "".join(lines[1:end])
            meta = yaml.safe_load(frontmatter)
            body = "".join(lines[end+1:])
        else:
            meta = {}
            body = "".join(lines)
        html = markdown.markdown(body)
        out_path = path.replace(".md", ".html")
        with open(out_path, 'w') as f:
            f.write(f"<html><head><link rel='stylesheet' href='../../style.css'></head><body>")
            f.write(f"<h1>{meta.get('title','')}</h1>")
            f.write(html)
            f.write("</body></html>")
