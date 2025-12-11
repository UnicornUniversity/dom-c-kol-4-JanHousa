// main.js
import { generateEmployee } from "./src/employee.js";

const YEAR_MS = 365.25 * 24 * 60 * 60 * 1000;

/**
 * Původní main z úkolu 3 – teď jako generateEmployeeData(dtoIn).
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
 * Výpočet věku v letech jako desetinné číslo.
 */
function computeAge(birthdateIso) {
  const now = Date.now();
  const birthMs = new Date(birthdateIso).getTime();
  return (now - birthMs) / YEAR_MS;
}

/**
 * Medián z pole čísel.
 */
function computeMedian(values) {
  const sorted = [...values].sort((a, b) => a - b);
  const n = sorted.length;
  const mid = Math.floor(n / 2);

  if (n % 2 === 1) {
    return sorted[mid];
  } else {
    return (sorted[mid - 1] + sorted[mid]) / 2;
  }
}

/**
 * Zaokrouhlení na jedno desetinné místo.
 */
function roundToOneDecimal(value) {
  return Math.round(value * 10) / 10;
}

/**
 * Výpočet statistik podle zadání.
 */
export function getEmployeeStatistics(employees) {
  const total = employees.length;

  let workload10 = 0;
  let workload20 = 0;
  let workload30 = 0;
  let workload40 = 0;

  const ages = [];
  const workloads = [];
  const womenWorkloads = [];

  for (const emp of employees) {
    const { workload, gender, birthdate } = emp;

    if (workload === 10) workload10++;
    else if (workload === 20) workload20++;
    else if (workload === 30) workload30++;
    else if (workload === 40) workload40++;

    const age = computeAge(birthdate); // desetinný věk
    ages.push(age);

    workloads.push(workload);

    if (gender === "female") {
      womenWorkloads.push(workload);
    }
  }

  // MIN / MAX věk – testy chtějí zaokrouhlit DOLŮ (Math.floor), ne Math.round
  const agesSorted = [...ages].sort((a, b) => a - b);
  const minAge = Math.floor(agesSorted[0]);
  const maxAge = Math.floor(agesSorted[agesSorted.length - 1]);

  // Průměrný věk – pořád pracujeme s desetinným věkem a až na konci na 1 desetinné místo
  const sumAges = ages.reduce((acc, val) => acc + val, 0);
  const averageAge = roundToOneDecimal(sumAges / total);

  // Medián věku – opět nejdřív medián z desetinných věků, ale zaokrouhlení dolů
  const medianAgeRaw = computeMedian(ages);
  const medianAge = Math.floor(medianAgeRaw);

  // Workload – medián
  const workloadsSorted = [...workloads].sort((a, b) => a - b);
  const medianWorkloadRaw = computeMedian(workloadsSorted);
  const medianWorkload = Math.round(medianWorkloadRaw); // celé číslo

  // Průměrný workload žen
  let averageWomenWorkload = null;
  if (womenWorkloads.length > 0) {
    const sumWomenWorkloads = womenWorkloads.reduce(
      (acc, val) => acc + val,
      0
    );
    const avgWomen = sumWomenWorkloads / womenWorkloads.length;
    averageWomenWorkload = roundToOneDecimal(avgWomen);
  }

  // Seřazení zaměstnanců dle workloadu (numericky!)
  const sortedByWorkload = [...employees].sort(
    (a, b) => a.workload - b.workload
  );

  return {
    total,
    workload10,
    workload20,
    workload30,
    workload40,
    averageAge,           // 1 desetinné místo
    minAge,               // celé číslo, floor
    maxAge,               // celé číslo, floor
    medianAge,            // celé číslo, floor(mediánu)
    medianWorkload,       // celé číslo
    averageWomenWorkload, // 1 desetinné místo nebo celé číslo
    sortedByWorkload,
  };
}

/**
 * Hlavní funkce podle zadání.
 */
export function main(dtoIn) {
  const employees = generateEmployeeData(dtoIn);
  return getEmployeeStatistics(employees);
}
