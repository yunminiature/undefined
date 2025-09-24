declare module 'sanitize-html' {
  export interface SanitizeHtmlOptions {
    allowedTags?: string[]
    allowedAttributes?: Record<string, string[]>
  }

  export default function sanitizeHtml(dirty: string, options?: SanitizeHtmlOptions): string
}


