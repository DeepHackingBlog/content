---
id: "como-subir-un-articulo-a-deep-hacking"
title: "How to Submit an Article to Deep Hacking"
author: "juan-antonio-gonzalez-mena"
publishedDate: 2026-02-26
updatedDate: 2026-02-26
image: "./images/portada-escribir-articulo.png"
description: "Learn how to propose and submit articles to Deep Hacking, from proposal approval to the Pull Request, with a Markdown format guide and author page instructions."
categories:
  - "miscellaneous"
draft: false
featured: false
lang: "en"
---

Since the last and biggest update to Deep Hacking, all articles are in Markdown format and available in the following repository:

- [Content repository](https://github.com/DeepHackingBlog/content)

The purpose of this article is to walk you through the process of proposing articles and to share some tips along the way. Let's go step by step :)

- [Can anyone submit articles?](#can-anyone-submit-articles)
- [How do I propose an article?](#how-do-i-propose-an-article)
- [Markdown format](#markdown-format)
  - [Markdown styles](#markdown-styles)
  - [Conclusion on Markdown](#conclusion-on-markdown)
- [Author page](#author-page)
- [Submitting your article in English too](#submitting-your-article-in-english-too)
- [Submission process](#submission-process)
- [Conclusion](#conclusion)

## Can anyone submit articles?

The short answer is: yes, but not just any way.

Deep Hacking has become a community project, and that openness is precisely what makes it special. We firmly believe that knowledge should be shared, and that both junior profiles and professionals with years of experience can contribute tremendous value.

However, an open project also needs clear criteria to stay true to its essence. Growing in quantity can never mean lowering the technical level, clarity, or practical usefulness of the content.

And this isn't just theory. I myself have gone through phases where, almost without noticing, I was prioritizing publishing more rather than publishing better. Over time I learned that quality must always come first.

That's why:

- ✅ Anyone can propose an article.
- ❌ Not any content, or in any format, will be published.

We're looking for articles that:

- Are original (or with clear rights).
- Have a technical and educational focus.
- Provide real, practical value.
- And, above all, fit within the Deep Hacking spirit (though of course, everything is open for discussion).

> By the way! Blue Team colleagues, Cyber Intelligence practitioners, and other defensive disciplines: we know the blog is called Deep Hacking, but you're part of this too.

## How do I propose an article?

If you want to write for the blog, the best approach is to send an email explaining your proposal to:

- [juanantonio.gonzalezmena@deephacking.tech](mailto:juanantonio.gonzalezmena@deephacking.tech)

To make the review easier, you can use this template as a starting point:

```text
Subject: Article proposal – Deep Hacking

Name or pseudonym:
- 

Proposed title:
- (Suggest a title for the article)

Description:
- (Briefly describe what the article is about and what you want to contribute with it)

Experience on the topic:
- (Tell us a bit about your experience with the topic you want to cover. You can also briefly mention your professional background if you find it relevant)

Repository or additional resources:
- (only if applicable)

Social media:
- (We'd appreciate it if you share your links to social media, whether LinkedIn, Twitter, or GitHub. LinkedIn especially)
```

Once you send the email:

1. We'll review your proposal.
2. We'll reply by email whether it's accepted or not.
3. If accepted, we'll coordinate the Pull Request and publication.

> Don't worry if I don't reply immediately. After 8 hours working in front of the computer, I sometimes need to rest, haha.

## Markdown format

The article must be in Markdown format and must include a frontmatter block at the top, that is, a metadata block with information about the article. Here's a template:

```yaml
---
id: "<article-slug-in-lowercase-with-hyphens>"
title: "<Article title>"
author: "<github-username-or-author-slug>"
publishedDate: YYYY-MM-DD
updatedDate: YYYY-MM-DD
image: "https://cdn.deephacking.tech/i/posts/<article-slug>/<main-image>.webp"
description: "<Brief, clear description of the article's content (150-160 characters recommended)>"
categories:
  - "<main-category>"
  # - "<secondary-category>" (optional)
draft: false
featured: false
lang: "en"
---
```

For example, if you're writing an article called "How to Submit an Article to Deep Hacking," a valid frontmatter would be:

```yaml
---
id: "como-subir-un-articulo-a-deep-hacking"
title: "How to Submit an Article to Deep Hacking"
author: "juan-antonio-gonzalez-mena"
publishedDate: 2026-04-06
updatedDate: 2026-04-06
image: "./images/cover.png"
description: "Learn how to submit articles to Deep Hacking. From article approval to the Pull Request."
categories:
  - "miscellaneous"
draft: false
featured: false
lang: "en"
---
```

There are a few fields worth clarifying:

- `author`: use your name separated by hyphens, or your nickname, depending on how you prefer to be presented. This field will also be used to create your author page, if you want one (see the [Author page](#author-page) section).
- `publishedDate` and `updatedDate`: you can set a future weekday date. If the date doesn't work out, don't worry, I'll take care of updating the values.
- `image`: used for the cover image. You can leave it empty with double quotes (`image: ""`), since I handle the creation of the cover. If you have an idea for it, feel free to mention it.
- `categories`: specifies the category or categories your article belongs to. If there are multiple, add one item per category. You can check the available categories in [categories.ts](https://github.com/DeepHackingBlog/content/blob/main/categories.ts) in the repository.
- `lang`: indicates the language of the article: `es` for Spanish or `en` for English. We'll talk more about publishing in English later (see the [Submitting your article in English too](#submitting-your-article-in-english-too) section).

Finally, the name of the article's Markdown file will typically be its title in lowercase separated by hyphens, for example:

- `how-to-submit-an-article-to-deep-hacking.md`

This applies as long as the filename doesn't end up too long. If it does, use a shorter name with the key words.

### Markdown styles

#### Placing 2 images in 2 columns

If you have, for example, 2 portrait-oriented images or simply 2 images you want to place side by side, you can use the following HTML tags:

```markdown
<div class="grid grid-cols-2 gap-4">
<div>

![First image](./images/image-1.png)

</div>
<div>

![Second image](./images/image-2.png)

</div>
</div>
```

You can find examples of this in the mobile device articles. Check the article on the blog and look at its file in the repository to see how it's done.

#### Adding captions to images

If you want to add captions below images, you can do it as follows:

```markdown
<figure>

![Third image](./images/image-3.png)

<figcaption>

Caption text

</figcaption>

</figure>
```

### Conclusion on Markdown

The best summary I can give you for this section is that you have over 100 examples from the more than 100 articles on the blog. If you're unsure how to do something you've seen in another article, or you simply have questions about formatting, you can check out the [Deep Hacking content repository](https://github.com/DeepHackingBlog/content) and browse all the examples. Use GitHub's search and enter one of the HTML tags to find direct examples.

In any case, if you have questions you can always reach me by email or through the Discord server.

## Author page

Alright, let's say you've already written your article in Markdown. Now it's time to, optionally, create your author page. The author page means that your name, whenever it appears as the author of an article, becomes a clickable link that leads to your profile. For example, you can see my author page at the following link:

- [Juan Antonio González Mena's author page](https://blog.deephacking.tech/en/author/juan-antonio-gonzalez-mena/)

As you can see, the author page is used to display:

- Contributions to the blog
- Social media links

It also ties into the [Hall of Fame](https://blog.deephacking.tech/en/hall-of-fame/): if you have an author page, you'll appear there along with any social media links you've included.

To create it, you'll need a Markdown file with the following structure:

```markdown
---
name: "<Full name>"
bio: "<Brief professional description (1 line)>"
avatar: "<URL to avatar or profile picture (512x512 recommended)>"
website: "<https://your-website.com/>" # optional
github: "<https://github.com/username>" # optional
twitter: "<https://twitter.com/username>" # optional
linkedin: "<https://www.linkedin.com/in/username/>" # optional
lang: "en"
---

Hey there! 👋 I'm **<Full name>**, also known as **<nickname if applicable>**.

I currently work in <specialty or main role> and have experience in <main technical areas>.

My main area of interest within cybersecurity is <red team / blue team / web pentesting / malware / cloud / etc.>, though I also enjoy working on <other areas if applicable>.

I firmly believe in sharing knowledge and giving back to the community, which is why I contribute to Deep Hacking.

If you'd like to get in touch or follow my work, you can do so through my social media links.
```

The most important thing to connect your articles to your author page is that the value of the `author` field in the article's frontmatter matches exactly the name of your author page's Markdown file. For example, if your article has:

```markdown
author: "juan-antonio-gonzalez-mena"
```

Then your author file must be named:

- `juan-antonio-gonzalez-mena.md`

This way, all your articles will be linked to your author page.

Regarding the template, all fields are optional except for `name`, which is what allows your name or nickname to be displayed on the blog. The description below the frontmatter is also optional.

A valid frontmatter example would be:

```markdown
---
name: "Juan Antonio González Mena"
bio: "Creator of Deep Hacking"
avatar: "https://0.gravatar.com/avatar/44f72985d93c8c7c19a2cc9ecda6cd41e47a2a743ce0a3c7101c2527db9cb65e?size=512&d=initials"
website: "https://blog.deephacking.tech/"
github: "https://github.com/sikumy"
twitter: "https://twitter.com/sikumy"
linkedin: "https://www.linkedin.com/in/juanantonio-gonzalez/"
lang: "en"
---

Hey there 👋. I'm **Juan Antonio González Mena**, though many people know me as **Sikumy**. I'm 24 years old and have been working in the cybersecurity field for over four years. I'm also the creator of this blog you're reading.

Deep Hacking started as simple personal notes. Over time it grew, evolved, and through its good and bad phases, it has become what it is today: **a space created by and for the community**.

I don't know how far this project will go or what paths it will take, but I do know that my goal is for it to become a technical reference. Time will tell. In the meantime, I'd love to have you along for the journey.
```

Just as with articles, you can check the [Deep Hacking authors folder](https://github.com/DeepHackingBlog/content/tree/1f59b5a6b92fdb7d52623374ab2c482a8df750bc/authors) in the repository for examples from all authors if you have any doubts.

Finally, for both articles and authors, you can check all available fields and whether they are required or optional in the [config.ts](https://github.com/DeepHackingBlog/content/blob/1f59b5a6b92fdb7d52623374ab2c482a8df750bc/config.ts) file in the repository.

## Submitting your article in English too

One of the great things about the latest Deep Hacking update is that the blog is available in both Spanish and English, making it possible to reach more people in both languages.

To publish an article in English, keep the following in mind:

- For articles:
  - Translate the Markdown filename to English. For example: `how-to-submit-an-article-to-deep-hacking.md`.
  - In the frontmatter, change the value of the `lang` field from `es` to `en`.
  - The `id` field in the frontmatter **is not translated**; it stays exactly the same in both versions.
  - Translate the content of the article.

- For authors:
  - Keep the same filename in both languages.
  - Translate the `bio` field in the frontmatter.
  - Translate the description below the frontmatter, if there is one.

For all of these tasks, I have prompts already written that automate them. I recommend running them to make sure everything looks right. You can check the following repository:

- [Prompts Repository](https://github.com/DeepHackingBlog/ai-prompts)

You can run them with VS Code and Copilot, or whatever tool you prefer.

> Important: It is strongly recommended to run these prompts only after you have moved the article to the cloned `content` repository. You can find the recommendations in the `README.md` of that repository.

## Submission process

After everything above, the submission process is relatively straightforward: it's just a matter of opening a Pull Request to the content repository. Below I'll walk you through the files you should submit and the exact steps to follow.

If, for example, you're submitting an article in both Spanish and English, along with two author page files (Spanish and English), the files and paths you'll need to submit would be:

```text
/content/posts/es/articulo.md
/content/posts/en/post.md
/content/authors/es/autor.md
/content/authors/en/author.md
```

The article's images must be stored in a folder named `images` inside one of the two folders holding the two versions of the article. For example:

```text
/content/posts/es/images/
```

Each Markdown file references images using relative paths (`./images/name.png`). The English version uses the exact same reference, even though the `images` folder physically only exists inside the Spanish version's folder; the system handles the rest.

The steps to follow are:

1. Fork the repository.

![Fork button in the Deep Hacking content repository on GitHub](images/image.png)

2. Once forked, clone it:

```bash
git clone https://github.com/your-username/content/
```

3. Add the Markdown files and the images folder.

4. Run the following commands:

```bash
git add .
git status
```

After running `git status`, the files that should appear as tracked are the following (example):

```text
/content/posts/es/articulo.md
/content/posts/es/images/image-1.png
/content/posts/es/images/image-2.png
/content/posts/en/post.md
/content/authors/es/autor.md
/content/authors/en/author.md
```

5. After verifying everything looks good, make the commit. I recommend using the article's title as the commit message:

```bash
git commit -m "How to Submit an Article to Deep Hacking"
```

6. Push the changes to your fork:

```bash
git push -u origin main
```

7. Finally, go to your fork on GitHub. You'll see a banner with a **"Compare & pull request"** button. Click it, write a brief description of what your PR includes, and submit it.

> From that point on, I'll review the Pull Request, leave comments if there's anything to adjust, and once everything looks correct, I'll merge it into the main branch and the article will be ready for publication.

## Conclusion

I hope this article has cleared up any doubts about how to contribute to the blog. The process, summarized, is as simple as this:

1. **Propose your article** by email before you start writing.
2. **Write it** following the Markdown format with its frontmatter.
3. **Create your author page** if you want to appear in the Hall of Fame.
4. **Translate it to Spanish** if you want to reach more people.
5. **Open the Pull Request** with all the files.

You don't need to be an expert in Git or Markdown to contribute. If you get stuck at any step, send me an email or drop by the Discord server and we'll sort it out together. Community comes first.

And of course, if you think any step in this article is unclear or could be improved, let me know. I've internalized the entire process myself and have tried to explain it as clearly as possible for someone who isn't familiar with it.
