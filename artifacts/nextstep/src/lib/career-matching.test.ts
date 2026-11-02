import assert from 'node:assert/strict';
import test from 'node:test';
import { buildRecommendations } from './career-matching';
import type { Profile } from './career-types';

const blankProfile: Profile = {
  education: { degree: '', field: '', courses: '' },
  interests: [],
  currentSkills: [],
  desiredSkills: [],
  experiences: '',
  workStyles: [],
  location: '',
  remotePreference: '',
  industries: [],
};

function makeProfile(overrides: Partial<Profile> = {}): Profile {
  return {
    ...blankProfile,
    ...overrides,
    education: { ...blankProfile.education, ...overrides.education },
  };
}

function assertUsefulResults(results: ReturnType<typeof buildRecommendations>) {
  assert.equal(results.length, 4);
  for (const result of results) {
    assert.ok(result.rationale.trim().length > 20, `${result.title} should explain why it appeared`);
    assert.match(result.rationale, /\byour\b|You shared|You have not added/);
    assert.ok(result.nextSteps.length >= 2 && result.nextSteps.length <= 3);
    assert.ok(result.nextSteps.every((step) => step.trim().length > 20));
    assert.ok(result.existingStrengths.length <= 4);
  }
}

test('research-oriented education and skills put UX research first with profile-specific rationale', () => {
  const results = buildRecommendations(makeProfile({
    education: {
      degree: 'Bachelor’s degree',
      field: 'Psychology',
      courses: 'Research methods, statistics',
    },
    interests: ['Understanding people', 'Learning how products work'],
    currentSkills: ['Research', 'Writing', 'Google Sheets'],
    desiredSkills: ['Data visualization'],
    workStyles: ['Analyzing'],
    industries: ['Technology'],
  }));

  assertUsefulResults(results);
  assert.equal(results[0].title, 'UX Research Assistant');
  assert.ok(results[0].score > 0);
  assert.match(results[0].rationale, /your interest in “Understanding people”/);
  assert.ok(results[0].existingStrengths.includes('Research'));
  assert.ok(!results[0].existingStrengths.includes('Data visualization'));
});

test('education alone can explain a recommendation without inventing current strengths', () => {
  const results = buildRecommendations(makeProfile({
    education: { degree: 'Bachelor’s degree', field: 'Psychology', courses: 'Research methods' },
  }));

  assertUsefulResults(results);
  assert.equal(results[0].title, 'UX Research Assistant');
  assert.match(results[0].rationale, /your education in “Research methods”/);
  assert.deepEqual(results[0].existingStrengths, []);
});

test('statistics education and presentation skills provide relevant role evidence', () => {
  const analystResults = buildRecommendations(makeProfile({
    education: { degree: 'Certificate', field: 'Statistics', courses: 'Probability' },
  }));
  assertUsefulResults(analystResults);
  assert.equal(analystResults[0].title, 'Junior Data Analyst');
  assert.match(analystResults[0].rationale, /your education in “Statistics”/);

  const communicationsResults = buildRecommendations(makeProfile({
    currentSkills: ['Presentation'],
  }));
  assertUsefulResults(communicationsResults);
  assert.equal(communicationsResults[0].title, 'Content & Communications Associate');
  assert.match(communicationsResults[0].rationale, /your current skill in “Presentation”/);
});

test('creative communication profiles rank content roles above unrelated paths', () => {
  const results = buildRecommendations(makeProfile({
    education: { degree: 'Associate degree', field: 'English', courses: 'Digital storytelling' },
    interests: ['Making information clearer', 'Communicating ideas', 'Design and visual storytelling'],
    currentSkills: ['Writing', 'Presentation', 'Content creation'],
    workStyles: ['Creating'],
    industries: ['Arts & media'],
    remotePreference: 'Remote',
    location: 'Portland, OR',
  }));

  assertUsefulResults(results);
  assert.equal(results[0].title, 'Content & Communications Associate');
  assert.match(results[0].rationale, /your interest in “Making information clearer”/);
  assert.match(results[0].nextSteps[2], /near Portland, OR/);
  assert.match(results[0].nextSteps[2], /Arts & media settings/);
  assert.match(results[0].nextSteps[2], /remote work options/);
});

test('community-focused profiles surface coordinating and engagement work', () => {
  const results = buildRecommendations(makeProfile({
    education: { degree: 'Certificate', field: 'Public service', courses: '' },
    interests: ['Helping a community', 'Organizing moving parts'],
    currentSkills: ['Project coordination', 'Facilitation', 'Planning'],
    experiences: 'Coordinated volunteers for a community food program.',
    workStyles: ['People'],
    industries: ['Community organizations'],
  }));

  assertUsefulResults(results);
  const topTitles = results.slice(0, 2).map((result) => result.title);
  assert.ok(topTitles.includes('Program Coordinator'));
  assert.ok(topTitles.includes('Community Engagement Associate'));
  assert.match(results[0].rationale, /your interest in “Helping a community”/);
});

test('a desired skill can guide matches without being presented as an existing strength', () => {
  const results = buildRecommendations(makeProfile({
    desiredSkills: ['Customer support'],
  }));

  assertUsefulResults(results);
  const productRole = results.find((result) => result.title === 'Product Operations Associate');
  assert.ok(productRole);
  assert.match(productRole.rationale, /your goal to build “Customer support”/);
  assert.deepEqual(productRole.existingStrengths, []);
});

test('a blank profile returns safe broad options with no fabricated fit or strengths', () => {
  const results = buildRecommendations(blankProfile);

  assertUsefulResults(results);
  for (const result of results) {
    assert.equal(result.score, 0);
    assert.match(result.rationale, /broad starting point—not a personalized match/);
    assert.deepEqual(result.existingStrengths, []);
  }
});
