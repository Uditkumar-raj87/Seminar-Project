const genders = ['Male', 'Female', 'Non-binary'];
const ageGroups = ['18-24', '25-34', '35-44', '45-54', '55+'];
const professions = [
  'Student',
  'Software Engineer',
  'Healthcare',
  'Teacher',
  'Freelancer',
  'Manager',
  'Designer',
];

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const randomFromSeed = (seed) => {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
};

const professionScreenBase = {
  Student: 8.2,
  'Software Engineer': 9.1,
  Healthcare: 5.7,
  Teacher: 6.1,
  Freelancer: 7.8,
  Manager: 7.3,
  Designer: 8.5,
};

const professionStressDelta = {
  Student: 0.7,
  'Software Engineer': 0.8,
  Healthcare: 1.2,
  Teacher: 0.9,
  Freelancer: 0.5,
  Manager: 1.1,
  Designer: 0.6,
};

const professionProductivityDelta = {
  Student: -0.2,
  'Software Engineer': 0.4,
  Healthcare: 0.2,
  Teacher: 0.1,
  Freelancer: 0.2,
  Manager: 0.1,
  Designer: 0.3,
};

const getSleepQuality = (sleepHours, stressLevel) => {
  if (sleepHours >= 7.3 && stressLevel <= 5.2) return 'Good';
  if (sleepHours >= 6.1 && stressLevel <= 7.3) return 'Average';
  return 'Poor';
};

const getProductivityBand = (productivity) => {
  if (productivity <= 4.3) return 'Low';
  if (productivity <= 7) return 'Medium';
  return 'High';
};

export const digitalLifeData = Array.from({ length: 240 }, (_, index) => {
  const profileSeed = index + 1;
  const profession = professions[index % professions.length];
  const gender = genders[(index * 5 + 1) % genders.length];
  const ageGroup = ageGroups[(index * 3 + 2) % ageGroups.length];

  const ageSleepPenalty = {
    '18-24': 0,
    '25-34': 0.2,
    '35-44': 0.35,
    '45-54': 0.5,
    '55+': 0.65,
  }[ageGroup];

  const screenRandomOffset = (randomFromSeed(profileSeed) - 0.5) * 2.4;
  const dailyScreenTime = clamp(
    professionScreenBase[profession] + screenRandomOffset,
    2.2,
    12,
  );

  const socialMediaRandomOffset = randomFromSeed(profileSeed * 2 + 9) * 1.1;
  const socialMediaTime = clamp(
    dailyScreenTime * (0.26 + randomFromSeed(profileSeed * 5) * 0.34) + socialMediaRandomOffset,
    0.6,
    6.3,
  );

  const sleepRandomOffset = (randomFromSeed(profileSeed * 7 + 13) - 0.5) * 1.8;
  const sleepHours = clamp(
    8.8 - dailyScreenTime * 0.32 - ageSleepPenalty + sleepRandomOffset,
    3.5,
    9.4,
  );

  const stressNoise = randomFromSeed(profileSeed * 11 + 17) * 1.25;
  const stressLevel = clamp(
    2.7 +
      dailyScreenTime * 0.47 +
      (8.6 - sleepHours) * 0.52 +
      professionStressDelta[profession] +
      stressNoise,
    1,
    10,
  );

  const productivityNoise = (randomFromSeed(profileSeed * 17 + 5) - 0.5) * 1.1;
  const productivityLevel = clamp(
    9.6 -
      stressLevel * 0.43 -
      Math.max(0, dailyScreenTime - 7) * 0.57 +
      sleepHours * 0.37 +
      professionProductivityDelta[profession] +
      productivityNoise,
    1,
    10,
  );

  const eyeStrainThreshold = 5.9 + randomFromSeed(profileSeed * 19 + 3) * 1.2;
  const eyeStrain = dailyScreenTime >= eyeStrainThreshold ? 'Yes' : 'No';

  return {
    id: index + 1,
    Gender: gender,
    Age_Group: ageGroup,
    Profession_Type: profession,
    Daily_Screen_Time: Number(dailyScreenTime.toFixed(2)),
    Social_Media_Time: Number(socialMediaTime.toFixed(2)),
    Sleep_Hours: Number(sleepHours.toFixed(2)),
    Stress_Level: Number(stressLevel.toFixed(2)),
    Productivity_Level: Number(productivityLevel.toFixed(2)),
    Productivity_Band: getProductivityBand(productivityLevel),
    Eye_Strain: eyeStrain,
    Sleep_Quality: getSleepQuality(sleepHours, stressLevel),
  };
});

export const filterOptions = {
  gender: genders,
  ageGroup: ageGroups,
  profession: professions,
};

export const productivityOrder = ['Low', 'Medium', 'High'];
export const sleepQualityOrder = ['Good', 'Average', 'Poor'];
export const screenBins = ['0-3h', '3-5h', '5-7h', '7-9h', '9-11h', '11h+'];
