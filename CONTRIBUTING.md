# Contributing to LearnSol

Thanks for your interest in contributing!  
LearnSol is an open-source Solana curriculum built for the community — and your improvements help everyone learn faster.

This document explains how to contribute new lessons, fix issues, add examples, and improve the platform.

---

# 📌 Before You Start

### ✅ Requirements  
To work on LearnSol locally, you should have:

- Node.js 18+  
- pnpm  
- Git  
- PostgreSQL (only required if you want to regenerate embeddings)

### 📁 Project Structure  
```

content/
week-1/
week-2/
week-3/
week-4/
week-5/
app/
components/
lib/
scripts/

```

- All curriculum content lives in `content/week-*`
- UI and platform code lives in `app/` and `components/`

---

# 📝 Types of Contributions

You can contribute in multiple ways:

### 1. Improve Lessons
- Fix typos, grammar, clarity  
- Add missing explanations  
- Add code comments  
- Improve examples  
- Add small challenges or tasks  

### 2. Add New Lessons or Pages
- Build new pages inside `content/week-*`
- Update that week’s `meta.json` to include the new page

### 3. Add Solana Examples
- Rust examples  
- Anchor examples  
- Client-side examples  
- Token/NFT utilities  

### 4. Improve UI/UX
- MDX layouts  
- Lesson components  
- Navigation improvements  

### 5. Fix Bugs or Issues
- Frontend bugs  
- Broken links or images  
- Example code errors  
- Script issues  

---

# ✍️ Adding or Editing Lessons

All lessons are MDX files inside:

```

content/week-*/<lesson>.mdx

```

### 1. Create a new lesson
Add a new `.mdx` file inside the appropriate week.

**Example:**
```

content/week-3/pda-intro.mdx

```

### 2. Update `meta.json`
Each week has a `meta.json` file:

```

{
"title": "Week 3 — Anchor",
"pages": [
"anchor-introduction",
"spl-token-integration",
"pda-intro"
]
}

````

Add your slug in the correct order.

### 3. Preview locally
```bash
npm run dev
````

### 4. (Optional) Rebuild search embeddings

If your PR changes lesson content significantly:

```bash
npm run ingest-docs
```

> ⚠️ Do **not** commit the generated embeddings.
> The maintainer will run ingestion before merging.

---

# 🧪 Running Locally

1. Install dependencies

```bash
npm install
```

2. Set up `.env.local`
   Use the sample in the README.

3. Start dev server

```bash
npm run dev
```

4. Visit

```
http://localhost:3000
```

---

# 🔍 Search / AI (RAG) Notes

LearnSol uses:

* PostgreSQL
* pgvector
* Embeddings generated from lesson content

If you add or edit content:

### Rebuild the search index (local only)

```bash
npm run ingest-docs
```

Do **not** run this in CI — the maintainer will handle it after PR approval.

---

# 🧭 Project Standards

### Writing Style

* Simple, clear, beginner-friendly
* Avoid jargon unless explained
* Prefer examples over theory
* Lessons should be concise and practical

### Code Style

* Use relevant Solana best practices
* Prefer clear code over clever code
* Add comments when explaining concepts

### Examples

* Keep examples minimal and runnable
* Always test them before submitting

---

# 🔄 Pull Request Process

1. Fork the repo
2. Create a feature branch

```bash
git checkout -b feature/my-change
```

3. Make changes
4. Commit with a clear message

```bash
git commit -m "Add PDA intro lesson for Week 3"
```

5. Push your branch

```bash
git push origin feature/my-change
```

6. Open a PR on GitHub
7. In the PR description, include:

   * What you changed
   * Why you changed it
   * Screenshots (for UI/lesson edits)

The maintainer (@Some1Uknow) will:

* Review content
* Run search ingestion (if needed)
* Merge when ready

---

# 🧡 Community & Discussions

Have ideas, suggestions, or questions?

Open a discussion or issue here:
[https://github.com/Some1Uknow/learn-solana/issues](https://github.com/Some1Uknow/learn-solana/issues)

---

# 📜 License

By contributing, you agree that your contributions are licensed under the MIT License.

---

<div align="center">
  <strong>Thank you for helping builders learn Solana.</strong><br/>
  Your contributions make this project better for everyone.
</div>
```

---