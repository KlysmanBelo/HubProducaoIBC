import { SongLyricResult } from '../types';

export function formatLyricsToSlides(lyricsText: string, linesPerSlide = 2): string[] {
  if (!lyricsText) return [];
  const lines = lyricsText
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 0 && !l.startsWith('[') && !l.endsWith(']'));

  const slides: string[] = [];
  for (let i = 0; i < lines.length; i += linesPerSlide) {
    const chunk = lines.slice(i, i + linesPerSlide);
    slides.push(chunk.join('\n'));
  }
  return slides;
}

export const WORSHIP_SONGS_DATABASE: SongLyricResult[] = [
  {
    title: 'A Casa É Sua',
    artist: 'Casa Worship',
    key: 'C (Dó Maior)',
    bpm: '68 BPM',
    composers: 'Julliany Souza, Léo Brandão, Ricardinho',
    structure: [
      { section: 'Verso 1', lyrics: 'Você é bem-vindo aqui\nA casa é Sua, pode entrar' },
      { section: 'Refrão', lyrics: 'Essa casa é Sua casa\nNós deixamos ela pra Você, Jesus' },
      { section: 'Ponte', lyrics: 'Aquece o nosso coração\nCom Teu fogo Santo' },
    ],
    fullLyrics: `Você é bem-vindo aqui
A casa é Sua, pode entrar
Não repara a bagunça
É que a gente tava esperando Você chegar

Você é bem-vindo aqui
A casa é Sua, pode entrar
Me esvazio de mim
Pra que Você possa habitar

Essa casa é Sua casa
Nós deixamos ela pra Você, Jesus
Essa casa é Sua casa
Nós deixamos ela pra Você, Jesus

Aquece o nosso coração
Com Teu fogo Santo
Aquece o nosso coração
Com Teu fogo Santo

Vem me queimar
Com Teu fogo Santo
Vem me queimar
Com Teu fogo Santo`,
    slidesFormat: [
      'Você é bem-vindo aqui\nA casa é Sua, pode entrar',
      'Não repara a bagunça\nÉ que a gente tava esperando Você chegar',
      'Você é bem-vindo aqui\nA casa é Sua, pode entrar',
      'Me esvazio de mim\nPra que Você possa habitar',
      'Essa casa é Sua casa\nNós deixamos ela pra Você, Jesus',
      'Essa casa é Sua casa\nNós deixamos ela pra Você, Jesus',
      'Aquece o nosso coração\nCom Teu fogo Santo',
      'Aquece o nosso coração\nCom Teu fogo Santo',
      'Vem me queimar\nCom Teu fogo Santo',
      'Vem me queimar\nCom Teu fogo Santo',
    ],
    groundingSources: [
      { title: 'Letras.mus.br - Casa Worship', url: 'https://www.letras.mus.br/casa-worship/a-casa-e-sua/' },
      { title: 'Cifra Club - A Casa É Sua', url: 'https://www.cifraclub.com.br/casa-worship/a-casa-e-sua/' },
    ],
  },
  {
    title: 'Bondade de Deus',
    artist: 'Isaías Saad',
    key: 'Ab (Lá Bemol Maior)',
    bpm: '70 BPM',
    composers: 'Jenn Johnson, Ed Cash, Jason Ingram, Ben Fielding, Brian Johnson',
    structure: [
      { section: 'Verso 1', lyrics: 'Te amo, Deus, Tua graça nunca falha\nTodos os dias eu estou em Tuas mãos' },
      { section: 'Refrão', lyrics: 'Tua bondade me seguirá\nMe seguirá, Senhor' },
      { section: 'Ponte', lyrics: 'Tua fidelidade é grande\nTua fidelidade é sem fim' },
    ],
    fullLyrics: `Te amo, Deus
Tua graça nunca falha
Todos os dias
Eu estou em Tuas mãos

Desde quando me levanto
Até eu me deitar
Eu cantarei da bondade de Deus

És fiel em todo tempo
Em todo tempo Tu és tão, tão bom
Com todo fôlego que tenho
Eu cantarei da bondade de Deus

Tua voz me guia
Em meio aos temporais
Na escuridão
Tua presença é minha paz

Eu Te conheço como Pai
E como amigo
E eu tenho vivido na bondade de Deus

Tua bondade me seguirá
Me seguirá, Senhor
Tua bondade me seguirá
Me seguirá, Senhor

Eu me rendo a Ti, Te dou o meu viver
Tudo o que sou
Pois Tua bondade me seguirá
Me seguirá, Senhor`,
    slidesFormat: [
      'Te amo, Deus\nTua graça nunca falha',
      'Todos os dias\nEu estou em Tuas mãos',
      'Desde quando me levanto\nAté eu me deitar',
      'Eu cantarei da bondade de Deus',
      'És fiel em todo tempo\nEm todo tempo Tu és tão, tão bom',
      'Com todo fôlego que tenho\nEu cantarei da bondade de Deus',
      'Tua voz me guia\nEm meio aos temporais',
      'Na escuridão\nTua presença é minha paz',
      'Eu Te conheço como Pai\nE como amigo',
      'E eu tenho vivido na bondade de Deus',
      'Tua bondade me seguirá\nMe seguirá, Senhor',
      'Tua bondade me seguirá\nMe seguirá, Senhor',
      'Eu me rendo a Ti, Te dou o meu viver\nTudo o que sou',
      'Pois Tua bondade me seguirá\nMe seguirá, Senhor',
    ],
    groundingSources: [
      { title: 'Letras.mus.br - Isaías Saad', url: 'https://www.letras.mus.br/isaias-saad/bondade-de-deus/' },
      { title: 'Cifra Club - Bondade de Deus', url: 'https://www.cifraclub.com.br/isaias-saad/bondade-de-deus/' },
    ],
  },
  {
    title: 'Ruja o Leão',
    artist: 'Talita Catanzaro (fhop music)',
    key: 'Em (Mi Menor)',
    bpm: '72 BPM',
    composers: 'Talita Catanzaro',
    structure: [
      { section: 'Verso', lyrics: 'Sobre o monte Sião\nO Cordeiro está de pé' },
      { section: 'Refrão', lyrics: 'Ruja o Leão\nQue a terra trema diante do Senhor' },
      { section: 'Ponte', lyrics: 'Ele vem saltando pelos montes\nO Amado da minha alma' },
    ],
    fullLyrics: `Sobre o monte Sião
O Cordeiro está de pé
E com Ele cento e quarenta e quatro mil
Que trazem na fronte o nome do Pai

Ruja o Leão
Que a terra trema
Diante do Senhor
Ruja o Leão
Que a terra trema
Diante do Senhor

Pois Ele vem saltando pelos montes
O Amado da minha alma
Ele vem saltando pelos montes
O Amado da minha alma

E o Espírito e a Noiva dizem: Vem
E quem ouve diga: Vem
E o Espírito e a Noiva dizem: Vem
Maranata, vem, Senhor Jesus`,
    slidesFormat: [
      'Sobre o monte Sião\nO Cordeiro está de pé',
      'E com Ele cento e quarenta e quatro mil\nQue trazem na fronte o nome do Pai',
      'Ruja o Leão\nQue a terra trema',
      'Diante do Senhor\nRuja o Leão',
      'Que a terra trema\nDiante do Senhor',
      'Pois Ele vem saltando pelos montes\nO Amado da minha alma',
      'Ele vem saltando pelos montes\nO Amado da minha alma',
      'E o Espírito e a Noiva dizem: Vem\nE quem ouve diga: Vem',
      'E o Espírito e a Noiva dizem: Vem\nMaranata, vem, Senhor Jesus',
    ],
    groundingSources: [
      { title: 'Letras.mus.br - Talita Catanzaro', url: 'https://www.letras.mus.br/talita-catanzaro/ruja-o-leao/' },
      { title: 'fhop music Oficial', url: 'https://www.youtube.com/results?search_query=ruja+o+leao+talita+catanzaro' },
    ],
  },
  {
    title: 'Yeshua',
    artist: 'Fernandinho',
    key: 'Bm (Si Menor)',
    bpm: '65 BPM',
    composers: 'Fernandinho',
    structure: [
      { section: 'Verso', lyrics: 'Te chamam de Deus e de Senhor\nTe chamam de Rei, Salvador' },
      { section: 'Refrão', lyrics: 'Yeshua\nO Teu nome é sobre todo nome' },
    ],
    fullLyrics: `Te chamam de Deus e de Senhor
Te chamam de Rei, Salvador
E agora andam dizendo
Por aí que Tu és meu amigo

Vem me abraçar
Vem me consolar
Vem me dizer que tudo vai passar

Yeshua
O Teu nome é sobre todo nome
Yeshua
O Teu nome é Santo`,
    slidesFormat: [
      'Te chamam de Deus e de Senhor\nTe chamam de Rei, Salvador',
      'E agora andam dizendo\nPor aí que Tu és meu amigo',
      'Vem me abraçar\nVem me consolar',
      'Vem me dizer que tudo vai passar\nYeshua',
      'O Teu nome é sobre todo nome\nYeshua',
      'O Teu nome é Santo',
    ],
    groundingSources: [
      { title: 'Letras.mus.br - Fernandinho', url: 'https://www.letras.mus.br/fernandinho/yeshua/' },
    ],
  },
  {
    title: 'Me Atraiu',
    artist: 'Gabriela Rocha',
    key: 'D (Ré Maior)',
    bpm: '66 BPM',
    composers: 'Abdiel Arsenio',
    structure: [
      { section: 'Verso 1', lyrics: 'Tu és a minha luz, minha salvação\nDe quem terei temor?' },
      { section: 'Refrão', lyrics: 'Me atraiu, me atraiu\nCom laços de amor me conquistou' },
    ],
    fullLyrics: `Tu és a minha luz, minha salvação
De quem terei temor?
Tu és a fortaleza da minha vida
A quem temerei?

O Teu olhar me encontrou
Na tempestade me sustentou
Quando achei que não aguentaria
A Tua graça me resgatou

Me atraiu, me atraiu
Com cordas de amor me atraiu
Me atraiu, me atraiu
Jesus, o Teu amor me conquistou

E hoje eu não vivo mais eu
Mas Cristo vive em mim
Minha vida entreguei no Teu altar
Pra sempre vou Te adorar`,
    slidesFormat: [
      'Tu és a minha luz, minha salvação\nDe quem terei temor?',
      'Tu és a fortaleza da minha vida\nA quem temerei?',
      'O Teu olhar me encontrou\nNa tempestade me sustentou',
      'Quando achei que não aguentaria\nA Tua graça me resgatou',
      'Me atraiu, me atraiu\nCom cordas de amor me atraiu',
      'Me atraiu, me atraiu\nJesus, o Teu amor me conquistou',
      'E hoje eu não vivo mais eu\nMas Cristo vive em mim',
      'Minha vida entreguei no Teu altar\nPra sempre vou Te adorar',
    ],
    groundingSources: [
      { title: 'Letras.mus.br - Gabriela Rocha', url: 'https://www.letras.mus.br/gabriela-rocha/me-atraiu/' },
    ],
  },
  {
    title: 'Lugar Secreto',
    artist: 'Gabriela Rocha',
    key: 'E (Mi Maior)',
    bpm: '68 BPM',
    composers: 'Gabriela Rocha, Hananiel Eduardo',
    structure: [
      { section: 'Verso 1', lyrics: 'Tu és tudo o que eu mais quero\nO meu fôlego, Tu és' },
      { section: 'Refrão', lyrics: 'Tudo o que eu mais quero é Te ver\nMe envolva com Tua glória e poder' },
      { section: 'Ponte', lyrics: 'Não há lugar mais alto\nDo que estar aos Teus pés' },
    ],
    fullLyrics: `Tu és tudo o que eu mais quero
O meu fôlego, Tu és
Em Teus braços é o meu lugar
Estou aqui, estou aqui

Pai, eu amo Tua presença
Teu olhar me contemplou
Eu só quero ficar aqui
Mais e mais

Tudo o que eu mais quero é Te ver
Me envolva com Tua glória e poder
Tua presença é o meu prazer
Tudo o que eu mais quero é Te ver

Não há lugar mais alto
Do que estar aos Teus pés
Aos Teus pés, aos Teus pés
Não há lugar mais alto
Do que estar aos Teus pés
Aos Teus pés`,
    slidesFormat: [
      'Tu és tudo o que eu mais quero\nO meu fôlego, Tu és',
      'Em Teus braços é o meu lugar\nEstou aqui, estou aqui',
      'Pai, eu amo Tua presença\nTeu olhar me contemplou',
      'Eu só quero ficar aqui\nMais e mais',
      'Tudo o que eu mais quero é Te ver\nMe envolva com Tua glória e poder',
      'Tua presença é o meu prazer\nTudo o que eu mais quero é Te ver',
      'Não há lugar mais alto\nDo que estar aos Teus pés',
      'Aos Teus pés, aos Teus pés\nNão há lugar mais alto',
      'Do que estar aos Teus pés\nAos Teus pés',
    ],
    groundingSources: [
      { title: 'Letras.mus.br - Gabriela Rocha', url: 'https://www.letras.mus.br/gabriela-rocha/lugar-secreto/' },
      { title: 'Cifra Club - Lugar Secreto', url: 'https://www.cifraclub.com.br/gabriela-rocha/lugar-secreto/' },
    ],
  },
  {
    title: 'Ousado Amor',
    artist: 'Isaías Saad',
    key: 'Gb (Fá Sustenido Maior)',
    bpm: '65 BPM',
    composers: 'Cory Asbury, Caleb Culver, Ran Jackson',
    structure: [
      { section: 'Verso 1', lyrics: 'Antes de eu falar, Tu cantavas sobre mim\nTu tens sido tão, tão bom pra mim' },
      { section: 'Refrão', lyrics: 'Oh, impressionante, infinito e ousado amor de Deus\nOh, que deixa as noventa e nove só pra me encontrar' },
      { section: 'Ponte', lyrics: 'Traz luz para as sombras\nEscala montanhas pra me encontrar' },
    ],
    fullLyrics: `Antes de eu falar
Tu cantavas sobre mim
Tu tens sido tão, tão bom pra mim
Antes de eu respirar
Sopraste Tua vida em mim
Tu tens sido tão, tão bom pra mim

Oh, impressionante, infinito e ousado amor de Deus
Oh, que deixa as noventa e nove só pra me encontrar
Não posso comprá-lo nem merecê-lo
Mesmo assim Se entregou
Oh, impressionante, infinito e ousado amor de Deus

Inimigo fui, mas Teu amor lutou por mim
Tu tens sido tão, tão bom pra mim
Não tinha valor, mas tudo pagou por mim
Tu tens sido tão, tão bom pra mim

Traz luz para as sombras
Escala montanhas pra me encontrar
Derruba muralhas, destrói as mentiras
Pra me encontrar`,
    slidesFormat: [
      'Antes de eu falar\nTu cantavas sobre mim',
      'Tu tens sido tão, tão bom pra mim\nAntes de eu respirar',
      'Sopraste Tua vida em mim\nTu tens sido tão, tão bom pra mim',
      'Oh, impressionante, infinito e ousado amor de Deus\nOh, que deixa as noventa e nove só pra me encontrar',
      'Não posso comprá-lo nem merecê-lo\nMesmo assim Se entregou',
      'Oh, impressionante, infinito e ousado amor de Deus',
      'Inimigo fui, mas Teu amor lutou por mim\nTu tens sido tão, tão bom pra mim',
      'Não tinha valor, mas tudo pagou por mim\nTu tens sido tão, tão bom pra mim',
      'Traz luz para as sombras\nEscala montanhas pra me encontrar',
      'Derruba muralhas, destrói as mentiras\nPra me encontrar',
    ],
    groundingSources: [
      { title: 'Letras.mus.br - Isaías Saad', url: 'https://www.letras.mus.br/isaias-saad/ousado-amor/' },
    ],
  },
  {
    title: 'Todavia Me Alegrarei',
    artist: 'Samuel Messias / Sarah Beatriz',
    key: 'Eb (Mi Bemol Maior)',
    bpm: '72 BPM',
    composers: 'Samuel Messias',
    structure: [
      { section: 'Verso', lyrics: 'Eu olhei a tristeza nos olhos e sorri\nMesmo na dor eu Te louvarei' },
      { section: 'Refrão', lyrics: 'Todavia me alegrarei no Senhor\nExultarei no Deus da minha salvação' },
    ],
    fullLyrics: `Eu olhei a tristeza nos olhos e sorri
Mesmo no vale da sombra da morte, não temi
Porque eu sei que o meu Redentor vive
E por fim se levantará sobre a terra

Ainda que a figueira não floresça
E não haja fruto na vide
O produto da oliveira minta
E os campos não produzam mantimento

Todavia me alegrarei
Todavia me alegrarei
No Deus da minha salvação
No Deus da minha salvação

O Senhor Deus é a minha força
E fará os meus pés como os das corças
E me fará andar sobre as minhas alturas`,
    slidesFormat: [
      'Eu olhei a tristeza nos olhos e sorri\nMesmo no vale da sombra da morte, não temi',
      'Porque eu sei que o meu Redentor vive\nE por fim se levantará sobre a terra',
      'Ainda que a figueira não floresça\nE não haja fruto na vide',
      'O produto da oliveira minta\nE os campos não produzam mantimento',
      'Todavia me alegrarei\nTodavia me alegrarei',
      'No Deus da minha salvação\nNo Deus da minha salvação',
      'O Senhor Deus é a minha força\nE fará os meus pés como os das corças',
      'E me fará andar sobre as minhas alturas',
    ],
    groundingSources: [
      { title: 'Letras.mus.br - Samuel Messias', url: 'https://www.letras.mus.br/samuel-messias/todavia-me-alegrarei/' },
    ],
  },
  {
    title: 'Porque Ele Vive',
    artist: 'Harpa Cristã / Matt Maher / IBC Louvor',
    key: 'G (Sol Maior)',
    bpm: '75 BPM',
    composers: 'Bill Gaither, Gloria Gaither',
    structure: [
      { section: 'Verso 1', lyrics: 'Deus enviou Seu Filho amado\nPara perdoar, para curar' },
      { section: 'Refrão', lyrics: 'Porque Ele vive, posso crer no amanhã\nPorque Ele vive, temor não há' },
    ],
    fullLyrics: `Deus enviou Seu Filho amado
Para perdoar, para curar
Na cruz morreu por meus pecados
Mas ressurgiu e vivo com o Pai está

Porque Ele vive, posso crer no amanhã
Porque Ele vive, temor não há
Mas eu bem sei, eu sei que a minha vida
Está nas mãos do meu Jesus, que vivo está

E quando enfim chegar a hora
Em que a morte enfrentarei
Sem medo, então, terei vitória
Verei na glória o meu Jesus que vivo está`,
    slidesFormat: [
      'Deus enviou Seu Filho amado\nPara perdoar, para curar',
      'Na cruz morreu por meus pecados\nMas ressurgiu e vivo com o Pai está',
      'Porque Ele vive, posso crer no amanhã\nPorque Ele vive, temor não há',
      'Mas eu bem sei, eu sei que a minha vida\nEstá nas mãos do meu Jesus, que vivo está',
      'E quando enfim chegar a hora\nEm que a morte enfrentarei',
      'Sem medo, então, terei vitória\nVerei na glória o meu Jesus que vivo está',
    ],
    groundingSources: [
      { title: 'Harpa Cristã - Hino 545', url: 'https://www.letras.mus.br/harpa-crista/porque-ele-vive/' },
    ],
  },
  {
    title: 'Caminho no Deserto (Way Maker)',
    artist: 'Soraya Moraes / Leeland / Sinach',
    key: 'B (Si Maior)',
    bpm: '68 BPM',
    composers: 'Sinach (Osinachi Kalu Okoro Egbu)',
    structure: [
      { section: 'Verso 1', lyrics: 'Estás aqui a mover entre nós\nTe adorarei, Te adorarei' },
      { section: 'Refrão', lyrics: 'Milagroso, abridor de caminho\nCumpridor de promessas, luz na escuridão' },
    ],
    fullLyrics: `Estás aqui a mover entre nós
Te adorarei, Te adorarei
Estás aqui a operar neste lugar
Te adorarei, Te adorarei

Milagroso, abridor de caminho
Cumpridor de promessas
Luz na escuridão
Meu Deus, esse é quem Tu és

Estás aqui tocando os corações
Te adorarei, Te adorarei
Estás aqui curando multidões
Te adorarei, Te adorarei

Mesmo que eu não veja, estás operando
Mesmo que eu não sinta, estás operando
Não cessas, não cessas de operar
Não cessas, não cessas de operar`,
    slidesFormat: [
      'Estás aqui a mover entre nós\nTe adorarei, Te adorarei',
      'Estás aqui a operar neste lugar\nTe adorarei, Te adorarei',
      'Milagroso, abridor de caminho\nCumpridor de promessas',
      'Luz na escuridão\nMeu Deus, esse é quem Tu és',
      'Estás aqui tocando os corações\nTe adorarei, Te adorarei',
      'Estás aqui curando multidões\nTe adorarei, Te adorarei',
      'Mesmo que eu não veja, estás operando\nMesmo que eu não sinta, estás operando',
      'Não cessas, não cessas de operar\nNão cessas, não cessas de operar',
    ],
    groundingSources: [
      { title: 'Letras.mus.br - Soraya Moraes', url: 'https://www.letras.mus.br/soraya-moraes/caminho-no-deserto/' },
    ],
  },
  {
    title: 'Santo Espírito (Holy Spirit)',
    artist: 'Laura Souguellis',
    key: 'D (Ré Maior)',
    bpm: '72 BPM',
    composers: 'Bryan Torwalt, Katie Torwalt',
    structure: [
      { section: 'Verso', lyrics: 'Não há nada igual, não há nada melhor\nQue estar em Tua presença' },
      { section: 'Refrão', lyrics: 'Santo Espírito, és bem-vindo aqui\nVem inundar, encher este lugar' },
    ],
    fullLyrics: `Não há nada igual, não há nada melhor
A que se compare a esperança viva
Tua presença

Eu provei e vi o mais doce amor
Onde meu coração se liberta
E a minha vergonha é desfeita
Tua presença

Santo Espírito, és bem-vindo aqui
Vem inundar, encher este lugar
É o desejo do meu coração
Ser inundado por Tua glória, Senhor

Que sejamos mais conscientes de Tua presença
Que possamos experimentar a Tua glória
E Tua bondade, Senhor`,
    slidesFormat: [
      'Não há nada igual, não há nada melhor\nA que se compare a esperança viva',
      'Tua presença\nEu provei e vi o mais doce amor',
      'Onde meu coração se liberta\nE a minha vergonha é desfeita',
      'Tua presença\nSanto Espírito, és bem-vindo aqui',
      'Vem inundar, encher este lugar\nÉ o desejo do meu coração',
      'Ser inundado por Tua glória, Senhor\nQue sejamos mais conscientes de Tua presença',
      'Que possamos experimentar a Tua glória\nE Tua bondade, Senhor',
    ],
    groundingSources: [
      { title: 'Letras.mus.br - Laura Souguellis', url: 'https://www.letras.mus.br/laura-souguellis/santo-espirito/' },
    ],
  },
  {
    title: 'Grandioso És Tu',
    artist: 'Harpa Cristã (Hino 545)',
    key: 'Bb (Si Bemol Maior)',
    bpm: '74 BPM',
    composers: 'Carl Boberg, Stuart K. Hine',
    structure: [
      { section: 'Verso 1', lyrics: 'Senhor meu Deus, quando eu maravilhado\nFico a pensar nas obras de Tuas mãos' },
      { section: 'Refrão', lyrics: 'Então minh\'alma canta a Ti, Senhor\nGrandioso és Tu! Grandioso és Tu!' },
    ],
    fullLyrics: `Senhor meu Deus, quando eu maravilhado
Fico a pensar nas obras de Tuas mãos
No céu azul de estrelas pontilhado
O Teu poder mostrando a criação

Então minh'alma canta a Ti, Senhor:
Grandioso és Tu! Grandioso és Tu!
Então minh'alma canta a Ti, Senhor:
Grandioso és Tu! Grandioso és Tu!

Quando a pensar que Deus não poupou Seu Filho
No lenho rude O fez morrer por mim
Levando sobre Si o meu pecado
Derramando Seu sangue em meu favor

E quando enfim Jesus vier na glória
E ao lar celestial me transportar
Adorarei prostrado e para sempre:
Grandioso és Tu, meu Deus, hei de cantar!`,
    slidesFormat: [
      'Senhor meu Deus, quando eu maravilhado\nFico a pensar nas obras de Tuas mãos',
      'No céu azul de estrelas pontilhado\nO Teu poder mostrando a criação',
      'Então minh\'alma canta a Ti, Senhor:\nGrandioso és Tu! Grandioso és Tu!',
      'Então minh\'alma canta a Ti, Senhor:\nGrandioso és Tu! Grandioso és Tu!',
      'Quando a pensar que Deus não poupou Seu Filho\nNo lenho rude O fez morrer por mim',
      'Levando sobre Si o meu pecado\nDerramando Seu sangue em meu favor',
      'E quando enfim Jesus vier na glória\nE ao lar celestial me transportar',
      'Adorarei prostrado e para sempre:\nGrandioso és Tu, meu Deus, hei de cantar!',
    ],
    groundingSources: [
      { title: 'Harpa Cristã Oficial', url: 'https://www.letras.mus.br/harpa-crista/grandioso-es-tu/' },
    ],
  },
  {
    title: 'Quero Conhecer Jesus',
    artist: 'Alessandro Vilas Boas (Cia Salt)',
    key: 'G (Sol Maior)',
    bpm: '70 BPM',
    composers: 'Alessandro Vilas Boas',
    structure: [
      { section: 'Verso', lyrics: 'O meu orgulho me tirou do jardim\nSua humildade colocou o jardim em mim' },
      { section: 'Refrão', lyrics: 'Quero conhecer Jesus\nE ser achado Nele' },
      { section: 'Ponte', lyrics: 'Yeshua, Yeshua\nO Teu amor me conquistou' },
    ],
    fullLyrics: `O meu orgulho me tirou do jardim
Sua humildade colocou o jardim em mim
Se eu vender tudo o que tenho em troca do amor
Eu falharia

Pois o amor não se compra nem se merece
O amor se ganha, de graça o recebe
Eu quero conhecer Jesus
Eu quero conhecer Jesus
E ser achado Nele

Yeshua, Yeshua
Tu és tão lindo
Que eu nem sei expressar
Yeshua, Yeshua
Tu és tão lindo`,
    slidesFormat: [
      'O meu orgulho me tirou do jardim\nSua humildade colocou o jardim em mim',
      'Se eu vender tudo o que tenho em troca do amor\nEu falharia',
      'Pois o amor não se compra nem se merece\nO amor se ganha, de graça o recebe',
      'Eu quero conhecer Jesus\nEu quero conhecer Jesus\nE ser achado Nele',
      'Yeshua, Yeshua\nTu és tão lindo',
      'Que eu nem sei expressar\nYeshua, Yeshua\nTu és tão lindo',
    ],
    groundingSources: [
      { title: 'Letras.mus.br - Alessandro Vilas Boas', url: 'https://www.letras.mus.br/alessandro-vilas-boas/quero-conhecer-jesus/' },
    ],
  },
  {
    title: 'Oceanos (Oceans)',
    artist: 'Ana Nóbrega / Hillsong United',
    key: 'D (Ré Maior)',
    bpm: '64 BPM',
    composers: 'Matt Crocker, Joel Houston, Salomon Ligthelm',
    structure: [
      { section: 'Verso', lyrics: 'Tua voz me chama sobre as águas\nOnde os meus pés podem falhar' },
      { section: 'Refrão', lyrics: 'E ao Teu nome clamarei\nE além das ondas olharei' },
      { section: 'Ponte', lyrics: 'Guia-me pra que em tudo em Ti confie\nSobre as águas eu caminhe' },
    ],
    fullLyrics: `Tua voz me chama sobre as águas
Onde os meus pés podem falhar
E ali Te encontro no mistério
Em meio ao mar confiarei

E ao Teu nome clamarei
E além das ondas olharei
Se o mar crescer
Somente em Ti descansarei
Pois eu sou Teu e Tu és meu

Tua graça abunda em águas fundas
Tua mão soberana me guiará
Onde os meus pés podem falhar
E o meu medo me cercar
Tu nunca falhaste e não falharás

Guia-me pra que em tudo em Ti confie
Sobre as águas eu caminhe
Por onde quer que me chamares
Leva-me mais fundo do que já estive
E minha fé será mais firme
Senhor, em Tua presença`,
    slidesFormat: [
      'Tua voz me chama sobre as águas\nOnde os meus pés podem falhar',
      'E ali Te encontro no mistério\nEm meio ao mar confiarei',
      'E ao Teu nome clamarei\nE além das ondas olharei',
      'Se o mar crescer\nSomente em Ti descansarei',
      'Pois eu sou Teu e Tu és meu\nTua graça abunda em águas fundas',
      'Tua mão soberana me guiará\nOnde os meus pés podem falhar',
      'E o meu medo me cercar\nTu nunca falhaste e não falharás',
      'Guia-me pra que em tudo em Ti confie\nSobre as águas eu caminhe',
      'Por onde quer que me chamares\nLeva-me mais fundo do que já estive',
      'E minha fé será mais firme\nSenhor, em Tua presença',
    ],
    groundingSources: [
      { title: 'Letras.mus.br - Ana Nóbrega', url: 'https://www.letras.mus.br/ana-nobrega/oceanos-onde-meus-pes-podem-falhar/' },
    ],
  },
  {
    title: 'Só Tu És Santo',
    artist: 'Morada',
    key: 'A (Lá Maior)',
    bpm: '68 BPM',
    composers: 'Brunão Morada',
    structure: [
      { section: 'Verso', lyrics: 'Não há outro igual a Ti\nNão há outro Deus como o nosso Deus' },
      { section: 'Refrão', lyrics: 'Só Tu és Santo, só Tu és Santo\nNão há outro igual a Ti' },
    ],
    fullLyrics: `Não há outro igual a Ti
Não há outro Deus como o nosso Deus
Que desceu do Seu trono de glória
Pra nos resgatar da escuridão

Só Tu és Santo, só Tu és Santo
Só Tu és Santo, Senhor
Não há outro igual a Ti
Digno de honra, de glória e louvor

Te exaltamos sobre a terra
Te exaltamos entre as nações
Que todo joelho se dobre
E toda língua confesse que Tu és Senhor`,
    slidesFormat: [
      'Não há outro igual a Ti\nNão há outro Deus como o nosso Deus',
      'Que desceu do Seu trono de glória\nPra nos resgatar da escuridão',
      'Só Tu és Santo, só Tu és Santo\nSó Tu és Santo, Senhor',
      'Não há outro igual a Ti\nDigno de honra, de glória e louvor',
      'Te exaltamos sobre a terra\nTe exaltamos entre as nações',
      'Que todo joelho se dobre\nE toda língua confesse que Tu és Senhor',
    ],
    groundingSources: [
      { title: 'Letras.mus.br - Morada', url: 'https://www.letras.mus.br/ministerio-morada/so-tu-es-santo/' },
    ],
  },
  {
    title: 'Pode Morar Aqui',
    artist: 'Theo Rubia',
    key: 'F (Fá Maior)',
    bpm: '70 BPM',
    composers: 'Theo Rubia',
    structure: [
      { section: 'Verso', lyrics: 'Aquieta a minh\'alma\nFaz meu coração ouvir Tua voz' },
      { section: 'Refrão', lyrics: 'Pode morar aqui\nPode ficar aqui, Senhor' },
    ],
    fullLyrics: `Aquieta a minh'alma
Faz meu coração ouvir Tua voz
Me ensina a esperar em Ti
Em silêncio descansar

Pode morar aqui
Pode ficar aqui, Senhor
A casa é Tua
O meu coração é Teu altar

Não tenho nada a Te oferecer
Além da minha vida e do meu louvor
Seja exaltado, seja adorado
Para sempre em mim`,
    slidesFormat: [
      'Aquieta a minh\'alma\nFaz meu coração ouvir Tua voz',
      'Me ensina a esperar em Ti\nEm silêncio descansar',
      'Pode morar aqui\nPode ficar aqui, Senhor',
      'A casa é Tua\nO meu coração é Teu altar',
      'Não tenho nada a Te oferecer\nAlém da minha vida e do meu louvor',
      'Seja exaltado, seja adorado\nPara sempre em mim',
    ],
    groundingSources: [
      { title: 'Letras.mus.br - Theo Rubia', url: 'https://www.letras.mus.br/theo-rubia/pode-morar-aqui/' },
    ],
  },
  {
    title: 'Vitorioso És',
    artist: 'Gabriel Guedes',
    key: 'A (Lá Maior)',
    bpm: '70 BPM',
    composers: 'Gabriel Guedes',
    structure: [
      { section: 'Verso', lyrics: 'O Teu amor me resgatou\nDa escuridão pra Tua luz' },
      { section: 'Refrão', lyrics: 'Vitorioso és, soberano Rei\nNada pode Te deter' },
    ],
    fullLyrics: `O Teu amor me resgatou
Da escuridão pra Tua luz
Tu me deste um novo coração
E a certeza da salvação

Vitorioso és, soberano Rei
Nada pode Te deter
Venceu a cruz, ressuscitou
Para sempre reinará

Teu é o reino, Teu é o poder
Tua é a glória para sempre, amém`,
    slidesFormat: [
      'O Teu amor me resgatou\nDa escuridão pra Tua luz',
      'Tu me deste um novo coração\nE a certeza da salvação',
      'Vitorioso és, soberano Rei\nNada pode Te deter',
      'Venceu a cruz, ressuscitou\nPara sempre reinará',
      'Teu é o reino, Teu é o poder\nTua é a glória para sempre, amém',
    ],
    groundingSources: [
      { title: 'Letras.mus.br - Gabriel Guedes', url: 'https://www.letras.mus.br/gabriel-guedes/vitorioso-es/' },
    ],
  },
  {
    title: 'Nenhum Outro Nome',
    artist: 'Hillsong Worship / Gabriela Rocha',
    key: 'D (Ré Maior)',
    bpm: '72 BPM',
    composers: 'Joel Houston, Jonas Myrin',
    structure: [
      { section: 'Verso', lyrics: 'Luz das nações, esperança eterna\nReinas em glória e majestade' },
      { section: 'Refrão', lyrics: 'Não há outro nome como o Teu\nJesus, o nome sobre todo nome' },
    ],
    fullLyrics: `Luz das nações, esperança eterna
Reinas em glória e majestade
O Teu reino jamais terá fim
Jesus, Emanuel

Não há outro nome como o Teu
Não há outro nome como o Teu
Jesus, o nome sobre todo nome
Jesus, o Salvador

Venceste a morte, o inferno e a cruz
Ressuscitaste em poder e luz
Para todo sempre reinarás
Jesus, o Rei dos reis`,
    slidesFormat: [
      'Luz das nações, esperança eterna\nReinas em glória e majestade',
      'O Teu reino jamais terá fim\nJesus, Emanuel',
      'Não há outro nome como o Teu\nNão há outro nome como o Teu',
      'Jesus, o nome sobre todo nome\nJesus, o Salvador',
      'Venceste a morte, o inferno e a cruz\nRessuscitaste em poder e luz',
      'Para todo sempre reinarás\nJesus, o Rei dos reis',
    ],
    groundingSources: [
      { title: 'Letras.mus.br - Hillsong / Gabriela Rocha', url: 'https://www.letras.mus.br/gabriela-rocha/nenhum-outro-nome/' },
    ],
  },
  {
    title: 'Em Teus Braços',
    artist: 'Laura Souguellis',
    key: 'C (Dó Maior)',
    bpm: '66 BPM',
    composers: 'Laura Souguellis',
    structure: [
      { section: 'Verso', lyrics: 'Seguro estou nos braços Daquele que nunca me deixou\nSeu amor perfeito sempre esteve aqui' },
      { section: 'Refrão', lyrics: 'E se eu passar pelo vale da morte\nNão temerei mal algum' },
    ],
    fullLyrics: `Seguro estou nos braços Daquele que nunca me deixou
Seu amor perfeito sempre esteve aqui
Ele começou a boa obra e vai terminar
Ele começou a boa obra e vai terminar

E se eu passar pelo vale da morte
Não temerei mal algum
Pois Tu estás comigo
Tua vara e Teu cajado me consolam

Eu me rendo ao Teu amor
Eu me rendo ao Teu abraço
Em Teus braços é o meu descanso
Em Teus braços encontro paz`,
    slidesFormat: [
      'Seguro estou nos braços Daquele que nunca me deixou\nSeu amor perfeito sempre esteve aqui',
      'Ele começou a boa obra e vai terminar\nEle começou a boa obra e vai terminar',
      'E se eu passar pelo vale da morte\nNão temerei mal algum',
      'Pois Tu estás comigo\nTua vara e Teu cajado me consolam',
      'Eu me rendo ao Teu amor\nEu me rendo ao Teu abraço',
      'Em Teus braços é o meu descanso\nEm Teus braços encontro paz',
    ],
    groundingSources: [
      { title: 'Letras.mus.br - Laura Souguellis', url: 'https://www.letras.mus.br/laura-souguellis/em-teus-bracos/' },
    ],
  },
  {
    title: 'Ninguém Explica Deus',
    artist: 'Preto no Branco feat. Gabriela Rocha',
    key: 'G (Sol Maior)',
    bpm: '70 BPM',
    composers: 'Clovis Pinho',
    structure: [
      { section: 'Verso 1', lyrics: 'Nada é igual ao Seu redor\nO universo chora o Seu esplendor' },
      { section: 'Refrão', lyrics: 'Ninguém explica Deus\nEle é o princípio e o fim' },
    ],
    fullLyrics: `Nada é igual ao Seu redor
Tudo se faz no Seu olhar
O universo chora o Seu esplendor
O Sol e a Lua dançam pra Te adorar

Dono de toda ciência, sabedoria e poder
Oh, dá-me de beber da água da fonte da vida
Antes que o haja houvesse
Ele já era Deus

Ninguém explica Deus
Ninguém explica Deus
E se duvida, então me explica quem fez o mar
Quem fez o céu, quem fez o ar?
Ninguém explica Deus`,
    slidesFormat: [
      'Nada é igual ao Seu redor\nTudo se faz no Seu olhar',
      'O universo chora o Seu esplendor\nO Sol e a Lua dançam pra Te adorar',
      'Dono de toda ciência, sabedoria e poder\nOh, dá-me de beber da água da fonte da vida',
      'Antes que o haja houvesse\nEle já era Deus',
      'Ninguém explica Deus\nNinguém explica Deus',
      'E se duvida, então me explica quem fez o mar\nQuem fez o céu, quem fez o ar?',
      'Ninguém explica Deus',
    ],
    groundingSources: [
      { title: 'Letras.mus.br - Preto no Branco', url: 'https://www.letras.mus.br/preto-no-branco/ninguem-explica-deus/' },
    ],
  },
  {
    title: 'Deus de Promessas',
    artist: 'Davi Sacer / Trazendo a Arca',
    key: 'E (Mi Maior)',
    bpm: '68 BPM',
    composers: 'Davi Sacer, Ronald Fonseca, Verônica Sacer',
    structure: [
      { section: 'Verso', lyrics: 'Sei que os Teus olhos sempre atentos olham pra mim\nE os Teus ouvidos estão abertos para ouvir' },
      { section: 'Refrão', lyrics: 'Deus de promessas, Deus de promessas\nNão falha, não falha' },
    ],
    fullLyrics: `Sei que os Teus olhos sempre atentos olham pra mim
E os Teus ouvidos estão abertos para ouvir
O meu clamor, a minha oração
Sei que Tua fidelidade é grande sobre mim

Deus de promessas, Deus de promessas
Não falha, não falha
Deus de aliança, Deus de aliança
Não mente, jamais mudará

Posso até chorar a noite inteira
Mas a alegria vem logo pela manhã
O choro pode durar uma noite
Mas o Teu socorro bem cedo virá`,
    slidesFormat: [
      'Sei que os Teus olhos sempre atentos olham pra mim\nE os Teus ouvidos estão abertos para ouvir',
      'O meu clamor, a minha oração\nSei que Tua fidelidade é grande sobre mim',
      'Deus de promessas, Deus de promessas\nNão falha, não falha',
      'Deus de aliança, Deus de aliança\nNão mente, jamais mudará',
      'Posso até chorar a noite inteira\nMas a alegria vem logo pela manhã',
      'O choro pode durar uma noite\nMas o Teu socorro bem cedo virá',
    ],
    groundingSources: [
      { title: 'Letras.mus.br - Davi Sacer', url: 'https://www.letras.mus.br/davi-sacer/deus-de-promessas/' },
    ],
  },
  {
    title: 'A Ele a Glória',
    artist: 'Diante do Trono',
    key: 'C (Dó Maior)',
    bpm: '65 BPM',
    composers: 'Ana Paula Valadão',
    structure: [
      { section: 'Verso', lyrics: 'Porque Dele e por Ele\nPara Ele são todas as coisas' },
      { section: 'Refrão', lyrics: 'A Ele a glória, a Ele a glória\nPra sempre, amém' },
    ],
    fullLyrics: `Porque Dele e por Ele
Para Ele são todas as coisas
Porque Dele e por Ele
Para Ele são todas as coisas

A Ele a glória
A Ele a glória
A Ele a glória
Pra sempre, amém

Quão insondáveis são os Teus juízos
E inescrutáveis os Teus caminhos
Quem conheceu a mente do Senhor?
A Ele a glória para sempre!`,
    slidesFormat: [
      'Porque Dele e por Ele\nPara Ele são todas as coisas',
      'Porque Dele e por Ele\nPara Ele são todas as coisas',
      'A Ele a glória\nA Ele a glória',
      'A Ele a glória\nPra sempre, amém',
      'Quão insondáveis são os Teus juízos\nE inescrutáveis os Teus caminhos',
      'Quem conheceu a mente do Senhor?\nA Ele a glória para sempre!',
    ],
    groundingSources: [
      { title: 'Letras.mus.br - Diante do Trono', url: 'https://www.letras.mus.br/diante-do-trono/a-ele-a-gloria/' },
    ],
  },
  {
    title: 'Raridade',
    artist: 'Anderson Freire',
    key: 'Bb (Si Bemol Maior)',
    bpm: '68 BPM',
    composers: 'Anderson Freire',
    structure: [
      { section: 'Verso', lyrics: 'Não consigo ir além do Teu olhar\nTudo o que eu consigo é me apaixonar' },
      { section: 'Refrão', lyrics: 'Você é um espelho que reflete a imagem do Senhor\nNão chore se o mundo ainda não notou' },
    ],
    fullLyrics: `Não consigo ir além do Teu olhar
Tudo o que eu consigo é me apaixonar
Chego a pensar que o Teu amor
É maior que todo o universo

Você é um espelho que reflete a imagem do Senhor
Não chore se o mundo ainda não notou
Já é o bastante Deus reconhecer o seu valor
Você é precioso, mais raro que o ouro puro de Ofir

Se você desistir, nem o ouro vai poder comprar
O que Deus preparou pra te abençoar
Você é uma raridade nas mãos do Criador`,
    slidesFormat: [
      'Não consigo ir além do Teu olhar\nTudo o que eu consigo é me apaixonar',
      'Chego a pensar que o Teu amor\nÉ maior que todo o universo',
      'Você é um espelho que reflete a imagem do Senhor\nNão chore se o mundo ainda não notou',
      'Já é o bastante Deus reconhecer o seu valor\nVocê é precioso, mais raro que o ouro puro de Ofir',
      'Se você desistir, nem o ouro vai poder comprar\nO que Deus preparou pra te abençoar',
      'Você é uma raridade nas mãos do Criador',
    ],
    groundingSources: [
      { title: 'Letras.mus.br - Anderson Freire', url: 'https://www.letras.mus.br/anderson-freire/raridade/' },
    ],
  },
  {
    title: 'Ressuscita-me',
    artist: 'Aline Barros',
    key: 'C (Dó Maior)',
    bpm: '70 BPM',
    composers: 'Anderson Freire',
    structure: [
      { section: 'Verso', lyrics: 'Mestre, eu preciso de um milagre\nTransforma minha vida, meu estado' },
      { section: 'Refrão', lyrics: 'Ressuscita-me, Senhor\nRemove a minha pedra' },
    ],
    fullLyrics: `Mestre, eu preciso de um milagre
Transforma minha vida, meu estado
Fazei o que ninguém mais pode fazer
Senhor, eu sei que nada é impossível pra Ti

Ressuscita-me, Senhor
Remove a minha pedra
Chama pelo meu nome
Muda a minha história

Ressuscita os meus sonhos
Transforma a minha vida
Me faz um milagre
Me faz renascer`,
    slidesFormat: [
      'Mestre, eu preciso de um milagre\nTransforma minha vida, meu estado',
      'Fazei o que ninguém mais pode fazer\nSenhor, eu sei que nada é impossível pra Ti',
      'Ressuscita-me, Senhor\nRemove a minha pedra',
      'Chama pelo meu nome\nMuda a minha história',
      'Ressuscita os meus sonhos\nTransforma a minha vida',
      'Me faz um milagre\nMe faz renascer',
    ],
    groundingSources: [
      { title: 'Letras.mus.br - Aline Barros', url: 'https://www.letras.mus.br/aline-barros/ressuscita-me/' },
    ],
  },
  {
    title: 'Alvo Mais Que a Neve',
    artist: 'Harpa Cristã (Hino 39)',
    key: 'A (Lá Maior)',
    bpm: '76 BPM',
    composers: 'Eden Reeder Latta, Henry S. Perkins',
    structure: [
      { section: 'Verso 1', lyrics: 'Bendito seja o Cordeiro\nQue na cruz por nós padeceu' },
      { section: 'Refrão', lyrics: 'Alvo mais que a neve\nSim, nesse sangue lavado, mais alvo que a neve serei' },
    ],
    fullLyrics: `Bendito seja o Cordeiro
Que na cruz por nós padeceu
Bendito seja o Seu sangue
Que por nós pecadores verteu

Eis nesse sangue lavados
Com roupas que tão alvas são
Os pecadores remidos
Que perante seu Deus já estão

Alvo mais que a neve!
Alvo mais que a neve!
Sim, nesse sangue lavado
Mais alvo que a neve serei!`,
    slidesFormat: [
      'Bendito seja o Cordeiro\nQue na cruz por nós padeceu',
      'Bendito seja o Seu sangue\nQue por nós pecadores verteu',
      'Eis nesse sangue lavados\nCom roupas que tão alvas são',
      'Os pecadores remidos\nQue perante seu Deus já estão',
      'Alvo mais que a neve!\nAlvo mais que a neve!',
      'Sim, nesse sangue lavado\nMais alvo que a neve serei!',
    ],
    groundingSources: [
      { title: 'Harpa Cristã - Hino 39', url: 'https://www.letras.mus.br/harpa-crista/alvo-mais-que-a-neve/' },
    ],
  },
];

function normalize(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, ' ')
    .trim();
}

export function findWorshipSong(query: string): SongLyricResult | null {
  const normQuery = normalize(query);
  if (!normQuery) return null;

  const words = normQuery.split(/\s+/).filter((w) => w.length > 1);

  // 1. Exact match on title or artist
  for (const song of WORSHIP_SONGS_DATABASE) {
    const normTitle = normalize(song.title);
    const normArtist = normalize(song.artist);

    if (normTitle === normQuery || `${normTitle} ${normArtist}` === normQuery) {
      return song;
    }
  }

  // 2. Title includes query or query includes title
  for (const song of WORSHIP_SONGS_DATABASE) {
    const normTitle = normalize(song.title);
    if (normTitle.includes(normQuery) || normQuery.includes(normTitle)) {
      return song;
    }
  }

  // 3. Match multiple significant words across title and artist
  for (const song of WORSHIP_SONGS_DATABASE) {
    const normTitle = normalize(song.title);
    const normArtist = normalize(song.artist);
    const combined = `${normTitle} ${normArtist}`;

    if (words.length > 0 && words.every((w) => combined.includes(w))) {
      return song;
    }
  }

  // 4. Check lyrics content for multi-word match
  for (const song of WORSHIP_SONGS_DATABASE) {
    const normLyrics = normalize(song.fullLyrics);
    if (words.length >= 2 && words.every((w) => normLyrics.includes(w))) {
      return song;
    }
  }

  // 5. Check if at least 70% of words match title
  for (const song of WORSHIP_SONGS_DATABASE) {
    const normTitle = normalize(song.title);
    const matchedCount = words.filter((w) => normTitle.includes(w)).length;
    if (words.length >= 2 && matchedCount / words.length >= 0.6) {
      return song;
    }
  }

  return null;
}
