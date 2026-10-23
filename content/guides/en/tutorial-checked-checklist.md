---
title: "How can I turn a YouTube tutorial into a checked step list?"
description: "Build a tutorial checklist with prerequisites, conditional steps and completion checks, using a reviewed Damas transcript."
slug: "tutorial-checked-checklist"
locale: "en"
publishedAt: "2026-10-23"
updatedAt: "2026-10-23"
status: "published"
primaryQuery: "turn a youtube tutorial into a checklist"
topics: ["turn a youtube tutorial into a checklist", "Damas"]
sources: [{"title": "Damas — App Store", "url": "https://apps.apple.com/us/app/damas-video-link-transcriber/id6766233794"}]
related: ["transcribe-social-video-link-iphone", "summarize-video-transcript-iphone", "translate-social-video-iphone"]
translationKey: "tutorial-checked-checklist"
---

To turn a YouTube tutorial into a checklist, obtain an editable transcript in Damas, check it against the video, then write one observable action per item. Keep prerequisites and conditional branches separate. You can prepare the checklist manually or optionally copy the checked transcript into another LLM; Damas itself provides transcription, summaries, editing and copying.

## Prepare the source

Damas supports public, on-demand YouTube, Instagram and X video links up to 90 minutes. On iPhone it requires iOS 18.6 or later, internet, Premium and AI processing consent. Only process material you are authorized to use. Private, restricted and live videos are unsupported; inaccessible public sources can also fail.

1. Open the tutorial on its original platform and retain its link and title in your working note.
2. Paste the supported link into Damas. Follow the current app instructions for transcription and review the AI consent.
3. Wait for processing, then read the transcript alongside the video. Correct uncertain words, numbers and units before reusing the text.
4. Watch demonstrations and read visible labels yourself. Speech transcription cannot supply an unspoken setting or a screen-only result.
5. Edit and copy the checked text. A built-in summary can orient you, but use the full explanation to preserve order and exceptions.

## Turn explanations into checkable actions

Make three passes: collect prerequisites first, order the actions second, and attach a completion check to each action last. For every item record the condition, the action and the result actually shown or stated in the tutorial. If no result is given, write “completion check not stated” rather than inventing one. Keep alternative branches conditional instead of treating them as consecutive steps.

An item remains “unverified” until you compare it with the source. Distinguish that review status from whether you have actually performed the action. Leave missing settings unresolved; do not silently fill them from general knowledge.

## Worked example: a spreadsheet tutorial

This is a fictional teaching example, not a quotation from a real video. Suppose the tutorial instructs viewers to duplicate a worksheet, then sort rows by date only if the dates are out of order.

- Prerequisite: identify the original worksheet and the date column from the source.
- Action: duplicate the worksheet. Check: confirm the duplicate exists before editing it.
- Conditional action: if dates are out of order, sort the duplicate by the demonstrated date column. If already ordered, skip this branch.
- Unresolved: if the sort direction is never stated or shown, mark it for review instead of assuming newest first.

Use these checks only if the real source supports them. Never add owners, deadlines, facts or quotations absent from the source. Keep the original intact while checking your own result.

## Optional copy/paste prompt for another LLM

Only share the transcript with another service if you have permission. This is an external drafting step, not a Damas integration or automatic checklist feature.

> Use only this checked tutorial transcript to draft a checklist. Separate prerequisites, ordered actions and conditional branches. For each action include the supporting passage and a completion check only if stated. Mark missing information “not stated.” Do not invent settings, owners, deadlines, facts or quotations. Keep source-review status separate from task completion. Source link: [link]. Transcript: [text].

Replay the source for every proposed item before using it. For the initial text, follow [video transcription](/guides/transcribe-social-video-link-iphone/); for a shorter orientation, see [summaries](/guides/summarize-video-transcript-iphone/). For another language, use [text translation](/guides/translate-social-video-iphone/) and verify technical labels against the original.

Processing time and accuracy vary. Damas does not download media, embed subtitles or process offline. Premium cannot make an inaccessible source available. Keep the source link with the final checklist so unresolved items can be revisited.

Damas Technologies LLC
