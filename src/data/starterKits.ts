import type { BadgeId } from '../types/flashcards'
import type { Card } from '../types/flashcards'

export interface StarterKit {
  id: string
  label: string
  badgeId: BadgeId
  verses: Omit<Card, 'id' | 'createdAt'>[]
}

/** Starter kits: themed sets of well-known verses. ESV text included for offline use. */
export const STARTER_KITS: StarterKit[] = [
  {
    id: 'salvation',
    label: 'Salvation',
    badgeId: 'starter_salvation',
    verses: [
      {
        bookId: 'JHN',
        chapter: 3,
        verseStart: 16,
        verseEnd: 16,
        referenceLabel: 'John 3:16',
        text: 'For God so loved the world, that he gave his only Son, that whoever believes in him should not perish but have eternal life.',
      },
      {
        bookId: 'ROM',
        chapter: 10,
        verseStart: 9,
        verseEnd: 9,
        referenceLabel: 'Romans 10:9',
        text: 'Because, if you confess with your mouth that Jesus is Lord and believe in your heart that God raised him from the dead, you will be saved.',
      },
      {
        bookId: 'EPH',
        chapter: 2,
        verseStart: 8,
        verseEnd: 9,
        referenceLabel: 'Ephesians 2:8–9',
        text: 'For by grace you have been saved through faith. And this is not your own doing; it is the gift of God, not a result of works, so that no one may boast.',
      },
    ],
  },
  {
    id: 'peace',
    label: 'Peace',
    badgeId: 'starter_peace',
    verses: [
      {
        bookId: 'PHP',
        chapter: 4,
        verseStart: 6,
        verseEnd: 7,
        referenceLabel: 'Philippians 4:6–7',
        text: 'Do not be anxious about anything, but in everything by prayer and supplication with thanksgiving let your requests be made known to God. And the peace of God, which surpasses all understanding, will guard your hearts and your minds in Christ Jesus.',
      },
      {
        bookId: 'JHN',
        chapter: 14,
        verseStart: 27,
        verseEnd: 27,
        referenceLabel: 'John 14:27',
        text: 'Peace I leave with you; my peace I give to you. Not as the world gives do I give to you. Let not your hearts be troubled, neither let them be afraid.',
      },
    ],
  },
  {
    id: 'strength',
    label: 'Strength',
    badgeId: 'starter_strength',
    verses: [
      {
        bookId: 'ISA',
        chapter: 40,
        verseStart: 31,
        verseEnd: 31,
        referenceLabel: 'Isaiah 40:31',
        text: 'But they who wait for the Lord shall renew their strength; they shall mount up with wings like eagles; they shall run and not be weary; they shall walk and not faint.',
      },
      {
        bookId: 'PHP',
        chapter: 4,
        verseStart: 13,
        verseEnd: 13,
        referenceLabel: 'Philippians 4:13',
        text: 'I can do all things through him who strengthens me.',
      },
    ],
  },
  {
    id: 'faith',
    label: 'Faith',
    badgeId: 'starter_faith',
    verses: [
      {
        bookId: 'HEB',
        chapter: 11,
        verseStart: 1,
        verseEnd: 1,
        referenceLabel: 'Hebrews 11:1',
        text: 'Now faith is the assurance of things hoped for, the conviction of things not seen.',
      },
      {
        bookId: 'ROM',
        chapter: 1,
        verseStart: 17,
        verseEnd: 17,
        referenceLabel: 'Romans 1:17',
        text: 'For in it the righteousness of God is revealed from faith for faith, as it is written, "The righteous shall live by faith."',
      },
    ],
  },
  {
    id: 'love',
    label: 'Love',
    badgeId: 'starter_love',
    verses: [
      {
        bookId: '1CO',
        chapter: 13,
        verseStart: 4,
        verseEnd: 7,
        referenceLabel: '1 Corinthians 13:4–7',
        text: 'Love is patient and kind; love does not envy or boast; it is not arrogant or rude. It does not insist on its own way; it is not irritable or resentful; it does not rejoice at wrongdoing, but rejoices with the truth. Love bears all things, believes all things, hopes all things, endures all things.',
      },
      {
        bookId: 'JHN',
        chapter: 13,
        verseStart: 34,
        verseEnd: 34,
        referenceLabel: 'John 13:34',
        text: 'A new commandment I give to you, that you love one another: just as I have loved you, you also are to love one another.',
      },
    ],
  },
  {
    id: 'scripture',
    label: 'Scripture',
    badgeId: 'starter_scripture',
    verses: [
      {
        bookId: '2TI',
        chapter: 3,
        verseStart: 16,
        verseEnd: 16,
        referenceLabel: '2 Timothy 3:16',
        text: 'All Scripture is breathed out by God and profitable for teaching, for reproof, for correction, and for training in righteousness.',
      },
      {
        bookId: 'PSA',
        chapter: 119,
        verseStart: 105,
        verseEnd: 105,
        referenceLabel: 'Psalm 119:105',
        text: 'Your word is a lamp to my feet and a light to my path.',
      },
    ],
  },
  {
    id: 'prayer',
    label: 'Prayer',
    badgeId: 'starter_prayer',
    verses: [
      {
        bookId: 'MAT',
        chapter: 6,
        verseStart: 9,
        verseEnd: 13,
        referenceLabel: 'Matthew 6:9–13',
        text: 'Pray then like this: "Our Father in heaven, hallowed be your name. Your kingdom come, your will be done, on earth as it is in heaven. Give us this day our daily bread, and forgive us our debts, as we also have forgiven our debtors. And lead us not into temptation, but deliver us from evil."',
      },
      {
        bookId: '1JN',
        chapter: 5,
        verseStart: 14,
        verseEnd: 14,
        referenceLabel: '1 John 5:14',
        text: 'And this is the confidence that we have toward him, that if we ask anything according to his will he hears us.',
      },
    ],
  },
  {
    id: 'hope',
    label: 'Hope',
    badgeId: 'starter_hope',
    verses: [
      {
        bookId: 'JER',
        chapter: 29,
        verseStart: 11,
        verseEnd: 11,
        referenceLabel: 'Jeremiah 29:11',
        text: 'For I know the plans I have for you, declares the Lord, plans for welfare and not for evil, to give you a future and a hope.',
      },
      {
        bookId: 'ROM',
        chapter: 15,
        verseStart: 13,
        verseEnd: 13,
        referenceLabel: 'Romans 15:13',
        text: 'May the God of hope fill you with all joy and peace in believing, so that by the power of the Holy Spirit you may abound in hope.',
      },
    ],
  },
  {
    id: 'trust',
    label: 'Trust',
    badgeId: 'starter_trust',
    verses: [
      {
        bookId: 'PRO',
        chapter: 3,
        verseStart: 5,
        verseEnd: 6,
        referenceLabel: 'Proverbs 3:5–6',
        text: 'Trust in the Lord with all your heart, and do not lean on your own understanding. In all your ways acknowledge him, and he will make straight your paths.',
      },
      {
        bookId: 'PSA',
        chapter: 56,
        verseStart: 3,
        verseEnd: 3,
        referenceLabel: 'Psalm 56:3',
        text: 'When I am afraid, I put my trust in you.',
      },
    ],
  },
  {
    id: 'new_life',
    label: 'New Life',
    badgeId: 'starter_new_life',
    verses: [
      {
        bookId: '2CO',
        chapter: 5,
        verseStart: 17,
        verseEnd: 17,
        referenceLabel: '2 Corinthians 5:17',
        text: 'Therefore, if anyone is in Christ, he is a new creation. The old has passed away; behold, the new has come.',
      },
      {
        bookId: 'ROM',
        chapter: 12,
        verseStart: 1,
        verseEnd: 2,
        referenceLabel: 'Romans 12:1–2',
        text: 'I appeal to you therefore, brothers, by the mercies of God, to present your bodies as a living sacrifice, holy and acceptable to God, which is your spiritual worship. Do not be conformed to this world, but be transformed by the renewal of your mind, that by testing you may discern what is the will of God, what is good and acceptable and perfect.',
      },
    ],
  },
]

export function getStarterKitById(id: string): StarterKit | undefined {
  return STARTER_KITS.find((k) => k.id === id)
}
