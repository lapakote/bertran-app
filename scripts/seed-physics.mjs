// Скрипт вставки 10 сложных терминов по физике в таблицу phrases
const SUPABASE_URL = 'https://ifpoizrfuunexwvzelux.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlmcG9penJmdXVuZXh3dnplbHV4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwMTE5NDksImV4cCI6MjA4NjU4Nzk0OX0.RY1LR8fMqWX-9c0EQVX0Y31n99p_9I22qgjiiDbPL1Q'

const headers = {
  apikey: SUPABASE_KEY,
  Authorization: 'Bearer ' + SUPABASE_KEY,
  'Content-Type': 'application/json',
  Prefer: 'return=representation',
}

// Шаг 1: получаем topic_id для Физики
const topicsRes = await fetch(
  `${SUPABASE_URL}/rest/v1/topics?name=eq.Физика&select=id,name`,
  { headers }
)
const topics = await topicsRes.json()

if (!topics.length) {
  console.error('❌ Тема "Физика" не найдена в таблице topics')
  process.exit(1)
}

const PHYSICS_TOPIC_ID = topics[0].id
console.log(`✅ Найдена тема "Физика" → topic_id: ${PHYSICS_TOPIC_ID}\n`)

// Шаг 2: формируем 10 сложных терминов (термодинамика + векторы)
const phrases = [
  // Термодинамика
  {
    russian_text: 'Энтропия системы возрастает в необратимых процессах',
    academic_context: 'The entropy of a system increases in irreversible processes',
    difficulty_level: 3,
  },
  {
    russian_text: 'Первое начало термодинамики связывает теплоту, работу и внутреннюю энергию',
    academic_context: 'The first law of thermodynamics relates heat, work and internal energy',
    difficulty_level: 3,
  },
  {
    russian_text: 'Адиабатический процесс протекает без теплообмена с окружающей средой',
    academic_context: 'An adiabatic process occurs without heat exchange with the surroundings',
    difficulty_level: 3,
  },
  {
    russian_text: 'Цикл Карно имеет максимальный КПД среди всех тепловых машин',
    academic_context: 'The Carnot cycle has the maximum efficiency among all heat engines',
    difficulty_level: 3,
  },
  {
    russian_text: 'Изотермическое расширение газа происходит при постоянной температуре',
    academic_context: 'Isothermal expansion of a gas occurs at constant temperature',
    difficulty_level: 2,
  },
  // Векторы и механика
  {
    russian_text: 'Скалярное произведение двух перпендикулярных векторов равно нулю',
    academic_context: 'The dot product of two perpendicular vectors equals zero',
    difficulty_level: 3,
  },
  {
    russian_text: 'Момент силы равен произведению силы на плечо',
    academic_context: 'The torque equals the force multiplied by the moment arm',
    difficulty_level: 2,
  },
  {
    russian_text: 'Проекция вектора на ось определяется через косинус угла',
    academic_context: 'The projection of a vector onto an axis is determined through the cosine of the angle',
    difficulty_level: 2,
  },
  {
    russian_text: 'Центростремительное ускорение направлено к центру окружности',
    academic_context: 'Centripetal acceleration is directed towards the centre of the circle',
    difficulty_level: 2,
  },
  {
    russian_text: 'Закон сохранения импульса выполняется в замкнутых системах',
    academic_context: 'The law of conservation of momentum holds in closed systems',
    difficulty_level: 2,
  },
].map(p => ({ ...p, topic_id: PHYSICS_TOPIC_ID }))

// Шаг 3: вставляем одним запросом
console.log(`📤 Вставляю ${phrases.length} фраз...`)
const insertRes = await fetch(`${SUPABASE_URL}/rest/v1/phrases`, {
  method: 'POST',
  headers,
  body: JSON.stringify(phrases),
})

if (!insertRes.ok) {
  const err = await insertRes.json()
  console.error('❌ Ошибка вставки:', JSON.stringify(err, null, 2))
  process.exit(1)
}

const inserted = await insertRes.json()
console.log(`\n✅ Успешно добавлено ${inserted.length} записей:\n`)
inserted.forEach((r, i) =>
  console.log(`  ${i + 1}. [lvl ${r.difficulty_level}] ${r.russian_text}`)
)
