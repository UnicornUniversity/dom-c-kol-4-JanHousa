// main.js
import { generateEmployee } from "./src/employee.js";

// Konstanty
const YEAR_MS = 365.25 * 24 * 60 * 60 * 1000;

/**
 * Vygeneruje pole zaměstnanců (původní main z úkolu 3),
 * jen přejmenované na generateEmployeeData(dtoIn).
 *
 * @param {object} dtoIn
 * @param {number} dtoIn.count
 * @param {object} dtoIn.age
 * @param {number} dtoIn.age.min
 * @param {number} dtoIn.age.max
 * @returns {Array<object>} employees
 */
export function generateEmployeeData(dtoIn) {
  const { count, age } = dtoIn;
  const minAge = age?.min;
  const maxAge = age?.max;

  if (typeof count !== "number" || count <= 0) {
    throw new Error("Invalid 'count' value in dtoIn.");
  }
  if (
    typeof minAge !== "number" ||
    typeof maxAge !== "number" ||
    minAge > maxAge
  ) {
    throw new Error("Invalid age interval in dtoIn.");
  }

  const employees = [];
  for (let i = 0; i < count; i++) {
    employees.push(generateEmployee(minAge, maxAge));
  }

  return employees;
}

/**
 * Pomocná funkce – spočítá věk v letech jako desetinné číslo.
 * Používá 365.25 dne v roce, stejně jako generování data narození.
 *
 * @param {string} birthdateIso - ISO string (např. "1990-01-01T00:00:00.000Z")
 * @returns {number} age in years (float)
 */
function computeAge(birthdateIso) {
  const now = Date.now();
  const birthMs = new Date(birthdateIso).getTime();
  return (now - birthMs) / YEAR_MS;
}

/**
 * Medián z pole čísel (pole nesmí být prázdné).
 *
 * @param {number[]} values
 * @returns {number} median
 */
function computeMedian(values) {
  const sorted = [...values].sort((a, b) => a - b);
  const n = sorted.length;
  const mid = Math.floor(n / 2);

  if (n % 2 === 1) {
    // lichý počet – prostřední hodnota
    return sorted[mid];
  } else {
    // sudý počet – průměr dvou prostředních
    return (sorted[mid - 1] + sorted[mid]) / 2;
  }
}

/**
 * Zaokrouhlení na jedno desetinné místo.
 *
 * @param {number} value
 * @returns {number}
 */
function roundToOneDecimal(value) {
  return Math.round(value * 10) / 10;
}

/**
 * Spočítá statistiky zaměstnanců podle zadání.
 *
 * @param {Array<object>} employees
 * @returns {object} dtoOut
 */
export function getEmployeeStatistics(employees) {
  const total = employees.length;

  // Pracovní úvazky
  let workload10 = 0;
  let workload20 = 0;
  let workload30 = 0;
  let workload40 = 0;

  const ages = [];
  const workloads = [];
  const womenWorkloads = [];

  for (const emp of employees) {
    const { workload, gender, birthdate } = emp;

    // Počítání workloadů
    if (workload === 10) workload10++;
    else if (workload === 20) workload20++;
    else if (workload === 30) workload30++;
    else if (workload === 40) workload40++;

    // věk
    const age = computeAge(birthdate);
    ages.push(age);

    // workload do pole
    workloads.push(workload);

    // ženy – workload
    if (gender === "female") {
      womenWorkloads.push(workload);
    }
  }

  // AGERELATED – pracujeme s desetinným věkem, zaokrouhlujeme až na konci
  const agesSorted = [...ages].sort((a, b) => a - b);
  const minAge = Math.round(agesSorted[0]);
  const maxAge = Math.round(agesSorted[agesSorted.length - 1]);

  const sumAges = ages.reduce((acc, val) => acc + val, 0);
  const averageAge = roundToOneDecimal(sumAges / total);

  const medianAgeRaw = computeMedian(ages);
  const medianAge = Math.round(medianAgeRaw); // podle zadání celé číslo

  // Workload – medián (číslo, zaokrouhlené na celé číslo)
  const workloadsSorted = [...workloads].sort((a, b) => a - b);
  const medianWorkloadRaw = computeMedian(workloadsSorted);
  const medianWorkload = Math.round(medianWorkloadRaw);

  // Průměrná výše úvazku žen
  let averageWomenWorkload = null;
  if (womenWorkloads.length > 0) {
    const sumWomenWorkloads = womenWorkloads.reduce(
      (acc, val) => acc + val,
      0
    );
    const avgWomen = sumWomenWorkloads / womenWorkloads.length;
    // dovoleno celé číslo i 1 desetinné místo – zvolíme 1 desetinné místo
    averageWomenWorkload = roundToOneDecimal(avgWomen);
  }

  // Seznam zaměstnanců setříděný dle úvazku od nejmenšího po největší
  const sortedByWorkload = [...employees].sort(
    (a, b) => a.workload - b.workload
  );

  const dtoOut = {
    total,
    workload10,
    workload20,
    workload30,
    workload40,
    averageAge,          // 1 desetinné místo
    minAge,              // celé číslo
    maxAge,              // celé číslo
    medianAge,           // celé číslo
    medianWorkload,      // celé číslo
    averageWomenWorkload, // null pokud nejsou žádné ženy / jinak 1 desetinné místo
    sortedByWorkload,
  };

  return dtoOut;
}

/**
 * Hlavní funkce – podle zadání:
 * 1) zavolá generateEmployeeData(dtoIn) – vygeneruje seznam zaměstnanců
 * 2) zavolá getEmployeeStatistics(employees) – spočítá statistiky
 * 3) vrátí dtoOut ve správné struktuře
 *
 * @param {object} dtoIn
 * @returns {object} dtoOut
 */
export function main(dtoIn) {
  const employees = generateEmployeeData(dtoIn);
  const dtoOut = getEmployeeStatistics(employees);
  return dtoOut;
}
