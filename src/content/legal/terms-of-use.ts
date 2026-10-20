import type { LegalPageContent } from './types';
import { siteConfig } from '../config/site';

const email = siteConfig.contactEmail;
const website = siteConfig.websiteUrl;
const domain = siteConfig.websiteDomain;
const privacyUrl = siteConfig.privacyPolicyUrl;
const termsUrl = siteConfig.termsOfUseUrl;

export const termsOfUsePage: LegalPageContent = {
  filename: 'terms-of-use.html',
  path: '/terms-of-use.html',
  documentTitle: 'Terms of Use | Damas Technologies',
  mascot: '📜',
  heading: 'Terms of Use',
  subtitle: 'The rules for using the Damas App, website, and related services.',
  layout: 'long-form',
  meta: {
    lastUpdated: 'July 15, 2026',
    effectiveDate: 'July 15, 2026',
  },
  sections: [
    {
      title: '1. AGREEMENT TO TERMS',
      paragraphs: [
        `These Terms of Use ("Terms") govern your access to and use of the Damas mobile application for iPhone (the "App"), our website at ${domain}, and related services (collectively, the "Service") provided by Damas Technologies LLC ("Damas," "we," "us," or "our").`,
        `By downloading, installing, accessing, or using the Service, you agree to be bound by these Terms and our Privacy Policy at <a href="${privacyUrl}">${privacyUrl}</a>. If you do not agree, do not use the Service.`,
        `Contact: <a href="mailto:${email}">${email}</a>`,
      ],
    },
    {
      title: '2. WHO WE ARE',
      paragraphs: [
        'Damas Technologies LLC',
        `Email: <a href="mailto:${email}">${email}</a>`,
        `Website: <a href="${website}">${website}</a>`,
        'The App is distributed through the Apple App Store. Apple is not a party to these Terms except as described in Section 19.',
      ],
    },
    {
      title: '3. DESCRIPTION OF THE SERVICE',
      paragraphs: ['Damas is an AI-powered productivity tool that helps you:'],
      list: [
        'Paste public social video post links and request transcription or translation',
        'Generate AI summaries and structured notes from transcript text',
        'Store, view, edit, and organize transcripts and notes on your device',
        'Receive optional push notifications when long-running processing jobs complete',
        'Use premium features through a paid subscription',
      ],
      subsections: [
        {
          title: '',
          paragraphs: [
            'Depending on the App version, voice recording and audio transcription features may also be offered.',
            'The Service processes content you submit using our servers and, with your consent, third-party AI providers (including OpenAI). Damas does not host or redistribute third-party videos. The App displays transcripts, translations, and AI-generated notes to you.',
            'Damas is not affiliated with, endorsed by, or sponsored by X Corp., Twitter, or any other social platform. References to those platforms describe compatibility with public links you choose to submit.',
          ],
        },
      ],
    },
    {
      title: '4. ELIGIBILITY',
      paragraphs: [
        'You must be at least 13 years old (or the minimum age required in your country) to use the Service. If you are under 18, you represent that you have permission from a parent or legal guardian.',
        'The Service is not intended for children under 13, and we do not knowingly offer it to them.',
        'You may use the Service only if you can form a binding contract with Damas and are not barred from using the Service under applicable law.',
      ],
    },
    {
      title: '5. NO USER ACCOUNTS',
      paragraphs: [
        'The current version of the Service does not require you to create a username or password. We identify your device for operational purposes using a randomly generated device identifier stored in your device\'s Keychain, as described in our Privacy Policy.',
        'You are responsible for maintaining the security of your device and Apple ID.',
      ],
    },
    {
      title: '6. SUBSCRIPTIONS, FREE TRIALS, AND PAYMENTS',
      subsections: [
        {
          title: '6.1 Premium subscription',
          paragraphs: [
            'Certain features require an active paid subscription ("Damas Premium" or similar branding shown in the App). Subscriptions are offered as auto-renewing plans (for example, weekly or monthly) through Apple\'s In-App Purchase system.',
            'Pricing, plan length, and free-trial offers are displayed in the App and on the App Store at the time of purchase and may vary by region.',
          ],
        },
        {
          title: '6.2 Free trial',
          paragraphs: [
            'If a free trial is offered, it converts to a paid subscription unless you cancel before the trial ends. Trial eligibility and duration are determined by Apple and the offer shown at purchase.',
          ],
        },
        {
          title: '6.3 Auto-renewal',
          paragraphs: [
            'Subscriptions automatically renew unless canceled at least 24 hours before the end of the current billing period. Your Apple ID account will be charged for renewal within 24 hours prior to the end of the current period.',
          ],
        },
        {
          title: '6.4 Managing and canceling',
          paragraphs: [
            'You manage, cancel, or change subscriptions through your Apple ID account settings (Settings → Apple ID → Subscriptions) or the App Store. Deleting the App does not cancel your subscription.',
          ],
        },
        {
          title: '6.5 Refunds',
          paragraphs: [
            'Payments are processed by Apple. Refund requests must be submitted to Apple in accordance with Apple\'s policies. Damas does not control Apple\'s billing or refund decisions.',
          ],
        },
        {
          title: '6.6 Price changes',
          paragraphs: [
            'We may change subscription prices or plans. Where required, Apple will notify you or request your consent before price changes apply to your subscription.',
          ],
        },
        {
          title: '6.7 Taxes',
          paragraphs: [
            'Prices may exclude applicable taxes, which Apple or local law may add at checkout.',
          ],
        },
      ],
    },
    {
      title: '7. AI PROCESSING CONSENT',
      paragraphs: [
        'Before certain features send your data for AI-powered transcription, translation, or summarization, the App will ask for your explicit consent.',
        'You may decline or revoke consent in the App\'s Privacy settings. If you decline or revoke consent, you may still browse the App, but new AI processing requests will not be sent.',
        'By granting consent, you authorize us to transmit the content described in the consent screen (such as video links, transcript text, and language selections) to our servers and subprocessors, including OpenAI, for processing.',
      ],
    },
    {
      title: '8. YOUR CONTENT AND RESPONSIBILITIES',
      subsections: [
        {
          title: '8.1 User content',
          paragraphs: [
            '"User Content" means information and material you provide through the Service, including video post links, audio recordings (if enabled), transcript text, edited notes, and language selections.',
            'You retain ownership of your User Content. You grant Damas a limited, non-exclusive, worldwide license to host, process, transmit, and display User Content solely as necessary to operate and improve the Service, including generating transcripts, translations, and summaries for you.',
          ],
        },
        {
          title: '8.2 Your representations',
          paragraphs: ['You represent and warrant that:'],
          list: [
            'You have the right to submit User Content and to grant the license above',
            'Your User Content and use of the Service comply with these Terms and applicable law',
            'You submit only public links you are permitted to use, or audio you have the right to record and process',
            'Your User Content does not infringe intellectual property, privacy, or other rights of any person or entity',
          ],
        },
        {
          title: '8.3 Public links only',
          paragraphs: [
            'The Service is designed for public video post links. Private, restricted, deleted, or unsupported links may fail. You are solely responsible for the links you submit.',
          ],
        },
        {
          title: '8.4 Accuracy of AI output',
          paragraphs: [
            'AI-generated transcripts, translations, and summaries may contain errors, omissions, or inaccuracies. You are responsible for reviewing output before relying on it for any purpose, including journalism, legal, medical, financial, or professional decisions.',
          ],
        },
      ],
    },
    {
      title: '9. ACCEPTABLE USE',
      paragraphs: ['You agree not to:'],
      list: [
        'Use the Service for any unlawful, harmful, fraudulent, or abusive purpose',
        'Submit content you do not have the right to process',
        'Attempt to access private, non-public, or copyrighted material without authorization',
        'Circumvent usage limits, rate limits, or security measures',
        'Reverse engineer, decompile, or attempt to extract source code except where law permits',
        'Use bots, scrapers, or automated means to abuse the Service',
        'Interfere with or disrupt the Service or servers',
        'Resell, sublicense, or commercially exploit the Service without our written permission',
        'Use the Service to build a competing product using unauthorized access to our systems',
        'Harass, threaten, or harm others through content you process or share',
      ],
      subsections: [
        {
          title: '',
          paragraphs: ['We may suspend or terminate access for violations.'],
        },
      ],
    },
    {
      title: '10. USAGE LIMITS',
      paragraphs: [
        'To ensure fair access and control costs, we may enforce per-device limits on the number of jobs, processing minutes, or other usage, with or without notice. Limits may change over time.',
        'If you exceed limits, requests may be delayed, rejected, or require a subscription upgrade where applicable.',
      ],
    },
    {
      title: '11. INTELLECTUAL PROPERTY',
      subsections: [
        {
          title: '11.1 Our property',
          paragraphs: [
            'The Service, including the App, software, design, branding, logos, and documentation (excluding User Content), is owned by Damas Technologies LLC or its licensors and is protected by intellectual property laws.',
            'We grant you a limited, personal, non-transferable, non-exclusive, revocable license to use the App on Apple-branded devices you own or control, subject to these Terms and the Apple App Store rules.',
          ],
        },
        {
          title: '11.2 Trademarks',
          paragraphs: [
            '"Damas" and related marks are trademarks of Damas Technologies LLC. Third-party names and marks (including platform names) belong to their respective owners.',
          ],
        },
        {
          title: '11.3 Feedback',
          paragraphs: [
            'If you send suggestions or feedback, you grant us the right to use it without restriction or compensation.',
          ],
        },
      ],
    },
    {
      title: '12. THIRD-PARTY SERVICES AND LINKS',
      paragraphs: [
        'The Service relies on third parties, including Apple, cloud hosting providers, and OpenAI. Your use of those services may be subject to their terms and policies.',
        'The Service may contain links to third-party websites. We are not responsible for third-party content, policies, or practices.',
      ],
    },
    {
      title: '13. SERVICE CHANGES AND AVAILABILITY',
      paragraphs: [
        'We may modify, suspend, or discontinue any part of the Service at any time, including features, supported link types, languages, or subscription benefits.',
        'We do not guarantee uninterrupted, timely, secure, or error-free operation. Maintenance, outages, third-party failures, and network issues may affect availability.',
        'Processing times for long videos vary and are not guaranteed.',
      ],
    },
    {
      title: '14. TERMINATION',
      paragraphs: [
        'You may stop using the Service at any time by deleting the App and canceling any subscription through Apple.',
        'We may suspend or terminate your access immediately if we reasonably believe you violated these Terms, pose a security risk, or if required by law.',
        'Upon termination, your license to use the App ends. Sections that by their nature should survive (including Sections 8, 11, 14–18) will survive.',
      ],
    },
    {
      title: '15. DISCLAIMERS',
      paragraphs: [
        'THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, WHETHER EXPRESS, IMPLIED, OR STATUTORY.',
        'TO THE MAXIMUM EXTENT PERMITTED BY LAW, DAMAS DISCLAIMS ALL WARRANTIES, INCLUDING IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, AND NON-INFRINGEMENT.',
        'WE DO NOT WARRANT THAT:',
      ],
      list: [
        'AI OUTPUT WILL BE ACCURATE, COMPLETE, OR RELIABLE',
        'THE SERVICE WILL MEET YOUR REQUIREMENTS',
        'DEFECTS WILL BE CORRECTED',
        'THE SERVICE IS FREE OF VIRUSES OR HARMFUL COMPONENTS',
      ],
    },
    {
      title: '16. LIMITATION OF LIABILITY',
      paragraphs: [
        'TO THE MAXIMUM EXTENT PERMITTED BY LAW:',
        'DAMAS TECHNOLOGIES LLC AND ITS OFFICERS, DIRECTORS, EMPLOYEES, AGENTS, AND AFFILIATES WILL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, EXEMPLARY, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS, DATA, GOODWILL, OR BUSINESS OPPORTUNITY, ARISING FROM OR RELATED TO THE SERVICE OR THESE TERMS, EVEN IF ADVISED OF THE POSSIBILITY.',
        'OUR TOTAL LIABILITY FOR ANY CLAIM ARISING OUT OF OR RELATING TO THE SERVICE OR THESE TERMS WILL NOT EXCEED THE GREATER OF (A) THE AMOUNT YOU PAID TO DAMAS FOR THE SERVICE IN THE TWELVE (12) MONTHS BEFORE THE EVENT GIVING RISE TO THE CLAIM, OR (B) FIFTY US DOLLARS (US $50).',
        'SOME JURISDICTIONS DO NOT ALLOW CERTAIN LIMITATIONS, SO SOME OF THE ABOVE MAY NOT APPLY TO YOU.',
      ],
    },
    {
      title: '17. INDEMNIFICATION',
      paragraphs: [
        'You agree to defend, indemnify, and hold harmless Damas Technologies LLC and its officers, directors, employees, and agents from any claims, damages, losses, liabilities, costs, and expenses (including reasonable attorneys\' fees) arising from:',
      ],
      list: [
        'Your User Content',
        'Your use of the Service',
        'Your violation of these Terms',
        'Your violation of any law or third-party rights',
      ],
    },
    {
      title: '18. DISPUTES, GOVERNING LAW, AND VENUE',
      paragraphs: [
        'These Terms are governed by the laws of the State of Wyoming, United States, without regard to conflict-of-law principles, except where mandatory consumer protection laws in your country of residence apply.',
        `Before filing a claim, you agree to contact us at <a href="mailto:${email}">${email}</a> and attempt to resolve the dispute informally for at least 30 days.`,
        'Except where prohibited by law, you agree that exclusive jurisdiction and venue for disputes not subject to arbitration (if any) will be in the state or federal courts located in Wyoming, and you consent to personal jurisdiction there.',
        'Nothing in this section limits rights you may have as a consumer under mandatory local law.',
      ],
    },
    {
      title: '19. APPLE APP STORE TERMS',
      paragraphs: [
        'If you downloaded the App from the Apple App Store, you acknowledge and agree that:',
      ],
      list: [
        'These Terms are between you and Damas Technologies LLC only, not Apple Inc. ("Apple")',
        'Apple is not responsible for the App or its content',
        'Apple has no obligation to furnish maintenance or support for the App',
        'In the event of any failure of the App to conform to any applicable warranty, you may notify Apple and Apple may refund the purchase price (if any) paid for the App; to the maximum extent permitted by law, Apple has no other warranty obligation',
        'Apple is not responsible for addressing claims by you or any third party relating to the App, including product liability, legal compliance, consumer protection, or intellectual property claims',
        'Apple and its subsidiaries are third-party beneficiaries of these Terms and may enforce them against you as a third-party beneficiary',
      ],
      subsections: [
        {
          title: '',
          paragraphs: [
            'Your use of the App must also comply with Apple\'s App Store Terms of Service and applicable usage rules.',
          ],
        },
      ],
    },
    {
      title: '20. EXPORT AND SANCTIONS',
      paragraphs: [
        'You may not use or export the Service except as authorized by United States law and the laws of the jurisdiction in which the Service is used. You represent that you are not located in a country subject to U.S. government embargo or designated as a terrorist-supporting country, and that you are not listed on any U.S. government prohibited or restricted party list.',
      ],
    },
    {
      title: '21. CHANGES TO THESE TERMS',
      paragraphs: [
        `We may update these Terms from time to time. We will post the updated Terms at <a href="${termsUrl}">${termsUrl}</a> and update the "Last updated" date.`,
        'If changes are material, we may provide additional notice in the App or by other reasonable means. Continued use after the effective date constitutes acceptance of the revised Terms, except where law requires otherwise.',
      ],
    },
    {
      title: '22. MISCELLANEOUS',
      list: [
        '<strong>Entire agreement:</strong> These Terms and the Privacy Policy are the entire agreement between you and Damas regarding the Service.',
        '<strong>Severability:</strong> If any provision is unenforceable, the remaining provisions remain in effect.',
        '<strong>No waiver:</strong> Failure to enforce a provision is not a waiver.',
        '<strong>Assignment:</strong> You may not assign these Terms without our consent. We may assign these Terms in connection with a merger, acquisition, or sale of assets.',
        '<strong>Force majeure:</strong> We are not liable for delays or failures due to events beyond our reasonable control.',
      ],
    },
    {
      title: '23. CONTACT US',
      paragraphs: [
        'Damas Technologies LLC',
        `Email: <a href="mailto:${email}">${email}</a>`,
        `Website: <a href="${website}">${website}</a>`,
        'For support, billing questions (via Apple), legal notices, or privacy requests, contact us at the email above.',
        '<strong>END OF TERMS OF USE</strong>',
      ],
    },
  ],
};
