// game.js

// === Motorbike Quest Game ===

const logBox = document.getElementById('logBox');
const questLog = document.getElementById('questLog');
const commandInput = document.getElementById('commandInput');
const locationImage = document.getElementById('locationImage');

const state = {
    questStage: 0,
    inventory: [],
    location: 'saigon_city',
};

const locations = {
    saigon_city: {
        image: 'images/saigon_city.png',
        north: 'saigon_street',
        entry: "You're at the edge of the city. Neon lights flicker behind you. To the north, the streets stretch wide.",
        look: "The city hums with restless energy. The road ahead calls.",
        smell: "The air is thick with the scent of distant street food and the faint tang of the sea."
    },
    saigon_street: {
        image: 'images/saigon_street.png',
        south: 'saigon_city',
        east: 'saigon_street_vendor',
        west: 'saigon_coffee',
        north: 'saigon_mechanic',
        entry: "You arrive on a bustling street. The scent of street food mixes with motor oil. A flower vendor waves at you from the east.",
        look: "The busy street stretches in every direction. A vendor and a coffee shop are nearby.",
        smell: "The combined scents of spices, gasoline, and blooming flowers fill the air."
    },
    saigon_street_vendor: {
        image: 'images/saigon_street_vendor.png',
        west: 'saigon_street',
        entry: "Colorful blooms spill from buckets. The flower vendor adjusts her sunhat and smiles at you.",
        look: "Petals flutter in the breeze. The vendor watches you curiously. Maybe try 'talk to vendor'.",
        smell: "The sweet, overpowering fragrance of a thousand flowers fills your nostrils."
    },
    saigon_coffee: {
        image: 'images/saigon_coffee.png',
        east: 'saigon_street',
        entry: "Steam wafts from mugs on the counter. The barista gives you a nod.",
        look: "The rich aroma of coffee fills the air. The barista awaits your approach. Maybe try 'talk to barista'.",
        smell: "The strong, comforting scent of freshly brewed coffee permeates the shop."
    },
    saigon_mechanic: {
        image: 'images/saigon_mechanic.png',
        south: 'saigon_street',
        entry: "The mechanic’s shop is cluttered with tools. A half-built bike gleams under a hanging light.",
        look: "Grease-streaked walls and the scent of oil surround you. The mechanic looks up from his work. Maybe try 'talk to mechanic'.",
        smell: "The sharp, metallic tang of oil and the hot, acrid smell of welding fill the shop."
    }
};

const quests = [
    'Talk to the flower vendor to find a way to earn money.',
    'Pick up coffee from the barista and deliver it to the mechanic.',
    'Talk to the mechanic and deliver the coffee to earn your motorbike.',
    'Take the motorbike from the mechanic.',
    'Travel north to Mui Ne.'
];

const npcDialogs = {
    vendor: [
        "The flower vendor adjusts her hat. 'Looking for work? The barista to the west needs help with a delivery.'",
        "'Still here? The barista’s waiting west of here. Get that coffee!'"
    ],
    barista: [
        "The barista grins. 'Here—hot and strong, just like the mechanic likes it. Ride fast and don’t spill a drop.'",
        "'You've already got the coffee. Don’t keep the mechanic waiting!'"
    ],
    mechanic: [
        "He glances at you, 'You got that coffee for me? Hand it over, and we'll talk business.'",
        "'You did well. That bike's yours now. Go make your mark.'",
        "He points to a sleek motorbike. 'She's all yours. Take good care of her.'",
        "He gives a nod. 'You're all set. Head north and ride into your destiny.'"
    ]
};

function updateLog(message) {
    const line = document.createElement('div');
    line.className = 'log-line';
    line.textContent = message;
    logBox.appendChild(line);
    logBox.scrollTop = logBox.scrollHeight;
}

function updateQuest() {
    console.log("Update quest function was called");
    questLog.textContent = `Current Quest: ${quests[state.questStage]}`;
    playSound('quest_complete_1.mp3');
}

function updateLocation() {
    const loc = locations[state.location];
    locationImage.src = loc.image;
    updateLog(loc.entry);
}

function handleCommand(command) {
    command = command.toLowerCase();

    if (command === 'help') {
        updateLog("Commands: go [direction], look, smell, take [item], use [item], talk to [npc], give [item] to [npc], inventory, help");
        return;
    }

    if (command === 'inventory') {
        if (state.inventory.length === 0) {
            updateLog("Your inventory is empty.");
        } else {
            updateLog("You are carrying: " + state.inventory.join(", "));
        }
        return;
    }

    if (command.startsWith('go ')) {
        const dir = command.split(' ')[1];
        const newLoc = locations[state.location][dir];
        if (newLoc) {
            state.location = newLoc;
            updateLog(`You head ${dir} through the pulsing streets of Saigon.`);
            updateLocation();
        } else {
            updateLog("You glance that way, but there's no path forward.");
        }
        return;
    }

    if (command === 'look') {
        updateLog(locations[state.location].look);
        return;
    }

    if (command === 'smell') {
        updateLog(locations[state.location].smell);
        return;
    }

    if (command.startsWith('take ')) {
        const item = command.split('take ')[1];
        if (state.location === 'saigon_coffee' && item === 'coffee') {
            if (!state.inventory.includes('coffee') && state.questStage === 1) {
                state.inventory.push('coffee');
                updateLog("You carefully take the steaming cup of coffee. It warms your hands.");
                state.questStage++;
                updateQuest();
            } else if (state.inventory.includes('coffee')) {
                updateLog("You already have the coffee. Better get it to the mechanic.");
            } else {
                updateLog("The barista gestures: 'Ask first, friend. Try \"talk to barista\".'");
            }
        } else if (state.location === 'saigon_mechanic' && item === 'motorbike') {
            if (state.questStage === 3) {
                state.inventory.push('motorbike');
                state.questStage++;
                updateQuest();
                updateLog("You take the motorbike. It's an old model, but sturdy.");
            } else {
                updateLog("The mechanic looks at you confused. 'You need to earn that bike first.'");
            }
        } else {
            updateLog("There’s nothing here to take like that.");
        }
        return;
    }

    if (command.startsWith('use ')) {
        const item = command.split('use ')[1];
        if (item === 'coffee' && state.location === 'saigon_mechanic') {
            if (state.inventory.includes('coffee') && state.questStage === 2) {
                updateLog("You hand over the coffee. The mechanic sips, sighs, and grins.");
                state.inventory = state.inventory.filter(i => i !== 'coffee');
                state.questStage++;
                updateQuest();
            } else {
                updateLog("He eyes your hands. 'You got something for me?'");
            }
        } else {
            updateLog("Nothing happens.");
        }
        return;
    }

    if (command.startsWith('talk to ')) {
        const npc = command.split('talk to ')[1];
        if (npc === 'vendor') {
            if (state.location !== 'saigon_street_vendor') {
                updateLog("You try to strike up a conversation, but there's no one by that name here.");
            } else if (state.questStage === 0) {
                updateLog(npcDialogs.vendor[0]);
                state.questStage++;
                updateQuest();
            } else {
                updateLog(npcDialogs.vendor[1]);
            }
        } else if (npc === 'barista') {
            if (state.location !== 'saigon_coffee') {
                updateLog("You try to strike up a conversation, but there's no one by that name here.");
            } else if (state.questStage === 0) {
                updateLog("You need to talk to the flower vendor first. Maybe check east?");
            } else if (state.questStage === 1 && !state.inventory.includes('coffee')) {
                updateLog(npcDialogs.barista[0]);
            } else {
                updateLog(npcDialogs.barista[1]);
            }
        } else if (npc === 'mechanic') {
            if (state.location !== 'saigon_mechanic') {
                updateLog("You try to strike up a conversation, but there's no one by that name here.");
            } else if (state.questStage === 2 && state.inventory.includes('coffee')) {
                updateLog(npcDialogs.mechanic[0]);
            } else if (state.questStage === 3) {
                updateLog(npcDialogs.mechanic[2]);
            } else if (state.questStage === 4) {
                updateLog(npcDialogs.mechanic[3]);
            } else {
                updateLog("He looks up from his work. 'Come back when you have coffee for me.'");
            }
        } else {
            updateLog("You try to strike up a conversation, but there's no one by that name here.");
        }
        return;
    }

    if (command.startsWith('give ')) {
        const parts = command.split(' ');
        if (parts.length >= 4 && parts[2] === 'to') {
            const item = parts[1];
            const npc = parts[3];
            if (item === 'coffee' && npc === 'mechanic' && state.location === 'saigon_mechanic') {
                if (state.inventory.includes('coffee') && state.questStage === 2) {
                    updateLog("You hand over the coffee. The mechanic sips, sighs, and grins.");
                    state.inventory = state.inventory.filter(i => i !== 'coffee');
                    state.questStage++;
                    updateQuest();
                } else {
                    updateLog("You don’t have the coffee—or it’s not the right time.");
                }
            } else {
                updateLog("That won’t work.");
            }
        }
        return;
    }

    updateLog("Nothing happens...");
}

commandInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
        const input = commandInput.value.trim();
        if (input.length > 0) {
            handleCommand(input);
            commandInput.value = '';
        }
    }
});

// Intro + game start
updateLog("Welcome to Saigon! Your grand journey to the Far North begins here, what awaits you there only time will tell. For now, you need a motorbike. Type 'help' for a list of commands. Try 'look', or 'go north' to get started.");
updateLocation();
updateQuest();

function testSound(){
  playSound('quest_complete_1.mp3')
}
