import initSqlJs from 'sql.js';
import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'server', 'data', 'stickers.db');

const TEAMS = [
  'MEX', 'RSA', 'KOR', 'CZE', 'CAN', 'BIH', 'QAT', 'SUI', 'BRA', 'MAR',
  'HAI', 'SCO', 'USA', 'PAR', 'AUS', 'TUR', 'GER', 'CUW', 'CIV', 'ECU',
  'NED', 'JPN', 'SWE', 'TUN', 'BEL', 'EGY', 'IRN', 'NZL', 'ESP', 'CPV',
  'KSA', 'URU', 'FRA', 'SEN', 'IRQ', 'NOR', 'ARG', 'ALG', 'AUT', 'JOR',
  'POR', 'COD', 'UZB', 'COL', 'ENG', 'CRO', 'GHA', 'PAN'
];

const PLAYERS = {
  MEX: ['Panini Logo', 'Luis Malagón', 'Johan Vasquez', 'Jorge Sánchez', 'Cesar Montes', 'Jesus Gallardo', 'Israel Reyes', 'Diego Lainez', 'Carlos Rodriguez', 'Edson Alvarez', 'Orbelin Pineda', 'Marcel Ruiz', 'Team Photo', 'Érick Sánchez', 'Hirving Lozano', 'Santiago Giménez', 'Raúl Jiménez', 'Alexis Vega', 'Roberto Alvarado', 'Cesar Huerta'],
  RSA: ['Team Logo', 'Ronwen Williams', 'Sipho Chaine', 'Aubrey Modiba', 'Samukele Kabini', 'Mbekezeli Mbokazi', 'Khulumani Ndamane', 'Siyabonga Ngezana', 'Khuliso Mudau', 'Nkosinathi Sibisi', 'Teboho Mokoena', 'Thalente Mbatha', 'Team Photo', 'Bathasi Aubaas', 'Yaya Sithole', 'Sipho Mbule', 'Lyle Foster', 'Iqraam Rayners', 'Mohau Nkota', 'Oswin Appollis'],
  KOR: ['Team Logo', 'Hyeon-woo Jo', 'Seung-Gyu Kim', 'Min-jae Kim', 'Yu-min Cho', 'Young-woo Seol', 'Han-beom Lee', 'Tae-seok Lee', 'Myung-jae Lee', 'Jae-sung Lee', 'In-beom Hwang', 'Kang-in Lee', 'Team Photo', 'Seung-ho Paik', 'Jens Castrop', 'Dongg-yeong Lee', 'Gue-sung Cho', 'Heung-min Son', 'Hee-chan Hwang', 'Hyeon-Gyu Oh'],
  CZE: ['Team Logo', 'Matej Kovar', 'Jindrich Stanek', 'Ladislav Krejci', 'Vladimir Coufal', 'Jaroslav Zeleny', 'Tomas Holes', 'David Zima', 'Michal Sadilek', 'Lukas Provod', 'Lukas Cerv', 'Tomas Soucek', 'Team Photo', 'Pavel Sulc', 'Matej Vydra', 'Vasil Kusej', 'Tomas Chory', 'Vaclav Cerny', 'Adam Hlozek', 'Patrik Schick'],
  CAN: ['Team Logo', 'Dayne St.Clair', 'Alphonso Davies', 'Alistair Johnston', 'Samuel Adekugbe', 'Riche Larvea', 'Derek Cornelius', 'Moïse Bombito', 'Kamal Miller', 'Stephen Eustáquio', 'Ismaël Koné', 'Jonathan Osborne', 'Team Photo', 'Jacob Shaffelburg', 'Mathieu Choinière', 'Niko Sigur', 'Tajon Buchanan', 'Liam Millar', 'Cyle Larin', 'Jonathan David'],
  BIH: ['Team Logo', 'Nikola Vasilj', 'Amer Dedic', 'Sead Kolasinac', 'Tarik Muharemovic', 'Nihad Mujakic', 'Nikola Katic', 'Amir Hadziahmetovic', 'Benjamin Tahirovic', 'Armin Gigovic', 'Ivan Sunjic', 'Ivan Basic', 'Team Photo', 'Dzenis Burnic', 'Esmir Bajraktarevic', 'Amar Memic', 'Ermedin Demirovic', 'Edin Dzeko', 'Samed Bazdar', 'Haris Tabakovic'],
  QAT: ['Team Logo', 'Meshaal Barsham', 'Sultan Albrake', 'Lucas Mendes', 'Homam Ahmed', 'Boualem Khoukhi', 'Pedro Miguel', 'Tarek Salman', 'Mohamed Al-Mannai', 'Karim Boudiaf', 'Assim Madibo', 'Ahmed Fatehi', 'Team Photo', 'Mohammed Waad', 'Abdulaziz Hatem', 'Hassan Al-Haydos', 'Edmilson Junior', 'Akram Hassan Afif', 'Ahmed Al Ganehi', 'Almoez Ali'],
  SUI: ['Team Logo', 'Gregor Kobel', 'Yvon Mvogo', 'Manuel Akanji', 'Ricardo Rodriguez', 'Nico Elvedi', 'Aurèle Amenda', 'Silvan Wide Mer', 'Granit Xhaka', 'Denis Zakaria', 'Remo Freuler', 'Fabian Rieder', 'Team Photo', 'Ardon Jashari', 'Johan Manzambi', 'Michel Aebischer', 'Breel Embolo', 'Ruben Vargas', 'Dan Ndoye', 'Zeki Amdouni'],
  BRA: ['Team Logo', 'Alisson', 'Bento', 'Marquinhos', 'Éder Militão', 'Gabriel Magalhães', 'Danilo', 'Wesley', 'Lucas Paquetá', 'Casemiro', 'Bruno Guimarães', 'Luiz Henrique', 'Team Photo', 'Vinicius Júnior', 'Rodrygo', 'João Pedro', 'Matheus Cunha', 'Gabriel Martinelli', 'Raphinha', 'Estévão'],
  MAR: ['Team Logo', 'Yassine Bounou', 'Munir El Kajoui', 'Achraf Hakimi', 'Noussair Mazraoui', 'Nayef Aguerd', 'Roman Saiss', 'Jawad El Yamio', 'Adam Masina', 'Sofyan Amrabat', 'Azzedine Ounahi', 'Eliesse Ben Seghir', 'Team Photo', 'Bilal El Khannouss', 'Ismael Saibari', 'Youssef En-Nesyri', 'Abde Ezzalzouli', 'Soufiane Rahimi', 'Brahim Diaz', 'Ayoub El Kaabi'],
  HAI: ['Team Logo', 'Johny Placide', 'Carlens Arcus', 'Martin Expérience', 'Jean-Kevin Duverne', 'Ricardo Adé', 'Duke Lacroix', 'Garven Metusala', 'Hannes Delcroix', 'Leverton Pierre', 'Danley Jean Jacques', 'Jean-Ricner Bellegarde', 'Team Photo', 'Christopher Attys', 'Derrick Etienne Jr', 'Josue Casimir', 'Ruben Providence', 'Duckens Nazon', 'Louicius Deedson', 'Frantzdy Pierrot'],
  SCO: ['Team Logo', 'Angus Gunn', 'Jack Hendry', 'Kieran Tierney', 'Aaron Hickey', 'Andrew Robertson', 'Scott McKenna', 'John Souttar', 'Anthony Ralston', 'Grant Hanley', 'Scott McTominay', 'Billy Gilmour', 'Team Photo', 'Lewis Ferguson', 'Ryan Christie', 'Kenny McLean', 'John McGinn', 'Lyndon Dykes', 'Che Adams', 'Ben Gannon-Doak'],
  USA: ['Team Logo', 'Math Freese', 'Chris Richards', 'Tim Ream', 'Mark McKenzie', 'Alex Freeman', 'Antonee Robinson', 'Tyler Adams', 'Tanner Tessmann', 'Weston McKennie', 'Christian Roldan', 'Timothy Weah', 'Team Photo', 'Diego Luna', 'Malik Tillman', 'Christian Pulisic', 'Brenden Aaronson', 'Ricardo Pepi', 'Haji Wright', 'Folarin Balogun'],
  PAR: ['Team Logo', 'Roberto Fernandez', 'Orlando Gill', 'Gustavo Gomez', 'Fabián Balbuena', 'Juan José Cáceres', 'Omar Alderete', 'Junior Alonso', 'Mathías Villasanti', 'Diego Gomez', 'Damián Bobadilla', 'Andres Cubas', 'Team Photo', 'Matias Galarza Fonda', 'Julio Enciso', 'Alejandro Romero Gamarra', 'Miguel Almirón', 'Ramon Sosa', 'Angel Romero', 'Antonio Sanabria'],
  AUS: ['Team Logo', 'Mathew Ryan', 'Joe Gauci', 'Harry Souttar', 'Alessandro Circati', 'Jordan Bos', 'Aziz Behich', 'Cameron Burgess', 'Lewis Miller', 'Milos Degenek', 'Jackson Irvine', 'Riley McGree', 'Team Photo', 'Aiden O\'Neill', 'Connor Metcalfe', 'Patrick Yazbek', 'Craig Goodwin', 'Kusini Vengi', 'Nestory Irankunda', 'Mohamed Touré'],
  TUR: ['Team Logo', 'Ugurcan Cakir', 'Mert Muldur', 'Zeki Celik', 'Abdulkerim Bardakci', 'Caglar Soyuncu', 'Merih Demiral', 'Ferdi Kadioglu', 'Kaan Ayhan', 'Ismail Yuksek', 'Hakan Calhanoglu', 'Orkun Kokcu', 'Team Photo', 'Arda Guler', 'Irfan Can Kahveci', 'Yunus Akgun', 'Can Uzun', 'Baris Alper Yilmaz', 'Kerem Akturkoglu', 'Kenan Yildiz'],
  GER: ['Team Logo', 'Marc-André ter Stegen', 'Jonathan Tah', 'David Raum', 'Nico Schlotterbeck', 'Antonio Rüdiger', 'Waldemar Anton', 'Ridle Baku', 'Maximilian Mittelstadt', 'Joshua Kimmich', 'Florian Wirtz', 'Felix Nmecha', 'Team Photo', 'Leon Goretzka', 'Jamal Musiala', 'Serge Gnabry', 'Kai Havertz', 'Leroy Sane', 'Karim Adeyemi', 'Nick Woltemade'],
  CUW: ['Team Logo', 'Eloy Room', 'Armando Obispo', 'Sherel Floranus', 'Jurien Gaari', 'Joshua Brenet', 'Roshon Van Eijma', 'Shurandy Sambo', 'Livano Comenencia', 'Godfried Roemeratoe', 'Juninho Bacuna', 'Leandro Bacuna', 'Team Photo', 'Tahith Chong', 'Kenji Gorre', 'Jearl Margaritha', 'Jurgen Locadia', 'Jeremy Antonisse', 'Gervane Kastaneer', 'Sontje Hansen'],
  CIV: ['Team Logo', 'Yahia Fofana', 'Ghislain Konan', 'Wilfried Singo', 'Odilon Kossounou', 'Evan Ndicka', 'Willy Boly', 'Emmanuel Agbadou', 'Ousmane Diomande', 'Franck Kessie', 'Seko Fofana', 'Ibrahim Sangare', 'Team Photo', 'Jean-Philippe Gbamin', 'Amad Diallo', 'Sébastien Haller', 'Simon Adingra', 'Yan Diomande', 'Evann Guessand', 'Oumar Diakite'],
  ECU: ['Team Logo', 'Hernán Galíndez', 'Gonzalo Valle', 'Piero Hincapie', 'Pervis Estupiñán', 'Willian Pacho', 'Ángel Preciado', 'Joel Ordóñez', 'Moises Caicedo', 'Alan Franco', 'Kendry Paez', 'Pedro Vite', 'Team Photo', 'John Veboah', 'Leonardo Campana', 'Gonzalo Plata', 'Nilson Angulo', 'Alan Minda', 'Kevin Rodriguez', 'Enner Valencia'],
  NED: ['Team Logo', 'Bart Verbruggen', 'Virgil van Dijk', 'Micky van de Ven', 'Jurrien Timber', 'Denzel Dumfries', 'Nathan Aké', 'Jeremie Frimpong', 'Jan Paul van Hecke', 'Tijjani Reijnders', 'Ryan Gravenberch', 'Teun Koopmeiners', 'Team Photo', 'Frenkie de Jong', 'Xavi Simons', 'Justin Kluivert', 'Memphis Depay', 'Donyell Malen', 'Wout Weghorst', 'Cody Gakpo'],
  JPN: ['Team Logo', 'Zion Suzuki', 'Henry Heroki Mochizuki', 'Ayumu Seko', 'Junnosuke Suzuki', 'Shogo Taniguchi', 'Tsuyoshi Watanabe', 'Kaishu Sano', 'Yuki Soma', 'Ao Tanaka', 'Daichi Kamada', 'Takefusa Kubo', 'Team Photo', 'Ritsu Doan', 'Keito Nakamura', 'Takumi Minamino', 'Shuto Machino', 'Junya Ito', 'Koki Ogawa', 'Ayase Ueda'],
  SWE: ['Team Logo', 'Victor Johansson', 'Isak Hien', 'Gabriel Gudmundsson', 'Emil Holm', 'Victor Nilsson Lindelöf', 'Gustaf Lagerbielke', 'Lucas Bergvall', 'Hugo Larsson', 'Jesper Karlström', 'Yasin Ayari', 'Mattias Svanberg', 'Team Photo', 'Daniel Svensson', 'Ken Sema', 'Roony Bardghji', 'Dejan Kulusevski', 'Anthony Elanga', 'Alexander Isak', 'Viktor Gyökeres'],
  TUN: ['Team Logo', 'Bechir Ben Said', 'Aymen Dahmen', 'Yan Valery', 'Montassar Talbi', 'Yassine Meriah', 'Ali Abdi', 'Dylan Bronn', 'Ellyes Skhiri', 'Aissa Laidouni', 'Ferjani Sassi', 'Mohamed Ali Ben Romdhane', 'Team Photo', 'Hannibal Mejbri', 'Elias Achouri', 'Elias Saad', 'Hazem Mastouri', 'Ismael Gharbi', 'Sayfallah Ltaief', 'Naim Sliti'],
  BEL: ['Team Logo', 'Thibaut Courtois', 'Arthur Theate', 'Timothy Castagne', 'Zeno Debast', 'Brandon Mechele', 'Maxim De Cuyper', 'Thomas Meunier', 'Youri Tielemans', 'Amadou Onana', 'Nicolas Raskin', 'Alexis Saelemaekers', 'Team Photo', 'Hans Vanaken', 'Kevin De Bruyne', 'Jérémy Doku', 'Charles De Ketelaere', 'Loïs Openda', 'Romelu Lukaku'],
  EGY: ['Team Logo', 'Mohamed El Shenawy', 'Mohamed Hany', 'Mohamed Hamdy', 'Yasser Ibrahim', 'Khaled Sobhi', 'Ramy Rabia', 'Hossam Abdelmaguid', 'Ahmed Fatouh', 'Marwan Attia', 'Zizo', 'Hamdy Fathy', 'Team Photo', 'Mohamed Lasheen', 'Emam Ashour', 'Osama Faisal', 'Mohamed Salah', 'Mostafa Mohamed', 'Trezeguet', 'Omar Marmoush'],
  IRN: ['Team Logo', 'Alireza Beiranvand', 'Morteza Pouraliganji', 'Ehsan Hajsafi', 'Milad Mohammadi', 'Shojae Khalilzadeh', 'Ramin Rezaeian', 'Hossein Kanaani', 'Sadegh Moharrami', 'Saleh Hardani', 'Saeed Ezatolahi', 'Saman Ghoddos', 'Team Photo', 'Omid Noorafkan', 'Roozbeh Cheshmi', 'Mohammad Mohebi', 'Sardar Azmoun', 'Mehdi Taremi', 'Alireza Jahanbakhsh', 'Ali Gholizadeh'],
  NZL: ['Team Logo', 'Max Crocombe Payne', 'Alex Paulsen', 'Michael Boxall', 'Liberato Cacace', 'Tim Payne', 'Tyler Bindon', 'Francis de Vries', 'Finn Surman', 'Joe Bell', 'Sarpreet Singh', 'Ryan Thomas', 'Team Photo', 'Matthew Garbett', 'Marko Stamenić', 'Ben Old', 'Chris Wood', 'Elijah Just', 'Callum McCowatt', 'Kosta Barbarouses'],
  ESP: ['Team Logo', 'Unai Simon', 'Robin Le Normand', 'Aymeric Laporte', 'Dean Huijsen', 'Pedro Porro', 'Dani Carvajal', 'Marc Cucurella', 'Martín Zubimendi', 'Rodri', 'Pedri', 'Fabian Ruiz', 'Team Photo', 'Mikel Merino', 'Lamine Yamal', 'Dani Olmo', 'Nico Williams', 'Ferran Torres', 'Álvaro Morata', 'Mikel Oyarzabal'],
  CPV: ['Team Logo', 'Vozinha', 'Logan Costa', 'Pico', 'Diney', 'Steven Moreira', 'Wagner Pina', 'Joao Paulo', 'Yannick Semedo', 'Kevin Pina', 'Patrick Andrade', 'Jamiro Monteiro', 'Team Photo', 'Deroy Duarte', 'Garry Rodrigues', 'Jovane Cabral', 'Ryan Mendes', 'Dailon Livramento', 'Willy Semedo', 'Bebe'],
  KSA: ['Team Logo', 'Nawaf Alaqidi', 'Abdulrahman Al-Sanbi', 'Saud Abdulhamid', 'Nawaf Bouwashl', 'Jihad Thakri', 'Moteb Al-Harbi', 'Hassan Altambakti', 'Musab Aljuwayr', 'Ziyad Aljohani', 'Abdullah Alkhaibari', 'Nasser Aldawsari', 'Team Photo', 'Saleh Abu Alshamat', 'Marwan Alsahafi', 'Salem Aldawsari', 'Abdulrahman Al-Aboud', 'Feras Akbrikan', 'Saleh Alshehri', 'Abdullah Al-Hamdan'],
  URU: ['Team Logo', 'Sergio Rochet', 'Santiago Mele', 'Ronald Araujo', 'José María Giménez', 'Sebastian Caceres', 'Mathias Olivera', 'Guillermo Varela', 'Nahitan Nandez', 'Federico Valverde', 'Giorgian De Arrascaeta', 'Rodrigo Bentancur', 'Team Photo', 'Manuel Ugarte', 'Nicolás de la Cruz', 'Maxi Araujo', 'Darwin Núñez', 'Federico Viñas', 'Rodrigo Aguirre', 'Facundo Pellistri'],
  FRA: ['Team Logo', 'Mike Maignan', 'Theo Hernandez', 'William Saliba', 'Jules Kounde', 'Ibrahima Konate', 'Dayot Upamecano', 'Lucas Digne', 'Aurélien Tchouaméni', 'Eduardo Camavinga', 'Manu Kone', 'Adrien Rabiot', 'Team Photo', 'Michael Olise', 'Ousmane Dembele', 'Bradley Barcola', 'Désiré Doué', 'Kingsley Coman', 'Hugo Ekitike', 'Kylian Mbappe'],
  SEN: ['Team Logo', 'Edouard Mendy', 'Yehvann Diouf', 'Moussa Niakhaté', 'Abdoulaye Seck', 'Ismail Jakobs', 'El Hadji Malick Diouf', 'Kalidou Koulibaly', 'Idrissa Gana Gueye', 'Pape Matar Sarr', 'Pape Gueye', 'Habib Diarra', 'Team Photo', 'Lamine Camara', 'Sadio Mane', 'Ismaïla Sarr', 'Boulaye Dia', 'Iliman Ndiaye', 'Nicolas Jackson', 'Krepin Diatta'],
  IRQ: ['Team Logo', 'Jalal Hassan', 'Rebin Sulaka', 'Hussein Ali', 'Akam Hashem', 'Merchas Doski', 'Zaid Tahseen', 'Manaf Younis', 'Zidane Iqbal', 'Amir Al-Ammari', 'Ibrahim Bavesh', 'Ali Jasim', 'Team Photo', 'Youssef Amyn', 'Aimar Sher', 'Marko Farji', 'Osama Rashid', 'Ali Al-Hamadi', 'Aymen Hussein', 'Mohanad Ali'],
  NOR: ['Team Logo', 'Orjan Nyland', 'Julian Ryerson', 'Leo Ostigård', 'Kristoffer Vassbakk Ajer', 'Marcus Holmgren Pedersen', 'David Møller Wolfe', 'Torbjørn Heggem', 'Morten Thorsby', 'Martin Ødegaard', 'Sander Berge', 'Andreas Schjelderup', 'Team Photo', 'Patrick Berg', 'Erling Haaland', 'Alexander Sørloth', 'Aron Dønnum', 'Jorgen Strand Larsen', 'Antonio Nusa', 'Oscar Bobb'],
  ARG: ['Team Logo', 'Emiliano Martinez', 'Nahuel Molina', 'Cristian Romero', 'Nicolas Otamendi', 'Nicolas Tagliafico', 'Leonardo Balerdi', 'Enzo Fernandez', 'Alexis Mac Allister', 'Rodrigo De Paul', 'Exequiel Palacios', 'Leandro Paredes', 'Team Photo', 'Nico Paz', 'Franco Mastantuono', 'Nico Gonzalez', 'Lionel Messi', 'Lautaro Martinez', 'Julian Alvarez', 'Giuliano Simeone'],
  ALG: ['Team Logo', 'Alexis Guendouz', 'Ramy Bensebaini', 'Youcef Atal', 'Rayan Aït-Nouri', 'Mohamed Amine Tougai', 'Aïssa Mandi', 'Ismael Bennacer', 'Houssem Aquar', 'Hicham Boudaoui', 'Ramiz Zerrouki', 'Nabil Bentalab', 'Team Photo', 'Farés Chaibi', 'Riyad Mahrez', 'Said Benrahma', 'Anis Hadj Moussa', 'Amine Gouiri', 'Baghdad Bounedjah', 'Mohammed Amoura'],
  AUT: ['Team Logo', 'Alexander Schlager', 'Patrick Pentz', 'David Alaba', 'Kevin Danso', 'Philipp Lienhart', 'Stefan Posch', 'Phillipp Mwene', 'Alexander Prass', 'Xaver Schlager', 'Marcel Sabitzer', 'Konrad Laimer', 'Team Photo', 'Florian Grillitsch', 'Nicolas Seiwald', 'Romano Schmid', 'Patrick Wimmer', 'Christoph Baumgartner', 'Michael Gregoritsch', 'Marko Arnautović'],
  JOR: ['Team Logo', 'Yazeed Abulaila', 'Ihsan Haddad', 'Mohammad Abu Hashish', 'Yazan Al-Arab', 'Abdallah Nasib', 'Saleem Obaid', 'Mohammad Abualnadi', 'Ibrahim Saadeh', 'Nizar Al-Rashdan', 'Noor Al-Rawabdeh', 'Mohannad Abu Taha', 'Team Photo', 'Amer Jamous', 'Musa Al-Taamari', 'Yazan Al-Naimat', 'Mahmoud Al-Mardi', 'Ali Olwan', 'Mohammad Abu Zrayq', 'Ibrahim Sabra'],
  POR: ['Team Logo', 'Diogo Costa', 'Jose Sa', 'Ruben Dias', 'João Cancelo', 'Diogo Dalot', 'Nuno Mendes', 'Gonçalo Inácio', 'Bernardo Silva', 'Bruno Fernandes', 'Ruben Neves', 'Vitinha', 'Team Photo', 'João Neves', 'Cristiano Ronaldo', 'Francisco Trincao', 'João Felix', 'Gonçalo Ramos', 'Pedro Neto', 'Rafael Leão'],
  COD: ['Team Logo', 'Lionel Mpasi', 'Aaron Wan-Bissaka', 'Axel Tuanzebe', 'Arthur Masuaku', 'Chancel Mbemba', 'Joris Kayembe', 'Charles Pickel', 'Ngal\'ayel Mukau', 'Edo Kayembe', 'Samuel Moutoussamy', 'Noah Sadiki', 'Team Photo', 'Théo Bongonda', 'Meschak Elia', 'Yoane Wissa', 'Brian Cipenga', 'Fiston Mayele', 'Cédric Bakambu', 'Nathanaël Mbuku'],
  UZB: ['Team Logo', 'Utkir Yusupov', 'Farrukh Savfiev', 'Sherzod Nasrullaev', 'Umar Eshmurodov', 'Husniddin Aliqulov', 'Rustamjon Ashurmatov', 'Khojiakbar Alijonov', 'Abdukodir Khusanov', 'Odiljon Hamrobekov', 'Otabek Shukurov', 'Jamshid Iskanderov', 'Team Photo', 'Azizbek Turgunboev', 'Khojimat Erkinov', 'Eldor Shomurodov', 'Oston Urunov', 'Jaloliddin Masharipov', 'Igor Sergeev', 'Abbosbek Fayzullaev'],
  COL: ['Team Logo', 'Camilo Vargas', 'David Ospina', 'Dávinson Sánchez', 'Yerry Mina', 'Daniel Munoz', 'Johan Mojica', 'Jhon Lucumí', 'Santiago Arias', 'Jefferson Lerma', 'Kevin Castaño', 'Richard Rios', 'Team Photo', 'James Rodriguez', 'Juan Fernando Quintero', 'Jorge Carrascal', 'Jon Arias', 'Jhon Cordoba', 'Luis Suarez', 'Luis Diaz'],
  ENG: ['Team Logo', 'Jordan Pickford', 'John Stones', 'Marc Guéhi', 'Ezri Konsa', 'Trent Alexander-Arnold', 'Reece James', 'Dan Burn', 'Jordan Henderson', 'Declan Rice', 'Jude Bellingham', 'Cole Palmer', 'Team Photo', 'Morgan Rogers', 'Anthony Gordon', 'Phil Foden', 'Bukayo Saka', 'Harry Kane', 'Marcus Rashford', 'Ollie Watkins'],
  CRO: ['Team Logo', 'Dominik Livaković', 'Duje Caleta-Car', 'Josko Gvardiol', 'Josip Stanišić', 'Luka Vušković', 'Josip Sutalo', 'Kristijan Jakic', 'Luka Modrić', 'Mateo Kovacic', 'Martin Baturina', 'Lovro Majer', 'Team Photo', 'Mario Pasalic', 'Petar Sucic', 'Ivan Perišić', 'Marco Pasalic', 'Ante Budimir', 'Andrej Kramarić', 'Franjo Ivanovic'],
  GHA: ['Team Logo', 'Lawrence Ati Zigi', 'Tariq Lamptey', 'Mohammed Salisu', 'Alidu Seidu', 'Alexander Djiku', 'Gideon Mensah', 'Caleb Yirenkyi', 'Abdul Issahaku Fatawu', 'Thomas Partey', 'Salis Abdul Samed', 'Kamaldeen Sulemana', 'Team Photo', 'Mohammed Kudus', 'Inaki Williams', 'Jordan Ayew', 'Andrew Ayew', 'Joseph Paintsil', 'Osman Bukari', 'Antoine Semenyo'],
  PAN: ['Team Logo', 'Orlando Mosquera', 'Luis Mejia', 'Fidel Escobar', 'Andres Andrade', 'Michael Amir Murillo', 'Eric Davis', 'Jose Cordoba', 'Cesar Blackman', 'Cristian Martinez', 'Aníbal Godoy', 'Adalberto Carrasquilla', 'Team Photo', 'Édgar Bárcenas', 'Carlos Harvey', 'Ismael Díaz', 'Jose Fajardo', 'Cecilio Waterman', 'Jose Luiz Rodriguez', 'Alberto Quintero']
};

const INTRO_STICKERS = [
  { id: 'FWC0', name: 'Panini Logo' },
  { id: 'FWC1', name: 'Official Emblem' },
  { id: 'FWC2', name: 'Official Emblem' },
  { id: 'FWC3', name: 'Official Mascots' },
  { id: 'FWC4', name: 'Official Slogan' },
  { id: 'FWC5', name: 'Official Ball' },
  { id: 'FWC6', name: 'Canada - Host Countries & Cities' },
  { id: 'FWC7', name: 'Mexico - Host Countries & Cities' },
  { id: 'FWC8', name: 'USA - Host Countries & Cities' },
  { id: 'FWC9', name: 'Italy 1934 - World Cup History' },
  { id: 'FWC10', name: 'Uruguay 1950 - World Cup History' },
  { id: 'FWC11', name: 'West Germany 1954 - World Cup History' },
  { id: 'FWC12', name: 'Brazil 1962 - World Cup History' },
  { id: 'FWC13', name: 'West Germany 1974 - World Cup History' },
  { id: 'FWC14', name: 'Argentina 1986 - World Cup History' },
  { id: 'FWC15', name: 'Brazil 1994 - World Cup History' },
  { id: 'FWC16', name: 'Brazil 2002 - World Cup History' },
  { id: 'FWC17', name: 'Italy 2006 - World Cup History' },
  { id: 'FWC18', name: 'Germany 2014 - World Cup History' },
  { id: 'FWC19', name: 'Argentina 2022 - World Cup History' }
];

const COLA_STICKERS = [
  { id: '1', name: 'Lamine Yamal - Spain' },
  { id: '2', name: 'Joshua Kimmich - Germany' },
  { id: '3', name: 'Harry Kane - England' },
  { id: '4', name: 'Santiago Giménez - Mexico' },
  { id: '5', name: 'Antonee Robinson - USA' },
  { id: '6', name: 'Jefferson Lerma - Colombia' },
  { id: '7', name: 'Edson Álvarez - Mexico' },
  { id: '8', name: 'Virgil van Dijk - Netherlands' },
  { id: '9', name: 'Alphonso Davies - Canada' },
  { id: '10', name: 'Weston McKennie - USA' },
  { id: '11', name: 'Lautaro Martínez - Argentina' },
  { id: '12', name: 'Gabriel Magalhães - Brazil' }
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

  for (let i = 0; i < INTRO_STICKERS.length; i++) {
    stmt.run([INTRO_STICKERS[i].id, 'FWC', INTRO_STICKERS[i].name, i, 0]);
  }

  for (const team of TEAMS) {
    const players = PLAYERS[team] || [];
    for (let i = 1; i <= 20; i++) {
      const playerName = players[i - 1] || `Player ${i}`;
      stmt.run([`${team}${i}`, team, playerName, i, 0]);
    }
  }

  for (let i = 0; i < COLA_STICKERS.length; i++) {
    stmt.run([COLA_STICKERS[i].id, 'COLA', COLA_STICKERS[i].name, i + 1, 0]);
  }

  stmt.free();
  saveDb(db);

  const teamCount = TEAMS.length;
  const introCount = INTRO_STICKERS.length;
  const colaCount = COLA_STICKERS.length;
  const total = teamCount * 20 + introCount + colaCount;

  console.log(`Seeded ${total} stickers (${teamCount} teams x 20 + ${introCount} intro + ${colaCount} cola)`);
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