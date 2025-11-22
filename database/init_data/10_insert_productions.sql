INSERT IGNORE INTO productions 
    (production_id, type_id, primary_title, original_title, is_adult, start_year, runtime_minutes, poster_url) 
VALUES
    -- movies
    ('tt0068646', 10, 'The Godfather',              'The Godfather',              0, 1972, 175, NULL),
    ('tt0133093', 10, 'The Matrix',                 'The Matrix',                 0, 1999, 136, NULL),
    ('tt0137523', 10, 'Fight Club',                 'Fight Club',                 0, 1999, 139, NULL),
    ('tt0144084', 10, 'American Psycho',            'American Psycho',            0, 2000, 102, NULL),
    ('tt0264464', 10, 'Catch Me If You Can',        'Catch Me If You Can',        0, 2002, 141, NULL),
    ('tt0482571', 10, 'The Prestige',               'The Prestige',               0, 2006, 130, NULL),
    ('tt0816692', 10, 'Interstellar',               'Interstellar',               0, 2014, 169, NULL),
    ('tt0993846', 10, 'The Wolf of Wall Street',    'The Wolf of Wall Street',    0, 2013, 180, NULL),
    ('tt1375666', 10, 'Inception',                  'Inception',                  0, 2010, 148, NULL),
    ('tt1950186', 10, 'Ford v Ferrari',             'Ford v Ferrari',             0, 2019, 152, NULL),

    -- tvSeries
    ('tt0417299', 30, 'Avatar: The Last Airbender', 'Avatar: The Last Airbender', 0, 2005, 23, NULL),
    ('tt0773262', 30, 'Dexter',                     'Dexter',                     0, 2006, 60, NULL),
    ('tt0903747', 30, 'Breaking Bad',               'Breaking Bad',               0, 2008, 45, NULL),
    ('tt0944947', 30, 'Game of Thrones',            'Game of Thrones',            0, 2011, 60, NULL),
    ('tt1190634', 30, 'The Boys',                   'The Boys',                   0, 2019, 60, NULL),
    ('tt2293002', 30, 'Ben 10: Omniverse',          'Ben 10: Omniverse',          0, 2012, 22, NULL),
    ('tt2467372', 30, 'Brooklyn Nine-Nine',         'Brooklyn Nine-Nine',         0, 2013, 22, NULL),
    ('tt2560140', 30, 'Attack on Titan',            'Shingeki no Kyojin',         0, 2013, 24, NULL),
    ('tt2861424', 30, 'Rick and Morty',             'Rick and Morty',             0, 2013, 23, NULL),
    ('tt3032476', 30, 'Better Call Saul',           'Better Call Saul',           0, 2015, 45, NULL),

    -- tvMiniSeries
    ('tt0185906', 40, 'Band of Brothers',           'Band of Brothers',           0, 2001, 60, NULL),
    ('tt10048342',40, 'The Queen''s Gambit',        'The Queen''s Gambit',        0, 2020, 60, NULL),
    ('tt10574558',40, 'Midnight Mass',              'Midnight Mass',              0, 2021, 60, NULL),
    ('tt2401256', 40, 'The Night Of',               'The Night Of',               0, 2016, 60, NULL),
    ('tt2649356', 40, 'Sharp Objects',              'Sharp Objects',              0, 2018, 60, NULL),
    ('tt2879552', 40, '11.22.63',                   '11.22.63',                   0, 2016, 60, NULL),
    ('tt7137906', 40, 'When They See Us',           'When They See Us',           0, 2019, 75, NULL),
    ('tt7366338', 40, 'Chernobyl',                  'Chernobyl',                  0, 2019, 60, NULL),
    ('tt8305212', 40, 'The Night Of',               'The Night Of',               0, 2016, 60, NULL),
    ('tt9815454', 40, 'Unorthodox',                 'Unorthodox',                 0, 2020, 50, NULL),

    -- tvMovie
    ('tt0123865', 20, 'Gia',                        'Gia',                        0, 1998, 120, NULL),
    ('tt0473389', 20, 'The Ron Clark Story',        'The Ron Clark Story',        0, 2006,  90, NULL),
    ('tt0905630', 20, 'Redemption',                 'Redemption',                 0, 2003,  32, NULL),
    ('tt1000771', 20, 'Recount',                    'Recount',                    0, 2008, 116, NULL),
    ('tt1132623', 20, 'You Don''t Know Jack',       'You Don''t Know Jack',       0, 2010, 134, NULL),
    ('tt1278469', 20, 'Temple Grandin',             'Temple Grandin',             0, 2010, 107, NULL),
    ('tt1684226', 20, 'The Normal Heart',           'The Normal Heart',           0, 2014, 132, NULL),
    ('tt1933667', 20, 'The Wizard of Lies',         'The Wizard of Lies',         0, 2017, 133, NULL),
    ('tt1132623', 20, 'You Don''t Know Jack',       'You Don''t Know Jack',       0, 2010, 134, NULL),
    ('tt8783232', 20, 'Redemption',                 'Redemption',                 0, 2018,  25, NULL),

    -- tvEpisode
    ('tt1204265', 50, 'Sozin''s Comet, Part 4: Avatar Aang', 'Sozin''s Comet, Part 4: Avatar Aang', 0, 2008, 21, NULL),
    ('tt12187040',50, 'Plan and Execution',         'Plan and Execution',         0, 2022, 50, NULL),
    ('tt1444421', 50, 'The Getaway',                'The Getaway',                0, 2009, 51, NULL),
    ('tt1683088', 50, 'Face Off',                   'Face Off',                   0, 2011, 50, NULL),
    ('tt2301451', 50, 'Ozymandias',                 'Ozymandias',                 0, 2013, 47, NULL),
    ('tt2301455', 50, 'Felina',                     'Felina',                     0, 2013, 55, NULL),
    ('tt4163660', 50, 'A New Dawn',                 'A New Dawn',                 0, 2014, 23, NULL),
    ('tt4283088', 50, 'Battle of the Bastards',     'Battle of the Bastards',     0, 2016, 60, NULL),
    ('tt5719536', 50, 'Chicanery',                  'Chicanery',                  0, 2017, 49, NULL),
    ('tt9906260', 50, 'Hero',                       'Hero',                       0, 2019, 24, NULL);


UPDATE productions SET poster_url = 'https://m.media-amazon.com/images/M/MV5BNGEwYjgwOGQtYjg5ZS00Njc1LTk2ZGEtM2QwZWQ2NjdhZTE5XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg' WHERE production_id = 'tt0068646'; -- The Godfather
UPDATE productions SET poster_url = 'https://image.tmdb.org/t/p/original/p96dm7sCMn4VYAStA6siNz30G1r.jpg' WHERE production_id = 'tt0133093'; -- The Matrix
UPDATE productions SET poster_url = 'https://m.media-amazon.com/images/M/MV5BOTgyOGQ1NDItNGU3Ny00MjU3LTg2YWEtNmEyYjBiMjI1Y2M5XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg' WHERE production_id = 'tt0137523'; -- Fight Club
UPDATE productions SET poster_url = 'https://image.tmdb.org/t/p/original/9uGHEgsiUXjCNq8wdq4r49YL8A1.jpg' WHERE production_id = 'tt0144084'; -- American Psycho
UPDATE productions SET poster_url = 'https://image.tmdb.org/t/p/original/gvOnGxfTWbUVdXWBFpbWwkKt95I.jpg' WHERE production_id = 'tt0264464'; -- Catch Me If You Can
UPDATE productions SET poster_url = 'https://image.tmdb.org/t/p/original/tRNlZbgNCNOpLpbPEz5L8G8A0JN.jpg' WHERE production_id = 'tt0482571'; -- The Prestige
UPDATE productions SET poster_url = 'https://image.tmdb.org/t/p/original/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg' WHERE production_id = 'tt0816692'; -- Interstellar
UPDATE productions SET poster_url = 'https://image.tmdb.org/t/p/original/kW9LmvYHAaS9iA0tHmZVq8hQYoq.jpg' WHERE production_id = 'tt0993846'; -- The Wolf of Wall Street
UPDATE productions SET poster_url = 'https://image.tmdb.org/t/p/original/xlaY2zyzMfkhk0HSC5VUwzoZPU1.jpg' WHERE production_id = 'tt1375666'; -- Inception
UPDATE productions SET poster_url = 'https://image.tmdb.org/t/p/w600_and_h900_face/7yXOh2PqutxhruHzVuoR35D1r4m.jpg' WHERE production_id = 'tt1950186'; -- Ford v Ferrari
UPDATE productions SET poster_url = 'https://image.tmdb.org/t/p/original/yaGt4GIutpbXHsv48tWceWg6s56.jpg' WHERE production_id = 'tt0417299'; -- Avatar: The Last Airbender
UPDATE productions SET poster_url = 'https://image.tmdb.org/t/p/original/q8dWfc4JwQuv3HayIZeO84jAXED.jpg' WHERE production_id = 'tt0773262'; -- Dexter
UPDATE productions SET poster_url = 'https://image.tmdb.org/t/p/original/ztkUQFLlC19CCMYHW9o1zWhJRNq.jpg' WHERE production_id = 'tt0903747'; -- Breaking Bad
UPDATE productions SET poster_url = 'https://image.tmdb.org/t/p/original/1XS1oqL89opfnbLl8WnZY1O1uJx.jpg' WHERE production_id = 'tt0944947'; -- Game of Thrones
UPDATE productions SET poster_url = 'https://image.tmdb.org/t/p/original/2zmTngn1tYC1AvfnrFLhxeD82hz.jpg' WHERE production_id = 'tt1190634'; -- The Boys
UPDATE productions SET poster_url = 'https://image.tmdb.org/t/p/original/Re9I5tauOspaJxYCIqRqavKT4F.jpg' WHERE production_id = 'tt2293002'; -- Ben 10: Omniverse
UPDATE productions SET poster_url = 'https://image.tmdb.org/t/p/original/A3SymGlOHefSKbz1bCOz56moupS.jpg' WHERE production_id = 'tt2467372'; -- Brooklyn Nine-Nine
UPDATE productions SET poster_url = 'https://image.tmdb.org/t/p/original/hTP1DtLGFamjfu8WqjnuQdP1n4i.jpg' WHERE production_id = 'tt2560140'; -- Attack on Titan
UPDATE productions SET poster_url = 'https://image.tmdb.org/t/p/original/WGRQ8FpjkDTzivQJ43t94bOuY0.jpg' WHERE production_id = 'tt2861424'; -- Rick and Morty
UPDATE productions SET poster_url = 'https://image.tmdb.org/t/p/original/fC2HDm5t0kHl7mTm7jxMR31b7by.jpg' WHERE production_id = 'tt3032476'; -- Better Call Saul
UPDATE productions SET poster_url = 'https://image.tmdb.org/t/p/original/8JMXquNmdMUy2n2RgW8gfOM0O3l.jpg' WHERE production_id = 'tt0185906'; -- Band of Brothers
UPDATE productions SET poster_url = 'https://image.tmdb.org/t/p/original/zU0htwkhNvBQdVSIKB9s6hgVeFK.jpg' WHERE production_id = 'tt10048342'; -- The Queen's Gambit
UPDATE productions SET poster_url = 'https://image.tmdb.org/t/p/original/iYoMZYVD775MtBYJfv6OGY1FsnL.jpg' WHERE production_id = 'tt10574558'; -- Midnight Mass
UPDATE productions SET poster_url = 'https://image.tmdb.org/t/p/original/q13XJHdnsmxQL9rXRcnNDrZGHjO.jpg' WHERE production_id = 'tt2401256'; -- The Night Of
UPDATE productions SET poster_url = 'https://image.tmdb.org/t/p/original/1SGovj2qDdkJexvhFiXllj9EYfu.jpg' WHERE production_id = 'tt2649356'; -- Sharp Objects
UPDATE productions SET poster_url = 'https://image.tmdb.org/t/p/original/1fH41ccMKvgDTbbcCxWWH6fznah.jpg' WHERE production_id = 'tt2879552'; -- 11.22.63
UPDATE productions SET poster_url = 'https://image.tmdb.org/t/p/original/oPv3nNtkuc6EPEql5lgdOuQNHuG.jpg' WHERE production_id = 'tt7137906'; -- When They See Us
UPDATE productions SET poster_url = 'https://image.tmdb.org/t/p/original/hlLXt2tOPT6RRnjiUmoxyG1LTFi.jpg' WHERE production_id = 'tt7366338'; -- Chernobyl
UPDATE productions SET poster_url = 'https://image.tmdb.org/t/p/original/tzCcYBtiyTkKQwsVyZuNE4F9oUw.jpg' WHERE production_id = 'tt9815454'; -- Unorthodox
UPDATE productions SET poster_url = 'https://image.tmdb.org/t/p/original/8KxvKGl8lQembejIadDP03qjEYT.jpg' WHERE production_id = 'tt0123865'; -- Gia 
UPDATE productions SET poster_url = 'https://image.tmdb.org/t/p/original/gSu3GKl3fYt8yFPr8ZYAZWoQNok.jpg' WHERE production_id = 'tt0473389'; -- The Ron Clark Story
UPDATE productions SET poster_url = 'https://image.tmdb.org/t/p/original/7I3WMof3AJuLkildBxpGZkuvQwj.jpg' WHERE production_id = 'tt1000771'; -- Recount
UPDATE productions SET poster_url = 'https://image.tmdb.org/t/p/original/xl4x8aILt9v91TUOKXHIVDZwkXy.jpg' WHERE production_id = 'tt1132623'; -- You Don't Know Jack
UPDATE productions SET poster_url = 'https://image.tmdb.org/t/p/original/gQhQ6yEkUkDDo1zugpq46PJN8xZ.jpg' WHERE production_id = 'tt1278469'; -- Temple Grandin
UPDATE productions SET poster_url = 'https://image.tmdb.org/t/p/original/rQwdv1bNdc0OSG8svAEfWACcAAU.jpg' WHERE production_id = 'tt1684226'; -- The Normal Heart
UPDATE productions SET poster_url = 'https://image.tmdb.org/t/p/original/8k4lJ4e0hvDQtKpItXmmPdw69sO.jpg' WHERE production_id = 'tt1933667'; -- The Wizard of Lies
UPDATE productions SET poster_url = 'https://image.tmdb.org/t/p/original/fC2HDm5t0kHl7mTm7jxMR31b7by.jpg' WHERE production_id = 'tt5719536'; -- Better Call Saul
UPDATE productions SET poster_url = 'https://image.tmdb.org/t/p/original/fC2HDm5t0kHl7mTm7jxMR31b7by.jpg' WHERE production_id = 'tt12187040'; -- Better Call Saul
UPDATE productions SET poster_url = 'https://image.tmdb.org/t/p/original/ztkUQFLlC19CCMYHW9o1zWhJRNq.jpg' WHERE production_id = 'tt2301455'; -- Breaking Bad
UPDATE productions SET poster_url = 'https://image.tmdb.org/t/p/original/ztkUQFLlC19CCMYHW9o1zWhJRNq.jpg' WHERE production_id = 'tt2301451'; -- Breaking Bad
UPDATE productions SET poster_url = 'https://image.tmdb.org/t/p/original/ztkUQFLlC19CCMYHW9o1zWhJRNq.jpg' WHERE production_id = 'tt1683088'; -- Breaking Bad
UPDATE productions SET poster_url = 'https://image.tmdb.org/t/p/original/Re9I5tauOspaJxYCIqRqavKT4F.jpg' WHERE production_id = 'tt4163660'; -- Ben 10: Omniverse
UPDATE productions SET poster_url = 'https://image.tmdb.org/t/p/original/q8dWfc4JwQuv3HayIZeO84jAXED.jpg' WHERE production_id = 'tt1444421'; -- Dexter
UPDATE productions SET poster_url = 'https://image.tmdb.org/t/p/original/yaGt4GIutpbXHsv48tWceWg6s56.jpg' WHERE production_id = 'tt1204265'; -- Avatar: The Last Airbender
UPDATE productions SET poster_url = 'https://image.tmdb.org/t/p/original/1XS1oqL89opfnbLl8WnZY1O1uJx.jpg' WHERE production_id = 'tt4283088'; -- Game of Thrones
UPDATE productions SET poster_url = 'https://image.tmdb.org/t/p/original/hTP1DtLGFamjfu8WqjnuQdP1n4i.jpg' WHERE production_id = 'tt9906260'; -- Attack on Titan
