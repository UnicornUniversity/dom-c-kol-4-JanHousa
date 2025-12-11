import { randomChoice, randomInRange } from "./mathUtils.js";
import { MALE_NAMES, FEMALE_NAMES, SURNAMES } from "./names.js";

// generates a single employee object with random attributes.
export function generateEmployee(minAge, maxAge) {
  const gender = randomChoice(["male", "female"]);

  const name = gender === "male"
    ? randomChoice(MALE_NAMES)
    : randomChoice(FEMALE_NAMES);

  const surname = randomChoice(SURNAMES);

  const birthdate = generateRandomBirthdate(minAge, maxAge);

  const workload = randomChoice([10, 20, 30, 40]);

  return {
    name,
    surname,
    gender,                     
    birthdate: birthdate.toISOString(), 
    workload,
  };
}

/**
 * generates a random birthdate for an employee within the specified age range.
 * A year has 365.25 days, as specified in the assignment.
 */
export function generateRandomBirthdate(minAge, maxAge) {
  const now = Date.now();
  const YEAR_MS = 365.25 * 24 * 60 * 60 * 1000;

  const minAgeMs = minAge * YEAR_MS;
  const maxAgeMs = maxAge * YEAR_MS;

  // birthTime in the interval <now - maxAgeMs, now - minAgeMs>
  const oldestBirthTime = now - maxAgeMs;
  const youngestBirthTime = now - minAgeMs;

  const randomTime = randomInRange(oldestBirthTime, youngestBirthTime);
  return new Date(randomTime);
}



