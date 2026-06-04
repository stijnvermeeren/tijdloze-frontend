import type { ContactFormRequest } from '../contracts/contact'
import { endpoint } from './shared'

export const contactEndpoints = {
  submit: () => endpoint<void, ContactFormRequest>('contact', 'POST'),
} as const