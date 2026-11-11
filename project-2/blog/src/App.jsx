import { useEffect, useMemo, useState } from 'react'
import './App.css'

const starterPosts = [
  {
    id: 'post-1',
    title: 'The quiet art of starting over',
    excerpt:
      'On making room for a fresh start, finding your footing, and learning to begin again without rushing the process.',
    content:
      'There is a kind of courage in beginning again. Not the loud, dramatic kind, but the quiet decision to make a little room for what comes next.\n\nWe often think a fresh start needs a perfect plan. It doesn’t. Sometimes it starts with one small choice: a walk without your phone, a page in a notebook, or a conversation you’ve been putting off.\n\nGive yourself permission to be a beginner. The point isn’t to have everything figured out. It’s to stay curious enough to take the next step.',
    category: 'Mindfulness',
    date: 'Nov 08, 2025',
    readTime: '5 min read',
    color: 'sage',
  },
  {
    id: 'post-2',
    title: 'A slower kind of Sunday',
    excerpt:
      'A few gentle rituals for reclaiming your weekend and making the ordinary feel a little more special.',
    content:
      'Sunday doesn’t have to be a countdown to Monday. It can be a day that belongs to you, made up of small rituals that bring you back to yourself.\n\nMake your coffee slowly. Open a window. Read a few pages of something you love. Leave a little white space in your calendar and see what finds you there.\n\nRest is not something you have to earn. It’s part of how you make a life that feels like your own.',
    category: 'Lifestyle',
    date: 'Nov 04, 2025',
    readTime: '4 min read',
    color: 'peach',
  },
  {
    id: 'post-3',
    title: 'Notes from a little green corner',
    excerpt:
      'What a handful of houseplants taught me about patience, care, and paying attention to the small things.',
    content:
      'My windowsill garden started with one rescued pothos and a promise to remember to water it. Somehow, it became a small lesson in paying attention.\n\nPlants are patient teachers. They don’t ask to be hurried; they respond to consistency. A little light, a little water, and time can turn almost nothing into something full of life.\n\nMaybe that’s true of most things we care about. Growth looks quiet for a while, until one day, there’s a new leaf.',
    category: 'Creative life',
    date: 'Oct 29, 2025',
    readTime: '6 min read',
    color: 'lavender',
  },
]

const categories = ['All stories', 'Mindfulness', 'Lifestyle', 'Creative life']

function Icon({ name, size = 18 }) {
  const paths = {
    home: <><path d="m3 10 9-7 9 7" /><path d="M5 9v11h14V9M9 20v-6h6v6" /></>,
    book: <><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" /></>,
    heart: <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />,
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
    plus: <><path d="M12 5v14M5 12h14" /></>,
    arrow: <><path d="M7 17 17 7M7 7h10v10" /></>,
    edit: <><path d="m15 5 4 4M4 20l4-.8L19 8a2.1 2.1 0 0 0-3-3L5 16l-1 4Z" /></>,
    close: <><path d="m18 6-12 12M6 6l12 12" /></>,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    spark: <><path d="m12 3 1.9 5.8L20 11l-6.1 2.2L12 19l-1.9-5.8L4 11l6.1-2.2L12 3Z" /><path d="m19 14 1.1 2.9L23 18l-2.9 1.1L19 22l-1.1-2.9L15 18l2.9-1.1L19 14Z" /></>,
    menu: <><path d="M4 6h16M4 12h16M4 18h16" /></>,
  }

  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[name]}
    </svg>
  )
}

function readSavedPosts() {
  try {
    const saved = window.localStorage.getItem('little-stories-posts')
    if (!saved) return starterPosts
    const parsed = JSON.parse(saved)
    if (Array.isArray(parsed)) return parsed
    console.error('Saved blog posts were not a list. Using starter posts instead.')
  } catch (error) {
    console.error('Could not read saved blog posts. Using starter posts instead.', error)
  }
  return starterPosts
}

function App() {
  const [posts, setPosts] = useState(readSavedPosts)
  const [activeCategory, setActiveCategory] = useState('All stories')
  const [search, setSearch] = useState('')
  const [modal, setModal] = useState(null)
  const [notice, setNotice] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    try {
      window.localStorage.setItem('little-stories-posts', JSON.stringify(posts))
    } catch (error) {
      console.error('Could not save blog posts in this browser.', error)
      window.setTimeout(() => setNotice('Could not save changes in this browser.'), 0)
    }
  }, [posts])

  useEffect(() => {
    if (!notice) return undefined
    const timeout = window.setTimeout(() => setNotice(''), 3200)
    return () => window.clearTimeout(timeout)
  }, [notice])

  const filteredPosts = useMemo(() => {
    const query = search.trim().toLowerCase()
    return posts.filter((post) => {
      const matchesCategory =
        activeCategory === 'All stories' || post.category === activeCategory
      const matchesSearch =
        !query ||
        `${post.title} ${post.excerpt} ${post.category}`.toLowerCase().includes(query)
      return matchesCategory && matchesSearch
    })
  }, [activeCategory, posts, search])

  const featuredPost = filteredPosts[0]
  const otherPosts = filteredPosts.slice(1)

  function handleSave(event) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const title = formData.get('title').trim()
    const excerpt = formData.get('excerpt').trim()
    const content = formData.get('content').trim()
    const category = formData.get('category')
    const post = {
      id: modal.post?.id ?? `post-${Date.now()}`,
      title,
      excerpt,
      content,
      category,
      date: modal.post?.date ?? new Intl.DateTimeFormat('en', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
      }).format(new Date()),
      readTime: `${Math.max(1, Math.ceil(content.split(/\s+/).length / 180))} min read`,
      color: modal.post?.color ?? ['sage', 'peach', 'lavender'][posts.length % 3],
    }

    setPosts((currentPosts) =>
      modal.post
        ? currentPosts.map((item) => (item.id === post.id ? post : item))
        : [post, ...currentPosts],
    )
    setActiveCategory('All stories')
    setSearch('')
    setModal(null)
    setNotice(modal.post ? 'Your story has been updated.' : 'Your new story is ready.')
  }

  return (
    <div className="app-shell min-h-screen bg-[#080b14] text-slate-100 selection:bg-cyan-300/30">
      <aside className={`sidebar ${menuOpen ? 'sidebar-open' : ''}`}>
        <a className="brand" href="#home" aria-label="Little Stories home">
          <span className="brand-mark"><Icon name="spark" size={20} /></span>
          <span>blog stories<span className="brand-period">.</span></span>
        </a>

        <div className="sidebar-label">YOUR SPACE</div>
        <nav className="side-nav" aria-label="Main navigation">
          <button
            className={`nav-link ${activeCategory === 'All stories' ? 'nav-active' : ''}`}
            onClick={() => { setActiveCategory('All stories'); setMenuOpen(false) }}
          >
            <Icon name="home" /> <span>Overview</span>
          </button>
          <button
            className={`nav-link ${activeCategory !== 'All stories' ? 'nav-active' : ''}`}
            onClick={() => { setActiveCategory('All stories'); setMenuOpen(false) }}
          >
            <Icon name="book" /> <span>All stories</span><span className="nav-count">{posts.length}</span>
          </button>
          <button className="nav-link" onClick={() => setNotice('Your reading list is coming soon.')}>
            <Icon name="heart" /> <span>Reading list</span>
          </button>
        </nav>

        <div className="sidebar-label category-label">CATEGORIES</div>
        <nav className="category-nav" aria-label="Story categories">
          {categories.slice(1).map((category, index) => (
            <button
              className={`category-link ${activeCategory === category ? 'category-active' : ''}`}
              key={category}
              onClick={() => { setActiveCategory(category); setMenuOpen(false) }}
            >
              <span className={`category-dot dot-${index}`} />
              {category}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="sidebar-note">
            <span className="note-icon"><Icon name="spark" size={18} /></span>
            <p>A little space for the things worth sharing.</p>
            <span className="note-signoff">Keep writing, keep wondering.</span>
          </div>
          <div className="profile">
            <div className="avatar">Y</div>
            <div className="profile-copy"><strong>Your journal</strong><span>Writer & daydreamer</span></div>
            <span className="profile-menu">···</span>
          </div>
        </div>
      </aside>

      <main className="main-content" id="home">
        <header className="topbar">
          <button className="mobile-menu" aria-label="Toggle menu" onClick={() => setMenuOpen(!menuOpen)}>
            <Icon name="menu" />
          </button>
          <div className="breadcrumb">Your space <span>/</span> <strong>{activeCategory}</strong></div>
          <div className="topbar-actions">
            <label className="search-box">
              <Icon name="search" size={17} />
              <input
                type="search"
                placeholder="Search stories..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                aria-label="Search stories"
              />
              <kbd>⌘ K</kbd>
            </label>
            <button className="write-button" onClick={() => setModal({ mode: 'create' })}>
              <Icon name="plus" size={17} /><span>New story</span>
            </button>
          </div>
        </header>

        <div className="page-content">
          <section className="welcome-row">
            <div>
              <div className="eyebrow"><span className="eyebrow-line" /> A JOURNAL FOR THE CURIOUS</div>
              <h1>Stories for a <em>softer</em> kind of day.</h1>
              <p className="welcome-copy">A collection of thoughts, small discoveries, and things that make us feel a little more human.</p>
            </div>
            <div className="date-stamp"><span>WEDNESDAY</span><strong>11</strong><span>NOVEMBER 2026</span></div>
          </section>

          <section className="stories-section" aria-label="Blog stories">
            <div className="section-heading">
              <div>
                <span className="section-kicker">THE JOURNAL</span>
                <h2>{activeCategory === 'All stories' ? 'A few good reads' : activeCategory}</h2>
              </div>
              <span className="story-total">{filteredPosts.length} {filteredPosts.length === 1 ? 'story' : 'stories'}</span>
            </div>

            {featuredPost ? (
              <>
                <article className={`featured-card cover-${featuredPost.color}`}>
                  <div className="featured-art" aria-hidden="true">
                    <div className="art-sun" />
                    <div className="art-hill art-hill-back" />
                    <div className="art-hill art-hill-front" />
                    <div className="art-stem"><i /><i /><i /></div>
                    <span className="art-caption">a moment<br />to yourself</span>
                  </div>
                  <div className="featured-copy">
                    <div className="post-meta">
                      <span className="post-category">{featuredPost.category}</span>
                      <span className="meta-dot">·</span>
                      <span>{featuredPost.date}</span>
                    </div>
                    <button className="featured-title" onClick={() => setModal({ mode: 'view', post: featuredPost })}>
                      {featuredPost.title}
                    </button>
                    <p className="featured-excerpt">{featuredPost.excerpt}</p>
                    <div className="featured-footer">
                      <span className="read-time"><Icon name="clock" size={15} />{featuredPost.readTime}</span>
                      <div className="card-actions">
                        <button className="text-action" onClick={() => setModal({ mode: 'edit', post: featuredPost })}>
                          <Icon name="edit" size={15} /> Edit
                        </button>
                        <button className="read-link" onClick={() => setModal({ mode: 'view', post: featuredPost })}>
                          Read story <Icon name="arrow" size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </article>

                {otherPosts.length > 0 && (
                  <div className="story-grid">
                    {otherPosts.map((post, index) => (
                      <article className="story-card" key={post.id}>
                        <button
                          className={`card-art mini-art art-${post.color}`}
                          aria-label={`Read ${post.title}`}
                          onClick={() => setModal({ mode: 'view', post })}
                        >
                          <span className="mini-art-shape mini-shape-one" />
                          <span className="mini-art-shape mini-shape-two" />
                          <span className="mini-art-label">{index === 0 ? 'SLOW LIVING' : 'LITTLE NOTES'}</span>
                          <span className="mini-art-mark">✳</span>
                        </button>
                        <div className="story-card-body">
                          <div className="post-meta">
                            <span className="post-category">{post.category}</span>
                            <span className="meta-dot">·</span>
                            <span>{post.date}</span>
                          </div>
                          <button className="story-title" onClick={() => setModal({ mode: 'view', post })}>{post.title}</button>
                          <p className="story-excerpt">{post.excerpt}</p>
                          <div className="story-card-footer">
                            <span className="read-time"><Icon name="clock" size={14} />{post.readTime}</span>
                            <button className="edit-icon-button" aria-label={`Edit ${post.title}`} onClick={() => setModal({ mode: 'edit', post })}>
                              <Icon name="edit" size={16} />
                            </button>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="empty-state">
                <span className="empty-icon"><Icon name="book" size={24} /></span>
                <h3>{search ? 'No stories found' : 'A blank page, full of possibility.'}</h3>
                <p>{search ? 'Try another search or category.' : 'Your next favorite story starts with a few words.'}</p>
                {!search && <button className="write-button" onClick={() => setModal({ mode: 'create' })}><Icon name="plus" size={17} />Write your first story</button>}
              </div>
            )}
          </section>

          <footer className="page-footer"><span>Made for the little things.</span><span>Take your time <i>✳</i></span></footer>
        </div>
      </main>

      {modal && (
        <div className="modal-backdrop" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setModal(null)
        }}>
          {modal.mode === 'view' ? (
            <article className="story-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
              <button className="modal-close" aria-label="Close story" onClick={() => setModal(null)}><Icon name="close" /></button>
              <div className={`modal-art cover-${modal.post.color}`}>
                <div className="art-sun" /><div className="art-hill art-hill-back" /><div className="art-hill art-hill-front" />
                <span className="modal-art-caption">a moment to yourself</span>
              </div>
              <div className="story-modal-content">
                <div className="post-meta"><span className="post-category">{modal.post.category}</span><span className="meta-dot">·</span><span>{modal.post.date}</span><span className="meta-dot">·</span><span>{modal.post.readTime}</span></div>
                <h2 id="modal-title">{modal.post.title}</h2>
                <p className="modal-excerpt">{modal.post.excerpt}</p>
                <div className="story-body">{modal.post.content.split('\n\n').map((paragraph, index) => <p key={`${modal.post.id}-${index}`}>{paragraph}</p>)}</div>
                <div className="modal-bottom"><span>Thanks for taking a moment.</span><button className="text-action" onClick={() => setModal({ mode: 'edit', post: modal.post })}><Icon name="edit" size={15} /> Edit story</button></div>
              </div>
            </article>
          ) : (
            <section className="editor-modal" role="dialog" aria-modal="true" aria-labelledby="editor-title">
              <div className="editor-header">
                <div><span className="section-kicker">{modal.mode === 'edit' ? 'MAKE IT YOURS' : 'A FRESH PAGE'}</span><h2 id="editor-title">{modal.mode === 'edit' ? 'Edit your story' : 'Write a new story'}</h2></div>
                <button className="modal-close" aria-label="Close editor" onClick={() => setModal(null)}><Icon name="close" /></button>
              </div>
              <form className="story-form" onSubmit={handleSave}>
                <label className="form-label">STORY TITLE<input name="title" type="text" placeholder="Give your story a name..." defaultValue={modal.post?.title ?? ''} required maxLength={100} /></label>
                <label className="form-label">CATEGORY<select name="category" defaultValue={modal.post?.category ?? 'Mindfulness'}>{categories.slice(1).map((category) => <option key={category}>{category}</option>)}</select></label>
                <label className="form-label">A LITTLE PREVIEW<textarea name="excerpt" placeholder="What is this story about?" defaultValue={modal.post?.excerpt ?? ''} rows="2" required maxLength={240} /></label>
                <label className="form-label">YOUR STORY<textarea name="content" className="content-input" placeholder="Start wherever you are..." defaultValue={modal.post?.content ?? ''} rows="8" required /></label>
                <div className="form-footer"><span>Take your time. Every good story starts somewhere.</span><button className="write-button" type="submit">{modal.post ? 'Save changes' : 'Publish story'}<Icon name="arrow" size={16} /></button></div>
              </form>
            </section>
          )}
        </div>
      )}

      {notice && <div className="toast" role="status">{notice}</div>}
    </div>
  )
}

export default App
