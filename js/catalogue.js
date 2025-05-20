
const catalogueEntities = [
    {
      id: '001',
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
      threat: 'Toriel should not be approached or reasoned with, her tongue is perhaps more dangerous than her fire.',
      history: 'Originally designed as tutorial guide, corrupted during game/reality merger, now tests survivors through combat trials. First encountered by Survivor Group "Deadmeat", an apt name, as they were the first victims.',
      notes: [
        'She\'s trying to help, in her way. Doesn\'t make her less deadly.',
        'The fire breath isn\'t 100%  real. The pain is.',
        'Color flickers before breath attack. DON\'T DODGE IT.'
      ]
    },
    {
      id: '042',
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
      threat: 'Intangible digital entity capable of possessing electronic devices. Can travel through power lines and electrical connections.',
      history: 'Appears to be fragmented shadow data from the original game\'s stealth enemies. Gained sentience during the merge. Often found near abandoned N-CO facilities.',
      notes: [
        'They don\'t see you if you don\'t look at screens. - Log #23',
        'Can be lured into energy traps with active devices. - Log #89',
        'Never corner one - they\'ll jump into your devices if desperate.'
      ]
    }
  ];
  
  function renderEntityCard(entityData) {
    const output = [
      `SURVIVOROS ENTITY CATALOGUE - ENTRY #${entityData.id}`,
      '',
      `ENTITY: ${entityData.name}`,
      `ORIGIN: ${entityData.origin}`,
      `STATE: ${entityData.state}`,
      `POWER LEVEL: ${entityData.powerLevel.toLocaleString()}`,
      `CONFIRMED KILLS: ${entityData.kills.toLocaleString()}`,
      '',
      'P.O.W.E.R ATTRIBUTES:',
      '',
      `POWER:     ${entityData.power.value} | ${entityData.power.dice}`,
      `ODDITY:    ${entityData.oddity.value} | ${entityData.oddity.dice}`,
      `WISDOM:    ${entityData.wisdom.value} | ${entityData.wisdom.dice}`,
      `ENDURANCE: ${entityData.endurance.value} | ${entityData.endurance.dice}`,
      `REFLEX:    ${entityData.reflex.value} | ${entityData.reflex.dice}`,
      '',
      `BLOOD: ${entityData.blood.current}/${entityData.blood.max} | SWEAT: ${entityData.sweat.current}/${entityData.sweat.max} | TEARS: ${entityData.tears.current}/${entityData.tears.max}`,
      '',
      'THREAT ASSESSMENT:',
      '',
      `> ${entityData.threat}`,
      '',
      'HISTORY:',
      '',
      entityData.history,
      '',
      'SURVIVOR NOTES:',
      ''
    ];
    
    entityData.notes.forEach(note => {
      output.push(`> ${note}`);
    });
    
    return output.join('\n');
  }
  
  function listCatalogueEntities(searchTerm = '') {
    const output = [
      'SURVIVOROS ENTITY CATALOGUE',
      ''
    ];
    
    let filteredEntities = catalogueEntities;
    if (searchTerm) {
      searchTerm = searchTerm.toLowerCase();
      filteredEntities = catalogueEntities.filter(entity => 
        entity.name.toLowerCase().includes(searchTerm) ||
        entity.origin.toLowerCase().includes(searchTerm) ||
        entity.state.toLowerCase().includes(searchTerm)
      );
    }
    
    output.push(`DISCOVERED ENTITIES (SHOWING ${filteredEntities.length} OF ${catalogueEntities.length}):`);
    output.push('────────────────────────────────────────────────────────────────');
    output.push('');
    
    filteredEntities.forEach(entity => {
      output.push(`#${entity.id} - ${entity.name} [${entity.state}] - ${entity.origin}`);
    });
    
    if (filteredEntities.length === 0) {
      output.push('No matching entities found.');
    }
    
    output.push('');
    output.push('Enter "catalogue view [ID]" to view entity details.');
    output.push('Enter "catalogue search [term]" to search for specific entities.');
    
    return output.join('\n');
  }