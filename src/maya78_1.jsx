import { useState, useEffect, useMemo, useCallback } from "react";

// ============================================================
// DATA: All 78 RWS Tarot Cards
// ============================================================
const ELEMENTS = {
  fire: { name: 'Fire', symbol: '🜂', color: '#8a5a44', bg: 'rgba(196,131,107,0.12)', border: 'rgba(196,131,107,0.4)', desc: 'Passion, energy, will, creativity. Fast, transformative energy.' },
  water: { name: 'Water', symbol: '🜄', color: '#446a8a', bg: 'rgba(107,142,196,0.12)', border: 'rgba(107,142,196,0.4)', desc: 'Emotions, intuition, relationships. Flowing, receptive energy.' },
  air: { name: 'Air', symbol: '🜁', color: '#5a6478', bg: 'rgba(160,168,184,0.12)', border: 'rgba(160,168,184,0.4)', desc: 'Thought, communication, truth, intellect. Quick, cutting energy.' },
  earth: { name: 'Earth', symbol: '🜃', color: '#5a7a44', bg: 'rgba(138,170,107,0.12)', border: 'rgba(138,170,107,0.4)', desc: 'Material world, body, money, nature. Grounding, stable energy.' },
};

const NUM = {
  0:'Infinite potential, the beginning before the beginning.',
  1:'New beginnings, raw potential, the seed.',
  2:'Duality, balance, partnership, choice.',
  3:'Creation, growth, expansion, collaboration.',
  4:'Structure, stability, foundation, rest.',
  5:'Conflict, change, instability, disruption.',
  6:'Harmony, communication, reciprocity, healing.',
  7:'Reflection, assessment, inner work, mystery.',
  8:'Mastery, movement, power, regeneration.',
  9:'Completion, culmination, the last push.',
  10:'Full circle, endings, transition to next cycle.',
};

const COURT_ROLES = {
  page:'Student/Messenger — youthful energy, curiosity, new beginnings in this element.',
  knight:'Adventurer/Action — the element in motion, sometimes to excess.',
  queen:'Nurturer/Master — mature, inward mastery. Receptive power & wisdom.',
  king:'Authority/Leader — outward mastery & command. Structure & responsibility.',
};

// Image URL mapping - uses Wikimedia Commons public domain images
// For your Vercel deploy: download images to public/cards/ and change BASE to ''
// Download all 78 from: https://luciellaes.itch.io/rider-waite-smith-tarot-cards-cc0
const WIKI = 'https://upload.wikimedia.org/wikipedia/commons/thumb';
const IMG_MAP = {
  'major-0': `${WIKI}/9/90/RWS_Tarot_00_Fool.jpg/300px-RWS_Tarot_00_Fool.jpg`,
  'major-1': `${WIKI}/d/de/RWS_Tarot_01_Magician.jpg/300px-RWS_Tarot_01_Magician.jpg`,
  'major-2': `${WIKI}/8/88/RWS_Tarot_02_High_Priestess.jpg/300px-RWS_Tarot_02_High_Priestess.jpg`,
  'major-3': `${WIKI}/d/d2/RWS_Tarot_03_Empress.jpg/300px-RWS_Tarot_03_Empress.jpg`,
  'major-4': `${WIKI}/c/c3/RWS_Tarot_04_Emperor.jpg/300px-RWS_Tarot_04_Emperor.jpg`,
  'major-5': `${WIKI}/8/8d/RWS_Tarot_05_Hierophant.jpg/300px-RWS_Tarot_05_Hierophant.jpg`,
  'major-6': `${WIKI}/3/3a/TheLovers.jpg/300px-TheLovers.jpg`,
  'major-7': `${WIKI}/9/9b/RWS_Tarot_07_Chariot.jpg/300px-RWS_Tarot_07_Chariot.jpg`,
  'major-8': `${WIKI}/f/f5/RWS_Tarot_08_Strength.jpg/300px-RWS_Tarot_08_Strength.jpg`,
  'major-9': `${WIKI}/4/4d/RWS_Tarot_09_Hermit.jpg/300px-RWS_Tarot_09_Hermit.jpg`,
  'major-10': `${WIKI}/3/3c/RWS_Tarot_10_Wheel_of_Fortune.jpg/300px-RWS_Tarot_10_Wheel_of_Fortune.jpg`,
  'major-11': `${WIKI}/e/e0/RWS_Tarot_11_Justice.jpg/300px-RWS_Tarot_11_Justice.jpg`,
  'major-12': `${WIKI}/2/2b/RWS_Tarot_12_Hanged_Man.jpg/300px-RWS_Tarot_12_Hanged_Man.jpg`,
  'major-13': `${WIKI}/d/d7/RWS_Tarot_13_Death.jpg/300px-RWS_Tarot_13_Death.jpg`,
  'major-14': `${WIKI}/f/f8/RWS_Tarot_14_Temperance.jpg/300px-RWS_Tarot_14_Temperance.jpg`,
  'major-15': `${WIKI}/5/55/RWS_Tarot_15_Devil.jpg/300px-RWS_Tarot_15_Devil.jpg`,
  'major-16': `${WIKI}/5/53/RWS_Tarot_16_Tower.jpg/300px-RWS_Tarot_16_Tower.jpg`,
  'major-17': `${WIKI}/d/db/RWS_Tarot_17_Star.jpg/300px-RWS_Tarot_17_Star.jpg`,
  'major-18': `${WIKI}/7/7f/RWS_Tarot_18_Moon.jpg/300px-RWS_Tarot_18_Moon.jpg`,
  'major-19': `${WIKI}/1/17/RWS_Tarot_19_Sun.jpg/300px-RWS_Tarot_19_Sun.jpg`,
  'major-20': `${WIKI}/d/dd/RWS_Tarot_20_Judgement.jpg/300px-RWS_Tarot_20_Judgement.jpg`,
  'major-21': `${WIKI}/f/ff/RWS_Tarot_21_World.jpg/300px-RWS_Tarot_21_World.jpg`,
  'wands-1': `${WIKI}/1/11/Wands01.jpg/300px-Wands01.jpg`,
  'wands-2': `${WIKI}/0/0f/Wands02.jpg/300px-Wands02.jpg`,
  'wands-3': `${WIKI}/f/ff/Wands03.jpg/300px-Wands03.jpg`,
  'wands-4': `${WIKI}/a/a4/Wands04.jpg/300px-Wands04.jpg`,
  'wands-5': `${WIKI}/9/9d/Wands05.jpg/300px-Wands05.jpg`,
  'wands-6': `${WIKI}/3/3b/Wands06.jpg/300px-Wands06.jpg`,
  'wands-7': `${WIKI}/e/e4/Wands07.jpg/300px-Wands07.jpg`,
  'wands-8': `${WIKI}/6/6a/Wands08.jpg/300px-Wands08.jpg`,
  'wands-9': `${WIKI}/4/4d/Tarot_Nine_of_Wands.jpg/300px-Tarot_Nine_of_Wands.jpg`,
  'wands-10': `${WIKI}/0/0b/Wands10.jpg/300px-Wands10.jpg`,
  'wands-page': `${WIKI}/6/6a/Wands11.jpg/300px-Wands11.jpg`,
  'wands-knight': `${WIKI}/1/16/Wands12.jpg/300px-Wands12.jpg`,
  'wands-queen': `${WIKI}/0/0d/Wands13.jpg/300px-Wands13.jpg`,
  'wands-king': `${WIKI}/c/ce/Wands14.jpg/300px-Wands14.jpg`,
  'cups-1': `${WIKI}/3/36/Cups01.jpg/300px-Cups01.jpg`,
  'cups-2': `${WIKI}/f/f8/Cups02.jpg/300px-Cups02.jpg`,
  'cups-3': `${WIKI}/7/7a/Cups03.jpg/300px-Cups03.jpg`,
  'cups-4': `${WIKI}/3/35/Cups04.jpg/300px-Cups04.jpg`,
  'cups-5': `${WIKI}/d/d7/Cups05.jpg/300px-Cups05.jpg`,
  'cups-6': `${WIKI}/1/17/Cups06.jpg/300px-Cups06.jpg`,
  'cups-7': `${WIKI}/a/ae/Cups07.jpg/300px-Cups07.jpg`,
  'cups-8': `${WIKI}/6/60/Cups08.jpg/300px-Cups08.jpg`,
  'cups-9': `${WIKI}/2/24/Cups09.jpg/300px-Cups09.jpg`,
  'cups-10': `${WIKI}/8/84/Cups10.jpg/300px-Cups10.jpg`,
  'cups-page': `${WIKI}/a/ad/Cups11.jpg/300px-Cups11.jpg`,
  'cups-knight': `${WIKI}/f/fa/Cups12.jpg/300px-Cups12.jpg`,
  'cups-queen': `${WIKI}/6/62/Cups13.jpg/300px-Cups13.jpg`,
  'cups-king': `${WIKI}/0/04/Cups14.jpg/300px-Cups14.jpg`,
  'swords-1': `${WIKI}/1/1a/Swords01.jpg/300px-Swords01.jpg`,
  'swords-2': `${WIKI}/9/9e/Swords02.jpg/300px-Swords02.jpg`,
  'swords-3': `${WIKI}/0/02/Swords03.jpg/300px-Swords03.jpg`,
  'swords-4': `${WIKI}/b/bf/Swords04.jpg/300px-Swords04.jpg`,
  'swords-5': `${WIKI}/2/23/Swords05.jpg/300px-Swords05.jpg`,
  'swords-6': `${WIKI}/2/29/Swords06.jpg/300px-Swords06.jpg`,
  'swords-7': `${WIKI}/3/34/Swords07.jpg/300px-Swords07.jpg`,
  'swords-8': `${WIKI}/a/a7/Swords08.jpg/300px-Swords08.jpg`,
  'swords-9': `${WIKI}/2/2f/Swords09.jpg/300px-Swords09.jpg`,
  'swords-10': `${WIKI}/d/d4/Swords10.jpg/300px-Swords10.jpg`,
  'swords-page': `${WIKI}/4/4c/Swords11.jpg/300px-Swords11.jpg`,
  'swords-knight': `${WIKI}/b/b0/Swords12.jpg/300px-Swords12.jpg`,
  'swords-queen': `${WIKI}/d/d4/Swords13.jpg/300px-Swords13.jpg`,
  'swords-king': `${WIKI}/3/33/Swords14.jpg/300px-Swords14.jpg`,
  'pentacles-1': `${WIKI}/f/fd/Pents01.jpg/300px-Pents01.jpg`,
  'pentacles-2': `${WIKI}/9/9f/Pents02.jpg/300px-Pents02.jpg`,
  'pentacles-3': `${WIKI}/4/42/Pents03.jpg/300px-Pents03.jpg`,
  'pentacles-4': `${WIKI}/3/35/Pents04.jpg/300px-Pents04.jpg`,
  'pentacles-5': `${WIKI}/9/96/Pents05.jpg/300px-Pents05.jpg`,
  'pentacles-6': `${WIKI}/a/a6/Pents06.jpg/300px-Pents06.jpg`,
  'pentacles-7': `${WIKI}/6/6a/Pents07.jpg/300px-Pents07.jpg`,
  'pentacles-8': `${WIKI}/4/49/Pents08.jpg/300px-Pents08.jpg`,
  'pentacles-9': `${WIKI}/f/f0/Pents09.jpg/300px-Pents09.jpg`,
  'pentacles-10': `${WIKI}/4/42/Pents10.jpg/300px-Pents10.jpg`,
  'pentacles-page': `${WIKI}/e/ec/Pents11.jpg/300px-Pents11.jpg`,
  'pentacles-knight': `${WIKI}/d/d5/Pents12.jpg/300px-Pents12.jpg`,
  'pentacles-queen': `${WIKI}/8/88/Pents13.jpg/300px-Pents13.jpg`,
  'pentacles-king': `${WIKI}/1/1c/Pents14.jpg/300px-Pents14.jpg`,
};
const getCardImage = (id) => IMG_MAP[id] || null;

const mk = (id,name,num,el,astro,yn,up,rev,img,fj) => ({id,name,numeral:num,arcana:'major',suit:null,element:el,astro,yesno:yn,upright:up,reversed:rev,imageDetails:img,foolsJourney:fj,numberMeaning:NUM[parseInt(id.split('-')[1])]||''});

const pip = (suit,el) => (n,name,num,yn,up,rev,img) => ({id:`${suit}-${n}`,name,numeral:num,arcana:'minor',suit,element:el,astro:null,yesno:yn,upright:up,reversed:rev,imageDetails:img,numberMeaning:NUM[n]||''});

const court = (suit,el) => (rank,name,num,yn,up,rev,img) => ({id:`${suit}-${rank}`,name,numeral:num,arcana:'minor',suit,element:el,court:rank,astro:null,yesno:yn,upright:up,reversed:rev,imageDetails:img,courtRole:COURT_ROLES[rank],numberMeaning:'Court cards embody personality aspects of their suit\'s element.'});

const W = pip('wands','fire'), CW = court('wands','fire');
const C = pip('cups','water'), CC = court('cups','water');
const S = pip('swords','air'), CS = court('swords','air');
const P = pip('pentacles','earth'), CP = court('pentacles','earth');

const DECK = [
  // MAJOR ARCANA
  mk('major-0','The Fool','0','air','Uranus','yes',['New beginnings','Innocence','Spontaneity','Free spirit'],['Recklessness','Fear of change','Naivety','Poor judgment'],'A young figure at a cliff edge, looking skyward. White dog leaps at heels. Carries a small bag, holds white rose. Mountains behind, bright sun.','The journey begins! The Fool steps into the unknown, trusting the universe.'),
  mk('major-1','The Magician','I','air','Mercury','yes',['Manifestation','Willpower','Skill','Resourcefulness'],['Manipulation','Trickery','Unused potential','Deception'],'Figure before a table with wand, cup, sword, pentacle. One hand to sky, one to earth. Infinity symbol above head. Red & white roses.','The Fool meets the first teacher — all tools for creation are already at hand.'),
  mk('major-2','The High Priestess','II','water','Moon','maybe',['Intuition','Mystery','Inner knowledge','Subconscious'],['Secrets','Disconnection','Withdrawal','Silence'],'Woman between black (B) and white (J) pillars. Holds TORA scroll. Crescent moon at feet. Pomegranate veil hides water.','The Fool discovers the inner world — the threshold between conscious and unconscious.'),
  mk('major-3','The Empress','III','earth','Venus','yes',['Abundance','Nurturing','Fertility','Sensuality'],['Dependence','Smothering','Neglect','Creative block'],'Seated in lush garden with wheat at feet, waterfall behind. Crown of 12 stars. Pomegranate gown. Venus symbol on heart shield.','The Fool meets abundant, creative mother energy. The world is lush and generative.'),
  mk('major-4','The Emperor','IV','fire','Aries','yes',['Authority','Structure','Father figure','Stability'],['Tyranny','Rigidity','Domination','Inflexibility'],'Stern figure on stone throne with ram heads. Ankh scepter, orb. Red robes, armor. Barren mountains — order imposed.','The Fool meets structure and law. Discipline, boundaries, and the power of order.'),
  mk('major-5','The Hierophant','V','earth','Taurus','maybe',['Tradition','Spiritual wisdom','Conformity','Institutions'],['Rebellion','Non-conformity','New approaches','Freedom'],'Religious figure between two pillars. Triple crown, triple cross. Two followers kneel. Crossed keys at feet.','Organized belief systems — what wisdom do you inherit, and what must you outgrow?'),
  mk('major-6','The Lovers','VI','air','Gemini','yes',['Love','Union','Choices','Alignment'],['Disharmony','Imbalance','Misalignment','Temptation'],'Naked man and woman beneath angel Raphael. Tree of Knowledge with serpent behind her. Tree of twelve flames behind him.','The first great choice — alignment of values. Who and what do you unite with?'),
  mk('major-7','The Chariot','VII','water','Cancer','yes',['Willpower','Determination','Control','Victory'],['Lack of direction','Aggression','No control','Obstacles'],'Figure in stone chariot beneath stars. Two sphinxes — black and white — pull apart. No reins, using will alone.','Harnessing opposing forces through willpower. Victory from focused intent.'),
  mk('major-8','Strength','VIII','fire','Leo','yes',['Courage','Inner strength','Compassion','Patience'],['Self-doubt','Weakness','Raw emotion','Insecurity'],'Woman gently holds open lion\'s jaws. Infinity symbol above. White robes, flower garland. Golden, calm landscape.','True strength is gentle mastery. Compassion tames what aggression cannot.'),
  mk('major-9','The Hermit','IX','earth','Virgo','maybe',['Introspection','Solitude','Inner guidance','Wisdom'],['Isolation','Loneliness','Withdrawal','Lost'],'Old figure atop mountain with lantern (six-pointed star). Staff in hand. Snow, grey sky — withdrawn to seek truth.','Some answers can only be found in silence and solitude.'),
  mk('major-10','Wheel of Fortune','X','fire','Jupiter','yes',['Cycles','Fate','Turning point','Luck'],['Bad luck','Resistance to change','Breaking cycles','Stagnation'],'Great wheel in sky with TARO/ROTA. Sphinx atop, serpent descends, Anubis rises. Four winged creatures in corners.','Life moves in cycles. What rises will fall, what falls will rise again.'),
  mk('major-11','Justice','XI','air','Libra','yes',['Justice','Truth','Cause & effect','Fairness'],['Injustice','Dishonesty','Lack of accountability','Bias'],'Figure on throne between pillars. Sword in one hand, scales in other. Red robe, green cloak, purple veil.','Every action has a consequence. The natural law of cause and effect.'),
  mk('major-12','The Hanged Man','XII','water','Neptune','maybe',['Surrender','New perspective','Letting go','Pause'],['Stalling','Resistance','Martyrdom','Needless sacrifice'],'Man hangs upside down from living tree, leg crossed in "4." Golden halo. Serene expression — he chose this.','Sometimes the only way forward is to let go and see from a new angle.'),
  mk('major-13','Death','XIII','water','Scorpio','no',['Transformation','Endings','Change','Release'],['Resistance to change','Stagnation','Fear of endings','Decay'],'Skeleton in black armor on white horse. Black flag with white rose. King fallen, bishop pleads, maiden turns, child offers flowers. Sun rises between towers.','Something must die for something new to be born. The end of an era.'),
  mk('major-14','Temperance','XIV','fire','Sagittarius','yes',['Balance','Moderation','Patience','Alchemy'],['Excess','Imbalance','Impatience','Extremes'],'Angel with one foot on land, one in water. Pouring liquid between cups impossibly. Triangle/square on chest. Path to golden crown.','Integration — blending opposites into something greater. Alchemy of the soul.'),
  mk('major-15','The Devil','XV','earth','Capricorn','no',['Bondage','Materialism','Shadow self','Addiction'],['Release','Breaking free','Reclaiming power','Detachment'],'Horned, bat-winged devil on pedestal. Naked couple chained below — but chains are loose. Inverted pentagram. Black background.','The chains of attachment and illusion. The secret: you can walk away anytime.'),
  mk('major-16','The Tower','XVI','fire','Mars','no',['Upheaval','Sudden change','Revelation','Destruction'],['Avoidance','Fear of change','Delayed disaster','Rebuilding'],'Tower struck by lightning, crown blown off. Two figures fall. 22 flames rain down. Black sky.','Everything built on false foundations crashes down. Terrifying but necessary.'),
  mk('major-17','The Star','XVII','air','Aquarius','yes',['Hope','Renewal','Inspiration','Serenity'],['Despair','Disconnection','Lack of faith','Discouragement'],'Naked woman kneels by pool, pouring water onto land and into pool. One large star, seven small. Ibis in tree.','After destruction, quiet hope. The calm after the storm — vulnerability and renewed faith.'),
  mk('major-18','The Moon','XVIII','water','Pisces','maybe',['Illusion','Fear','Subconscious','Intuition'],['Clarity','Release of fear','Truth revealed','Repressed emotions'],'Full moon with face between two towers. Winding path from pool. Crayfish crawls from water. Dog and wolf howl.','Dreams and shadows. Not everything is as it seems.'),
  mk('major-19','The Sun','XIX','fire','Sun','yes',['Joy','Success','Vitality','Clarity'],['Temporary sadness','Ego','Overexposure','Delayed success'],'Naked child on white horse beneath radiant sun. Sunflowers behind wall. Red banner. Everything bright and warm.','After darkness, full joyous light. Pure clarity, vitality, and success.'),
  mk('major-20','Judgement','XX','fire','Pluto','yes',['Rebirth','Reckoning','Awakening','Calling'],['Self-doubt','Avoidance','Refusal of the call','Harsh self-judgment'],'Angel Gabriel blows trumpet from clouds. Naked figures rise from coffins, arms outstretched.','The great awakening — answering the call to become who you were meant to be.'),
  mk('major-21','The World','XXI','earth','Saturn','yes',['Completion','Integration','Achievement','Wholeness'],['Incompletion','Stagnation','Lack of closure','Shortcuts'],'Dancing figure in laurel wreath, holding two wands. Red sash. Four creatures in corners. Androgynous, whole.','The journey is complete. All lessons learned, all opposites united. The cycle begins again.'),

  // WANDS
  W(1,'Ace of Wands','A','yes',['Inspiration','New opportunity','Creative spark','Potential'],['Delays','Lack of motivation','Missed opportunity','Block'],'Hand from cloud holds sprouting wand. Leaves fall. Castle on distant hill.'),
  W(2,'Two of Wands','2','yes',['Planning','Future vision','Discovery','Decision'],['Fear of unknown','Lack of planning','Playing safe','Indecision'],'Man on castle wall holds globe and wand. Second wand fixed to wall. Gazes over sea.'),
  W(3,'Three of Wands','3','yes',['Expansion','Foresight','Progress','Opportunity'],['Delays','Obstacles','Frustration','Playing small'],'Figure on cliff watching ships sail. Three wands planted beside. Expansive view.'),
  W(4,'Four of Wands','4','yes',['Celebration','Homecoming','Harmony','Milestone'],['Transition','Instability','Lack of support','Conflict'],'Four wands with flower canopy. Two figures celebrate. Castle and crowd behind.'),
  W(5,'Five of Wands','5','no',['Conflict','Competition','Tension','Diversity'],['Avoidance','Inner conflict','Resolution','Compromise'],'Five young men brandish wands in seeming fight — but no one is hit. May be play or brainstorming.'),
  W(6,'Six of Wands','6','yes',['Victory','Recognition','Success','Public acclaim'],['Ego','Fall from grace','Private achievement','No recognition'],'Figure rides horse through crowd, wand with laurel wreath. Crowd celebrates.'),
  W(7,'Seven of Wands','7','maybe',['Defensiveness','Standing ground','Perseverance','Challenge'],['Overwhelm','Giving up','Exhaustion','Defeat'],'Man on high ground defends with wand against six from below. Mismatched shoes — caught off guard.'),
  W(8,'Eight of Wands','8','yes',['Speed','Movement','Quick action','Air travel'],['Delays','Waiting','Slowing down','Frustration'],'Eight wands fly through air over landscape, same direction. No figures — pure momentum.'),
  W(9,'Nine of Wands','9','maybe',['Resilience','Persistence','Boundaries','Last stand'],['Exhaustion','Paranoia','Giving up','Overwhelm'],'Wounded man leans on wand, looking warily back. Eight wands behind like a fence.'),
  W(10,'Ten of Wands','10','no',['Burden','Responsibility','Overcommitment','Hard work'],['Release','Delegation','Letting go','Burnout'],'Figure struggles to carry ten wands toward town. Can barely see over the load.'),
  CW('page','Page of Wands','Pg','yes',['Enthusiasm','Exploration','Discovery','Free spirit'],['Setbacks','Lack of direction','Procrastination','Boredom'],'Young person in barren landscape gazing at tall wand. Salamander tunic.'),
  CW('knight','Knight of Wands','Kn','yes',['Adventure','Energy','Passion','Impulsiveness'],['Recklessness','Haste','Scattered energy','Delays'],'Knight charges on rearing horse with budding wand. Salamander tunic. Pyramids behind.'),
  CW('queen','Queen of Wands','Q','yes',['Confidence','Independence','Warmth','Determination'],['Jealousy','Selfishness','Demanding','Insecurity'],'Queen on lion/sunflower throne. Wand and sunflower. Black cat at feet. Magnetic.'),
  CW('king','King of Wands','K','yes',['Leadership','Vision','Entrepreneurship','Bold action'],['Impulsive','Domineering','Ruthless','High expectations'],'King on lion/salamander throne with budding wand. Small salamander at feet.'),

  // CUPS
  C(1,'Ace of Cups','A','yes',['Love','New feelings','Emotional awakening','Compassion'],['Emotional loss','Blocked feelings','Emptiness','Repressed'],['Hand from cloud holds overflowing chalice. Five streams. Dove with wafer. Water lilies.']),
  C(2,'Two of Cups','2','yes',['Partnership','Attraction','Unity','Connection'],['Imbalance','Broken communication','Separation','Tension'],'Man and woman exchange cups. Caduceus with lion head above.'),
  C(3,'Three of Cups','3','yes',['Celebration','Friendship','Community','Joy'],['Overindulgence','Gossip','Isolation','Third party'],'Three women toast and dance in garden of fruits and flowers.'),
  C(4,'Four of Cups','4','no',['Apathy','Contemplation','Dissatisfaction','Withdrawn'],['Motivation','Awareness','Acceptance','New perspective'],'Man under tree, arms crossed, stares at three cups. Hand offers fourth — unnoticed.'),
  C(5,'Five of Cups','5','no',['Grief','Loss','Regret','Disappointment'],['Acceptance','Moving on','Finding peace','Forgiveness'],'Cloaked figure looks at three spilled cups. Two stand behind, unseen. Bridge to castle.'),
  C(6,'Six of Cups','6','yes',['Nostalgia','Innocence','Happy memories','Reunion'],['Living in past','Unrealistic','Naivety','Moving forward'],'Boy offers flower cup to smaller girl. Six flower cups. Old village. Guard walks away.'),
  C(7,'Seven of Cups','7','maybe',['Fantasy','Illusion','Choices','Wishful thinking'],['Clarity','Making a choice','Alignment','Focus'],'Silhouette gazes at seven cups in clouds — castle, jewels, wreath, dragon, head, figure, snake.'),
  C(8,'Eight of Cups','8','no',['Walking away','Disillusionment','Seeking depth','Letting go'],['Fear of change','Staying too long','Avoidance','Clinging'],'Cloaked figure walks from eight stacked cups toward mountains under crescent moon.'),
  C(9,'Nine of Cups','9','yes',['Contentment','Satisfaction','Wish fulfilled','Gratitude'],['Dissatisfaction','Greed','Materialism','Smugness'],'Satisfied man on bench, arms crossed, smiling. Nine cups in arc behind.'),
  C(10,'Ten of Cups','10','yes',['Harmony','Family','Fulfillment','Happily ever after'],['Broken home','Disharmony','Misalignment','Family conflict'],'Couple with raised arms beneath rainbow of ten cups. Children dance. Peaceful home.'),
  CC('page','Page of Cups','Pg','yes',['Creative opportunity','Intuitive message','Curiosity','Dreamer'],['Emotional immaturity','Escapism','Insecurity','Block'],'Young person by sea with cup — fish pops out, surprising them. Floral tunic.'),
  CC('knight','Knight of Cups','Kn','yes',['Romance','Charm','Imagination','Following heart'],['Moodiness','Unrealistic','Jealousy','Disappointment'],'Knight rides slowly, holding cup like offering. Winged helmet. River nearby.'),
  CC('queen','Queen of Cups','Q','yes',['Compassion','Emotional security','Intuition','Nurturing'],['Codependency','Insecurity','Martyrdom','Manipulation'],'Queen at sea edge with ornate covered cup. Gazes intently. Cherub throne.'),
  CC('king','King of Cups','K','yes',['Emotional balance','Diplomacy','Compassion','Calm'],['Manipulation','Moodiness','Coldness','Volatility'],'King on stone throne in turbulent seas. Cup and scepter. Ship and dolphin behind.'),

  // SWORDS
  S(1,'Ace of Swords','A','yes',['Clarity','Breakthrough','New idea','Mental force'],['Confusion','Chaos','Misinformation','Brutality'],'Hand from cloud grips sword with golden crown. Laurel branch and palm frond hang from crown.'),
  S(2,'Two of Swords','2','maybe',['Indecision','Stalemate','Blocked emotions','Denial'],['Overwhelm','Info overload','Decision made','Seeing truth'],'Blindfolded woman holds two crossed swords. Sea and rocks behind. Crescent moon.'),
  S(3,'Three of Swords','3','no',['Heartbreak','Grief','Sorrow','Painful truth'],['Recovery','Forgiveness','Moving on','Releasing pain'],'Three swords pierce a red heart amid grey rain clouds. Stark and simple.'),
  S(4,'Four of Swords','4','maybe',['Rest','Recovery','Contemplation','Solitude'],['Restlessness','Burnout','Stagnation','Anxiety'],'Knight lies on tomb in prayer. Three swords on wall, one beneath. Stained glass window.'),
  S(5,'Five of Swords','5','no',['Defeat','Conflict','Winning at cost','Bullying'],['Reconciliation','Making amends','Past conflict','Forgiveness'],'Smirking man holds three swords, two on ground. Two defeated figures walk to stormy sea.'),
  S(6,'Six of Swords','6','yes',['Transition','Moving on','Healing journey','Calmer waters'],['Stuck','Resistance','Unresolved baggage','Delayed healing'],'Ferryman guides woman and child across water. Six swords in boat. Choppy to calm.'),
  S(7,'Seven of Swords','7','no',['Deception','Stealth','Strategy','Getting away'],['Coming clean','Confession','Conscience','Getting caught'],'Man tiptoes from camp carrying five swords, leaving two. Looks back slyly.'),
  S(8,'Eight of Swords','8','no',['Restriction','Trapped','Self-imposed limits','Victim mentality'],['Freedom','Release','New perspective','Self-acceptance'],'Blindfolded, bound woman among eight swords. Water at feet. Castle behind. Bindings are loose.'),
  S(9,'Nine of Swords','9','no',['Anxiety','Nightmares','Worry','Despair'],['Recovery','Learning to cope','Finding help','Releasing worry'],'Person sits up in bed, face in hands. Nine swords on dark wall. Roses on bedcover.'),
  S(10,'Ten of Swords','10','no',['Rock bottom','Painful ending','Betrayal','Finality'],['Recovery','Regeneration','Worst is over','Resisting end'],'Man face down with ten swords in back. Black sky but golden dawn on horizon.'),
  CS('page','Page of Swords','Pg','maybe',['Curiosity','Mental agility','New ideas','Vigilance'],['Gossip','Hasty decisions','Cynicism','Scattered'],'Young person on uneven ground with upright sword. Wind blows hair. Clouds gather.'),
  CS('knight','Knight of Swords','Kn','yes',['Ambition','Action','Drive','Fast thinking'],['Impulsive','Burnout','No direction','Rude'],'Knight charges at full speed, sword raised. Storm clouds, wind-bent trees. Birds scatter.'),
  CS('queen','Queen of Swords','Q','yes',['Clear thinking','Direct communication','Independence','Boundaries'],['Cold','Cruel','Bitter','Overly critical'],'Queen on butterfly throne with upright sword. Left hand extends. One bird above. Known sorrow made her wise.'),
  CS('king','King of Swords','K','maybe',['Authority','Intellect','Truth','Ethical leadership'],['Manipulation','Tyranny','Abuse of power','Cold logic'],'King on butterfly/sylph throne. Sword tilted right. Trees bend in wind. Stern but fair.'),

  // PENTACLES
  P(1,'Ace of Pentacles','A','yes',['New opportunity','Prosperity','Manifestation','Abundance'],['Missed opportunity','Scarcity','Instability','Poor planning'],'Hand from cloud holds golden pentacle over lush garden. Path through hedge archway to mountains.'),
  P(2,'Two of Pentacles','2','maybe',['Balance','Adaptability','Juggling','Flexibility'],['Imbalance','Overwhelm','Disorganization','Financial stress'],'Young man dances juggling two pentacles in infinity loop. Ships on huge waves behind.'),
  P(3,'Three of Pentacles','3','yes',['Teamwork','Collaboration','Skill','Learning'],['No teamwork','Disregard for skills','Poor quality','Work conflict'],'Stonemason works on cathedral. Monk and architect consult plans. Three pentacles in archway.'),
  P(4,'Four of Pentacles','4','no',['Security','Control','Possessiveness','Hoarding'],['Letting go','Generosity','Spending','Financial insecurity'],'Man clutches pentacle to chest. One on head, two under feet. City behind. Tight grip, isolation.'),
  P(5,'Five of Pentacles','5','no',['Hardship','Loss','Isolation','Financial difficulty'],['Recovery','Improvement','Spiritual wealth','Finding help'],'Two poor figures in snow pass lit church window. Don\'t look up to see help available.'),
  P(6,'Six of Pentacles','6','yes',['Generosity','Giving','Receiving help','Charity'],['Strings attached','Debt','Power imbalance','Selfishness'],'Merchant with scales gives coins to two beggars. Six pentacles above. Note the power dynamic.'),
  P(7,'Seven of Pentacles','7','maybe',['Patience','Long-term investment','Assessment','Reward'],['Impatience','Bad investment','No reward','Wasted effort'],'Farmer leans on hoe gazing at seven pentacles on bush. Tired but contemplative.'),
  P(8,'Eight of Pentacles','8','yes',['Skill development','Dedication','Apprenticeship','Craftsmanship'],['Perfectionism','No motivation','Shortcuts','Sloppy work'],'Craftsman at bench carving pentacles. Six finished, one in progress. Town distant — focused isolation.'),
  P(9,'Nine of Pentacles','9','yes',['Luxury','Self-sufficiency','Independence','Reward'],['Overworked','Superficial','Hustling','Dependence'],'Elegant woman in vineyard, falcon on gloved hand. Nine pentacles on vines. Snails at feet.'),
  P(10,'Ten of Pentacles','10','yes',['Legacy','Wealth','Family','Inheritance'],['Family disputes','Financial failure','Debt','Loss of legacy'],'Old man in archway with dogs. Couple and child nearby. Pentacles in Tree of Life pattern. Estate.'),
  CP('page','Page of Pentacles','Pg','yes',['Ambition','Desire to learn','Diligence','New opportunity'],['No progress','Procrastination','Learning from failure','Short-sighted'],'Young person in green field holding pentacle up with wonder. Plowed fields behind.'),
  CP('knight','Knight of Pentacles','Kn','yes',['Hard work','Reliability','Patience','Routine'],['Laziness','Boredom','Feeling stuck','Perfectionism'],'Knight on stationary dark horse holding pentacle. Plowed fields. Slowest knight — methodical.'),
  CP('queen','Queen of Pentacles','Q','yes',['Nurturing','Practical','Abundance','Homebody'],['Self-neglect','Work-life imbalance','Codependency','Smothering'],'Queen on fruit tree/goat throne with pentacle on lap. Rabbit, roses. Earth-mama.'),
  CP('king','King of Pentacles','K','yes',['Wealth','Business','Security','Discipline'],['Greed','Materialism','Stubborn','Wasteful'],'King on bull throne in grapevine robe. Scepter, foot on bull skull. Castle behind.'),
];

// SPREADS DATA
const SPREADS = [
  { id:'single', name:'Yes or No', count:1, desc:'Quick direct answer.', when:'Fast answer or daily guidance.', positions:[{n:1,name:'The Answer',desc:'Direct energy for your question. Check Yes/No/Maybe for quick guidance.',x:50,y:50}] },
  { id:'ppf', name:'Past · Present · Future', count:3, desc:'Timeline showing energy flow.', when:'Daily check-ins, understanding evolution.', positions:[{n:1,name:'Past',desc:'What brought you here. Foundation or what\'s fading.',x:20,y:50},{n:2,name:'Present',desc:'Where you are now. Current energy or challenge.',x:50,y:50},{n:3,name:'Future',desc:'Where things are heading. A trajectory, not fixed.',x:80,y:50}] },
  { id:'sao', name:'Situation · Action · Outcome', count:3, desc:'What\'s happening, what to do, what to expect.', when:'Practical advice, not just insight.', positions:[{n:1,name:'Situation',desc:'The reality of what\'s going on.',x:20,y:50},{n:2,name:'Action',desc:'What to do — the energy to embody.',x:50,y:50},{n:3,name:'Outcome',desc:'Likely result if you follow guidance.',x:80,y:50}] },
  { id:'relationship', name:'Relationship', count:5, desc:'Dynamics between you and another.', when:'Romantic, friendship, family, or professional.', positions:[{n:1,name:'You',desc:'Your energy and perspective.',x:20,y:70},{n:2,name:'Them',desc:'Their energy and perspective.',x:80,y:70},{n:3,name:'Connection',desc:'The bond between you.',x:50,y:30},{n:4,name:'Challenge',desc:'What needs attention or healing.',x:50,y:60},{n:5,name:'Potential',desc:'Where this can go.',x:50,y:90}] },
  { id:'elemental', name:'Elemental Cross', count:5, desc:'All four life areas plus spirit.', when:'Holistic life check-in.', positions:[{n:1,name:'Air · Mind',desc:'Mental state — thoughts, clarity.',x:50,y:15},{n:2,name:'Water · Heart',desc:'Emotional state — feelings, intuition.',x:20,y:50},{n:3,name:'Spirit · Center',desc:'Soul\'s current lesson.',x:50,y:50},{n:4,name:'Fire · Will',desc:'Creative/active state — passion, drive.',x:80,y:50},{n:5,name:'Earth · Body',desc:'Physical/material — health, money, work.',x:50,y:85}] },
  { id:'horseshoe', name:'Horseshoe', count:7, desc:'Comprehensive arc from past to outcome.', when:'More depth than 3 cards, less than Celtic Cross.', positions:[{n:1,name:'Past',desc:'Background — what led here.',x:8,y:85},{n:2,name:'Present',desc:'Where you are now.',x:22,y:52},{n:3,name:'Hidden',desc:'What you\'re not seeing.',x:38,y:28},{n:4,name:'Obstacle',desc:'Primary challenge.',x:54,y:18},{n:5,name:'External',desc:'Outside forces affecting you.',x:70,y:28},{n:6,name:'Advice',desc:'Recommended action.',x:84,y:52},{n:7,name:'Outcome',desc:'Most likely result.',x:95,y:85}] },
  { id:'celtic', name:'Celtic Cross', count:10, desc:'The classic comprehensive reading.', when:'Deep, complex questions needing thorough exploration.', positions:[{n:1,name:'Heart',desc:'Central energy of the situation.',x:28,y:50},{n:2,name:'Challenge',desc:'What\'s crossing you.',x:28,y:50,crossing:true},{n:3,name:'Foundation',desc:'Unconscious root beneath.',x:28,y:80},{n:4,name:'Recent Past',desc:'Energy that\'s fading.',x:8,y:50},{n:5,name:'Crown',desc:'Highest potential.',x:28,y:20},{n:6,name:'Near Future',desc:'Energy approaching.',x:48,y:50},{n:7,name:'Your Attitude',desc:'How you see yourself here.',x:72,y:85},{n:8,name:'Environment',desc:'External influences.',x:72,y:62},{n:9,name:'Hopes & Fears',desc:'What you hope for or fear most.',x:72,y:38},{n:10,name:'Outcome',desc:'Where all energies lead.',x:72,y:15}] },
];

// ============================================================
// HELPERS
// ============================================================
const getEl = (el) => ELEMENTS[el] || ELEMENTS.air;
const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);
const getRandomCards = (n) => shuffle(DECK).slice(0, n);

// ============================================================
// STYLES (inline for artifact)
// ============================================================
const css = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400&family=DM+Sans:wght@300;400;500;600;700&display=swap');
*{margin:0;padding:0;box-sizing:border-box}
html{overflow-x:hidden;width:100%;-webkit-text-size-adjust:100%}
body{font-family:'DM Sans',sans-serif;background:#faf6f1;color:#1e1230;-webkit-font-smoothing:antialiased;overflow-x:hidden;width:100%;font-size:16px;line-height:1.5}
:root{
--plum:#1e1230;--plum-mid:#3b2a7a;--lav:#c4b1d4;--lav-pale:#e8dff0;
--rg:#c78e8e;--rg-light:#e8b4b8;--rg-shimmer:#f2cdd0;--rose-dust:#d4a0a0;--rose-blush:#f0d4d4;
--cream:#faf6f1;--cream-warm:#f5ede0;--white:#fffdf7;
--muted:#5a4d6a;--glass:rgba(250,246,241,0.88);--gborder:rgba(196,177,212,0.4);
--body:#1e1230;
}
.app{max-width:540px;margin:0 auto;min-height:100vh;min-height:100dvh;display:flex;flex-direction:column;background:linear-gradient(180deg,var(--white),var(--cream) 40%,var(--cream-warm));position:relative;overflow-x:hidden;width:100%}
.page{flex:1;overflow-y:auto;overflow-x:hidden;padding:0 20px 100px;-webkit-overflow-scrolling:touch;width:100%}
.bnav{position:fixed;bottom:0;left:50%;transform:translateX(-50%);width:100%;max-width:540px;height:76px;display:flex;align-items:center;justify-content:space-around;padding:0 6px env(safe-area-inset-bottom,8px);background:rgba(255,253,247,0.97);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border-top:1px solid var(--gborder);z-index:100}
.nt{display:flex;flex-direction:column;align-items:center;gap:3px;font-size:10px;font-weight:600;color:var(--muted);letter-spacing:.04em;text-transform:uppercase;cursor:pointer;border:none;background:none;padding:6px 10px;-webkit-tap-highlight-color:transparent}
.nt.a{color:var(--rg)}
.nti{width:30px;height:30px;display:flex;align-items:center;justify-content:center;border-radius:9px;font-size:16px;transition:all .2s}
.nt.a .nti{background:linear-gradient(135deg,var(--rose-blush),var(--lav-pale));box-shadow:0 2px 8px rgba(199,142,142,.25)}
.hdr{padding:16px 0 12px}
.hdr h1{font-family:'Cormorant Garamond',serif;font-size:30px;font-weight:400;color:var(--plum)}
.hdr h1 span{background:linear-gradient(135deg,var(--rg),var(--rg-light));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.hdr p{font-size:13px;color:var(--muted);letter-spacing:.08em;text-transform:uppercase;margin-top:3px;font-weight:500}
.mtabs{display:flex;gap:5px;margin-bottom:16px;overflow-x:auto;padding-bottom:4px;-ms-overflow-style:none;scrollbar-width:none}
.mtabs::-webkit-scrollbar{display:none}
.mt{padding:8px 16px;border-radius:10px;font-size:14px;font-weight:500;white-space:nowrap;cursor:pointer;background:transparent;color:var(--muted);border:1px solid transparent;transition:all .2s;-webkit-tap-highlight-color:transparent}
.mt.a{background:var(--lav-pale);color:var(--plum-mid);border-color:var(--gborder);font-weight:600}
.gc{background:var(--glass);border:1px solid var(--gborder);border-radius:16px;padding:16px;margin-bottom:14px;box-shadow:0 4px 24px rgba(42,27,61,.08)}
.gcl{background:linear-gradient(145deg,rgba(250,246,241,.92),rgba(232,223,240,.5));border:1px solid var(--gborder);border-radius:20px;padding:20px;margin-bottom:16px;box-shadow:0 4px 24px rgba(42,27,61,.08)}
.tc-mini{width:62px;height:94px;border-radius:7px;background:linear-gradient(145deg,var(--lav-pale),var(--rose-blush));border:2px solid var(--rg);display:flex;align-items:center;justify-content:center;font-size:10px;font-family:'Cormorant Garamond',serif;font-weight:700;color:var(--plum);text-align:center;padding:5px;line-height:1.15;box-shadow:0 4px 24px rgba(42,27,61,.08),0 0 20px rgba(199,142,142,.2);flex-shrink:0}
.tc-feat{width:105px;height:160px;border-radius:11px;background:linear-gradient(145deg,var(--lav-pale),var(--cream-warm));border:2.5px solid var(--rg);display:flex;flex-direction:column;align-items:center;justify-content:center;font-family:'Cormorant Garamond',serif;font-weight:700;font-size:13px;color:var(--plum);text-align:center;padding:10px;line-height:1.2;box-shadow:0 8px 32px rgba(42,27,61,.12),0 0 20px rgba(199,142,142,.2);flex-shrink:0;cursor:pointer;transition:transform .2s}
.tc-feat:hover{transform:scale(1.03)}
.cnum{font-size:22px;color:var(--rg);margin-bottom:3px;font-weight:600}
.pill{display:inline-block;padding:5px 12px;border-radius:20px;font-size:13px;font-weight:500;background:var(--lav-pale);color:var(--plum-mid);margin:3px 4px 3px 0}
.pill-r{background:var(--rose-blush);color:#7a4a4a}
.ab{display:inline-flex;align-items:center;gap:5px;padding:5px 11px;background:linear-gradient(135deg,rgba(68,49,141,.08),rgba(199,142,142,.08));border:1px solid rgba(199,142,142,.35);border-radius:8px;font-size:13px;font-weight:500;color:var(--plum-mid)}
.eb{display:inline-flex;align-items:center;gap:5px;padding:5px 11px;border-radius:8px;font-size:13px;font-weight:600}
.yn{display:inline-flex;align-items:center;gap:4px;padding:4px 11px;border-radius:20px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.05em}
.yn-y{background:rgba(122,184,138,.14);border:1.5px solid rgba(122,184,138,.5);color:#3a7a4a}
.yn-n{background:rgba(196,107,107,.14);border:1.5px solid rgba(196,107,107,.5);color:#7a3a3a}
.yn-m{background:rgba(212,168,67,.14);border:1.5px solid rgba(212,168,67,.5);color:#7a6a2a}
.stm{font-size:12px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.1em;margin-bottom:8px}
.bp{background:linear-gradient(135deg,var(--plum-mid),var(--plum));color:var(--cream);border:none;padding:16px 24px;border-radius:14px;font-family:'DM Sans',sans-serif;font-size:16px;font-weight:600;cursor:pointer;box-shadow:0 4px 16px rgba(42,27,61,.2);width:100%;text-align:center;-webkit-tap-highlight-color:transparent;transition:transform .1s}
.bp:active{transform:scale(.98)}
.bo{background:transparent;border:1.5px solid var(--lav);color:var(--plum-mid);padding:14px 20px;border-radius:13px;font-family:'DM Sans',sans-serif;font-size:15px;font-weight:600;cursor:pointer;text-align:center;width:100%;-webkit-tap-highlight-color:transparent}
.qo{padding:16px 18px;border:1.5px solid var(--gborder);border-radius:14px;font-size:15px;font-weight:500;margin-bottom:8px;cursor:pointer;background:var(--white);transition:all .15s;-webkit-tap-highlight-color:transparent;color:var(--body)}
.qo:active{transform:scale(.98)}
.qo.sel{border-color:var(--plum-mid);background:var(--lav-pale)}
.qo.ok{border-color:rgba(122,184,138,.5);background:rgba(122,184,138,.12)}
.qo.no{border-color:rgba(196,107,107,.5);background:rgba(196,107,107,.12)}
.ar{background:linear-gradient(135deg,rgba(122,184,138,.1),rgba(122,184,138,.03));border:1px solid rgba(122,184,138,.35);border-radius:14px;padding:16px;margin-top:12px}
.arl{font-size:12px;color:#3a7a4a;text-transform:uppercase;letter-spacing:.08em;font-weight:700;margin-bottom:6px}
.ti{width:100%;padding:16px;border:1.5px solid var(--gborder);border-radius:14px;font-size:15px;font-family:'DM Sans',sans-serif;color:var(--plum);background:var(--white);min-height:90px;resize:vertical;outline:none;line-height:1.5}
.ti:focus{border-color:var(--rg-light)}
.ti::placeholder{color:#9a8aaa;font-style:italic}
.sp{background:linear-gradient(145deg,rgba(42,27,61,.03),rgba(232,223,240,.3));border:1px solid var(--gborder);border-radius:16px;padding:16px;margin-bottom:12px;cursor:pointer;transition:all .2s;-webkit-tap-highlight-color:transparent}
.sp:active{transform:scale(.98)}
.sp.sel{border-color:var(--rg);box-shadow:0 0 0 1px var(--rg),0 0 20px rgba(199,142,142,.2)}
.sn{font-family:'Cormorant Garamond',serif;font-size:20px;font-weight:600;color:var(--plum)}
.sm{font-size:13px;color:var(--muted);margin-top:3px;margin-bottom:10px;font-weight:400}
.sl{position:relative;width:100%;aspect-ratio:2.2/1;min-height:80px}
.spos{position:absolute;width:32px;height:48px;border-radius:5px;border:1.5px solid var(--rg);background:linear-gradient(145deg,var(--lav-pale),var(--cream-warm));display:flex;align-items:center;justify-content:center;font-size:11px;font-family:'Cormorant Garamond',serif;font-weight:700;color:var(--plum-mid);transform:translate(-50%,-50%)}
.spos.cross{transform:translate(-50%,-50%) rotate(90deg);z-index:2;border-color:var(--rose-dust)}
.pi{display:flex;gap:12px;align-items:flex-start;padding:13px 0;border-bottom:1px solid rgba(196,177,212,.15)}
.pi:last-child{border-bottom:none}
.pn{width:28px;height:28px;border-radius:50%;background:linear-gradient(135deg,var(--plum-mid),#5a42a6);color:var(--cream);font-size:12px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.pnm{font-size:15px;font-weight:600;color:var(--plum);margin-bottom:3px}
.pd{font-size:13px;color:var(--muted);line-height:1.55}
.fjb{display:flex;gap:3px}
.fjs{flex:1;height:24px;border-radius:4px;display:flex;align-items:center;justify-content:center;font-size:8px;font-family:'Cormorant Garamond',serif;font-weight:700;cursor:pointer;transition:all .2s}
.fjs.a{background:linear-gradient(135deg,var(--plum-mid),var(--rose-dust));color:white}
.fjs.i{background:var(--lav-pale);color:var(--muted)}
.pb{width:100%;height:8px;background:var(--lav-pale);border-radius:4px;overflow:hidden;margin:6px 0}
.pf{height:100%;border-radius:4px;transition:width .5s ease}
.bg{display:flex;align-items:center;gap:14px;width:100%;padding:16px 18px;background:var(--white);border:1px solid var(--gborder);border-radius:16px;margin-bottom:10px;cursor:pointer;-webkit-tap-highlight-color:transparent;transition:all .2s;text-align:left}
.bg:active{transform:scale(.98)}
.bgi{width:40px;height:40px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0}
.bgt{font-size:16px;font-weight:600;color:var(--plum)}
.bgd{font-size:13px;color:var(--muted);margin-top:2px;line-height:1.4;font-weight:400}
.bba{font-size:14px;color:var(--muted);cursor:pointer;background:none;border:none;font-family:'DM Sans',sans-serif;padding:6px 0;margin-bottom:6px;-webkit-tap-highlight-color:transparent;font-weight:500}
.dc{background:linear-gradient(145deg,rgba(42,27,61,.03),rgba(199,142,142,.06));border:1px solid rgba(199,142,142,.25);border-radius:16px;padding:18px;text-align:center;margin-top:10px}
.sr{display:flex;gap:14px;justify-content:center;margin:14px 0;flex-wrap:wrap}
.sc{width:78px;height:78px;border-radius:50%;border:3px solid var(--lav);display:flex;flex-direction:column;align-items:center;justify-content:center;background:var(--white)}
.scn{font-family:'Cormorant Garamond',serif;font-size:24px;font-weight:700;color:var(--plum-mid);line-height:1}
.scl{font-size:9px;color:var(--muted);text-transform:uppercase;letter-spacing:.04em;margin-top:3px;font-weight:600}
.sb{display:inline-flex;align-items:center;gap:6px;padding:7px 16px;background:linear-gradient(135deg,var(--rg-shimmer),rgba(199,142,142,.2));border-radius:20px;font-size:14px;font-weight:600;color:var(--plum);border:1px solid var(--rg-light)}
.dv{display:flex;align-items:center;justify-content:center;gap:12px;margin:14px 0}
.dvl{flex:1;height:1px;background:linear-gradient(90deg,transparent,var(--rg-light),transparent)}
.dvs{color:var(--rg);font-size:11px;letter-spacing:6px}
.spg{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:12px 0}
.spo{padding:14px 10px;border:1.5px solid var(--gborder);border-radius:14px;text-align:center;cursor:pointer;background:var(--white);transition:all .2s;-webkit-tap-highlight-color:transparent}
.spo.sel{border-color:var(--rg);background:var(--rose-blush);box-shadow:0 2px 8px rgba(199,142,142,.15)}
.deck-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(68px,1fr));gap:7px}
.deck-cell{aspect-ratio:2/3;border-radius:6px;background:linear-gradient(145deg,var(--lav-pale),var(--rose-blush));border:1.5px solid var(--rg-light);display:flex;align-items:center;justify-content:center;font-size:9px;font-family:'Cormorant Garamond',serif;font-weight:700;color:var(--plum);cursor:pointer;transition:all .2s;text-align:center;line-height:1.1;padding:4px;-webkit-tap-highlight-color:transparent}
.deck-cell:active{transform:scale(.95)}
.card-img{width:100%;height:100%;object-fit:cover;border-radius:4px}
.card-img-feat{width:100%;height:100%;object-fit:cover;border-radius:8px}
.card-img-mini{width:100%;height:100%;object-fit:cover;border-radius:4px}
.tc-mini.has-img{padding:0;overflow:hidden;border-width:2.5px}
.tc-feat.has-img{padding:0;overflow:hidden}
.deck-cell.has-img{padding:0;overflow:hidden;border-width:2px;border-color:var(--rg)}
@keyframes shimmer{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}
@keyframes twinkle{0%,100%{opacity:.15;transform:scale(1)}50%{opacity:.8;transform:scale(1.4)}}
@keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
@keyframes pulseGlow{0%,100%{opacity:.5;transform:scale(1) translate(-50%,-50%)}50%{opacity:1;transform:scale(1.1) translate(-50%,-50%)}}
.star-field{position:absolute;top:0;left:0;right:0;height:350px;pointer-events:none;z-index:0;overflow:hidden}
.star{position:absolute;border-radius:50%;background:var(--rg-light);animation:twinkle 3s ease-in-out infinite}
.fan{position:relative;width:100%;height:190px;display:flex;align-items:center;justify-content:center;margin:8px auto 4px;overflow:hidden}
.fc{width:68px;height:108px;border-radius:8px;position:absolute;display:flex;align-items:center;justify-content:center;font-family:'Cormorant Garamond',serif;font-weight:700;text-align:center;line-height:1.1;padding:6px}
.fcb{background:linear-gradient(155deg,var(--plum) 0%,#3a2660 50%,var(--plum) 100%);border:1.5px solid var(--rg);color:var(--rg-light);font-size:17px;box-shadow:0 4px 20px rgba(42,27,61,.25)}
.fcf{background:linear-gradient(155deg,var(--cream),var(--lav-pale),var(--rose-blush));border:2px solid var(--rg);color:var(--plum);font-size:10px;box-shadow:0 8px 32px rgba(42,27,61,.2),0 0 20px rgba(199,142,142,.15)}
.fg{position:absolute;width:100px;height:100px;border-radius:50%;background:radial-gradient(circle,rgba(199,142,142,.12) 0%,transparent 70%);pointer-events:none;top:50%;left:50%;animation:pulseGlow 4s ease-in-out infinite}
`;

// ============================================================
// COMPONENT: Bottom Nav
// ============================================================
function BottomNav({ tab, setTab }) {
  const tabs = [
    { id: 'home', icon: '⌂', label: 'Home' },
    { id: 'study', icon: '✦', label: 'Study' },
    { id: 'spreads', icon: '⬡', label: 'Spreads' },
    { id: 'read', icon: '✧', label: 'Read' },
    { id: 'progress', icon: '◐', label: 'Progress' },
  ];
  return (
    <nav className="bnav">
      {tabs.map(t => (
        <button key={t.id} className={`nt ${tab === t.id ? 'a' : ''}`} onClick={() => setTab(t.id)}>
          <span className="nti">{t.icon}</span>{t.label}
        </button>
      ))}
    </nav>
  );
}

// ============================================================
// COMPONENT: Card Detail (Explorer)
// ============================================================
function CardDetail({ card, onBack }) {
  const el = getEl(card.element);
  const majors = DECK.filter(c => c.arcana === 'major');
  const majIdx = majors.findIndex(c => c.id === card.id);

  return (
    <div>
      <button className="bba" onClick={onBack}>← Back to Deck</button>
      <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', marginBottom: 14 }}>
        {getCardImage(card.id) ? (
          <div className="tc-feat has-img" style={{ cursor: 'default' }}>
            <img src={getCardImage(card.id)} alt={card.name} className="card-img-feat" loading="lazy" />
          </div>
        ) : (
          <div className="tc-feat" style={{ cursor: 'default' }}>
            <div className="cnum">{card.numeral}</div>
            {card.name.replace(/^(The |Ace of |Two of |Three of |Four of |Five of |Six of |Seven of |Eight of |Nine of |Ten of |Page of |Knight of |Queen of |King of )/,'').split(' ').map((w,i) => <span key={i}>{i > 0 && <br/>}{w}</span>)}
            <div style={{ marginTop: 6, fontSize: 18, fontWeight: 600, color: 'var(--muted)' }}>{card.arcana === 'major' ? 'Major Arcana' : card.suit.charAt(0).toUpperCase() + card.suit.slice(1)}</div>
          </div>
        )}
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 26, fontWeight: 700, marginBottom: 4 }}>{card.name}</div>
          {card.astro && <div className="ab" style={{ marginBottom: 5 }}>{card.astro}</div>}
          <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 7 }}>
            <span className="eb" style={{ background: el.bg, border: `1px solid ${el.border}`, color: el.color }}>{el.symbol} {el.name}</span>
            <span className={`yn yn-${card.yesno === 'yes' ? 'y' : card.yesno === 'no' ? 'n' : 'm'}`}>{card.yesno === 'yes' ? '✓ Yes' : card.yesno === 'no' ? '✗ No' : '~ Maybe'}</span>
          </div>
          <div style={{ marginBottom: 6 }}>
            <div style={{ fontSize: 17, textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--muted)', marginBottom: 3 }}>↑ Upright</div>
            {card.upright.map((k, i) => <span key={i} className="pill">{k}</span>)}
          </div>
          <div>
            <div style={{ fontSize: 17, textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--muted)', marginBottom: 3 }}>↓ Reversed</div>
            {card.reversed.map((k, i) => <span key={i} className="pill" style={{ opacity: 0.7 }}>{k}</span>)}
          </div>
        </div>
      </div>

      {/* Element & Number */}
      <div className="gc">
        <div className="stm">Element & Number</div>
        <div style={{ display: 'flex', gap: 9, alignItems: 'flex-start', marginBottom: 7 }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: el.bg, border: `1.5px solid ${el.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, flexShrink: 0 }}>{el.symbol}</div>
          <div style={{ fontSize: 18, lineHeight: 1.5 }}><strong style={{ color: el.color }}>{el.name}</strong> — {el.desc}</div>
        </div>
        {card.numberMeaning && <div style={{ borderTop: '1px solid var(--gborder)', paddingTop: 7, marginTop: 4, fontSize: 17, lineHeight: 1.5 }}><strong style={{ color: 'var(--rg)' }}>{card.numeral}</strong> — {card.numberMeaning}</div>}
      </div>

      {/* Fool's Journey (majors only) */}
      {card.foolsJourney && (
        <div className="gc">
          <div className="stm">The Fool's Journey</div>
          <div style={{ fontSize: 18, color: 'var(--muted)', marginBottom: 7, lineHeight: 1.5 }}>{card.foolsJourney}</div>
          <div className="fjb">
            {majors.slice(0, 10).map((m, i) => (
              <div key={i} className={`fjs ${i === majIdx ? 'a' : 'i'}`}>{m.numeral}</div>
            ))}
            {majIdx >= 10 && <div className="fjs i">⋯</div>}
          </div>
          {majIdx >= 10 && (
            <div className="fjb" style={{ marginTop: 3 }}>
              {majors.slice(10).map((m, i) => (
                <div key={i} className={`fjs ${i + 10 === majIdx ? 'a' : 'i'}`}>{m.numeral}</div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Image Details */}
      <div className="gc">
        <div className="stm">In the RWS Image</div>
        <div style={{ fontSize: 18, lineHeight: 1.6 }}>{card.imageDetails}</div>
      </div>

      {/* Court Role */}
      {card.courtRole && (
        <div className="gc" style={{ borderLeft: '3px solid var(--rose-dust)' }}>
          <div className="stm">Court Card Role</div>
          <div style={{ fontSize: 18, lineHeight: 1.6 }}>{card.courtRole}</div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// COMPONENT: Quiz
// ============================================================
function Quiz() {
  const [mode, setMode] = useState('keywords');
  const [card, setCard] = useState(null);
  const [options, setOptions] = useState([]);
  const [selected, setSelected] = useState(null);
  const [correct, setCorrect] = useState(null);
  const [score, setScore] = useState({ right: 0, total: 0, streak: 0 });

  const newQuestion = useCallback(() => {
    const c = DECK[Math.floor(Math.random() * DECK.length)];
    setCard(c);
    setSelected(null);
    setCorrect(null);

    if (mode === 'keywords') {
      const right = c.upright.slice(0, 3).join(', ');
      const wrongs = shuffle(DECK.filter(x => x.id !== c.id)).slice(0, 3).map(x => x.upright.slice(0, 3).join(', '));
      const opts = shuffle([{ text: right, isCorrect: true }, ...wrongs.map(w => ({ text: w, isCorrect: false }))]);
      setOptions(opts);
    } else if (mode === 'element') {
      const right = getEl(c.element).name;
      const allEls = ['Fire', 'Water', 'Air', 'Earth'];
      const opts = shuffle(allEls.map(e => ({ text: e, isCorrect: e === right })));
      setOptions(opts);
    } else if (mode === 'yesno') {
      const right = c.yesno;
      const opts = [
        { text: 'Yes', isCorrect: right === 'yes' },
        { text: 'No', isCorrect: right === 'no' },
        { text: 'Maybe', isCorrect: right === 'maybe' },
      ];
      setOptions(opts);
    } else if (mode === 'reverse') {
      const right = c.name;
      const wrongs = shuffle(DECK.filter(x => x.id !== c.id)).slice(0, 3).map(x => x.name);
      const opts = shuffle([{ text: right, isCorrect: true }, ...wrongs.map(w => ({ text: w, isCorrect: false }))]);
      setOptions(opts);
    }
  }, [mode]);

  useEffect(() => { newQuestion(); }, [mode, newQuestion]);

  const handleSelect = (idx) => {
    if (selected !== null) return;
    setSelected(idx);
    const isRight = options[idx].isCorrect;
    setCorrect(isRight);
    setScore(s => ({ right: s.right + (isRight ? 1 : 0), total: s.total + 1, streak: isRight ? s.streak + 1 : 0 }));
  };

  if (!card) return null;

  const question = mode === 'keywords' ? 'What are the upright keywords?' : mode === 'element' ? 'What element is this card?' : mode === 'yesno' ? 'Yes, No, or Maybe?' : `Which card matches these keywords?`;

  return (
    <div>
      <div className="mtabs">
        {[['keywords','Keywords'],['element','Element'],['yesno','Yes/No'],['reverse','Reverse ID']].map(([id,label]) => (
          <button key={id} className={`mt ${mode === id ? 'a' : ''}`} onClick={() => setMode(id)}>{label}</button>
        ))}
      </div>

      {mode !== 'reverse' ? (
        <div style={{ textAlign: 'center', marginBottom: 14 }}>
          {getCardImage(card.id) ? (
            <div className="tc-feat has-img" style={{ margin: '0 auto', cursor: 'default' }}>
              <img src={getCardImage(card.id)} alt={card.name} className="card-img-feat" loading="lazy" />
            </div>
          ) : (
            <div className="tc-feat" style={{ margin: '0 auto', cursor: 'default' }}>
              <div className="cnum">{card.numeral}</div>
              {card.name.split(' ').slice(-2).join(' ')}
            </div>
          )}
          <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize: 16, fontWeight: 600, color: 'var(--plum)', marginTop: 8 }}>{card.name}</div>
        </div>
      ) : (
        <div className="gcl" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 18, color: 'var(--muted)', marginBottom: 6 }}>Which card has these keywords?</div>
          {card.upright.map((k, i) => <span key={i} className="pill">{k}</span>)}
        </div>
      )}

      {mode !== 'reverse' && <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 18, textAlign: 'center', marginBottom: 12, color: 'var(--plum)' }}>{question}</div>}

      {options.map((o, i) => (
        <div key={i} className={`qo ${selected === i ? (o.isCorrect ? 'ok' : 'no') : ''} ${selected !== null && o.isCorrect ? 'ok' : ''}`} onClick={() => handleSelect(i)}>
          {selected !== null && o.isCorrect && '✓ '}{selected === i && !o.isCorrect && '✗ '}{o.text}
        </div>
      ))}

      {selected !== null && (
        <div className="ar">
          <div className="arl">{correct ? '✓ Correct!' : '✗ Not quite'}</div>
          <div style={{ fontSize: 18, lineHeight: 1.5, color: 'var(--plum)' }}>
            <strong>{card.name}</strong> — {card.upright.join(', ')}. {card.astro && `Ruled by ${card.astro}.`} Element: {getEl(card.element).name}.
          </div>
          <button className="bp" style={{ marginTop: 10 }} onClick={newQuestion}>Next Card →</button>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
        <span style={{ fontSize: 18, color: 'var(--muted)' }}>{score.right}/{score.total} correct</span>
        {score.streak > 1 && <span className="sb">🔥 {score.streak} streak</span>}
      </div>
    </div>
  );
}

// ============================================================
// COMPONENT: Connect (Story Thread)
// ============================================================
function Connect() {
  const [mode, setMode] = useState('story');
  const [cards, setCards] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [revealed, setRevealed] = useState(false);

  const newDraw = useCallback(() => {
    setCards(getRandomCards(mode === 'missing' ? 3 : mode === 'patterns' ? 5 : 3));
    setUserInput('');
    setRevealed(false);
  }, [mode]);

  useEffect(() => { newDraw(); }, [mode, newDraw]);

  const positions = ['Past', 'Present', 'Future'];

  const generateReading = () => {
    const els = cards.map(c => getEl(c.element).name);
    const suits = cards.filter(c => c.suit).map(c => c.suit);
    const majors = cards.filter(c => c.arcana === 'major').length;
    let patterns = [];
    if (majors >= 2) patterns.push(`${majors} Major Arcana cards signal big soul-level energy`);
    const elCounts = {};
    els.forEach(e => elCounts[e] = (elCounts[e]||0)+1);
    Object.entries(elCounts).forEach(([e,c]) => { if (c >= 2) patterns.push(`${c} ${e} cards — strong ${e.toLowerCase()} energy dominates`); });
    return {
      narrative: `${cards[0].name} in ${positions[0]} suggests ${cards[0].upright[0].toLowerCase()} energy as the foundation. ${cards[1].name} in ${positions[1]} shows the current theme of ${cards[1].upright[0].toLowerCase()}. ${cards.length > 2 ? `${cards[2].name} in ${positions[2]} points toward ${cards[2].upright[0].toLowerCase()}.` : ''}`,
      flow: els.map((e, i) => `${getEl(cards[i].element).symbol} ${e}`).join(' → '),
      patterns,
    };
  };

  return (
    <div>
      <div className="mtabs">
        {[['story','Story Thread'],['missing','Missing Card'],['patterns','Patterns']].map(([id,label]) => (
          <button key={id} className={`mt ${mode === id ? 'a' : ''}`} onClick={() => setMode(id)}>{label}</button>
        ))}
      </div>

      <div className="gcl" style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 17, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 10 }}>
          {mode === 'story' ? 'Tell the story these cards tell together' : mode === 'missing' ? 'What energy does the hidden card carry?' : 'What patterns do you see?'}
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 14, flexWrap: 'wrap' }}>
          {cards.map((c, i) => (
            <div key={i}>
              {mode === 'missing' && i === 2 && !revealed ? (
                <div className="tc-mini" style={{ background: 'linear-gradient(155deg, var(--plum), #3a2660)', color: 'var(--rg-light)', fontSize: 14 }}>?</div>
              ) : getCardImage(c.id) ? (
                <div className="tc-mini has-img"><img src={getCardImage(c.id)} alt={c.name} className="card-img-mini" loading="lazy" /></div>
              ) : (
                <div className="tc-mini">{c.name.replace(/^(The |Ace of |Two of |Three of |Four of |Five of |Six of |Seven of |Eight of |Nine of |Ten of |Page of |Knight of |Queen of |King of )/,'')}</div>
              )}
              <div style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.05em', textAlign: 'center', marginTop: 3, fontWeight: 600 }}>{positions[i] || `Card ${i+1}`}</div>
            </div>
          ))}
        </div>
      </div>

      <textarea className="ti" placeholder="Type your interpretation here..." value={userInput} onChange={e => setUserInput(e.target.value)} />

      <button className="bp" style={{ marginTop: 10 }} onClick={() => setRevealed(true)}>Reveal Reading ✦</button>

      {revealed && (() => {
        const r = generateReading();
        return (
          <div className="ar" style={{ marginTop: 14 }}>
            <div className="arl">✦ Model Reading</div>
            <div style={{ fontSize: 18, lineHeight: 1.6, color: 'var(--plum)' }}>{r.narrative}</div>
            <div style={{ marginTop: 8, fontSize: 17, color: 'var(--muted)' }}>Flow: {r.flow}</div>
            {r.patterns.length > 0 && (
              <div style={{ marginTop: 8, borderTop: '1px solid rgba(122,184,138,.2)', paddingTop: 8 }}>
                <div style={{ fontSize: 17, color: '#5a8a6a', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 4 }}>Patterns</div>
                {r.patterns.map((p, i) => <div key={i} style={{ fontSize: 18, lineHeight: 1.5 }}>• {p}</div>)}
              </div>
            )}
            <button className="bo" style={{ marginTop: 10 }} onClick={newDraw}>New Draw</button>
          </div>
        );
      })()}
    </div>
  );
}

// ============================================================
// PAGE: Home
// ============================================================
function HomePage({ setTab, setStudyMode }) {
  const stars = Array.from({length:18}, (_,i) => ({
    w: 1 + Math.random()*1.5, top: Math.random()*45, left: Math.random()*95,
    delay: Math.random()*3, dur: 2.8 + Math.random()*2,
  }));

  return (
    <div style={{ position: 'relative' }}>
      <div className="star-field">
        {stars.map((s,i) => <div key={i} className="star" style={{ width:s.w,height:s.w,top:`${s.top}%`,left:`${s.left}%`,animationDelay:`${s.delay}s`,animationDuration:`${s.dur}s` }} />)}
      </div>

      <div style={{ textAlign:'center', padding:'28px 0 6px', position:'relative', zIndex:1 }}>
        <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:42, fontWeight:300, color:'var(--plum)', letterSpacing:'.04em', lineHeight:1 }}>
          <span style={{ background:'linear-gradient(135deg,var(--rg),var(--rg-light),var(--rg),var(--rg-light))', backgroundSize:'200% 200%', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text', animation:'shimmer 4s ease-in-out infinite' }}>Māyā</span>{' '}
          <span style={{ color:'var(--plum)' }}>78</span>
        </div>
        <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:14, fontStyle:'italic', color:'var(--muted)', marginTop:4, letterSpacing:'.1em' }}>read between worlds</div>
      </div>

      {/* Fan */}
      <div className="fan" style={{ position:'relative', zIndex:1 }}>
        <div className="fg" />
        {[-24,-12,0,12,24].map((rot,i) => (
          <div key={i} className={`fc ${i===2?'fcf':'fcb'}`} style={{ transform:`rotate(${rot}deg) translateX(${rot*3.6}px) translateY(${Math.abs(rot)*0.5}px)`, zIndex:i===2?4:Math.abs(2-i) }}>
            {i===2 ? <div><div style={{fontSize:15,color:'var(--rg)',marginBottom:3}}>☆</div><div style={{fontSize:12}}>Your<br/>Journey<br/>Awaits</div></div> : <span style={{opacity:.5+i*.1}}>✦</span>}
          </div>
        ))}
      </div>

      <div className="dv"><div className="dvl"/><div className="dvs">✦ ✦ ✦</div><div className="dvl"/></div>

      <button className="bg" onClick={() => { setTab('study'); setStudyMode('explorer'); }}>
        <div className="bgi" style={{ background:'linear-gradient(135deg,var(--lav-pale),var(--rose-blush))' }}>✦</div>
        <div style={{flex:1}}><div className="bgt">Study the Deck</div><div className="bgd">Explore all 78 cards, meanings & connections</div></div>
        <span style={{color:'var(--rg)',fontSize:16}}>›</span>
      </button>
      <button className="bg" onClick={() => { setTab('study'); setStudyMode('quiz'); }}>
        <div className="bgi" style={{ background:'linear-gradient(135deg,var(--rose-blush),var(--rg-shimmer))' }}>✧</div>
        <div style={{flex:1}}><div className="bgt">Quiz Me</div><div className="bgd">Keywords, elements, astro & yes/no</div></div>
        <span style={{color:'var(--rg)',fontSize:16}}>›</span>
      </button>
      <button className="bg" onClick={() => { setTab('read'); }}>
        <div className="bgi" style={{ background:'linear-gradient(135deg,rgba(199,142,142,.2),rgba(199,142,142,.08))' }}>⟡</div>
        <div style={{flex:1}}><div className="bgt">Ask a Question</div><div className="bgd">Choose a spread, pull cards, practice reading</div></div>
        <span style={{color:'var(--rg)',fontSize:16}}>›</span>
      </button>
      <button className="bg" onClick={() => { setTab('spreads'); }}>
        <div className="bgi" style={{ background:'linear-gradient(135deg,rgba(68,49,141,.1),rgba(68,49,141,.05))' }}>⬡</div>
        <div style={{flex:1}}><div className="bgt">Learn Spreads</div><div className="bgd">Browse layouts & what each position means</div></div>
        <span style={{color:'var(--rg)',fontSize:16}}>›</span>
      </button>

      <div className="dc">
        <div style={{ fontSize:14, color:'var(--rg)', textTransform:'uppercase', letterSpacing:'.12em', fontWeight:700, marginBottom:6 }}>✦ Today's Invitation</div>
        <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:16, fontStyle:'italic', color:'var(--plum)', lineHeight:1.6 }}>Sit with one card today.<br/>What do you notice that you've never seen before?</div>
      </div>
    </div>
  );
}

// ============================================================
// PAGE: Study
// ============================================================
function StudyPage({ initialMode }) {
  const [mode, setMode] = useState(initialMode || 'explorer');
  const [selectedCard, setSelectedCard] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => { if (initialMode) setMode(initialMode); }, [initialMode]);

  const filtered = useMemo(() => {
    if (filter === 'all') return DECK;
    if (filter === 'major') return DECK.filter(c => c.arcana === 'major');
    if (filter === 'courts') return DECK.filter(c => c.court);
    return DECK.filter(c => c.suit === filter);
  }, [filter]);

  return (
    <div>
      <div className="hdr"><h1><span>Māyā</span> 78</h1><p>Study</p></div>
      <div className="mtabs">
        {[['explorer','Explorer'],['quiz','Quiz'],['connect','Connect']].map(([id,label]) => (
          <button key={id} className={`mt ${mode === id ? 'a' : ''}`} onClick={() => { setMode(id); setSelectedCard(null); }}>{label}</button>
        ))}
      </div>

      {mode === 'explorer' && !selectedCard && (
        <>
          <div className="mtabs">
            {[['all','All 78'],['major','Major'],['wands','🜂 Wands'],['cups','🜄 Cups'],['swords','🜁 Swords'],['pentacles','🜃 Pent.'],['courts','Courts']].map(([id,label]) => (
              <button key={id} className={`mt ${filter === id ? 'a' : ''}`} onClick={() => setFilter(id)}>{label}</button>
            ))}
          </div>
          <div className="deck-grid">
            {filtered.map(c => (
              <div key={c.id} className={`deck-cell ${getCardImage(c.id) ? 'has-img' : ''}`} onClick={() => setSelectedCard(c)}>
                {getCardImage(c.id) ? (
                  <img src={getCardImage(c.id)} alt={c.name} className="card-img" loading="lazy" />
                ) : (
                  <>{c.numeral}<br/>{c.name.split(' ').slice(-1)[0]}</>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {mode === 'explorer' && selectedCard && (
        <CardDetail card={selectedCard} onBack={() => setSelectedCard(null)} />
      )}

      {mode === 'quiz' && <Quiz />}
      {mode === 'connect' && <Connect />}
    </div>
  );
}

// ============================================================
// PAGE: Spreads
// ============================================================
function SpreadDetail({ spread, onBack }) {
  return (
    <div>
      <button className="bba" onClick={onBack}>← Back to Library</button>
      <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:28, fontWeight:600, color:'var(--plum)', marginBottom:2 }}>{spread.name}</div>
      <div style={{ fontSize:14, color:'var(--muted)', marginBottom:14 }}>{spread.count} cards · {spread.when}</div>

      <div className="gcl" style={{ textAlign:'center' }}>
        <div className="stm">Layout</div>
        <div className="sl" style={{ minHeight: spread.count > 5 ? 120 : 80 }}>
          {spread.positions.map((p,i) => (
            <div key={i} className={`spos ${p.crossing ? 'cross' : ''}`} style={{ left:`${p.x}%`, top:`${p.y}%` }}>{p.n}</div>
          ))}
        </div>
      </div>

      <div className="stm">Positions</div>
      {spread.positions.map((p,i) => (
        <div key={i} className="pi">
          <div className="pn">{p.n}</div>
          <div><div className="pnm">{p.name}</div><div className="pd">{p.desc}</div></div>
        </div>
      ))}
    </div>
  );
}

function SpreadsPage() {
  const [selected, setSelected] = useState(null);
  if (selected) return <SpreadDetail spread={selected} onBack={() => setSelected(null)} />;

  return (
    <div>
      <div className="hdr"><h1><span>Māyā</span> 78</h1><p>Spread Library</p></div>
      {SPREADS.map(s => (
        <div key={s.id} className="sp" onClick={() => setSelected(s)}>
          <div className="sn">{s.name}</div>
          <div className="sm">{s.count} cards · {s.when}</div>
          <div className="sl">
            {s.positions.map((p,i) => (
              <div key={i} className={`spos ${p.crossing ? 'cross' : ''}`} style={{ left:`${p.x}%`, top:`${p.y}%` }}>{p.n}</div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ============================================================
// PAGE: Read (Ask a Question + Guided)
// ============================================================
function ReadPage() {
  const [mode, setMode] = useState('ask');
  const [question, setQuestion] = useState('');
  const [spreadId, setSpreadId] = useState('ppf');
  const [dealtCards, setDealtCards] = useState(null);
  const [userReading, setUserReading] = useState('');
  const [showModel, setShowModel] = useState(false);

  const spread = SPREADS.find(s => s.id === spreadId);

  const pullCards = () => {
    setDealtCards(getRandomCards(spread.count));
    setUserReading('');
    setShowModel(false);
  };

  const reset = () => {
    setDealtCards(null);
    setQuestion('');
    setUserReading('');
    setShowModel(false);
  };

  // Guided mode
  const [guidedQ] = useState(() => {
    const qs = ['I feel stuck in my career. What do I need to see?','What is blocking me from finding love?','How can I improve my financial situation?','What lesson is the universe trying to teach me right now?','What do I need to let go of?','How can I deepen my spiritual practice?'];
    return qs[Math.floor(Math.random()*qs.length)];
  });
  const [guidedCards] = useState(() => getRandomCards(3));
  const [guidedStep, setGuidedStep] = useState(0);
  const [guidedInputs, setGuidedInputs] = useState(['','','','']);

  return (
    <div>
      <div className="hdr"><h1><span>Māyā</span> 78</h1><p>Read</p></div>
      <div className="mtabs">
        <button className={`mt ${mode==='ask'?'a':''}`} onClick={() => setMode('ask')}>Ask a Question</button>
        <button className={`mt ${mode==='guided'?'a':''}`} onClick={() => setMode('guided')}>Guided Practice</button>
      </div>

      {mode === 'ask' && !dealtCards && (
        <>
          <div className="gcl">
            <div style={{ fontSize:13, color:'var(--rg)', fontWeight:700, textTransform:'uppercase', letterSpacing:'.08em', marginBottom:7 }}>Step 1 · Your Question</div>
            <textarea className="ti" placeholder="What would you like to ask the cards?" value={question} onChange={e => setQuestion(e.target.value)} style={{ minHeight:55 }} />
          </div>

          <div className="gcl">
            <div style={{ fontSize:13, color:'var(--rg)', fontWeight:700, textTransform:'uppercase', letterSpacing:'.08em', marginBottom:7 }}>Step 2 · Choose Your Spread</div>
            <div className="spg">
              {SPREADS.map(s => (
                <div key={s.id} className={`spo ${spreadId===s.id?'sel':''}`} onClick={() => setSpreadId(s.id)}>
                  <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:15, fontWeight:600, color:'var(--plum)' }}>{s.name}</div>
                  <div style={{ fontSize:14, color:'var(--muted)', marginTop:2 }}>{s.count} cards</div>
                </div>
              ))}
            </div>
          </div>

          <button className="bp" onClick={pullCards}>Pull Your Cards ✦</button>
        </>
      )}

      {mode === 'ask' && dealtCards && (
        <>
          {question && <div style={{ textAlign:'center', fontFamily:"'Cormorant Garamond',serif", fontSize:17, fontStyle:'italic', color:'var(--muted)', marginBottom:12 }}>"{question}"</div>}

          <div style={{ display:'flex', justifyContent:'center', gap:12, flexWrap:'wrap', marginBottom:14 }}>
            {dealtCards.map((c,i) => (
              <div key={i}>
                {getCardImage(c.id) ? (
                  <div className="tc-mini has-img"><img src={getCardImage(c.id)} alt={c.name} className="card-img-mini" loading="lazy" /></div>
                ) : (
                  <div className="tc-mini">{c.numeral}<br/>{c.name.split(' ').slice(-1)[0]}</div>
                )}
                <div style={{ fontSize:13, color:'var(--muted)', textTransform:'uppercase', letterSpacing:'.04em', textAlign:'center', marginTop:3, fontWeight:600 }}>{spread.positions[i]?.name}</div>
              </div>
            ))}
          </div>

          <div className="stm" style={{ marginTop:8 }}>Your Interpretation</div>
          <textarea className="ti" placeholder="What do you see in these cards? What story do they tell?" value={userReading} onChange={e => setUserReading(e.target.value)} />

          <button className="bp" style={{ marginTop:10 }} onClick={() => setShowModel(true)}>Reveal Model Reading ✦</button>

          {showModel && (
            <div className="ar" style={{ marginTop:14 }}>
              <div className="arl">✦ Model Reading</div>
              <div style={{ fontSize:14, lineHeight:1.6, color:'var(--plum)' }}>
                {dealtCards.map((c,i) => (
                  <span key={i}><strong>{c.name}</strong> in {spread.positions[i]?.name}: {c.upright[0].toLowerCase()} energy — {c.upright.slice(1).join(', ').toLowerCase()}. </span>
                ))}
              </div>
              <div style={{ marginTop:8, fontSize:14, color:'var(--muted)' }}>
                Element flow: {dealtCards.map(c => `${getEl(c.element).symbol} ${getEl(c.element).name}`).join(' → ')}
              </div>
              <div style={{ marginTop:6, display:'flex', gap:5, flexWrap:'wrap' }}>
                {dealtCards.map((c,i) => <span key={i} className={`yn yn-${c.yesno==='yes'?'y':c.yesno==='no'?'n':'m'}`} style={{fontSize:13}}>{c.name.split(' ').slice(-1)[0]}: {c.yesno}</span>)}
              </div>
            </div>
          )}

          <button className="bo" style={{ marginTop:12 }} onClick={reset}>New Reading</button>
        </>
      )}

      {mode === 'guided' && (
        <>
          <div className="gc" style={{ textAlign:'center' }}>
            <div style={{ fontSize:14, color:'var(--muted)', textTransform:'uppercase', letterSpacing:'.08em', marginBottom:5 }}>Querent's Question</div>
            <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:18, fontStyle:'italic', color:'var(--plum)' }}>"{guidedQ}"</div>
          </div>

          <div style={{ display:'flex', justifyContent:'center', gap:14, marginBottom:12 }}>
            {guidedCards.map((c,i) => (
              <div key={i}>
                {getCardImage(c.id) ? (
                  <div className="tc-mini has-img"><img src={getCardImage(c.id)} alt={c.name} className="card-img-mini" loading="lazy" /></div>
                ) : (
                  <div className="tc-mini">{c.numeral}<br/>{c.name.split(' ').slice(-1)[0]}</div>
                )}
                <div style={{ fontSize:13, color:'var(--muted)', textTransform:'uppercase', textAlign:'center', marginTop:3, fontWeight:600 }}>{['Past','Present','Future'][i]}</div>
              </div>
            ))}
          </div>

          <div className="gcl">
            <div style={{ fontSize:13, color:'var(--rg)', fontWeight:700, textTransform:'uppercase', letterSpacing:'.06em', marginBottom:6 }}>
              Step {guidedStep+1} of 4: {['Read Each Card','Find Connections','Spot Patterns','Full Narrative'][guidedStep]}
            </div>
            <div style={{ fontSize:15, lineHeight:1.5, color:'var(--plum)', marginBottom:8 }}>
              {guidedStep===0 && `Look at ${guidedCards[0].name} in the Past position. What energy defined the recent past?`}
              {guidedStep===1 && 'How do these cards connect? Do any share elements, numbers, or themes?'}
              {guidedStep===2 && 'What patterns do you see? Repeated elements? All majors? A number showing up?'}
              {guidedStep===3 && 'Now weave it all together. What is the full story from past to future?'}
            </div>
            <textarea className="ti" style={{ minHeight:60 }} placeholder="Type your thoughts..." value={guidedInputs[guidedStep]} onChange={e => { const n=[...guidedInputs]; n[guidedStep]=e.target.value; setGuidedInputs(n); }} />
          </div>

          <div style={{ display:'flex', gap:8 }}>
            {guidedStep > 0 && <button className="bo" style={{ flex:1 }} onClick={() => setGuidedStep(s=>s-1)}>← Back</button>}
            {guidedStep < 3 ? (
              <button className="bp" style={{ flex:1 }} onClick={() => setGuidedStep(s=>s+1)}>Next Step →</button>
            ) : (
              <button className="bp" style={{ flex:1 }} onClick={() => setGuidedStep(4)}>Reveal Reading ✦</button>
            )}
          </div>

          {guidedStep === 4 && (
            <div className="ar" style={{ marginTop:14 }}>
              <div className="arl">✦ Model Reading</div>
              <div style={{ fontSize:14, lineHeight:1.6, color:'var(--plum)' }}>
                {guidedCards.map((c,i) => (
                  <span key={i}><strong>{c.name}</strong> ({['Past','Present','Future'][i]}): {c.upright.join(', ')}. </span>
                ))}
                <br/><br/>Element flow: {guidedCards.map(c => `${getEl(c.element).symbol} ${getEl(c.element).name}`).join(' → ')}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ============================================================
// PAGE: Progress
// ============================================================
function ProgressPage() {
  const suits = [
    { name:'Major Arcana', count:22, color:'linear-gradient(90deg,var(--plum-mid),var(--rg))', val:0 },
    { name:'Cups · 🜄 Water', count:14, color:'linear-gradient(90deg,#6b8ec4,var(--lav))', val:0 },
    { name:'Wands · 🜂 Fire', count:14, color:'linear-gradient(90deg,#c4836b,var(--rose-dust))', val:0 },
    { name:'Swords · 🜁 Air', count:14, color:'linear-gradient(90deg,#a0a8b8,var(--lav))', val:0 },
    { name:'Pentacles · 🜃 Earth', count:14, color:'linear-gradient(90deg,#8aaa6b,#f0dca0)', val:0 },
  ];

  return (
    <div>
      <div className="hdr"><h1><span>Māyā</span> 78</h1><p>Your Journey</p></div>
      <div style={{ textAlign:'center', padding:'6px 0 14px' }}>
        <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:14.5, fontStyle:'italic', color:'var(--muted)' }}>Start studying to track your progress</div>
        <div style={{ marginTop:8 }}><span className="sb">✦ Begin your journey</span></div>
      </div>

      <div className="sr">
        <div className="sc"><div className="scn">0</div><div className="scl">Cards</div></div>
        <div className="sc" style={{ borderColor:'var(--rose-dust)' }}><div className="scn">0</div><div className="scl">Quizzes</div></div>
        <div className="sc" style={{ borderColor:'var(--rg)' }}><div className="scn">0</div><div className="scl">Readings</div></div>
      </div>

      <div className="gc">
        <div className="stm">Card Mastery</div>
        {suits.map((s,i) => (
          <div key={i} style={{ marginBottom: i < suits.length-1 ? 10 : 0 }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:3 }}>
              <span style={{ fontSize:12 }}>{s.name}</span>
              <span style={{ fontSize:13, color:'var(--muted)' }}>0/{s.count}</span>
            </div>
            <div className="pb"><div className="pf" style={{ width:'0%', background:s.color }} /></div>
          </div>
        ))}
      </div>

      <div className="gc">
        <div className="stm">Quick Start ✦</div>
        <div style={{ fontSize:14, lineHeight:1.6, color:'var(--plum)' }}>
          Head to <strong>Study → Quiz</strong> to start learning cards. Your progress will be tracked here as you go. Every card you get right builds your mastery!
        </div>
      </div>
    </div>
  );
}

// ============================================================
// APP
// ============================================================
export default function App() {
  const [tab, setTab] = useState('home');
  const [studyMode, setStudyMode] = useState(null);

  return (
    <>
      <style>{css}</style>
      <div className="app">
        <div className="page">
          {tab === 'home' && <HomePage setTab={setTab} setStudyMode={setStudyMode} />}
          {tab === 'study' && <StudyPage initialMode={studyMode} />}
          {tab === 'spreads' && <SpreadsPage />}
          {tab === 'read' && <ReadPage />}
          {tab === 'progress' && <ProgressPage />}
        </div>
        <BottomNav tab={tab} setTab={(t) => { setTab(t); setStudyMode(null); }} />
      </div>
    </>
  );
}
