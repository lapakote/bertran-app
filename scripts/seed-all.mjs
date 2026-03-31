const SUPABASE_URL = 'https://ifpoizrfuunexwvzelux.supabase.co'
const KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlmcG9penJmdXVuZXh3dnplbHV4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwMTE5NDksImV4cCI6MjA4NjU4Nzk0OX0.RY1LR8fMqWX-9c0EQVX0Y31n99p_9I22qgjiiDbPL1Q'
const H = { apikey: KEY, Authorization: 'Bearer ' + KEY, 'Content-Type': 'application/json', Prefer: 'return=representation' }

const TOPICS = {
  math:      'a6d69634-8a8d-443f-a70a-2be8c9cdc5cc',
  physics:   '48bd0be6-6853-4478-a0c8-3ec1169507f1',
  chemistry: 'b35f65ff-82bf-435c-bf1a-1c0dff410179',
}

// ─── МАТЕМАТИКА ──────────────────────────────────────────────────────────────
const MATH = [
  // Уровень 1 — базовые понятия
  { r: 'Найдите сумму элементов множества',                   a: 'Find the sum of elements of the set',                           d: 1 },
  { r: 'Постройте график функции',                            a: 'Plot the graph of the function',                                d: 1 },
  { r: 'Решите квадратное уравнение',                         a: 'Solve the quadratic equation',                                  d: 1 },
  { r: 'Найдите период тригонометрической функции',           a: 'Find the period of the trigonometric function',                 d: 1 },
  { r: 'Вычислите логарифм числа',                            a: 'Calculate the logarithm of the number',                         d: 1 },
  { r: 'Найдите область определения функции',                 a: 'Find the domain of the function',                               d: 1 },
  { r: 'Запишите уравнение прямой через две точки',           a: 'Write the equation of a line through two points',               d: 1 },
  { r: 'Вычислите вероятность события',                       a: 'Calculate the probability of an event',                         d: 1 },
  { r: 'Найдите медиану и моду выборки',                      a: 'Find the median and mode of the sample',                        d: 1 },
  { r: 'Докажите делимость числа',                            a: 'Prove the divisibility of the number',                          d: 1 },
  { r: 'Найдите количество перестановок',                     a: 'Find the number of permutations',                               d: 1 },
  { r: 'Исследуйте функцию на чётность',                      a: 'Investigate the function for parity',                           d: 1 },
  { r: 'Вычислите сумму арифметической прогрессии',           a: 'Calculate the sum of the arithmetic progression',               d: 1 },
  { r: 'Найдите n-й член геометрической прогрессии',          a: 'Find the n-th term of the geometric progression',               d: 1 },
  // Уровень 2 — средний
  { r: 'Найдите производную сложной функции',                 a: 'Find the derivative of a composite function',                   d: 2 },
  { r: 'Решите систему линейных уравнений',                   a: 'Solve the system of linear equations',                          d: 2 },
  { r: 'Вычислите определитель матрицы',                      a: 'Calculate the determinant of the matrix',                       d: 2 },
  { r: 'Найдите экстремумы функции',                          a: 'Find the extrema of the function',                              d: 2 },
  { r: 'Разложите многочлен на множители',                    a: 'Factor the polynomial',                                         d: 2 },
  { r: 'Найдите угол между векторами',                        a: 'Find the angle between vectors',                                d: 2 },
  { r: 'Запишите уравнение касательной к кривой',             a: 'Write the equation of the tangent to the curve',                d: 2 },
  { r: 'Найдите наибольшее значение функции на отрезке',      a: 'Find the maximum value of the function on the interval',        d: 2 },
  { r: 'Решите неравенство методом интервалов',               a: 'Solve the inequality using the interval method',                d: 2 },
  { r: 'Вычислите биномиальный коэффициент',                  a: 'Calculate the binomial coefficient',                            d: 2 },
  { r: 'Упростите тригонометрическое выражение',              a: 'Simplify the trigonometric expression',                         d: 2 },
  { r: 'Решите тригонометрическое уравнение',                 a: 'Solve the trigonometric equation',                              d: 2 },
  { r: 'Вычислите скалярное произведение векторов',           a: 'Calculate the dot product of vectors',                          d: 2 },
  { r: 'Решите показательное уравнение',                      a: 'Solve the exponential equation',                                d: 2 },
  { r: 'Решите логарифмическое уравнение',                    a: 'Solve the logarithmic equation',                                d: 2 },
  { r: 'Найдите уравнение плоскости в пространстве',          a: 'Find the equation of the plane in space',                       d: 2 },
  { r: 'Докажите формулу методом математической индукции',    a: 'Prove the formula by mathematical induction',                   d: 2 },
  { r: 'Запишите число в тригонометрической форме',           a: 'Write the number in trigonometric form',                        d: 2 },
  { r: 'Вычислите дисперсию случайной величины',              a: 'Calculate the variance of the random variable',                 d: 2 },
  { r: 'Найдите обратную матрицу',                            a: 'Find the inverse matrix',                                       d: 2 },
  // Уровень 3 — сложные
  { r: 'Вычислите определённый интеграл',                     a: 'Calculate the definite integral',                               d: 3 },
  { r: 'Вычислите предел последовательности',                 a: 'Calculate the limit of the sequence',                           d: 3 },
  { r: 'Решите дифференциальное уравнение первого порядка',   a: 'Solve the first-order differential equation',                   d: 3 },
  { r: 'Найдите длину дуги кривой',                           a: 'Find the arc length of the curve',                              d: 3 },
  { r: 'Вычислите частную производную функции',               a: 'Calculate the partial derivative of the function',              d: 3 },
  { r: 'Исследуйте числовой ряд на сходимость',               a: 'Investigate the numerical series for convergence',              d: 3 },
  { r: 'Вычислите несобственный интеграл',                    a: 'Calculate the improper integral',                               d: 3 },
  { r: 'Найдите собственные значения матрицы',                a: 'Find the eigenvalues of the matrix',                            d: 3 },
  { r: 'Вычислите объём тела вращения',                       a: 'Calculate the volume of a solid of revolution',                 d: 3 },
  { r: 'Найдите градиент скалярного поля',                    a: 'Find the gradient of the scalar field',                         d: 3 },
  { r: 'Вычислите тройной интеграл',                          a: 'Calculate the triple integral',                                 d: 3 },
  { r: 'Запишите разложение функции в ряд Тейлора',           a: 'Write the Taylor series expansion of the function',             d: 3 },
  { r: 'Найдите сумму числового ряда',                        a: 'Find the sum of the numerical series',                          d: 3 },
  { r: 'Исследуйте функцию методом Лагранжа',                 a: 'Investigate the function using the Lagrange method',            d: 3 },
  { r: 'Решите задачу оптимизации с ограничениями',           a: 'Solve the constrained optimisation problem',                    d: 3 },
]

// ─── ФИЗИКА ──────────────────────────────────────────────────────────────────
const PHYSICS = [
  // Уровень 1
  { r: 'Запишите второй закон Ньютона',                               a: "Write Newton's second law",                                          d: 1 },
  { r: 'Что такое инерция?',                                          a: 'What is inertia?',                                                   d: 1 },
  { r: 'Вычислите кинетическую энергию тела',                         a: 'Calculate the kinetic energy of the body',                           d: 1 },
  { r: 'Что такое потенциальная энергия?',                            a: 'What is potential energy?',                                          d: 1 },
  { r: 'Запишите закон всемирного тяготения',                         a: 'Write the law of universal gravitation',                             d: 1 },
  { r: 'Что такое электрический ток?',                                a: 'What is electric current?',                                          d: 1 },
  { r: 'Запишите закон Ома для участка цепи',                         a: "Write Ohm's law for a section of a circuit",                         d: 1 },
  { r: 'Что такое магнитное поле?',                                   a: 'What is a magnetic field?',                                          d: 1 },
  { r: 'Объясните явление интерференции света',                       a: 'Explain the phenomenon of light interference',                       d: 1 },
  { r: 'Что такое длина волны?',                                      a: 'What is wavelength?',                                                d: 1 },
  { r: 'Запишите уравнение равномерного движения',                    a: 'Write the equation of uniform motion',                               d: 1 },
  // Уровень 2
  { r: 'Сформулируйте принцип суперпозиции сил',                      a: 'State the principle of superposition of forces',                     d: 2 },
  { r: 'Вычислите работу, совершённую силой',                         a: 'Calculate the work done by the force',                               d: 2 },
  { r: 'Запишите уравнение колебательного движения',                  a: 'Write the equation of oscillatory motion',                           d: 2 },
  { r: 'Определите индуктивное сопротивление катушки',                a: 'Determine the inductive reactance of the coil',                      d: 2 },
  { r: 'Объясните эффект Доплера',                                    a: 'Explain the Doppler effect',                                         d: 2 },
  { r: 'Сформулируйте теорему о кинетической энергии',                a: 'State the work-energy theorem',                                      d: 2 },
  { r: 'Запишите уравнение состояния идеального газа',                a: 'Write the ideal gas equation of state',                              d: 2 },
  { r: 'Найдите силу Лоренца, действующую на заряд',                  a: 'Find the Lorentz force acting on the charge',                        d: 2 },
  { r: 'Вычислите ёмкость конденсатора',                              a: 'Calculate the capacitance of the capacitor',                         d: 2 },
  { r: 'Объясните явление фотоэффекта',                               a: 'Explain the photoelectric effect',                                   d: 2 },
  { r: 'Запишите закон Кулона для точечных зарядов',                  a: "Write Coulomb's law for point charges",                              d: 2 },
  { r: 'Объясните принцип работы трансформатора',                     a: 'Explain the operating principle of the transformer',                 d: 2 },
  { r: 'Сформулируйте второй закон термодинамики',                    a: 'State the second law of thermodynamics',                             d: 2 },
  { r: 'Вычислите частоту свободных колебаний контура',               a: 'Calculate the frequency of free oscillations of the circuit',        d: 2 },
  { r: 'Запишите уравнение теплового баланса',                        a: 'Write the thermal balance equation',                                 d: 2 },
  { r: 'Объясните явление диффракции света',                          a: 'Explain the phenomenon of light diffraction',                        d: 2 },
  { r: 'Найдите ускорение свободного падения через закон тяготения',  a: 'Find the gravitational acceleration through the law of gravitation',  d: 2 },
  { r: 'Запишите условие равновесия рычага',                          a: 'Write the equilibrium condition for a lever',                        d: 2 },
  // Уровень 3
  { r: 'Выведите формулу для скорости звука в газе',                  a: 'Derive the formula for the speed of sound in a gas',                 d: 3 },
  { r: 'Запишите уравнения Максвелла в интегральной форме',           a: "Write Maxwell's equations in integral form",                         d: 3 },
  { r: 'Объясните принцип неопределённости Гейзенберга',              a: "Explain Heisenberg's uncertainty principle",                         d: 3 },
  { r: 'Выведите формулу Планка для излучения абсолютно чёрного тела',a: "Derive Planck's formula for blackbody radiation",                    d: 3 },
  { r: 'Сформулируйте постулаты специальной теории относительности',  a: 'State the postulates of special relativity',                         d: 3 },
  { r: 'Объясните туннельный эффект в квантовой механике',            a: 'Explain the tunnel effect in quantum mechanics',                     d: 3 },
  { r: 'Запишите уравнение Шрёдингера для частицы в яме',             a: "Write the Schrödinger equation for a particle in a well",            d: 3 },
  { r: 'Выведите формулу релятивистской кинетической энергии',        a: 'Derive the formula for relativistic kinetic energy',                 d: 3 },
  { r: 'Объясните физический смысл волновой функции',                 a: 'Explain the physical meaning of the wave function',                  d: 3 },
]

// ─── ХИМИЯ ───────────────────────────────────────────────────────────────────
const CHEMISTRY = [
  // Уровень 1
  { r: 'Запишите электронную конфигурацию атома',              a: 'Write the electron configuration of the atom',                     d: 1 },
  { r: 'Что такое ковалентная связь?',                         a: 'What is a covalent bond?',                                         d: 1 },
  { r: 'Расставьте коэффициенты в уравнении реакции',         a: 'Balance the coefficients in the reaction equation',                d: 1 },
  { r: 'Определите степень окисления элемента',               a: 'Determine the oxidation state of the element',                    d: 1 },
  { r: 'Что такое молярная масса вещества?',                  a: 'What is the molar mass of a substance?',                          d: 1 },
  { r: 'Запишите формулу серной кислоты',                     a: 'Write the formula for sulfuric acid',                             d: 1 },
  { r: 'Что такое pH раствора?',                              a: 'What is the pH of a solution?',                                   d: 1 },
  { r: 'Назовите классы неорганических соединений',           a: 'Name the classes of inorganic compounds',                         d: 1 },
  { r: 'Что такое экзотермическая реакция?',                  a: 'What is an exothermic reaction?',                                 d: 1 },
  { r: 'Сколько электронов на внешнем уровне углерода?',      a: 'How many electrons are in the outer shell of carbon?',            d: 1 },
  { r: 'Что такое изомеры?',                                  a: 'What are isomers?',                                               d: 1 },
  { r: 'Запишите уравнение реакции нейтрализации',            a: 'Write the equation for the neutralisation reaction',              d: 1 },
  { r: 'Что такое химическое равновесие?',                    a: 'What is chemical equilibrium?',                                   d: 1 },
  { r: 'Назовите типы химических реакций',                    a: 'Name the types of chemical reactions',                            d: 1 },
  { r: 'Что такое электролиз?',                               a: 'What is electrolysis?',                                           d: 1 },
  // Уровень 2
  { r: 'Объясните принцип Ле Шателье',                        a: 'Explain Le Chatelier\'s principle',                               d: 2 },
  { r: 'Вычислите выход продукта реакции',                    a: 'Calculate the yield of the reaction product',                     d: 2 },
  { r: 'Запишите уравнение реакции горения алкана',           a: 'Write the equation for the combustion of an alkane',              d: 2 },
  { r: 'Объясните механизм реакции замещения',                a: 'Explain the mechanism of a substitution reaction',                d: 2 },
  { r: 'Найдите константу диссоциации слабой кислоты',        a: 'Find the dissociation constant of a weak acid',                  d: 2 },
  { r: 'Составьте уравнение электролиза раствора соли',       a: 'Write the equation for electrolysis of a salt solution',         d: 2 },
  { r: 'Объясните явление гидролиза соли',                    a: 'Explain the phenomenon of salt hydrolysis',                       d: 2 },
  { r: 'Запишите уравнение реакции этерификации',             a: 'Write the equation for the esterification reaction',              d: 2 },
  { r: 'Составьте схему электронного баланса реакции',        a: 'Draw the electron balance scheme for the reaction',              d: 2 },
  { r: 'Определите продукты реакции гидролиза белка',         a: 'Determine the products of protein hydrolysis',                   d: 2 },
  { r: 'Вычислите массовую долю элемента в соединении',       a: 'Calculate the mass fraction of an element in a compound',        d: 2 },
  { r: 'Объясните строение бензольного кольца',               a: 'Explain the structure of the benzene ring',                      d: 2 },
  { r: 'Запишите уравнение окислительно-восстановительной реакции', a: 'Write the equation for the oxidation-reduction reaction',   d: 2 },
  { r: 'Определите тип гибридизации атома углерода',          a: 'Determine the hybridisation type of the carbon atom',            d: 2 },
  { r: 'Составьте уравнение реакции полимеризации этилена',   a: 'Write the equation for the polymerisation of ethylene',          d: 2 },
  { r: 'Объясните принцип работы гальванического элемента',   a: 'Explain the operating principle of the galvanic cell',           d: 2 },
  // Уровень 3
  { r: 'Объясните метод молекулярных орбиталей',               a: 'Explain the molecular orbital theory',                           d: 3 },
  { r: 'Выведите уравнение Аррениуса для константы скорости',  a: "Derive the Arrhenius equation for the rate constant",            d: 3 },
  { r: 'Объясните природу ковалентной связи с позиции МВС',    a: 'Explain the nature of the covalent bond from the VB theory',     d: 3 },
  { r: 'Вычислите энергию Гиббса и предскажите направление реакции', a: "Calculate Gibbs energy and predict the reaction direction", d: 3 },
  { r: 'Объясните механизм нуклеофильного присоединения',      a: 'Explain the mechanism of nucleophilic addition',                 d: 3 },
  { r: 'Запишите уравнение Нернста для электродного потенциала', a: 'Write the Nernst equation for electrode potential',            d: 3 },
  { r: 'Объясните явление резонанса в органических молекулах', a: 'Explain the phenomenon of resonance in organic molecules',       d: 3 },
  { r: 'Выведите интегральный закон действующих масс',         a: 'Derive the integrated law of mass action',                       d: 3 },
  { r: 'Объясните теорию переходного состояния реакции',       a: 'Explain the transition state theory of a reaction',              d: 3 },
  { r: 'Запишите уравнение Гесса для теплового эффекта',       a: "Write Hess's equation for the heat effect",                      d: 3 },
]

// ─── Утилита: вставить батч ──────────────────────────────────────────────────
async function insertBatch(rows) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/phrases`, {
    method: 'POST',
    headers: H,
    body: JSON.stringify(rows),
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(JSON.stringify(err))
  }
  return res.json()
}

// ─── Основная логика ─────────────────────────────────────────────────────────
async function seedTopic(name, topicId, allPhrases) {
  // 1. Проверяем сколько уже есть
  const existing = await fetch(
    `${SUPABASE_URL}/rest/v1/phrases?topic_id=eq.${topicId}&select=russian_text`,
    { headers: H }
  ).then(r => r.json())

  const existingTexts = new Set(existing.map(p => p.russian_text))
  const needed = allPhrases.filter(p => !existingTexts.has(p.r))
  const toInsert = needed.slice(0, Math.max(0, 50 - existing.length))

  console.log(`\n📚 ${name}: уже ${existing.length}/50, добавляю ${toInsert.length}...`)

  if (toInsert.length === 0) {
    console.log(`  ✅ Уже 50+ фраз, пропускаю.`)
    return
  }

  const rows = toInsert.map(p => ({
    topic_id: topicId,
    russian_text: p.r,
    academic_context: p.a,
    difficulty_level: p.d,
    audio_url: null,
  }))

  const inserted = await insertBatch(rows)
  console.log(`  ✅ Вставлено ${inserted.length} фраз (итого ~${existing.length + inserted.length}/50)`)

  // Вывод по уровням
  const byLevel = inserted.reduce((acc, p) => {
    acc[p.difficulty_level] = (acc[p.difficulty_level] || 0) + 1
    return acc
  }, {})
  Object.entries(byLevel).sort().forEach(([lvl, cnt]) =>
    console.log(`     Уровень ${lvl}: ${cnt} фраз`)
  )
}

await seedTopic('Математика', TOPICS.math,      MATH)
await seedTopic('Физика',     TOPICS.physics,   PHYSICS)
await seedTopic('Химия',      TOPICS.chemistry, CHEMISTRY)

console.log('\n🎉 Готово! Все предметы наполнены до 50 фраз.')
