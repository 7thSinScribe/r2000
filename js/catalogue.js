const catalogEntities = [
    {
      id: '1',
      name: 'TORIEL, THE UNVANQUISHED',
      origin: 'Tutorial_Boss_001.arc',
      state: 'HYBRID',
      powerLevel: 9100,
      kills: 371,
      power: { value: 22, dice: '5d12' },
      oddity: { value: 18, dice: '2d8+3d10' },
      wisdom: { value: 16, dice: '4d8+1d10' },
      endurance: { value: 20, dice: '5d10' },
      reflex: { value: 15, dice: '5d8' },
      blood: { current: 62, max: 62 },
      sweat: { current: 50, max: 50 },
      tears: { current: 52, max: 52 },
      threats: [
        'Draconic entity serving as gateway guardian to new areas',
        'Controls both PHYSICAL and DIGITAL space within 30m radius',
        'Special ability: "Maternal Reset" - restores 50% BLOOD when low',
        'Special ability: "Bitmap Breath" - converts physical objects to corrupted digital pixels',
        'WEAKNESS: Exploits in tutorial code patterns'
      ],
      history: 'Originally designed as tutorial guide, corrupted during game/reality merger, now tests survivors through combat trials. First encountered in Sector N-3 by Survivor Group "Deadbeef".',
      notes: [
        'She\'s trying to help, in her way. Doesn\'t make her less deadly.',
        'The fire breath isn\'t real. The pain is. - Log #55',
        'Color flickers before breath attack. DODGE LATERAL. - Log #87'
      ]
    },
    {
      id: '42',
      name: 'BITMAP SHADE',
      origin: 'Enemy_Shadow_001.arc',
      state: 'DIGITAL',
      powerLevel: 3200,
      kills: 127,
      power: { value: 10, dice: '5d6+5d7' },
      oddity: { value: 25, dice: '5d14' },
      wisdom: { value: 8, dice: '5d6+3d7' },
      endurance: { value: 12, dice: '5d6+7d7' },
      reflex: { value: 18, dice: '5d10+3d6' },
      blood: { current: 32, max: 32 },
      sweat: { current: 40, max: 40 },
      tears: { current: 43, max: 43 },
      threats: [
        'Intangible digital entity capable of possessing electronic devices',
        'Can travel through power lines and electrical connections',
        'Special ability: "Glitch Step" - teleports short distances through digital space',
        'Special ability: "Pixel Drain" - absorbs digital imagery to heal',
        'WEAKNESS: Electromagnetic pulses disrupt its cohesion'
      ],
      history: 'Appears to be fragmented shadow data from the original game\'s stealth enemies. Gained sentience during the merge. Often found near abandoned N-CO facilities.',
      notes: [
        'They don\'t see you if you don\'t look at screens. - Log #23',
        'Can be lured into energy traps with active devices. - Log #89',
        'Never corner one - they\'ll jump into your devices if desperate.'
      ]
    }
  ];
  
  function renderEntityCard(entityData) {
    const cardWidth = 68;
    
    const topBorder = `╔${'═'.repeat(cardWidth - 2)}╗`;
    const headerDivider = `╠${'═'.repeat(cardWidth - 2)}╣`;
    const bottomBorder = `╚${'═'.repeat(cardWidth - 2)}╝`;
    
    const title = ` SURVIVOROS ENTITY CATALOG - ENTRY #${entityData.id.padStart(3, '0')} `;
    const headerRow = `║${title.padEnd(cardWidth - 2)}║`;
    
    const sections = [];
    
    // Entity info section
    sections.push(generateSection([
      '',
      `ENTITY: ${entityData.name}`,
      `ORIGIN: ${entityData.origin}`,
      `STATE: ${entityData.state}`,
      `POWER LEVEL: ${entityData.powerLevel.toLocaleString()}`,
      `CONFIRMED KILLS: ${entityData.kills.toLocaleString()}`,
      ''
    ], cardWidth));
    
    // POWER attributes section
    sections.push(generateSection([
      'P.O.W.E.R ATTRIBUTES:',
      '',
      `POWER:     ${entityData.power.value} | ${entityData.power.dice}`,
      `ODDITY:    ${entityData.oddity.value} | ${entityData.oddity.dice}`,
      `WISDOM:    ${entityData.wisdom.value} | ${entityData.wisdom.dice}`,
      `ENDURANCE: ${entityData.endurance.value} | ${entityData.endurance.dice}`,
      `REFLEX:    ${entityData.reflex.value} | ${entityData.reflex.dice}`,
      '',
      `BLOOD: ${entityData.blood.current}/${entityData.blood.max} | SWEAT: ${entityData.sweat.current}/${entityData.sweat.max} | TEARS: ${entityData.tears.current}/${entityData.tears.max}`,
      ''
    ], cardWidth));
    
    // Threat assessment section
    const threatLines = ['THREAT ASSESSMENT:', ''];
    entityData.threats.forEach(threat => {
      const wrappedLines = wrapText(threat, cardWidth - 6);
      wrappedLines.forEach((line, index) => {
        if (index === 0) {
          threatLines.push(`> ${line}`);
        } else {
          threatLines.push(`  ${line}`);
        }
      });
    });
    threatLines.push('');
    sections.push(generateSection(threatLines, cardWidth));
    
    // History section
    const historyLines = ['HISTORY:', ''];
    const wrappedHistory = wrapText(entityData.history, cardWidth - 4);
    historyLines.push(...wrappedHistory);
    historyLines.push('');
    sections.push(generateSection(historyLines, cardWidth));
    
    // Notes section
    const notesLines = ['SURVIVOR NOTES:', ''];
    entityData.notes.forEach(note => {
      const wrappedLines = wrapText(note, cardWidth - 6);
      wrappedLines.forEach((line, index) => {
        if (index === 0) {
          notesLines.push(`> ${line}`);
        } else {
          notesLines.push(`  ${line}`);
        }
      });
    });
    notesLines.push('');
    sections.push(generateSection(notesLines, cardWidth));
    
    // Assemble the complete card
    let result = topBorder + '\n' + headerRow + '\n' + headerDivider + '\n';
    
    for (let i = 0; i < sections.length; i++) {
      result += sections[i].join('\n') + '\n';
      if (i < sections.length - 1) {
        result += headerDivider + '\n';
      }
    }
    
    result += bottomBorder;
    return result;
  }
  
  function generateSection(lines, width) {
    return lines.map(line => `║ ${line.padEnd(width - 4)} ║`);
  }
  
  function wrapText(text, maxWidth) {
    const words = text.split(' ');
    const lines = [];
    let currentLine = '';
    
    words.forEach(word => {
      if (currentLine.length + word.length + 1 <= maxWidth) {
        currentLine += (currentLine.length === 0 ? '' : ' ') + word;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    });
    
    if (currentLine.length > 0) {
      lines.push(currentLine);
    }
    
    return lines;
  }
  
  function listCatalogEntities(searchTerm = '') {
    const cardWidth = 68;
    const topBorder = `╔${'═'.repeat(cardWidth - 2)}╗`;
    const headerDivider = `╠${'═'.repeat(cardWidth - 2)}╣`;
    const bottomBorder = `╚${'═'.repeat(cardWidth - 2)}╝`;
    
    const title = ' SURVIVOROS ENTITY CATALOG ';
    const headerRow = `║${title.padEnd(cardWidth - 2)}║`;
    
    let filteredEntities = catalogEntities;
    if (searchTerm) {
      searchTerm = searchTerm.toLowerCase();
      filteredEntities = catalogEntities.filter(entity => 
        entity.name.toLowerCase().includes(searchTerm) ||
        entity.origin.toLowerCase().includes(searchTerm) ||
        entity.state.toLowerCase().includes(searchTerm)
      );
    }
    
    const listLines = [
      '',
      `DISCOVERED ENTITIES (SHOWING ${filteredEntities.length} OF ${catalogEntities.length}):`,
      '────────────────────────────────────────────────────────────────',
      ''
    ];
    
    filteredEntities.forEach(entity => {
      listLines.push(`#${entity.id.padStart(3, '0')} - ${entity.name} [${entity.state}] - ${entity.origin}`);
    });
    
    if (filteredEntities.length === 0) {
      listLines.push('No matching entities found.');
    }
    
    listLines.push('');
    listLines.push('Enter "catalog view [ID]" to view entity details.');
    listLines.push('Enter "catalog search [term]" to search for specific entities.');
    listLines.push('');
    
    const result = [
      topBorder,
      headerRow,
      headerDivider,
      ...generateSection(listLines, cardWidth),
      bottomBorder
    ].join('\n');
    
    return result;
  }