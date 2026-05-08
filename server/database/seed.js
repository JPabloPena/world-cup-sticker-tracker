import initSqlJs from 'sql.js';
import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'server', 'data', 'stickers.db');

const TEAMS = [
  'ARG', 'AUS', 'AUT', 'BEL', 'BRA', 'CMR', 'CAN', 'CHN', 'COL',
  'CRO', 'CZE', 'DEN', 'ECU', 'ENG', 'ESP', 'FRA', 'GER', 'GHA', 'GRE',
  'HUN', 'IRN', 'IRL', 'ITA', 'JPN', 'KOR', 'KSA', 'MAR', 'MEX', 'NED',
  'NGA', 'NOR', 'NZL', 'PAN', 'PER', 'POL', 'POR', 'ROU', 'RUS', 'SEN',
  'SRB', 'SCO', 'SUI', 'SWE', 'TUN', 'TUR', 'UKR', 'URU', 'USA'
];

const REAL_PLAYERS = {
  BRA: ['Alisson', 'Marquinhos', 'Thiago Silva', 'Militao', 'Casemiro', 'Bruno Guimaraes', 'Paqueta', 'Neymar', 'Vinicius Jr', 'Rodri', 'Richarlison', 'Raphinha', 'Lucas Moura', 'Gabriel Jesus', 'Arthur Melo', 'Fabinho', 'Ederson', 'Gabriel Martinelli', 'Antony', 'Bremer'],
  ARG: ['Emiliano Martinez', 'Romero', 'Otamendi', 'Molina', 'Tagliafico', 'De Paul', 'Mac Allister', 'Enzo Fernandez', 'Messi', 'Di Maria', 'Lautaro Martinez', 'Julian Alvarez', 'Garnacho', 'Paredes', 'Lo Celso', 'Cuti Romero', 'Lisandro Martinez', 'Exequiel Palacios', 'Franco Armani', 'Gonzalo Montiel'],
  USA: ['Turner', 'Dest', 'Ream', 'Robinson', 'Scally', 'Adams', 'McKennie', 'Musah', 'Pulisic', 'Sargent', 'Weah', 'Balogun', 'Lletget', 'Reyna', 'Horvath', 'Carter-Vickers', 'Miles Robinson', 'Cannon', 'Roldan', 'Morris'],
  MEX: ['Ochoa', 'Chaquete', 'Morales', 'Edson Alvarez', 'Guzman', 'Lozano', 'Jimenez', 'Vega', 'Singh', 'Pineda', 'Herrera', 'Rodriguez', 'Gomez', 'Sanchez', 'Arteaga', 'Gutierrez', 'Orozco', 'Martinez', 'Cordero', 'Zubimendi'],
  ESP: ['Simon', 'Cuevas', 'Le Normand', 'Laporte', 'Carvajal', 'Rodri', 'Fabián', 'Pedri', 'Williams', 'Morata', 'Olmo', 'Sancris', 'Pino', 'Mingueza', 'Koke', 'Riquelme', 'Balde', 'Buñuel', 'Hernandez', 'Meré'],
  FRA: ['Maignan', 'Kounde', 'Upamecano', 'Konate', 'Theo Hernandez', 'Pavard', 'Tchouameni', 'Kante', 'Griezmann', 'Mbappe', 'Dembele', 'Rabiot', 'Coman', 'Thuram', 'Edouardo', 'Boey', 'Mouri', 'Clauss', 'Fofana', 'Diaby'],
  GER: ['Ter Stegen', 'Neuer', 'Rüdiger', 'Tah', 'Kimmich', 'Goretzka', 'Musiala', 'Jamala', 'Havertz', 'Werner', 'Füllkrug', 'Günter', 'Schlotter', 'Raum', 'Gosens', 'Müller', 'Sané', 'Branthwaite', 'Kehrer', 'Bella'],
  ENG: ['Pickford', 'Stones', 'Walker', 'Trippier', 'Shaw', 'Rice', 'Bellingham', 'Saka', 'Foden', 'Kane', 'Palmer', 'Stirling', 'Gallagher', 'Gomez', 'Cons', 'Maddison', 'Eze', 'Watkins', 'Gordon', 'Colwill']
};

const INTRO_NAMES = [
  'Copa del Mundo', 'Trofeo Dorado', 'Estadio', 'Balón Oficial', 'Logo FIFA',
  'Copa 2026', 'Estadio Final', 'Himno', 'Premio', 'Estrella',
  'Partido', 'Árbitro', 'Alineación', 'Goleador', 'Asistencia',
  'Hat-trick', 'Final', 'Campeón', 'Leyenda', 'Historia'
];

function saveDb(db) {
  const data = db.export();
  const buffer = Buffer.from(data);
  fs.writeFileSync(DB_PATH, buffer);
}

async function initDatabase() {
  const dbDir = path.dirname(DB_PATH);
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  const SQL = await initSqlJs();
  let db;

  if (fs.existsSync(DB_PATH)) {
    const buffer = fs.readFileSync(DB_PATH);
    db = new SQL.Database(buffer);
  } else {
    db = new SQL.Database();
  }

  db.run(`
    CREATE TABLE IF NOT EXISTS stickers (
      id TEXT PRIMARY KEY,
      country_code TEXT NOT NULL,
      name TEXT NOT NULL,
      position INTEGER NOT NULL,
      count INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`CREATE INDEX IF NOT EXISTS idx_stickers_country ON stickers(country_code)`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_stickers_name ON stickers(name)`);

  return db;
}

async function seedStickers(db) {
  db.run('DELETE FROM stickers');

  const stmt = db.prepare('INSERT INTO stickers (id, country_code, name, position, count) VALUES (?, ?, ?, ?, ?)');

  for (let i = 0; i < INTRO_NAMES.length; i++) {
    stmt.run([`FWC${i}`, 'FWC', `${INTRO_NAMES[i]}`, i, 0]);
  }

  for (const team of TEAMS) {
    const players = REAL_PLAYERS[team] || [];
    for (let i = 1; i <= 20; i++) {
      const playerName = players[i - 1] || `Jugador ${i}`;
      stmt.run([`${team}${i}`, team, playerName, i, 0]);
    }
  }

  stmt.free();
  saveDb(db);
  const total = TEAMS.length * 20 + INTRO_NAMES.length;
  console.log(`Seeded ${total} stickers (${TEAMS.length} teams x 20 + ${INTRO_NAMES.length} intro)`);
}

async function main() {
  console.log('Teams:', TEAMS.length);
  const db = await initDatabase();
  await seedStickers(db);
  saveDb(db);
  db.close();
  console.log('Database seeded successfully');
}

main();