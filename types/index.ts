export interface Project {
  name: string
  slug: string
  description: string
  images: string[]
  location: string
  author: Author
}

interface Author {
  name: string
  link?: string
}
