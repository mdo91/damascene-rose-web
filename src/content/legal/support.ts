import type { LegalPageContent } from './types';
import { siteConfig } from '../config/site';

export const supportPage: LegalPageContent = {
  filename: 'support.html',
  path: '/support.html',
  documentTitle: 'Support | Damas Technologies',
  mascot: '💬',
  heading: 'Support',
  subtitle: 'Need a hand? Our team is here to help with questions, feedback, or anything else!',
  sections: [
    {
      title: 'We’re happy to help',
      paragraphs: [
        'Whether you have a question about our products, need assistance with the survey, or want to share feedback, send us a message and we’ll get back to you as soon as we can.',
      ],
    },
    {
      title: 'Contact Us',
      variant: 'contact-box',
      paragraphs: ['Drop us a line anytime:'],
    },
    {
      title: 'What to include',
      list: [
        'Your name and how we can reach you',
        'A short description of your question or issue',
        'Any helpful details like device or browser type',
      ],
    },
  ],
};

export const supportContactEmail = siteConfig.contactEmail;
