import sqlite3 from "sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.join(__dirname, "db.sqlite");

const db = new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
        console.error("❌ SQLite connection error:", err.message);
    } else {
        console.log("✅ Connected to SQLite:", DB_PATH);
    }
});

db.serialize(() => {
    db.run("PRAGMA foreign_keys = ON");

    db.run(`CREATE TABLE IF NOT EXISTS operators (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        specialty TEXT, region TEXT, languages TEXT,
        years_experience INTEGER, rating REAL, reviews_count INTEGER,
        contact_phone TEXT, contact_email TEXT, whatsapp TEXT,
        description TEXT, image_path TEXT,
        is_verified INTEGER DEFAULT 1,
        is_english_speaking INTEGER DEFAULT 1,
        is_women_friendly INTEGER DEFAULT 0
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS guesthouses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL, region TEXT, city TEXT,
        price_per_night REAL, rating REAL, reviews_count INTEGER,
        is_women_friendly INTEGER DEFAULT 0,
        has_wifi INTEGER DEFAULT 0, has_hot_water INTEGER DEFAULT 0,
        languages TEXT, contact_phone TEXT, contact_email TEXT,
        description TEXT, image_path TEXT,
        is_verified INTEGER DEFAULT 1, lat REAL, lng REAL,
        UNIQUE(name, city)
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS itineraries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL UNIQUE, duration_days INTEGER NOT NULL,
        difficulty TEXT, description TEXT, highlights TEXT,
        best_season TEXT, image_path TEXT,
        is_women_friendly INTEGER DEFAULT 0, price_from REAL
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS itinerary_days (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        itinerary_id INTEGER REFERENCES itineraries(id) ON DELETE CASCADE,
        day_number INTEGER NOT NULL, title TEXT, location TEXT,
        description TEXT, accommodation TEXT,
        distance_km REAL, elevation_m INTEGER,
        UNIQUE(itinerary_id, day_number)
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS forum_posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        author_name TEXT NOT NULL, author_country TEXT,
        title TEXT NOT NULL, content TEXT NOT NULL,
        category TEXT DEFAULT 'general',
        is_women_specific INTEGER DEFAULT 0,
        created_at TEXT DEFAULT (datetime('now')),
        is_approved INTEGER DEFAULT 0
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS emergency_protocols (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        region TEXT NOT NULL, title TEXT NOT NULL, category TEXT,
        description TEXT, phone_number TEXT, steps TEXT,
        priority INTEGER DEFAULT 0,
        UNIQUE(region, title)
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS womens_info (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        category TEXT NOT NULL, title TEXT NOT NULL,
        content TEXT NOT NULL, tips TEXT,
        priority INTEGER DEFAULT 0,
        UNIQUE(category, title)
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS food_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        category TEXT NOT NULL,
        description TEXT,
        ingredients TEXT,
        is_vegan INTEGER DEFAULT 0,
        is_vegetarian INTEGER DEFAULT 0,
        contains_horse INTEGER DEFAULT 0,
        tip TEXT,
        priority INTEGER DEFAULT 0,
        image_url TEXT
    )`);

    db.get("SELECT COUNT(*) as c FROM food_items", (err, row) => {
        if (err || row.c > 0) return;
        const foods = [
            // Traditional dishes
            ['Beshbarmak','traditional','The national dish of Kyrgyzstan. Flat boiled noodles topped with tender boiled horse or lamb meat and covered in a rich onion sauce. The name means "five fingers" — traditionally eaten by hand. Served at all celebrations and family gatherings.','["Horse meat or lamb","Flat pasta sheets","Onions","Meat broth","Salt"]',0,0,1,'Ask your host whether it is horse (jylky) or lamb (koy) — both are equally traditional. Always accept a bowl; refusing is considered rude.',10,'/uploads/food/beshbarmak.jpg'],
            ['Manty','traditional','Large steamed dumplings filled with minced lamb or beef mixed with onion and fat. Served with sour cream (kaymak) or tomato sauce. Manty are a social food — families make them together for hours.','["Minced lamb or beef","Onions","Dumpling dough","Fat tail","Sour cream"]',0,0,0,'Order at least 5–6 per person. Ask for kaymak (thick sour cream) rather than ketchup for the authentic experience.',9,'/uploads/food/manty.jpg'],
            ['Lagman','traditional','Hand-pulled noodles in a thick meat and vegetable broth. Originally a Dungan and Uyghur dish, now deeply embedded in Kyrgyz cuisine. Can occasionally be ordered without meat at some restaurants.','["Hand-pulled noodles","Lamb or beef","Tomatoes","Peppers","Carrots","Onions","Spices"]',0,0,0,'Available at almost every café. Specify "bez myasa" (without meat) to request a vegetarian version — not always available but worth asking.',8,'/uploads/food/lagman.jpg'],
            ['Plov','traditional','A rich rice dish cooked in a large kazan (cauldron) with meat, carrots, onions, and garlic. Originally from Uzbek cuisine but widely eaten across Kyrgyzstan, especially in the south around Osh.','["Rice","Lamb or beef","Carrots","Onions","Garlic","Cottonseed oil"]',0,0,0,'Osh plov (from the city of Osh) is considered the best in Central Asia. Often sold by weight at Osh bazaar from huge communal cauldrons.',9,'/uploads/food/plov.jpg'],
            ['Shorpo','traditional','A clear, hearty lamb broth soup with large chunks of boiled lamb on the bone, potatoes, carrots, and onion. Simple, warming, and filling — a staple of nomadic cuisine designed to use the whole animal.','["Lamb on the bone","Potatoes","Carrots","Onion","Salt","Dill"]',0,0,0,'Drink the broth first, then eat the meat. The fat floating on top is considered the richest part.',7,'/uploads/food/shorpo.jpg'],
            ['Kuurdak','traditional','A fried dish of lamb offal (liver, kidney, lungs, heart) with potatoes, onion, and fat. One of the most traditional dishes — made to use every part of the slaughtered animal. Strong, rich flavour.','["Lamb offal","Potatoes","Onions","Animal fat","Salt","Pepper"]',0,0,0,'Not for the faint-hearted but worth trying once. Best eaten fresh and hot.',6,'/uploads/food/kuurdak.jpg'],
            ['Samsa','street_food','Baked triangular or round pastry filled with minced lamb and onion, or sometimes pumpkin. Sold hot from clay tandoor ovens at every bazaar and street stall. One of the safest and most delicious street foods.','["Flaky pastry dough","Minced lamb (or pumpkin)","Onion","Spices"]',0,0,0,'Ask for "tykva samsa" (pumpkin samsa) — these are vegetarian and often the tastiest option. Eat immediately while hot.',9,'/uploads/food/samsa.jpg'],
            ['Shashlik','street_food','Marinated meat skewers grilled over charcoal. Lamb, chicken, and beef are the most common. Found at every market and outdoor restaurant. The smell of shashlik smoke is part of the Kyrgyz bazaar experience.','["Lamb, chicken or beef","Onion","Vinegar marinade","Salt","Pepper"]',0,0,0,'Chicken shashlik is the safest option for those not used to lamb fat. Always eat with the raw onion and vinegar salad served alongside.',8,'/uploads/food/shashlyk.jpg'],
            ['Lepyoshka','street_food','Round flatbread baked in a clay tandoor. The staple bread of Kyrgyzstan — served with every meal, at every guesthouse, and sold at every market. Chewy on the outside, soft inside.','["Wheat flour","Water","Yeast","Salt","Sesame seeds"]',1,1,0,'Buy directly from the tandoor oven for the best experience. Goes perfectly with tea, jam, and kaymak (sour cream).',8,'/uploads/food/lepyoshka.jpg'],
            // Drinks
            ['Kumis','drinks','Fermented mare\'s milk (horse milk). The most iconic Kyrgyz drink — slightly fizzy, tart, and mildly alcoholic (1–3% ABV). Produced by nomadic families during summer months when mares are lactating. Considered a health drink with probiotic properties.','["Fresh mare\'s milk","Starter culture"]',0,1,0,'Try it cold in a traditional bowl (piyala). Politely sip rather than gulp — it is an acquired taste. Do not refuse if offered by a host; it is deeply culturally significant.',10,'/uploads/food/kymyz.jpg'],
            ['Ayran','drinks','A simple cold yogurt drink made by diluting fermented milk with water. Slightly sour, very refreshing, and available everywhere. Non-alcoholic and much milder than kumis.','["Fermented cow or sheep milk","Water","Salt"]',0,1,0,'A safe and delicious daily drink. Widely available bottled or fresh. Good for the stomach after heavy meat dishes.',8,'/uploads/food/ayran.jpg'],
            ['Maksym','drinks','A traditional fermented grain drink made from roasted barley or wheat. Thick, slightly sour, and mildly alcoholic. Sold cold in summer from street kiosks.','["Roasted barley or wheat","Water","Salt"]',0,1,0,'Try from a street kiosk rather than bottled — the fresh version is far superior. Pairs well with samsa.',6,'/uploads/food/maksym.jpg'],
            ['Chai','drinks','Black tea served in a small bowl (piyala) with bread, jam, and kaymak. Sharing tea is the foundation of all social interaction in Kyrgyzstan — you will be offered it everywhere.','["Black tea","Water"]',1,1,0,'Always accept tea when offered in a home or guesthouse. Refusing is considered impolite. Add jam to your cup rather than sugar for the traditional way.',9,'/uploads/food/chai.jpg'],
            // Vegetarian / vegan
            ['Pumpkin Samsa','vegetarian_vegan','The best vegetarian street food option. Samsa pastry filled with sweetened pumpkin and onion instead of meat. Found at most bazaars and bakeries. Naturally vegan.','["Pumpkin","Onion","Flaky pastry","Sugar","Spices"]',1,1,0,'Ask specifically for "tykva" (pumpkin) samsa. Not all vendors sell them but most bazaars have at least one stall.',9,'/uploads/food/pumpkinsamsa.jpg'],
            ['Vegetable Lagman','vegetarian_vegan','Lagman noodles cooked in a vegetable broth with tomatoes, peppers, carrots, and onion. Increasingly available at restaurants in Bishkek and Karakol. Ask for "bez myasa" (without meat).','["Hand-pulled noodles","Tomatoes","Peppers","Carrots","Onion","Garlic","Vegetable oil"]',1,1,0,'More common in cities than rural areas. Some restaurants in Bishkek specifically cater to vegetarians — ask your guesthouse host for recommendations.',8,'/uploads/food/vegetablelagman.jpg'],
            ['Bazaar Fruits & Vegetables','vegetarian_vegan','Kyrgyzstan\'s bazaars are full of fresh seasonal produce — apricots, watermelons, tomatoes, cucumbers, walnuts, and dried fruits. The Osh bazaar and Bishkek\'s Osh bazaar are the best places to stock up.','["Seasonal fruits","Vegetables","Dried fruits","Nuts","Honey"]',1,1,0,'Summer is the best time — apricots and watermelons are exceptional. Buy walnuts in Arslanbob directly from the farmers for the freshest quality.',8,'/uploads/food/bazaarfruits.jpg'],
            ['Bread & Kaymak','vegetarian_vegan','Fresh lepyoshka flatbread with kaymak (thick, rich sour cream similar to clotted cream) and homemade jam is a standard breakfast at every guesthouse. Filling, vegetarian, and delicious.','["Lepyoshka bread","Kaymak (sour cream)","Homemade jam"]',0,1,0,'Kaymak is made from animal milk so it is not vegan, but it is vegetarian. Homemade jam (often apricot or raspberry) is almost always vegan.',7,'/uploads/food/breadkaymak.jpg'],
        ];
        foods.forEach(f => db.run(`INSERT INTO food_items (name,category,description,ingredients,is_vegan,is_vegetarian,contains_horse,tip,priority,image_url) VALUES (?,?,?,?,?,?,?,?,?,?)`, f));
    });

    db.run(`CREATE TABLE IF NOT EXISTS bookings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        guesthouse_id INTEGER REFERENCES guesthouses(id),
        guesthouse_name TEXT NOT NULL,
        guest_name TEXT NOT NULL,
        guest_email TEXT NOT NULL,
        guest_phone TEXT,
        check_in TEXT NOT NULL,
        check_out TEXT NOT NULL,
        guests_count INTEGER DEFAULT 1,
        total_price REAL,
        status TEXT DEFAULT 'confirmed',
        booking_ref TEXT,
        created_at TEXT DEFAULT (datetime('now'))
    )`);

    // ── Seed helpers ──────────────────────────────────────────────────────────
    const seedDays = (id, days) =>
        days.forEach(d =>
            db.run(`INSERT INTO itinerary_days (itinerary_id,day_number,title,location,description,accommodation,distance_km,elevation_m) VALUES (?,?,?,?,?,?,?,?)`, [id, ...d])
        );

    // ── Operators ─────────────────────────────────────────────────────────────
    db.get("SELECT COUNT(*) as c FROM operators", (err, row) => {
        if (err || row.c > 0) return;
        const ops = [
            ['Tian Shan Adventures','Trekking & Mountaineering','Bishkek','["English","Russian","Kyrgyz"]',12,4.9,284,'+996 555 100 200','info@tianshan-adventures.kg','+996555100200','Premier trekking specialist with 12 years of experience and UIAGM-certified mountain guides. Specialists in Tian Shan range expeditions, multi-day treks, and high-altitude mountaineering. All guides are fluent in English.',1,1,1],
            ['Nomadic Trails KG','Cultural & Horseback Tours','Karakol','["English","Russian","German"]',8,4.7,196,'+996 700 300 400','hello@nomadictrails.kg','+996700300400','Authentic cultural experiences with nomadic families across Kyrgyzstan. Specialising in horseback journeys to Song-Köl and Kochkor, traditional felt-making workshops, and home-stay programs in remote yurt camps.',1,1,1],
            ['Silk Road Explorers','Cultural & Historical Tours','Osh','["English","Russian","Uzbek"]',10,4.8,211,'+996 770 500 600','tours@silkroadexplorers.kg','+996770500600','Deep specialists in southern Kyrgyzstan Silk Road heritage. Guided tours of Osh bazaar, Sulayman Mountain, Uzgen, and the ancient Tash Rabat caravanserai with rich historical commentary in fluent English.',1,1,0],
            ['Ala Archa Mountain Guides','Climbing & High-Altitude','Bishkek','["English","Russian"]',15,4.9,147,'+996 312 540 780','guides@ala-archa.kg','+996312540780','Professional high-altitude guides operating from Bishkek into Ala Archa National Park and the greater Tian Shan. Day hikes, multi-day routes, and full technical climbing expeditions with all safety equipment provided.',1,1,0],
            ['KG Women Expeditions','Women-Only Tours','Bishkek','["English","Russian","French"]',6,4.9,122,'+996 555 770 880','info@kgwomen.kg','+996555770880','Female-led expedition company designed specifically for women travellers. All guides are experienced local women. Custom itineraries prioritise safety, cultural sensitivity, and genuine connection with Kyrgyz women communities.',1,1,1],
        ];
        ops.forEach(o => db.run(`INSERT INTO operators (name,specialty,region,languages,years_experience,rating,reviews_count,contact_phone,contact_email,whatsapp,description,is_verified,is_english_speaking,is_women_friendly) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`, o));
    });

    // ── Guesthouses ───────────────────────────────────────────────────────────
    db.get("SELECT COUNT(*) as c FROM guesthouses", (err, row) => {
        if (err || row.c > 0) return;
        const ghs = [
            ['CBT Kochkor Guesthouse','Naryn','Kochkor',25,4.8,167,1,1,1,'["English","Russian","Kyrgyz"]','+996 700 200 300','cbt@kochkor.kg',"Community-based tourism guesthouse run by a local women's cooperative. Clean private rooms, home-cooked Kyrgyz meals, warm family atmosphere. Ideal base for Song-Köl excursions. Women travelling alone are warmly welcomed.",1,42.183,75.763],
            ['Karakol Travelers Lodge','Issyk-Kul','Karakol',30,4.7,203,1,1,1,'["English","Russian"]','+996 700 400 500','info@karakollodge.kg','Well-established travelers lodge in central Karakol. Popular with international trekkers heading to Jeti-Ögüz and the Karakol Gorge. Luggage storage, tour booking assistance, and a cozy common room for meeting fellow travelers.',1,42.491,78.393],
            ['Bishkek Nomad Hostel','Chui','Bishkek',15,4.5,389,1,1,1,'["English","Russian","Chinese"]','+996 312 650 100','stay@bishkeknomad.kg',"Budget-friendly hostel in central Bishkek. Mix of dorms and private rooms. Great social atmosphere with a rooftop terrace. Knowledgeable staff arrange transport and tours. Women's dormitory available on request.",1,42.871,74.594],
            ['Song-Kol Yurt Experience','Naryn','Song-Kol',45,4.9,134,1,0,0,'["English","Kyrgyz"]','+996 707 900 800','yurts@songkol.kg',"Authentic yurt camp on the shores of Song-Köl alpine lake at 3,016m. Includes three traditional meals, guided horseback riding, and cultural evenings with live music. No WiFi — a genuine digital detox. One of Kyrgyzstan's most rewarding stays.",1,41.867,75.133],
            ['Osh Heritage Guesthouse','Osh','Osh',20,4.6,178,1,1,1,'["English","Russian","Uzbek"]','+996 779 300 200','stay@oshheri.kg','Beautifully restored traditional house near Osh bazaar and Sulayman Mountain. Family-run with exceptional hospitality. The family speaks excellent English and provides free walking tour maps of the old city.',1,40.527,72.794],
            ['Arslanbob Village Stay','Jalal-Abad','Arslanbob',18,4.8,95,1,0,1,'["English","Russian","Kyrgyz"]','+996 700 600 700','cbt@arslanbob.kg',"CBT guesthouse in the famous walnut forest village of Arslanbob. Simple, comfortable rooms in a family home. Perfect base for hiking in the world's largest wild walnut forest. Host family organises local guides and horses.",1,41.337,72.924],
        ];
        ghs.forEach(g => db.run(`INSERT INTO guesthouses (name,region,city,price_per_night,rating,reviews_count,is_women_friendly,has_wifi,has_hot_water,languages,contact_phone,contact_email,description,is_verified,lat,lng) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`, g));
    });

    // ── Itineraries ───────────────────────────────────────────────────────────
    db.get("SELECT COUNT(*) as c FROM itineraries", (err, row) => {
        if (err || row.c > 0) return;

        db.run(`INSERT INTO itineraries (id,title,duration_days,difficulty,description,highlights,best_season,is_women_friendly,price_from) VALUES (1,'Essential Kyrgyzstan',10,'Moderate',"A carefully curated 10-day journey through Kyrgyzstan's most iconic landscapes. From the capital Bishkek to the high-altitude Song-Köl lake, this itinerary balances adventure, culture, and natural beauty. No prior mountaineering experience required.",'["Ala Archa canyon hike","Issyk-Kul lakeshore","Karakol animal market","Jeti-Ögüz red rocks","Song-Köl yurt stay","Horseback riding with nomads"]','June to September',1,850)`, [], () => seedDays(1, [
            [1,'Arrive in Bishkek','Bishkek',"Arrive at Manas International Airport. Transfer to your guesthouse in central Bishkek. Evening orientation walk through Ala-Too Square. Welcome dinner with your guide.",'Bishkek Nomad Hostel',0,800],
            [2,'Ala Archa National Park','Ala Archa',"Full-day hike in Ala Archa National Park, 40km south of Bishkek. Trek to the Ak-Sai glacier viewpoint (2,800m). Dramatic gorge scenery with peaks rising to 4,800m.",'Bishkek Nomad Hostel',12,2800],
            [3,'Drive to Issyk-Kul','Cholpon-Ata',"Morning departure for the north shore of Issyk-Kul, the world's second-largest alpine lake. Visit the Scythian petroglyphs museum at Cholpon-Ata. Afternoon swim in the crystal-clear lake.",'Local guesthouse Cholpon-Ata',280,1607],
            [4,'Karakol Town','Karakol',"Drive to Karakol, the main hub for eastern Tian Shan trekking. Visit the Dungan Mosque built without nails, the Russian Orthodox Church, and the famous weekly animal market.",'Karakol Travelers Lodge',150,1770],
            [5,'Jeti-Ögüz Valley','Jeti-Ögüz',"Day hike through Jeti-Ögüz Valley, famous for its seven red sandstone bulls rock formation. Hike to the Flower Meadow. Breathtaking alpine scenery.",'Karakol Travelers Lodge',18,2500],
            [6,'Karakol to Kochkor','Kochkor',"Drive along Issyk-Kul south shore through Bokonbaevo. Eagle hunter demonstration en route. Continue to Kochkor, famous for its traditional felt-shyrdak craft.",'CBT Kochkor Guesthouse',200,1850],
            [7,'Ascent to Song-Köl','Song-Köl',"Morning felt-making workshop with local women's cooperative. Afternoon drive up to Song-Köl Alpine Lake (3,016m). Arrive at yurt camp and settle in under a vast starlit sky.",'Song-Kol Yurt Experience',80,3016],
            [8,'A Day with Nomads','Song-Köl',"Full day at Song-Köl. Morning horseback ride along the lakeshore. Afternoon hike to plateau viewpoint. Traditional evening meal with live komuz music in the yurt.",'Song-Kol Yurt Experience',20,3100],
            [9,'Return to Bishkek','Bishkek',"Morning descent from Song-Köl. Drive through the Chüy Valley back to Bishkek. Afternoon shopping at Osh Bazaar. Farewell dinner at a traditional Kyrgyz restaurant.",'Bishkek Nomad Hostel',250,800],
            [10,'Departure','Bishkek',"Morning at leisure. Transfer to Manas International Airport for your departure flight. Safe travels!",'',0,800],
        ]));

        db.run(`INSERT INTO itineraries (id,title,duration_days,difficulty,description,highlights,best_season,is_women_friendly,price_from) VALUES (2,'Kyrgyzstan Highlands',14,'Moderate–Challenging',"A 14-day expedition that goes deeper into Kyrgyzstan's mountain heartland — the remote Tash Rabat caravanserai, the Naryn canyon, and the Silk Road city of Osh. A perfect balance of trekking, culture, and history for experienced independent travellers.",'["Tash Rabat caravanserai overnight","Naryn gorge landscape","Sulayman Mountain UNESCO","Silk Road history & Osh bazaar","Kochkor felt-making workshop","Karakol Gorge high-altitude trek"]','May to October',1,1150)`, [], () => seedDays(2, [
            [1,'Arrive Bishkek','Bishkek',"Arrive at Manas Airport. City orientation walk through Ala-Too Square and Osh Bazaar.",'Bishkek Nomad Hostel',0,800],
            [2,'Bishkek City Day','Bishkek',"National History Museum, Soviet-era architecture walk, Osh Bazaar, traditional manti and kumis dinner.",'Bishkek Nomad Hostel',5,800],
            [3,'Ala Archa Hike','Ala Archa',"Full-day alpine hike to Ak-Sai glacier viewpoint. Peaks to 4,800m visible from the trail.",'Bishkek Nomad Hostel',16,2800],
            [4,'Drive to Karakol','Karakol',"Scenic drive along Issyk-Kul north shore. Stop at Grigoryevka and Semyonovka gorges for panoramic views.",'Karakol Travelers Lodge',430,1770],
            [5,'Karakol Gorge Trek','Karakol',"Full-day trek in Karakol Gorge past the Turasu waterfall to a mountain plateau at 3,200m.",'Karakol Travelers Lodge',22,3200],
            [6,'Jeti-Ögüz & South Shore','Jeti-Ögüz',"Morning at the Seven Bulls formation. Afternoon along Issyk-Kul south shore via Tamga petroglyphs.",'Karakol Travelers Lodge',100,1607],
            [7,'Kochkor & Nomadic Culture','Kochkor',"Drive to Kochkor. CBT centre felt-making workshop. Evening komuz music at family guesthouse.",'CBT Kochkor Guesthouse',200,1850],
            [8,'Song-Köl Lake','Song-Köl',"Ascent to Song-Köl (3,016m). Afternoon horseback on the plateau. Sunset yurt overnight.",'Song-Kol Yurt Experience',80,3016],
            [9,'Song-Köl to Naryn','Naryn',"Morning on the steppe, then descent through dramatic Kalmak-Ashuu pass. Arrive Naryn.",'Local guesthouse Naryn',120,2044],
            [10,'Tash Rabat Caravanserai','Tash Rabat',"Drive to the ancient 10th-century Tash Rabat caravanserai. Explore the stone structure that sheltered Silk Road merchants. Overnight in yurts outside the caravanserai.",'Yurt camp Tash Rabat',100,3200],
            [11,'Drive South to Osh','Osh',"Drive south via the dramatic Fergana range. Descend into the Fergana Valley. Arrive Osh by evening.",'Osh Heritage Guesthouse',320,963],
            [12,'Osh: Mountain & Bazaar','Osh',"Morning at UNESCO-listed Sulayman Mountain. Afternoon in the vast Osh bazaar and historic old town.",'Osh Heritage Guesthouse',5,963],
            [13,'Osh to Bishkek Flight','Bishkek',"Short domestic flight from Osh to Bishkek (1 hour). Afternoon free. Final farewell dinner.",'Bishkek Nomad Hostel',0,800],
            [14,'Departure','Bishkek',"Transfer to Manas International Airport for international departure.",'',0,800],
        ]));

        db.run(`INSERT INTO itineraries (id,title,duration_days,difficulty,description,highlights,best_season,is_women_friendly,price_from) VALUES (3,'Complete Kyrgyzstan Circuit',21,'Challenging',"The definitive Kyrgyzstan journey — a 21-day full-country circuit covering every major region from the Chui Valley to the Fergana Valley. High-altitude treks, Silk Road cities, and remote yurt stays for seasoned travellers seeking the deepest cultural immersion Kyrgyzstan offers.",'["Peak Lenin base camp views","Sary-Chelek biosphere lake","Arslanbob walnut forests","Full Song-Köl plateau circuit","Osh Silk Road south","Uzgen minaret & Fergana Valley"]','June to September',1,1650)`, [], () => seedDays(3, [
            [1,'Arrive Bishkek','Bishkek',"Arrive at Manas Airport. City orientation and welcome dinner.",'Bishkek Nomad Hostel',0,800],
            [2,'Bishkek City Tour','Bishkek',"National Museum, Soviet architecture walk, Osh Bazaar, rooftop dinner.",'Bishkek Nomad Hostel',8,800],
            [3,'Ala Archa Hike','Ala Archa',"Full-day alpine hike to glacier viewpoint at 2,800m.",'Bishkek Nomad Hostel',16,2800],
            [4,'North Shore Issyk-Kul','Cholpon-Ata',"Drive to Issyk-Kul north shore. Petroglyphs museum visit.",'Guesthouse Cholpon-Ata',280,1607],
            [5,'Issyk-Kul Lakeshore','Cholpon-Ata',"Morning swim, afternoon beach walk, local fish market.",'Guesthouse Cholpon-Ata',10,1607],
            [6,'Drive to Karakol','Karakol',"East to Karakol. Dungan Mosque and Orthodox Church visits.",'Karakol Travelers Lodge',150,1770],
            [7,'Karakol Gorge Trek','Karakol',"Full-day high-altitude trek to 3,200m plateau via Turasu waterfall.",'Karakol Travelers Lodge',22,3200],
            [8,'Jeti-Ögüz Valley','Jeti-Ögüz',"Seven Bulls formation and Flower Meadow alpine hike.",'Karakol Travelers Lodge',18,2500],
            [9,'South Shore to Kochkor','Kochkor',"Scenic south shore drive via Tamga petroglyphs. Arrive Kochkor.",'CBT Kochkor Guesthouse',250,1850],
            [10,'Song-Köl Lake','Song-Köl',"Ascent to Song-Köl (3,016m). Yurt camp, horseback riding at sunset.",'Song-Kol Yurt Experience',80,3016],
            [11,'Song-Köl Full Day','Song-Köl',"Day with nomadic family. Eagle demonstration. Stars above 3,000m.",'Song-Kol Yurt Experience',15,3100],
            [12,'Naryn City','Naryn',"Descent via Kalmak-Ashuu pass. Naryn Fort ruins and regional museum.",'Local guesthouse Naryn',120,2044],
            [13,'Tash Rabat Caravanserai','Tash Rabat',"10th-century Silk Road caravanserai. Overnight in yurts outside the ancient stone structure.",'Yurt camp Tash Rabat',100,3200],
            [14,'Return to Bishkek','Bishkek',"Drive back via At-Bashi valley. One night in Bishkek.",'Bishkek Nomad Hostel',320,800],
            [15,'Fly to Osh','Osh',"Domestic flight to Osh (1 hour). Sulayman Mountain evening visit.",'Osh Heritage Guesthouse',0,963],
            [16,'Osh Bazaar & Old Town','Osh',"Full day in Osh bazaar and historic old town. Silk Road dinner.",'Osh Heritage Guesthouse',8,963],
            [17,'Drive to Arslanbob','Arslanbob',"Drive north to Arslanbob walnut forest village in Jalal-Abad.",'Arslanbob Village Stay',150,1680],
            [18,'Arslanbob Forest Hike','Arslanbob',"Full-day hike through the world's largest wild walnut forest to the waterfall.",'Arslanbob Village Stay',14,2200],
            [19,'Sary-Chelek Lake','Sary-Chelek',"Drive to pristine Sary-Chelek biosphere reserve. Lakeside camp.",'Guesthouse Sary-Chelek',80,1873],
            [20,'Return to Bishkek','Bishkek',"Drive back to Bishkek. Farewell dinner at rooftop restaurant.",'Bishkek Nomad Hostel',350,800],
            [21,'Departure','Bishkek',"Transfer to Manas International Airport. Safe travels!",'',0,800],
        ]));
    });

    // ── Emergency Protocols ───────────────────────────────────────────────────
    db.get("SELECT COUNT(*) as c FROM emergency_protocols", (err, row) => {
        if (err || row.c > 0) return;
        const protocols = [
            ['All Regions','Medical Emergency','medical','Serious medical emergency requiring ambulance dispatch.','103','["Call 103 (ambulance) immediately","State your GPS location as precisely as possible","Contact your travel insurance emergency hotline","Ask your guesthouse host or guide for immediate assistance","Key hospitals: National Hospital Bishkek +996 312 665 123 | Regional Hospital Osh +996 3222 55 100"]',10],
            ['Mountain Regions','Mountain Rescue','rescue','Emergencies in high-altitude and remote trekking areas.','112','["Call 112 (unified emergency number)","Send your exact GPS coordinates via SMS if voice call fails","Activate your PLB or satellite communicator if carried","Do not move an injured person unless in immediate danger","Signal rescuers: 6 whistle blasts or mirror reflection","Kyrgyz Mountain Rescue Service: +996 312 620 060"]',10],
            ['All Regions','Police Emergency','security','Theft, assault, or security incidents.','102','["Call 102 (police emergency)","Note the officer\'s name and badge number","File an official written police report — REQUIRED for insurance claims","Contact your embassy if the response feels inadequate"]',8],
            ['All Regions','Embassy Contacts','diplomatic','Document loss, arrest, or critical incidents requiring diplomatic assistance.','',"[\"Swiss Embassy (via Kazakhstan): +7 727 258 2600\",\"German Embassy Bishkek: +996 312 905 000\",\"French Embassy Bishkek: +996 312 623 402\",\"Italian Embassy (via Kazakhstan): +7 7172 97 24 03\",\"UK Embassy Bishkek: +996 312 303 037\",\"Lost passport: contact embassy immediately for emergency travel document\",\"Allow 2–5 working days for emergency passport processing\"]",9],
            ['All Regions','Lost or Stolen Documents','documents','Steps for lost or stolen passport or important documents.','102','["Report immediately to local police — get a written copy of the report","Photograph the police report for your records","Contact your embassy for an emergency travel document","Notify your travel insurer with the police report number","OVIR Bishkek (Kyrgyz Migration Service): +996 312 627 040","Tip: store digital copies of all documents in a secure cloud app before departure"]',7],
        ];
        protocols.forEach(p => db.run(`INSERT INTO emergency_protocols (region,title,category,description,phone_number,steps,priority) VALUES (?,?,?,?,?,?,?)`, p));
    });

    db.run(`UPDATE emergency_protocols SET steps = ? WHERE title = 'Police Emergency'`,
        ['["Call 102 (police emergency)","Note the officer\'s name and badge number","File an official written police report — REQUIRED for insurance claims","Contact your embassy if the response feels inadequate"]']
    );

    db.run(`UPDATE emergency_protocols SET steps = ? WHERE title = 'Embassy Contacts'`,
        ['["Swiss Embassy (via Kazakhstan): +7 727 258 2600","German Embassy Bishkek: +996 312 905 000","French Embassy Bishkek: +996 312 623 402","Italian Embassy (via Kazakhstan): +7 7172 97 24 03","UK Embassy Bishkek: +996 312 303 037","Lost passport: contact embassy immediately for emergency travel document","Allow 2–5 working days for emergency passport processing"]']
    );

    // ── Women's Info ──────────────────────────────────────────────────────────
    db.get("SELECT COUNT(*) as c FROM womens_info", (err, row) => {
        if (err || row.c > 0) return;
        const info = [
            ['safety','Solo Travel Safety Overview',"Kyrgyzstan is considered one of the safer Central Asian countries for female solo travelers. The predominantly Muslim culture is moderate and generally welcoming to foreign women. Standard precautions apply, and rural areas require more awareness than urban Bishkek.",'["Register your itinerary with your embassy before departure","Share your daily plan with someone at home","Use CBT (Community-Based Tourism) guesthouses — vetted, family-run","Avoid isolated areas after dark","Trust your instincts — if a situation feels wrong, leave","Download offline maps (Maps.me or OsmAnd) for remote areas without connectivity"]',10],
            ['dress_code','Dress Code & Cultural Sensitivity',"Kyrgyzstan has a moderate Islamic culture. While Bishkek is cosmopolitan and western clothing is normal, rural and southern regions — particularly Osh and Jalal-Abad — have more conservative expectations for women.",'["In rural areas: cover shoulders and knees at minimum","In mosques and religious sites: cover hair and wear loose clothing","Bikinis and swimwear acceptable at Issyk-Kul resort beaches only","Carry a lightweight scarf — invaluable for mosques and unexpected conservative situations","Bishkek: regular western clothing is completely normal","Markets: more modest dress is appreciated even if not required"]',9],
            ['transport','Transportation Safety Guide',"Getting around Kyrgyzstan as a woman requires awareness. Shared taxis (marshrutky) are the main form of inter-city transport. Hiring a private driver through your guesthouse or a verified operator is significantly safer for long distances.",'["Book inter-city transport through your guesthouse — they know trustworthy drivers","For marshrutky: sit near the door or next to other women","Avoid traveling alone by shared taxi at night","Negotiate and agree on price BEFORE getting in","In Bishkek: use Yandex Go app — safe, metered, app-based taxis","Keep emergency numbers saved offline on your phone"]',8],
            ['accommodation','Accommodation Safety & Selection',"CBT (Community-Based Tourism) guesthouses are the safest option for female solo travelers. They are vetted family homes with community oversight. All guesthouses listed on this platform are verified and women-friendly rated.",'["Prioritise guesthouses with the Women-Friendly verified badge","CBT guesthouses have community accountability — strongly recommended","Lock your room door at night — carry a small door wedge if you prefer extra security","Women\'s dormitory available at Bishkek Nomad Hostel","Inform guesthouse hosts of your daily plans and expected return time","All listed guesthouses have English-speaking staff"]',9],
            ['health','Health & Medical Considerations',"Altitude sickness is the primary health risk in Kyrgyzstan. Song-Köl (3,016m), Tash Rabat (3,200m), and most trekking routes can trigger acute mountain sickness (AMS). Preparation and acclimatization are essential.",'["Acclimatize for at least 2 nights in Bishkek (800m) before ascending higher","AMS symptoms: headache, nausea, dizziness, fatigue — descend immediately if severe","Diamox (acetazolamide) can be taken preventatively — consult a doctor before travel","Water: drink only filtered or bottled water outside Bishkek","Pharmacies in Bishkek are well-stocked — bring personal prescriptions labeled in Russian","Menstrual products: available in Bishkek supermarkets, very limited in rural areas — carry adequate supply","Travel insurance with emergency evacuation coverage is MANDATORY for all trekking routes"]',10],
        ];
        info.forEach(i => db.run(`INSERT INTO womens_info (category,title,content,tips,priority) VALUES (?,?,?,?,?)`, i));
    });

    // ── Forum Posts ───────────────────────────────────────────────────────────
    db.get("SELECT COUNT(*) as c FROM forum_posts", (err, row) => {
        if (err || row.c > 0) return;
        const posts = [
            ['Sarah M.','United Kingdom','Solo trekking Song-Köl — everything you need to know','I completed the 10-day Essential Kyrgyzstan itinerary in August as a solo female traveler. The Song-Köl experience was the highlight of my entire trip — two nights in the yurt with the nomadic family was something I will never forget. The CBT Kochkor guesthouse arranged everything seamlessly, and my guide spoke excellent English. Altitude was fine with a slow ascent. Would recommend to any solo female traveler without hesitation.','trekking',1,1],
            ['Thomas R.','Germany','Tian Shan Adventures — operator review after 14-day trek','Booked the Kyrgyzstan Highlands itinerary with Tian Shan Adventures and cannot recommend them highly enough. Guide named Bakyt was exceptional — deep knowledge of the mountains, great English, and incredibly organised. The Tash Rabat overnight was the most atmospheric experience I have had in years of adventure travel. Logistics were flawless. Book early for summer.','trekking',0,1],
            ['Yuki T.','Japan','Osh: completely underrated and totally safe','I spent 3 days in Osh and it completely changed my perception of Central Asia. The bazaar is enormous and fascinating — try the samsa and laghman. Sulayman Mountain at sunrise is a must. The Osh Heritage Guesthouse family were incredibly welcoming and helped me arrange a day trip to Uzgen. Worth the trip south even on a short itinerary.','accommodation',0,1],
            ['Miriam K.','Switzerland','Women travelling in Kyrgyzstan — honest assessment','Travelled 21 days around Kyrgyzstan solo. As a Swiss woman accustomed to a certain level of infrastructure and safety, I was pleasantly surprised. The key is preparation: verify your guesthouses, use recommended operators, and carry offline maps. The KG Women Expeditions team were superb for the mountain sections. Local women I met were incredibly warm and curious. Go — you will not regret it.','general',1,1],
            ['Carlos B.','Spain','Horseback at Song-Köl — tips and what to expect','The horseback riding at Song-Köl was incredible but physically demanding. I had limited riding experience and found 4 hours quite tough. The views across the alpine steppe were worth every moment of discomfort. Tips: padded cycling shorts, high-SPF sunscreen (altitude UV is brutal), and serious layers — temperature drops sharply after sunset at 3,000m.','trekking',0,1],
        ];
        posts.forEach(p => db.run(`INSERT INTO forum_posts (author_name,author_country,title,content,category,is_women_specific,is_approved) VALUES (?,?,?,?,?,?,?)`, p));
    });
});

export default db;
