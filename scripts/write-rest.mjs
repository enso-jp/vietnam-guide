import { mkdirSync, writeFileSync } from 'node:fs';

const guide = (data) => {
  mkdirSync('src/content/guides', { recursive: true });
  writeFileSync(`src/content/guides/${data.slug}.json`, JSON.stringify(data, null, 2));
};

const trip = (data) => {
  mkdirSync('src/content/itineraries', { recursive: true });
  writeFileSync(`src/content/itineraries/${data.slug}.json`, JSON.stringify(data, null, 2));
};

guide({
  slug: 'when-to-go',
  title: 'When to travel',
  group: 'before',
  summary: 'Vietnam has no single best month. The north, the central coast, and the south run on different monsoons. Pick the region that matters most, then check the others.',
  verified: '19 Oct 2026',
  sections: [
    { heading: 'Three climates', paragraphs: [
      'The north, including Hanoi, Ha Long, Ninh Binh, and the mountains, has a cool dry season from about November to April and a hot wet summer. This is the only region with a real winter.',
      'The central coast, including Hue, Da Nang, Hoi An, and Phong Nha, is driest from about February to August. September to November brings heavy rain, floods, and typhoons. Hoi An’s old town floods in many of those years.',
      'The south, including Ho Chi Minh City, the Mekong, and Phu Quoc, is drier from about December to April and wet from May to November. Rain is often a hard afternoon shower rather than an all-day washout. Da Lat stays cooler year-round because of the altitude.'
    ]},
    { heading: 'If you can only pick one window', paragraphs: [
      'March and April are the closest thing to a countrywide compromise: the north is warming and mostly dry, the center is in its dry months, and the south has not yet entered the heavy rains. Tet, the lunar new year, moves each year and shuts a lot of the country for several days. Book transport far ahead if your dates touch it, or avoid the holiday week if you need shops and trains to run normally.'
    ]}
  ],
  faqs: [
    { q: 'What if the trip must be in October?', a: 'Favor the south and the north. Treat the central coast as weather-dependent and keep a backup night in Da Nang if Hoi An floods.' }
  ],
  seoTitle: 'When to travel to Vietnam',
  seoDescription: 'A month-by-month way to choose between north, central, and south Vietnam.'
});

guide({
  slug: 'e-visa',
  title: 'E-visa and entry',
  group: 'before',
  summary: 'Most visitors apply online before they fly. Use the official portals, not a lookalike site, and treat approval as something you wait for rather than something you receive at the airport desk.',
  verified: '19 Oct 2026',
  sourceUrl: 'https://evisa.gov.vn/',
  sourceLabel: 'Vietnam National Electronic Visa system',
  sections: [
    { heading: 'Where to apply', paragraphs: [
      'The official e-visa sites are https://evisa.gov.vn/ and https://thithucdientu.gov.vn/. The immigration service has told applicants to use these domains. A travel agency may submit for you; you can also apply yourself.',
      'Rules, eligible passport lists, length of stay, and fees change. Read the current form. This page is a planning note, not a legal determination.'
    ]},
    { heading: 'Before you fly', paragraphs: [
      'Apply with the passport you will carry. The name and number must match. Keep the approval file offline on your phone. Airlines often check it at departure.',
      'Single and multiple entry, and stays up to 90 days, have been part of the system. Confirm the option you need on the official form the week you apply.'
    ]}
  ],
  faqs: [
    { q: 'Can you get a visa on arrival instead?', a: 'Do not plan on it unless an official instruction for your passport says so. The e-visa is the path to arrange before travel.' }
  ],
  seoTitle: 'Vietnam e-visa — how to apply',
  seoDescription: 'Use the official Vietnam e-visa portals and check the current rules before you book flights.'
});

guide({
  slug: 'money',
  title: 'Money',
  group: 'before',
  summary: 'The currency is the dong, VND. Cards work in cities. Cash still pays for markets, countryside meals, and many tickets. The number of zeros is the thing that causes mistakes.',
  verified: '19 Oct 2026',
  sections: [
    { heading: 'Cash and cards', paragraphs: [
      'ATMs are common in cities and tourist towns. Tell your bank you are traveling. Withdraw larger amounts less often, and check the fee screen before you confirm.',
      'A 50,000 note and a 500,000 note are easy to confuse when you are tired. Count the zeros before you hand a note over, and count the change.'
    ]},
    { heading: 'How people pay', paragraphs: [
      'Hotels, malls, and many restaurants in Hanoi and Ho Chi Minh City take cards. Street stalls, markets, homestays, and boat tickets often want cash. USD is sometimes quoted at hotels; you can almost always pay in dong.'
    ]}
  ],
  faqs: [{ q: 'Should you bring dollars?', a: 'A small backup is useful. Do not plan to pay daily expenses in USD.' }],
  seoTitle: 'Money in Vietnam — dong, ATMs, and cards',
  seoDescription: 'How to pay in Vietnam, why cash still matters, and how to read the zeros on a dong note.'
});

guide({
  slug: 'sim-and-wifi',
  title: 'SIM cards and Wi-Fi',
  group: 'before',
  summary: 'Buy a tourist SIM at the airport or use an eSIM if your phone supports it. You want data before you reach the taxi line, because Grab needs it.',
  verified: '19 Oct 2026',
  sections: [
    { heading: 'At the airport', paragraphs: [
      'Viettel, Mobifone, and Vinaphone booths in international arrivals sell tourist SIMs. Bring your passport. Compare the data amount, not the box.',
      'Cafe Wi-Fi is widespread and uneven. Do not plan to navigate a new city on a single cafe login.'
    ]}
  ],
  faqs: [{ q: 'Is an eSIM enough?', a: 'Yes if your phone accepts one and you install it before you land. A physical SIM is the fallback.' }],
  seoTitle: 'SIM cards and Wi-Fi in Vietnam',
  seoDescription: 'Get a data SIM at the airport so maps and Grab work when you land.'
});

guide({
  slug: 'luggage',
  title: 'Luggage and forwarding',
  group: 'before',
  summary: 'Carry a bag you can lift onto a train berth and a boat. Long-distance buses store large packs underneath. Forwarding services exist between cities if you want to travel light on a mountain detour.',
  verified: '19 Oct 2026',
  sections: [
    { heading: 'What to carry', paragraphs: [
      'A 20–40 liter bag is enough for the classic route if you do laundry. Hard cases are awkward on sleeper buses and island ferries.',
      'Hotels and bus offices can often send a bag ahead to the next city. Ask for a written receipt and a delivery date before you let go of it.'
    ]}
  ],
  faqs: [],
  seoTitle: 'Luggage in Vietnam',
  seoDescription: 'What size bag works on trains, buses, and boats, and how forwarding works.'
});

guide({
  slug: 'street-manners',
  title: 'Street manners',
  group: 'learn',
  summary: 'The street rule that surprises visitors is traffic. Motorbikes flow through intersections. You cross by stepping out at a steady pace so riders can curve around you.',
  verified: '19 Oct 2026',
  sections: [
    { heading: 'Crossing', paragraphs: [
      'Wait for a slight gap, then walk steadily. Do not freeze and do not sprint. Make eye contact with the nearest rider if you can. A local who steps off the curb is the person to follow.',
      'Sidewalks are also parking, cooking, and cafe space. Walk in the remaining strip, and step into the road only when you mean to cross.'
    ]},
    { heading: 'Everything else', paragraphs: [
      'Horns are a signal, not always an insult. Public affection is milder than in many Western cities. Ask before you photograph a person, especially in a highland village.',
      'Bargaining belongs in markets, not in restaurants with printed prices. Shoes come off at homestays, temples, and many house entries.'
    ]}
  ],
  faqs: [],
  seoTitle: 'Street manners in Vietnam',
  seoDescription: 'How to cross a street of motorbikes, and the other public habits that keep a walk easy.'
});

guide({
  slug: 'eating-manners',
  title: 'Eating manners',
  group: 'learn',
  summary: 'Meals are shared, herbs are part of the dish, and a few chopstick habits matter. Street stalls expect you to know the price before you sit only if it is not already on the wall.',
  verified: '19 Oct 2026',
  sections: [
    { heading: 'At the table', paragraphs: [
      'Do not stick chopsticks upright in a bowl of rice. Pass dishes, do not spear them. It is normal to lift a noodle bowl.',
      'If a hotpot or a grill is shared, wait for the cook at the table to start. Leave a little food if you are a guest in a home; finish the bowl at a stall if you bought it yourself.'
    ]},
    { heading: 'Paying', paragraphs: [
      'Seafood displayed on ice is often priced by weight. Ask before it is cooked. Tipping is not required. Rounding up a taxi or leaving small change at a sit-down meal is enough.'
    ]}
  ],
  faqs: [],
  seoTitle: 'Eating manners in Vietnam',
  seoDescription: 'Chopsticks, shared dishes, and how to avoid a surprise seafood bill.'
});

guide({
  slug: 'flights',
  title: 'Flights inside Vietnam',
  group: 'move',
  summary: 'Domestic flights are the way to keep a two-week trip intact. Vietnam Airlines, Vietjet, Bamboo Airways, and Vietravel Airlines cover the main cities.',
  verified: '19 Oct 2026',
  sections: [
    { heading: 'Where flying saves the trip', paragraphs: [
      'Hanoi to Hue or Da Nang, Hanoi to Ho Chi Minh City, and Ho Chi Minh City to Phu Quoc or Da Lat are the legs where a train or bus spends a day you may not have.',
      'Low fares come with strict baggage rules. Weigh your bag at the hotel. Airports are close to Da Nang, Hue, and central Ho Chi Minh City, and farther from Hoi An and Sapa.'
    ]}
  ],
  faqs: [],
  seoTitle: 'Domestic flights in Vietnam',
  seoDescription: 'When to fly inside Vietnam instead of taking the train or a sleeper bus.'
});

guide({
  slug: 'trains',
  title: 'Trains',
  group: 'move',
  summary: 'The Reunification Express runs between Hanoi and Ho Chi Minh City. It is an overnight experience, not a high-speed network. Book a sleeper berth on the long legs.',
  verified: '19 Oct 2026',
  sourceUrl: 'https://dsvn.vn/',
  sourceLabel: 'Vietnam Railways',
  sections: [
    { heading: 'What the train is good for', paragraphs: [
      'Hanoi to Hue or Da Nang overnight, and Hanoi to Lao Cai for Sapa, are the visitor journeys. The full Hanoi to Ho Chi Minh City ride takes more than thirty hours and only suits people who want the train itself.',
      'Soft sleepers are the comfortable berth. Hard seats are a last resort. Tickets sell out around holidays. The official railway site is https://dsvn.vn/ and licensed agents sell the same trains.'
    ]}
  ],
  faqs: [],
  seoTitle: 'Trains in Vietnam',
  seoDescription: 'How the Reunification Express works and which overnight rides are worth booking.'
});

guide({
  slug: 'buses',
  title: 'Buses',
  group: 'move',
  summary: 'Sleeper buses and limousine vans are the workhorses between cities the train misses. Book a company with a named pickup, and expect the advertised time to include traffic.',
  verified: '19 Oct 2026',
  sections: [
    { heading: 'How to book', paragraphs: [
      'Vexere and 12Go list the operators. Limousine vans cost more than a basic sleeper and are usually the better night. Read the pickup point. “Hanoi” can mean a station on the edge of the city.',
      'Keep your bag ticket. The hold underneath is opened at stops.'
    ]}
  ],
  faqs: [],
  seoTitle: 'Buses in Vietnam',
  seoDescription: 'How sleeper buses and limousine vans work between Vietnamese cities.'
});

guide({
  slug: 'grab-and-taxis',
  title: 'Grab and taxis',
  group: 'move',
  summary: 'Grab is the default ride inside large cities. Install it on Wi-Fi, add a card or cash, and match the plate before you get in.',
  verified: '19 Oct 2026',
  sections: [
    { heading: 'In town', paragraphs: [
      'GrabCar is the easier choice with luggage. GrabBike is faster in Hanoi and Ho Chi Minh City traffic and a poor idea with a suitcase or a child.',
      'Airport taxis with a written price are fine. A street hail should use the meter. If a driver refuses, wait for the next car or open the app.'
    ]}
  ],
  faqs: [],
  seoTitle: 'Grab and taxis in Vietnam',
  seoDescription: 'How to use Grab, and when a metered taxi is the right car.'
});

guide({
  slug: 'motorbikes',
  title: 'Motorbikes',
  group: 'move',
  summary: 'A Vietnamese motorcycle license is what makes riding legal. Many shops still rent bikes to visitors without one. A crash in that situation is your problem, and insurance may not answer.',
  verified: '19 Oct 2026',
  sections: [
    { heading: 'The practical choice', paragraphs: [
      'Hire a car and driver, or ride as a passenger with a licensed driver, on the Ha Giang Loop and the Hai Van pass. Those roads are the ones people picture when they imagine riding Vietnam.',
      'If you hold the correct license, wear a helmet, ride in daylight, and do not drink. An international driving permit is not a substitute you should assume will be accepted. Check the current rule before you rent.'
    ]}
  ],
  faqs: [],
  seoTitle: 'Motorbikes in Vietnam',
  seoDescription: 'Why most visitors should hire a driver instead of renting a motorbike.'
});

guide({
  slug: 'where-to-stay',
  title: 'Where to stay',
  group: 'stay',
  summary: 'Vietnam’s useful beds are city hotels, beach resorts, homestays, stilt houses, hostels, and overnight boats. Pick the area before the brand.',
  verified: '19 Oct 2026',
  sections: [
    { heading: 'Types', paragraphs: [
      'Hotels cover the cities. Resorts cover Phu Quoc, Da Nang, Nha Trang, and Mui Ne. Homestays are the right night in Tam Coc, Sapa’s valleys, Mai Chau, and parts of Hoi An.',
      'An overnight Ha Long boat is a stay, not an activity you add after booking a hotel. Read the cabin photo carefully. A stilt house in Mai Chau usually includes dinner.'
    ]},
    { heading: 'Price bands', paragraphs: [
      'Dorm beds are the hostel price. A simple private room in a visitor town is the next step. A well-located hotel is a clear step up. Resort villas and advertised cruise cabins sit at the top. Prices move on Tet and weekends; the band on each place page is a planning range, not a quote.'
    ]}
  ],
  faqs: [],
  seoTitle: 'Where to stay in Vietnam',
  seoDescription: 'Hotels, homestays, resorts, and overnight boats, and which trip each one fits.'
});

trip({
  slug: 'best-14-days',
  title: 'Best of Vietnam in 14 days',
  kind: 'trip',
  duration: '14 days',
  budget: 'Midrange, with one domestic flight',
  pace: 'Steady',
  summary: 'Hanoi, one northern landscape, Hue, Hoi An, and Ho Chi Minh City. Fly at least once. Add the Mekong only if you drop a northern night.',
  days: [
    { title: 'Days 1–3 — Hanoi', body: 'Land and walk the Old Quarter, the lake, and one museum or the Temple of Literature. Eat bun cha.', placeSlug: 'hanoi' },
    { title: 'Day 4 — Ninh Binh or Ha Long', body: 'Pick one. Ninh Binh for rice and a boat cave. Ha Long for open water. Do not do both unless you add days.', placeSlug: 'ninh-binh' },
    { title: 'Day 5 — Back to Hanoi, overnight south', body: 'Return to Hanoi. Fly to Hue the next morning, or board the sleeper train.', placeSlug: 'hanoi' },
    { title: 'Days 6–7 — Hue', body: 'Citadel, then one tomb. Eat bun bo Hue.', placeSlug: 'hue' },
    { title: 'Day 8 — Hue to Hoi An', body: 'Travel in the morning. The Hai Van pass is optional and weather-dependent.', placeSlug: 'hoi-an' },
    { title: 'Days 9–10 — Hoi An', body: 'Old town, a food morning, and either the beach or My Son.', placeSlug: 'hoi-an' },
    { title: 'Day 11 — Fly to Ho Chi Minh City', body: 'From Da Nang. Use the afternoon to walk District 1.', placeSlug: 'ho-chi-minh-city' },
    { title: 'Days 12–13 — Ho Chi Minh City', body: 'A museum morning and either Cu Chi or a decision to leave for Can Tho.', placeSlug: 'ho-chi-minh-city' },
    { title: 'Day 14 — Leave, or a dawn market', body: 'Fly home, or be on a boat in Can Tho if you moved south the day before.', placeSlug: 'can-tho' }
  ],
  seoTitle: 'Vietnam in 14 days',
  seoDescription: 'A practical 14-day route from Hanoi to Ho Chi Minh City, with one northern side trip and the central coast.'
});

trip({
  slug: 'north-7-days',
  title: 'Northern Vietnam in 7 days',
  kind: 'trip',
  duration: '7 days',
  budget: 'Midrange',
  pace: 'One landscape, not three',
  summary: 'Hanoi plus either the mountains or the bay and Ninh Binh. Seven days is not Hanoi, Ha Long, Sapa, and Ha Giang.',
  days: [
    { title: 'Days 1–2 — Hanoi', body: 'Arrive and walk. Do not transfer onward the hour you land.', placeSlug: 'hanoi' },
    { title: 'Days 3–5 — One region', body: 'Sapa, the Ha Giang Loop with a driver, or Ha Long plus Ninh Binh. Choose before you book the trains.', placeSlug: 'sapa' },
    { title: 'Days 6–7 — Hanoi', body: 'Return with a spare night so a delay does not become a missed flight.', placeSlug: 'hanoi' }
  ],
  seoTitle: '7 days in northern Vietnam',
  seoDescription: 'A one-week northern itinerary that picks a single landscape beyond Hanoi.'
});

trip({
  slug: 'central-5-days',
  title: 'Central coast in 5 days',
  kind: 'trip',
  duration: '5 days',
  budget: 'Midrange',
  pace: 'Relaxed',
  summary: 'Hue and Hoi An, with Da Nang as the airport. Add Phong Nha only by dropping a day in one of the cities.',
  days: [
    { title: 'Days 1–2 — Hue', body: 'Citadel and a tomb.', placeSlug: 'hue' },
    { title: 'Day 3 — To Hoi An', body: 'Morning transfer. Afternoon in the old town.', placeSlug: 'hoi-an' },
    { title: 'Days 4–5 — Hoi An', body: 'Food, a bicycle, and the flight out of Da Nang.', placeSlug: 'da-nang' }
  ],
  seoTitle: '5 days on the central coast',
  seoDescription: 'Hue, Hoi An, and the Da Nang airport in five days.'
});

trip({
  slug: 'south-5-days',
  title: 'The south in 5 days',
  kind: 'trip',
  duration: '5 days',
  budget: 'Midrange',
  pace: 'City plus one trip',
  summary: 'Ho Chi Minh City plus either Can Tho, Phu Quoc, or Da Lat. Not all three.',
  days: [
    { title: 'Days 1–2 — Ho Chi Minh City', body: 'District 1 and one museum.', placeSlug: 'ho-chi-minh-city' },
    { title: 'Days 3–4 — One add-on', body: 'A night in Can Tho, a flight to Phu Quoc, or a night bus to Da Lat.', placeSlug: 'can-tho' },
    { title: 'Day 5 — Back to the airport', body: 'Tan Son Nhat, unless you fly out of the add-on city.', placeSlug: 'ho-chi-minh-city' }
  ],
  seoTitle: '5 days in southern Vietnam',
  seoDescription: 'Ho Chi Minh City and one of Can Tho, Phu Quoc, or Da Lat.'
});

trip({
  slug: 'hanoi-old-quarter-walk',
  title: 'Hanoi Old Quarter walk',
  kind: 'walk',
  duration: '3 hours',
  budget: 'Low, plus a meal',
  pace: 'Relaxed',
  summary: 'A morning loop north of Hoan Kiem Lake through the guild streets, a market, and a lunch bowl.',
  stops: [
    { name: 'Hoan Kiem lakeshore', minutes: 20, walkMinutes: 10, placeSlug: 'hanoi', note: 'Start at the northern edge of the lake.' },
    { name: 'Hang Bac and the silver street', minutes: 20, walkMinutes: 8, note: 'Walk north. The trade names survive on the signs.' },
    { name: 'Bach Ma Temple', minutes: 15, walkMinutes: 10, note: 'A small neighborhood temple on Hang Buom.' },
    { name: 'Dong Xuan Market', minutes: 25, walkMinutes: 10, note: 'One floor is enough.' },
    { name: 'Lunch', minutes: 50, note: 'Bun cha or pho, then walk back to the lake on a different lane.' }
  ],
  seoTitle: 'Hanoi Old Quarter walking itinerary',
  seoDescription: 'A three-hour morning walk through Hanoi’s Old Quarter.'
});

trip({
  slug: 'hoi-an-old-town-walk',
  title: 'Hoi An old town walk',
  kind: 'walk',
  duration: '3 hours',
  budget: 'Ticket plus a bowl of cao lau',
  pace: 'Relaxed',
  summary: 'Morning streets, one old house, the covered bridge, and lunch before the town gets hot.',
  stops: [
    { name: 'Japanese Covered Bridge', minutes: 20, walkMinutes: 8, placeSlug: 'hoi-an', note: 'Start at the west end.' },
    { name: 'Tran Phu shophouses', minutes: 30, walkMinutes: 5, note: 'Pick one ticketed house, not five.' },
    { name: 'Assembly hall', minutes: 25, walkMinutes: 8, note: 'The Chinese assembly halls are cool and detailed.' },
    { name: 'River edge', minutes: 15, walkMinutes: 5, note: 'Note the flood marks if you are visiting late in the year.' },
    { name: 'Cao lau', minutes: 40, note: 'Eat before you leave the old streets.' }
  ],
  seoTitle: 'Hoi An old town walk',
  seoDescription: 'A morning walking route through Hoi An’s old town.'
});

trip({
  slug: 'ho-chi-minh-city-walk',
  title: 'Ho Chi Minh City walk',
  kind: 'walk',
  duration: '4 hours',
  budget: 'Museum ticket and lunch',
  pace: 'Steady',
  summary: 'District 1 from the cathedral square to Ben Thanh, with the palace if the heat allows.',
  stops: [
    { name: 'Notre-Dame square and the Post Office', minutes: 25, walkMinutes: 8, placeSlug: 'ho-chi-minh-city', note: 'The cathedral may be closed for works. The post office interior is the sure stop.' },
    { name: 'Dong Khoi', minutes: 20, walkMinutes: 10, note: 'Walk toward the river, then turn inland.' },
    { name: 'Reunification Palace', minutes: 60, walkMinutes: 12, note: 'Allow a full hour inside.' },
    { name: 'Ben Thanh Market', minutes: 30, walkMinutes: 10, note: 'Look, then eat lunch nearby rather than in the tourist stalls.' }
  ],
  seoTitle: 'Ho Chi Minh City walking itinerary',
  seoDescription: 'A half-day walk through District 1 in Ho Chi Minh City.'
});

mkdirSync('src/content/seasons', { recursive: true });
writeFileSync('src/content/seasons/rice.json', JSON.stringify({
  sites: [
    { slug: 'tam-coc', name: 'Tam Coc', placeSlug: 'tam-coc', water: 'April', green: 'April to May', gold: 'Late May to early June', note: 'Earlier than the northern mountains.' },
    { slug: 'sapa', name: 'Sapa valleys', placeSlug: 'sapa', water: 'Late April to May', green: 'July to August', gold: 'Late August to October', note: 'Mist can hide a peak week.' },
    { slug: 'mu-cang-chai', name: 'Mu Cang Chai', placeSlug: 'sapa', water: 'May to early June', green: 'June to August', gold: 'September to October', note: 'In Lao Cai after the Yen Bai merger. Often the latest gold.' },
    { slug: 'mai-chau', name: 'Mai Chau', placeSlug: 'mai-chau', water: 'March to May', green: 'June to August', gold: 'September to October', note: 'A lower valley, easier to reach from Hanoi.' },
    { slug: 'ha-giang', name: 'Ha Giang buckwheat', placeSlug: 'ha-giang', water: 'Not rice', green: 'Not rice', gold: 'Flowers often October to November', note: 'This row is tam giác mạch, not a rice terrace. It shares the autumn trip.' }
  ]
}, null, 2));

console.log('wrote guides, itineraries, rice');
