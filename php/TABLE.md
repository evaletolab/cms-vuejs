TABLE editors 
  slug (string), 
  content (string),
  version (string), 
  published (bool),
  lang (string), 
  time(number ou date)


TABLE menu
  name(str),  
  label(str),  
  lang(str),
  weight(int),
  from(str),
  to(str),
  group(str)


  CREATE TABLE IF NOT EXISTS "editors" (
        "id"  INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
        "meta_type"  TEXT NOT NULL,
        "meta_title"  TEXT NOT NULL,
        "meta_tags"  TEXT NOT NULL,
        "meta_owner"  TEXT NOT NULL,
        "slug"  TEXT NOT NULL UNIQUE,
        "content"  TEXT,
        "version"  TEXT NOT NULL,
        "published" INTEGER NOT NULL,
        "time"  INTEGER NOT NULL
    );