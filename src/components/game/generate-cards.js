const levenshtein = require('fast-levenshtein');
const fs = require('fs');
const path = require('path');

const readdir = asyncify(fs.readdir.bind(fs));
const stat = asyncify(fs.stat.bind(fs));
const root = path.join(__dirname, './images/cards');

doThings();

async function doThings () {
  var files = await readFiles(root);

  files = files.map((e) => e.split('/'));

  checkData(files);

}

function checkData (files) {
  const data = getData();

  var cards = data.map(function (card) {
    var parts = card.id.split('-');
    parts.shift();
    var idNum = parts[0];
    var disasterType = null;
    var isDisaster = false;
    if (idNum === 'throne') {
      idNum = Number(parts[2]);
    } else {
      parts.shift();
      if (idNum[0] === 'c' || idNum[0] === 'd') {
        idNum = idNum.substr(1);
        disasterType = idNum[0];
        isDisaster = true;
      }
    }
    var isBlank = false;
    var isVault = false;
    var isThrone = false;
    var isCatastrophe = false;
    card.categories.forEach(function (category) {
      switch (category) {
        case 'Throne':
          isThrone = true;
          break;
        case 'Blank':
          isBlank = true;
          break;
        case 'Catastrophe':
          isCatastrophe  = true;
          // no break
        case 'Disaster':
          isDisaster = true;
          break;
        case 'Treasure':
          isVault = true;
          break;
        case 'Passive':
        case 'Link':
          isBlank = false;
          break;
        default:
          console.log(category);
          break;
      }
    });
    isBlank = isBlank && Number(idNum) > 50;
    // find the card!!!
    var suspectedPaths = [...files];
    if (isThrone) {
      suspectedPaths = suspectedPaths.filter((fileParts) => fileParts[0] === 'Throne rooms');
    } else {
      suspectedPaths = suspectedPaths.filter((fileParts) => fileParts[0] !== 'Throne rooms');
    }
    if (isDisaster) {
      suspectedPaths = suspectedPaths.filter((fileParts) => fileParts[0] === 'Disasters');
    } else {
      suspectedPaths = suspectedPaths.filter((fileParts) => fileParts[0] !== 'Disasters');
    }
    if (isBlank) {
      suspectedPaths = suspectedPaths.filter((fileParts) => fileParts[0] === 'Blankroom');
    } else {
      suspectedPaths = suspectedPaths.filter((fileParts) => fileParts[0] !== 'Blankroom');
    }
    if (isVault) {
      suspectedPaths = suspectedPaths.filter((fileParts) => fileParts[0] === 'Vaults');
    } else {
      suspectedPaths = suspectedPaths.filter((fileParts) => fileParts[0] !== 'Vaults');
    }

    var result = suspectedPaths.reduce(function (bestGuess, fileParts) {
      var fileName = fileParts[fileParts.length - 1];
      var nameParts = fileName.split('_');
      var num = nameParts.shift();

      let matchingNumbers = Number(num) === Number(idNum);

      if (isThrone) {
        let myNum = parts[parts.length - 1];
        if (myNum === num && fileName.substr(-12) !== 'FLIPSIDE.png') {
          return [fileParts, 0];
        }
      }

      if (!isVault && !isThrone) {
        nameParts.pop();
      }
      var myName = parts.join('').toLowerCase();
      var theirName = nameParts.join('').toLowerCase();
      var distance = levenshtein.get(myName, theirName);

      if (matchingNumbers) {
        distance--;
      }

      if (!bestGuess || distance < bestGuess[1]) {
        return [fileParts, distance];
      }
      return bestGuess;
    }, null);

    return [card, result[0].join('/')];
  });


  var takenCards = {};
  var lines = [];

  cards.forEach(function (card, i) {
    lines.push("import card" + i + " from './images/cards/" + card[1] + "';");
    if (takenCards[card[1]]) {
      console.error(card[0], card[1], 'already taken by', takenCards[card[1]]);
    }
    takenCards[card[1]] = card[0];
  });

  lines.push('export default {');
  cards.forEach(function (card, i) {
    lines.push("  '" + card[0].id + "': card" + i + ",");
  });
  lines.push('};');

  fs.writeFileSync(path.join(__dirname, 'cards.js'), lines.join('\n'));
}

async function readFiles (fileRoot) {
  var data = await readdir(fileRoot);
  data = await Promise.all(data.map(async function (pathPart) {
    var newRoot = path.join(fileRoot, pathPart);
    var children = null;
    try {
      children = await readFiles(newRoot);
      return children;
    } catch (e) {
      // do nothing
    }

    return newRoot.substr(root.length + 1);
  }));

  var result = [];
  data.forEach(function (entry) {
    if (!entry) {
      return;
    }
    if (Array.isArray(entry)) {
      result = result.concat(entry);
      return;
    }
    result.push(entry);
  });

  return result;
}

function asyncify (method, noErr) {
  return async function () {
    var args = [...arguments];
    var self = this;
    return new Promise(function (resolve, reject) {
      args.push(handler);
      method.apply(self, args);

      function handler (err, data) {
        if (noErr) {
          return resolve(err);
        }
        if (err) {
          return reject(err);
        }
        return resolve(data);
      }
    });

  }
}

function getData () {
  return [
    {
      "id": "card-throne-room-1",
      "categories": [
        "Throne"
      ],
      "assetType": "Card"
    },
    {
      "id": "card-throne-room-2",
      "categories": [
        "Throne"
      ],
      "assetType": "Card"
    },
    {
      "id": "card-throne-room-3",
      "categories": [
        "Throne"
      ],
      "assetType": "Card"
    },
    {
      "id": "card-throne-room-4",
      "categories": [
        "Throne"
      ],
      "assetType": "Card"
    },
    {
      "id": "card-throne-room-5",
      "categories": [
        "Throne"
      ],
      "assetType": "Card"
    },
    {
      "id": "card-1-black-market",
      "categories": [
        "Blank"
      ],
      "assetType": "Card"
    },
    {
      "id": "card-2-divination-chamber",
      "categories": [
        "Blank"
      ],
      "assetType": "Card"
    },
    {
      "id": "card-3-merchants-guild",
      "categories": [
        "Blank"
      ],
      "assetType": "Card"
    },
    {
      "id": "card-4-wormhole-generator",
      "categories": [
        "Blank"
      ],
      "assetType": "Card"
    },
    {
      "id": "card-5-doomsayer",
      "categories": [
        "Blank"
      ],
      "assetType": "Card"
    },
    {
      "id": "card-6-anti-gravity-cannon",
      "categories": [
        "Blank"
      ],
      "assetType": "Card"
    },
    {
      "id": "card-7-time-machine",
      "categories": [
        "Blank"
      ],
      "assetType": "Card"
    },
    {
      "id": "card-8-soothsayer",
      "categories": [
        "Blank"
      ],
      "assetType": "Card"
    },
    {
      "id": "card-9-architect",
      "categories": [
        "Blank"
      ],
      "assetType": "Card"
    },
    {
      "id": "card-10-interior-decorator",
      "categories": [
        "Blank"
      ],
      "assetType": "Card"
    },
    {
      "id": "card-11-treasury",
      "categories": [
        "Passive"
      ],
      "assetType": "Card"
    },
    {
      "id": "card-12-market",
      "categories": [
        "Passive"
      ],
      "assetType": "Card"
    },
    {
      "id": "card-13-energy-core",
      "categories": [
        "Passive"
      ],
      "assetType": "Card"
    },
    {
      "id": "card-14-gravity-generator",
      "categories": [
        "Passive"
      ],
      "assetType": "Card"
    },
    {
      "id": "card-15-reinforced-walls",
      "categories": [
        "Passive"
      ],
      "assetType": "Card"
    },
    {
      "id": "card-16-gravitational-anchor",
      "categories": [
        "Passive"
      ],
      "assetType": "Card"
    },
    {
      "id": "card-17-tavern",
      "categories": [
        "Passive"
      ],
      "assetType": "Card"
    },
    {
      "id": "card-18-echo-chamber",
      "categories": [
        "Passive"
      ],
      "assetType": "Card"
    },
    {
      "id": "card-19-armorer",
      "categories": [
        "Passive"
      ],
      "assetType": "Card"
    },
    {
      "id": "card-20-generator-1",
      "categories": [
        "Passive"
      ],
      "assetType": "Card"
    },
    {
      "id": "card-21-generator-2",
      "categories": [
        "Passive"
      ],
      "assetType": "Card"
    },
    {
      "id": "card-22-safe-room",
      "categories": [
        "Passive"
      ],
      "assetType": "Card"
    },
    {
      "id": "card-23-bunker",
      "categories": [
        "Passive"
      ],
      "assetType": "Card"
    },
    {
      "id": "card-24-room-with-legs",
      "categories": [
        "Passive"
      ],
      "assetType": "Card"
    },
    {
      "id": "card-25-spinning-room",
      "categories": [
        "Passive"
      ],
      "assetType": "Card"
    },
    {
      "id": "card-26-warping-chamber",
      "categories": [
        "Passive"
      ],
      "assetType": "Card"
    },
    {
      "id": "card-27-imposter",
      "categories": [
        "Passive"
      ],
      "assetType": "Card"
    },
    {
      "id": "card-28-commanders-chambers",
      "categories": [
        "Passive"
      ],
      "assetType": "Card"
    },
    {
      "id": "card-29-engineers-workshop",
      "categories": [
        "Passive"
      ],
      "assetType": "Card"
    },
    {
      "id": "card-30-pilots-quarters",
      "categories": [
        "Passive"
      ],
      "assetType": "Card"
    },
    {
      "id": "card-31-swimming-pool",
      "categories": [
        "Passive"
      ],
      "assetType": "Card"
    },
    {
      "id": "card-32-candy-shop",
      "categories": [
        "Passive"
      ],
      "assetType": "Card"
    },
    {
      "id": "card-33-petting-zoo",
      "categories": [
        "Passive"
      ],
      "assetType": "Card"
    },
    {
      "id": "card-34-movie-theatre",
      "categories": [
        "Passive"
      ],
      "assetType": "Card"
    },
    {
      "id": "card-35-nuclear-reactor",
      "categories": [
        "Passive"
      ],
      "assetType": "Card"
    },
    {
      "id": "card-36-mercenary-1",
      "categories": [
        "Link"
      ],
      "assetType": "Card"
    },
    {
      "id": "card-37-mercenary-2",
      "categories": [
        "Link"
      ],
      "assetType": "Card"
    },
    {
      "id": "card-38-mercenary-3",
      "categories": [
        "Link"
      ],
      "assetType": "Card"
    },
    {
      "id": "card-39-mercenary-4",
      "categories": [
        "Link"
      ],
      "assetType": "Card"
    },
    {
      "id": "card-40-giant-fan-1",
      "categories": [
        "Link"
      ],
      "assetType": "Card"
    },
    {
      "id": "card-41-giant-fan-2",
      "categories": [
        "Link"
      ],
      "assetType": "Card"
    },
    {
      "id": "card-42-construction-crew",
      "categories": [
        "Link"
      ],
      "assetType": "Card"
    },
    {
      "id": "card-43-rocket-engineer-1",
      "categories": [
        "Link"
      ],
      "assetType": "Card"
    },
    {
      "id": "card-44-rocket-engineer-2",
      "categories": [
        "Link"
      ],
      "assetType": "Card"
    },
    {
      "id": "card-45-shuttle-1",
      "categories": [
        "Link"
      ],
      "assetType": "Card"
    },
    {
      "id": "card-46-shuttle-2",
      "categories": [
        "Link"
      ],
      "assetType": "Card"
    },
    {
      "id": "card-47-warp-cannon-1",
      "categories": [
        "Link"
      ],
      "assetType": "Card"
    },
    {
      "id": "card-48-warp-cannon-2",
      "categories": [
        "Link"
      ],
      "assetType": "Card"
    },
    {
      "id": "card-49-warp-cannon-3",
      "categories": [
        "Link"
      ],
      "assetType": "Card"
    },
    {
      "id": "card-50-hydraulic-arm-1",
      "categories": [
        "Link"
      ],
      "assetType": "Card"
    },
    {
      "id": "card-51-hydraulic-arm-2",
      "categories": [
        "Link"
      ],
      "assetType": "Card"
    },
    {
      "id": "card-52-watchtower",
      "categories": [
        "Link"
      ],
      "assetType": "Card"
    },
    {
      "id": "card-53-homeowners-association",
      "categories": [
        "Link"
      ],
      "assetType": "Card"
    },
    {
      "id": "card-54-unhappy-neighbor",
      "categories": [
        "Link"
      ],
      "assetType": "Card"
    },
    {
      "id": "card-55-disco",
      "categories": [
        "Link"
      ],
      "assetType": "Card"
    },
    {
      "id": "card-56-corridor-1",
      "categories": [
        "Blank"
      ],
      "assetType": "Card"
    },
    {
      "id": "card-57-corridor-2",
      "categories": [
        "Blank"
      ],
      "assetType": "Card"
    },
    {
      "id": "card-58-corridor-3",
      "categories": [
        "Blank"
      ],
      "assetType": "Card"
    },
    {
      "id": "card-59-corridor-4",
      "categories": [
        "Blank"
      ],
      "assetType": "Card"
    },
    {
      "id": "card-60-corridor-5",
      "categories": [
        "Blank"
      ],
      "assetType": "Card"
    },
    {
      "id": "card-61-corridor-6",
      "categories": [
        "Blank"
      ],
      "assetType": "Card"
    },
    {
      "id": "card-62-hallway-1",
      "categories": [
        "Blank"
      ],
      "assetType": "Card"
    },
    {
      "id": "card-63-hallway-2",
      "categories": [
        "Blank"
      ],
      "assetType": "Card"
    },
    {
      "id": "card-64-hallway-3",
      "categories": [
        "Blank"
      ],
      "assetType": "Card"
    },
    {
      "id": "card-65-hallway-4",
      "categories": [
        "Blank"
      ],
      "assetType": "Card"
    },
    {
      "id": "card-66-hallway-5",
      "categories": [
        "Blank"
      ],
      "assetType": "Card"
    },
    {
      "id": "card-67-hallway-6",
      "categories": [
        "Blank"
      ],
      "assetType": "Card"
    },
    {
      "id": "card-68-hallway-7",
      "categories": [
        "Blank"
      ],
      "assetType": "Card"
    },
    {
      "id": "card-69-staircase-1",
      "categories": [
        "Blank"
      ],
      "assetType": "Card"
    },
    {
      "id": "card-70-staircase-2",
      "categories": [
        "Blank"
      ],
      "assetType": "Card"
    },
    {
      "id": "card-71-staircase-3",
      "categories": [
        "Blank"
      ],
      "assetType": "Card"
    },
    {
      "id": "card-72-staircase-4",
      "categories": [
        "Blank"
      ],
      "assetType": "Card"
    },
    {
      "id": "card-73-staircase-5",
      "categories": [
        "Blank"
      ],
      "assetType": "Card"
    },
    {
      "id": "card-74-staircase-6",
      "categories": [
        "Blank"
      ],
      "assetType": "Card"
    },
    {
      "id": "card-75-staircase-7",
      "categories": [
        "Blank"
      ],
      "assetType": "Card"
    },
    {
      "id": "card-76-big-vault-1",
      "categories": [
        "Treasure"
      ],
      "assetType": "Card"
    },
    {
      "id": "card-77-big-vault-2",
      "categories": [
        "Treasure"
      ],
      "assetType": "Card"
    },
    {
      "id": "card-78-big-vault-3",
      "categories": [
        "Treasure"
      ],
      "assetType": "Card"
    },
    {
      "id": "card-79-big-vault-4",
      "categories": [
        "Treasure"
      ],
      "assetType": "Card"
    },
    {
      "id": "card-80-large-vault-1",
      "categories": [
        "Treasure"
      ],
      "assetType": "Card"
    },
    {
      "id": "card-81-large-vault-2",
      "categories": [
        "Treasure"
      ],
      "assetType": "Card"
    },
    {
      "id": "card-82-medium-vault-1",
      "categories": [
        "Treasure"
      ],
      "assetType": "Card"
    },
    {
      "id": "card-83-medium-vault-2",
      "categories": [
        "Treasure"
      ],
      "assetType": "Card"
    },
    {
      "id": "card-84-medium-vault-3",
      "categories": [
        "Treasure"
      ],
      "assetType": "Card"
    },
    {
      "id": "card-85-medium-vault-4",
      "categories": [
        "Treasure"
      ],
      "assetType": "Card"
    },
    {
      "id": "card-86-medium-vault-5",
      "categories": [
        "Treasure"
      ],
      "assetType": "Card"
    },
    {
      "id": "card-87-medium-vault-6",
      "categories": [
        "Treasure"
      ],
      "assetType": "Card"
    },
    {
      "id": "card-88-small-vault-1",
      "categories": [
        "Treasure"
      ],
      "assetType": "Card"
    },
    {
      "id": "card-89-small-vault-2",
      "categories": [
        "Treasure"
      ],
      "assetType": "Card"
    },
    {
      "id": "card-90-small-vault-3",
      "categories": [
        "Treasure"
      ],
      "assetType": "Card"
    },
    {
      "id": "card-91-small-vault-4",
      "categories": [
        "Treasure"
      ],
      "assetType": "Card"
    },
    {
      "id": "card-92-bribers-vault-1",
      "categories": [
        "Treasure",
        "Link"
      ],
      "assetType": "Card"
    },
    {
      "id": "card-93-bribers-vault-2",
      "categories": [
        "Treasure",
        "Link"
      ],
      "assetType": "Card"
    },
    {
      "id": "card-94-cold-vault",
      "categories": [
        "Treasure",
        "Passive"
      ],
      "assetType": "Card"
    },
    {
      "id": "card-95-dynamic-vault",
      "categories": [
        "Treasure"
      ],
      "assetType": "Card"
    },
    {
      "id": "card-96-entropic-vault",
      "categories": [
        "Treasure",
        "Passive"
      ],
      "assetType": "Card"
    },
    {
      "id": "card-97-candy-vault",
      "categories": [
        "Treasure",
        "Passive"
      ],
      "assetType": "Card"
    },
    {
      "id": "card-98-lonely-vault-1",
      "categories": [
        "Treasure"
      ],
      "assetType": "Card"
    },
    {
      "id": "card-99-lonely-vault-2",
      "categories": [
        "Treasure"
      ],
      "assetType": "Card"
    },
    {
      "id": "card-100-nuclear-vault",
      "categories": [
        "Treasure",
        "Link"
      ],
      "assetType": "Card"
    },
    {
      "id": "card-d01-nuclear-meltdown",
      "categories": [
        "Disaster"
      ],
      "assetType": "Card"
    },
    {
      "id": "card-d02-nebula-drake",
      "categories": [
        "Disaster"
      ],
      "assetType": "Card"
    },
    {
      "id": "card-d03-gas-explosion",
      "categories": [
        "Disaster"
      ],
      "assetType": "Card"
    },
    {
      "id": "card-d04-meteor",
      "categories": [
        "Disaster"
      ],
      "assetType": "Card"
    },
    {
      "id": "card-d05-magma-quake",
      "categories": [
        "Disaster"
      ],
      "assetType": "Card"
    },
    {
      "id": "card-d06-entropy-demon",
      "categories": [
        "Disaster"
      ],
      "assetType": "Card"
    },
    {
      "id": "card-d07-verdant-chaos",
      "categories": [
        "Disaster"
      ],
      "assetType": "Card"
    },
    {
      "id": "card-d08-aurora-whale",
      "categories": [
        "Disaster"
      ],
      "assetType": "Card"
    },
    {
      "id": "card-d09-space-bees",
      "categories": [
        "Disaster"
      ],
      "assetType": "Card"
    },
    {
      "id": "card-d10-aurora-veil",
      "categories": [
        "Disaster"
      ],
      "assetType": "Card"
    },
    {
      "id": "card-d11-warp-storm",
      "categories": [
        "Disaster"
      ],
      "assetType": "Card"
    },
    {
      "id": "card-d12-ionic-tornado",
      "categories": [
        "Disaster"
      ],
      "assetType": "Card"
    },
    {
      "id": "card-c01-void-weavers",
      "categories": [
        "Catastrophe"
      ],
      "assetType": "Card"
    },
    {
      "id": "card-c02-economic-crash",
      "categories": [
        "Catastrophe"
      ],
      "assetType": "Card"
    },
    {
      "id": "card-c03-doom",
      "categories": [
        "Catastrophe"
      ],
      "assetType": "Card"
    },
    {
      "id": "card-c04-the-star-child",
      "categories": [
        "Catastrophe"
      ],
      "assetType": "Card"
    },
    {
      "id": "card-c05-cosmic-koala",
      "categories": [
        "Catastrophe"
      ],
      "assetType": "Card"
    },
    {
      "id": "card-c06-golden-meteor",
      "categories": [
        "Catastrophe"
      ],
      "assetType": "Card"
    },
    {
      "id": "card-c07-ancient-awakening",
      "categories": [
        "Catastrophe"
      ],
      "assetType": "Card"
    },
    {
      "id": "card-c08-extra-dimensional-rift",
      "categories": [
        "Catastrophe"
      ],
      "assetType": "Card"
    },
    {
      "id": "card-c09-cult-of-room",
      "categories": [
        "Catastrophe"
      ],
      "assetType": "Card"
    },
    {
      "id": "card-c10-time-anomaly",
      "categories": [
        "Catastrophe"
      ],
      "assetType": "Card"
    },
    {
      "id": "card-c11-celestial-goddess",
      "categories": [
        "Catastrophe"
      ],
      "assetType": "Card"
    },
    {
      "id": "card-c12-the-singularity",
      "categories": [
        "Catastrophe"
      ],
      "assetType": "Card"
    }
  ];
}
