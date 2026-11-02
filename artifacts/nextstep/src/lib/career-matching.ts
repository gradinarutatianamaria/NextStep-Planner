import type { Profile, Recommendation } from './career-types';

type EvidenceKind =
  | 'interest'
  | 'current skill'
  | 'skill goal'
  | 'work style'
  | 'industry preference'
  | 'education'
  | 'experience';

type ProfileEvidence = { kind: EvidenceKind; value: string };

type CareerPath = {
  title: string;
  description: string;
  signals: string[];
  strengths: string[];
  build: string[];
  next: string[];
};

const paths: CareerPath[] = [
  {
    title: 'UX Research Assistant',
    description: 'Help teams understand how people use a service or product. Early-career roles often support interviews, usability sessions, and clear summaries of what people need.',
    signals: ['Understanding people', 'Research', 'Analyzing', 'Technology', 'Design and visual storytelling', 'Listening', 'Psychology'],
    strengths: ['Research', 'Listening', 'Writing'],
    build: ['Interview and usability-study practice', 'Research ethics and accessible methods', 'A short case study showing your process'],
    next: ['Try a five-person usability review of a public website and write a one-page findings brief.', 'Explore entry-level research coordinator and UX research assistant job descriptions in an industry you care about.', 'Practice turning one observation into a clear, evidence-based recommendation.'],
  },
  {
    title: 'Program Coordinator',
    description: 'Keep a program moving by coordinating people, schedules, resources, and follow-through. Roles range from campus programs to community and public-service organizations.',
    signals: ['Helping a community', 'Organizing moving parts', 'People', 'Project coordination', 'Education', 'Public service', 'Community organizations'],
    strengths: ['Planning', 'Team collaboration', 'Communication'],
    build: ['Budget and timeline tracking', 'Stakeholder updates', 'Basic evaluation and outcome reporting'],
    next: ['Map a small event or volunteer project from idea to follow-up using a simple timeline.', 'Ask a local nonprofit or campus group about a short-term coordination opportunity.', 'Compare coordinator roles in two sectors to see which day-to-day work appeals.'],
  },
  {
    title: 'Content & Communications Associate',
    description: 'Turn complex ideas into useful, clear messages for a specific audience. Early roles may include writing, editing, newsletters, web updates, or campaign support.',
    signals: ['Making information clearer', 'Communicating ideas', 'Writing', 'Creating', 'Arts & media', 'Content creation', 'Education'],
    strengths: ['Writing', 'Presentation', 'Research'],
    build: ['Editing for different audiences and formats', 'Content planning and basic analytics', 'A small portfolio of published or sample work'],
    next: ['Rewrite a complicated public-facing page so a new reader can understand it quickly.', 'Create two or three samples in different formats, such as a short article and an email.', 'Look for communications assistant roles at organizations whose work you already follow.'],
  },
  {
    title: 'People Operations Coordinator',
    description: 'Support the practical systems that help people join, learn, and do their work. Depending on the organization, this can include onboarding, learning programs, or employee support.',
    signals: ['Understanding people', 'Helping a community', 'People', 'Organizing moving parts', 'Psychology', 'Listening', 'Team collaboration'],
    strengths: ['Listening', 'Organization', 'Communication'],
    build: ['Confidentiality and employment-practice basics', 'People systems and spreadsheet confidence', 'Clear, consistent process documentation'],
    next: ['Draft a thoughtful first-week checklist for someone joining a team.', 'Talk with a people operations professional about the balance of service and process in their work.', 'Search for people coordinator, onboarding coordinator, and learning coordinator roles.'],
  },
  {
    title: 'Junior Data Analyst',
    description: 'Use spreadsheets and other tools to organize information, spot patterns, and answer practical questions. Many junior roles pair analysis with clear communication.',
    signals: ['Finding patterns', 'Analyzing', 'Data analysis', 'Data visualization', 'Google Sheets', 'Research', 'Improving a process', 'Problem-solving', 'Statistics'],
    strengths: ['Research', 'Problem-solving', 'Google Sheets'],
    build: ['SQL fundamentals and data cleaning', 'A visualization tool such as Tableau or Power BI', 'A portfolio project with a written explanation of your findings'],
    next: ['Choose an open dataset connected to a topic you care about and ask one specific question.', 'Practice cleaning, summarizing, and charting the data in a spreadsheet.', 'Read entry-level analyst postings and note which tools appear most often in your target sector.'],
  },
  {
    title: 'Product Operations Associate',
    description: 'Help a product team work smoothly by connecting customer feedback, internal processes, and useful documentation. The role blends organization with curiosity about how products improve.',
    signals: ['Learning how products work', 'Improving a process', 'Organizing moving parts', 'Technology', 'Problem-solving', 'Customer support'],
    strengths: ['Planning', 'Research', 'Team collaboration'],
    build: ['Product lifecycle and roadmap basics', 'Issue tracking and documentation tools', 'Ways to summarize customer feedback'],
    next: ['Choose an app you use and sketch one small improvement, including who it helps and why.', 'Practice writing a concise product feedback brief from several user comments.', 'Explore product operations, product support, and customer experience associate roles.'],
  },
  {
    title: 'Community Engagement Associate',
    description: 'Build relationships between an organization and the people it serves. The work can include outreach, events, listening sessions, and sharing community perspectives.',
    signals: ['Helping a community', 'Teaching and learning', 'People', 'Public service', 'Community organizations', 'Listening'],
    strengths: ['Listening', 'Facilitation', 'Communication'],
    build: ['Inclusive outreach and facilitation', 'Event and contact tracking', 'Community-informed evaluation'],
    next: ['Volunteer for one community event and notice what makes participation welcoming.', 'Practice writing an outreach message that is specific, accessible, and easy to act on.', 'Look at community engagement roles in local government, education, or mission-led organizations.'],
  },
];

function normalize(value: string) {
  return value
    .normalize('NFKD')
    .replace(/\p{Diacritic}/gu, '')
    .toLocaleLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim();
}

function containsPhrase(text: string, phrase: string) {
  const normalizedText = normalize(text);
  const normalizedPhrase = normalize(phrase);
  return Boolean(normalizedPhrase) && ` ${normalizedText} `.includes(` ${normalizedPhrase} `);
}

function evidenceFor(profile: Profile): ProfileEvidence[] {
  return [
    ...profile.interests.map((value) => ({ kind: 'interest' as const, value })),
    ...profile.currentSkills.map((value) => ({ kind: 'current skill' as const, value })),
    ...profile.desiredSkills.map((value) => ({ kind: 'skill goal' as const, value })),
    ...profile.workStyles.map((value) => ({ kind: 'work style' as const, value })),
    ...profile.industries.map((value) => ({ kind: 'industry preference' as const, value })),
    ...[profile.education.degree, profile.education.field, profile.education.courses]
      .filter((value) => value.trim())
      .map((value) => ({ kind: 'education' as const, value })),
    ...(profile.experiences.trim() ? [{ kind: 'experience' as const, value: profile.experiences }] : []),
  ];
}

function describeEvidence(evidence: ProfileEvidence, signal: string) {
  switch (evidence.kind) {
    case 'interest':
      return `your interest in “${evidence.value}”`;
    case 'current skill':
      return `your current skill in “${evidence.value}”`;
    case 'skill goal':
      return `your goal to build “${evidence.value}”`;
    case 'work style':
      return `your preference for “${evidence.value}” work`;
    case 'industry preference':
      return `your preference for the ${evidence.value} industry`;
    case 'education':
      return `your education in “${evidence.value}”`;
    case 'experience':
      return `your experience mentioning “${signal}”`;
  }
}

function joinList(items: string[]) {
  if (items.length < 2) return items[0] ?? '';
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(', ')}, and ${items.at(-1)}`;
}

function profileContext(profile: Profile) {
  const context = [
    ...profile.interests.map((value) => `an interest in “${value}”`),
    ...profile.currentSkills.map((value) => `a current skill in “${value}”`),
    ...profile.desiredSkills.map((value) => `a goal to build “${value}”`),
    ...profile.workStyles.map((value) => `a preference for “${value}” work`),
    profile.education.field ? `education in “${profile.education.field}”` : '',
    profile.education.degree ? `the program “${profile.education.degree}”` : '',
    profile.education.courses ? 'coursework or training' : '',
    profile.experiences.trim() ? 'work, volunteer, or project experience' : '',
    profile.industries.length ? `a preference for ${profile.industries.slice(0, 2).join(' or ')}` : '',
    profile.location ? `a location preference for ${profile.location}` : '',
    profile.remotePreference && profile.remotePreference !== 'Flexible'
      ? `a ${profile.remotePreference.toLowerCase()} work preference`
      : '',
  ].filter(Boolean);
  return context.slice(0, 2);
}

function rationaleFor(
  profile: Profile,
  matchedSignals: string[],
  evidence: ProfileEvidence[],
) {
  const reasons: string[] = [];
  for (const signal of matchedSignals) {
    const source = evidence.find((item) => containsPhrase(item.value, signal));
    if (!source) continue;
    const reason = describeEvidence(source, signal);
    if (!reasons.includes(reason)) reasons.push(reason);
    if (reasons.length === 3) break;
  }

  if (reasons.length) {
    return `This path connects with ${joinList(reasons)}. These are useful reasons to explore it—not a prediction of how you would perform.`;
  }

  const context = profileContext(profile);
  if (context.length) {
    return `You shared ${joinList(context)}, but those answers do not point directly to this path yet. Treat it as a broad option to compare, not a personalized fit.`;
  }
  return 'You have not added career details yet, so this is a broad starting point—not a personalized match. Add an interest or skill to see more tailored suggestions.';
}

export function buildRecommendations(profile: Profile): Recommendation[] {
  const evidence = evidenceFor(profile);
  const ranked = paths.map((path) => {
    const matchingCues = [...new Set([...path.signals, ...path.strengths])];
    const matchedSignals = matchingCues.filter((signal) =>
      evidence.some((item) => containsPhrase(item.value, signal)),
    );
    const score = Math.round((matchedSignals.length / matchingCues.length) * 100);
    const existingStrengths = profile.currentSkills
      .filter((skill, index, all) =>
        all.findIndex((other) => normalize(other) === normalize(skill)) === index,
      )
      .filter((skill) =>
        [...path.signals, ...path.strengths].some(
          (signal) => containsPhrase(signal, skill) || containsPhrase(skill, signal),
        ),
      )
      .slice(0, 4);
    const searchContext = [
      profile.location ? `near ${profile.location}` : '',
      profile.industries.length ? `in ${profile.industries.slice(0, 2).join(' or ')} settings` : '',
      profile.remotePreference && profile.remotePreference !== 'Flexible'
        ? `with ${profile.remotePreference.toLowerCase()} work options`
        : '',
    ].filter(Boolean);
    const nextSteps = searchContext.length
      ? [
          ...path.next.slice(0, 2),
          `Search for ${path.title.toLowerCase()} roles ${searchContext.join(', ')} and compare current employer requirements.`,
        ]
      : path.next;

    return {
      title: path.title,
      description: path.description,
      rationale: rationaleFor(profile, matchedSignals, evidence),
      existingStrengths,
      skillsToBuild: path.build,
      nextSteps,
      score,
    };
  });

  return ranked.sort((a, b) => b.score - a.score).slice(0, 4);
}
