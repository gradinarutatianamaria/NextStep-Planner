import { expect, test } from '@playwright/test';
import { buildRecommendations } from '../src/lib/career-matching.ts';
import type { Profile } from '../src/lib/career-types.ts';

const storageKey = 'nextstep-browser-demo-v1';
const profile: Profile = {
  education: {
    degree: "Bachelor's degree",
    field: 'Psychology',
    courses: 'Research methods, statistics',
  },
  interests: ['Understanding people', 'Learning how products work'],
  currentSkills: ['Research', 'Writing'],
  desiredSkills: ['Data analysis'],
  experiences: 'Student research assistant: organized interview notes and summarized findings.',
  workStyles: ['Analyzing'],
  location: 'Chicago, IL',
  remotePreference: 'Hybrid',
  industries: ['Technology'],
};

function choiceId(value: string) {
  return `button-choice-${value.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
}

test('saved results restore current matches and profile answers after refresh', async ({ page }) => {
  const currentRecommendations = buildRecommendations(profile);
  await page.goto('/');

  await page.getByTestId('input-degree').fill(profile.education.degree);
  await page.getByTestId('input-field-of-study').fill(profile.education.field);
  await page.getByTestId('input-courses').fill(profile.education.courses);

  await page.getByTestId('button-step-2').click();
  for (const interest of profile.interests) {
    await page.getByTestId(choiceId(interest)).click();
  }

  await page.getByTestId('button-step-3').click();
  for (const skill of profile.currentSkills) {
    await page.getByTestId(choiceId(skill)).first().click();
  }
  await page.getByTestId(choiceId(profile.desiredSkills[0])).last().click();

  await page.getByTestId('button-step-4').click();
  await page.getByTestId('input-experiences').fill(profile.experiences);

  await page.getByTestId('button-step-5').click();
  await page.getByTestId('button-style-analyzing').click();
  await page.getByTestId('input-location').fill(profile.location);
  await page.getByTestId('select-remote-preference').selectOption(profile.remotePreference);
  await page.getByTestId(choiceId(profile.industries[0])).click();

  await page.getByTestId('button-find-paths').click();
  await expect(page.getByTestId('card-recommendation-1')).toBeVisible();
  await page.getByTestId('button-save-recommendations').click();
  await expect(page.getByTestId('button-save-recommendations')).toContainText('Saved on this device');

  // Simulate results saved by an older matching ruleset for the same profile.
  await page.evaluate((key) => {
    const stored = JSON.parse(localStorage.getItem(key) ?? 'null');
    if (!stored) throw new Error('The submitted profile was not saved.');
    stored.recommendations = [{
      title: 'Legacy saved career path',
      description: 'This result came from an older matching ruleset.',
      rationale: 'Stale recommendation that should never be restored.',
      existingStrengths: ['Outdated strength'],
      skillsToBuild: ['Outdated skill'],
      nextSteps: ['Outdated next step'],
      score: 99,
    }];
    localStorage.setItem(key, JSON.stringify(stored));
  }, storageKey);

  await page.reload();
  await expect(page.getByTestId('card-recommendation-1')).toBeVisible();
  await expect(page.getByTestId('button-save-recommendations')).toContainText('Saved on this device');
  await expect(page.getByText('Legacy saved career path')).toHaveCount(0);

  for (const [index, recommendation] of currentRecommendations.entries()) {
    const card = page.getByTestId(`card-recommendation-${index + 1}`);
    await expect(card.getByTestId(`text-role-title-${index + 1}`)).toHaveText(recommendation.title);
    await expect(card.locator('.fit-label strong')).toHaveText(`${recommendation.score}%`);
    await expect(card.locator('.detail-block').first().locator('p')).toHaveText(recommendation.rationale);
  }

  await page.getByTestId('button-edit-answers').click();
  await expect(page.getByTestId('input-degree')).toHaveValue(profile.education.degree);
  await expect(page.getByTestId('input-field-of-study')).toHaveValue(profile.education.field);
  await expect(page.getByTestId('input-courses')).toHaveValue(profile.education.courses);

  await page.getByTestId('button-step-2').click();
  for (const interest of profile.interests) {
    await expect(page.getByTestId(choiceId(interest))).toHaveAttribute('aria-pressed', 'true');
  }

  await page.getByTestId('button-step-3').click();
  for (const skill of profile.currentSkills) {
    await expect(page.getByTestId(choiceId(skill)).first()).toHaveAttribute('aria-pressed', 'true');
  }
  await expect(page.getByTestId(choiceId(profile.desiredSkills[0])).last()).toHaveAttribute('aria-pressed', 'true');

  await page.getByTestId('button-step-4').click();
  await expect(page.getByTestId('input-experiences')).toHaveValue(profile.experiences);

  await page.getByTestId('button-step-5').click();
  await expect(page.getByTestId('button-style-analyzing')).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByTestId('input-location')).toHaveValue(profile.location);
  await expect(page.getByTestId('select-remote-preference')).toHaveValue(profile.remotePreference);
  await expect(page.getByTestId(choiceId(profile.industries[0]))).toHaveAttribute('aria-pressed', 'true');
});
