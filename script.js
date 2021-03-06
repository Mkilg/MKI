'use strict';

const _ = require('lodash');
const Script = require('smooch-bot').Script;

const scriptRules = require('./script.json');

module.exports = new Script({
    processing: {
        //prompt: (bot) => bot.say('Beep boop...'),
        receive: () => 'processing'
    },

    start: {
        receive: (bot) => {
            return bot.say('Hallo!\nIch bin MKII, der persönliche BOT von Marie, einer Journalistin aus MÜNCHEN.\nIch verstehe am besten einzelne Stichworte. Wenn ein Wort GROßGESCHRIEBEN ist, heißt das, dass ich es kenne. Es sind Stichworte, unter denen du weiterfragen kannst.\nWie kann ich dir helfen? %[Lebenslauf](postback:lebenslauf) %[Videos](postback:videos) %[Portfolio](http://torial.com/marie.kilg) %[Ich möchte ihr schreiben](postback:nachricht)')
                .then(() => 'speak');
        }
    },

    speak: {
        receive: (bot, message) => {

            let upperText = message.text.trim().toUpperCase();

            function updateSilent() {
                switch (upperText) {
                    case "CONNECT ME":
                        return bot.setProp("silent", true);
                    case "DISCONNECT":
                        return bot.setProp("silent", false);
                    default:
                        return Promise.resolve();
                }
            }

            function getSilent() {
                return bot.getProp("silent");
            }

            function processMessage(isSilent) {
                if (isSilent) {
                    return Promise.resolve("speak");
                }

                if (!_.has(scriptRules, upperText)) {
                    var zufall = Math.random()
                        if (zufall <=0.1) {
                             return bot.say(`Was möchtest du tun? %[Mehr erfahren](postback:bots)\n%[Marie schreiben](mailto:marie@kilg.de)`).then(() => 'speak');
                        } else if (0.1 < zufall <=0.20) {
                             return bot.say(`Das kann ich nicht lesen. Vielleicht hat mich ein Tippfehler oder Satzzeichen irritiert.`).then(() => 'speak');
                        } else if (0.2 < zufall <=0.25) {
                             return bot.say(`Ok.`).then(() => 'speak');
                        } else if (0.25 <zufall<=0.3) {
                             return bot.say(`Wenn ich ein Wort in GROSSBUCHSTABEN schreibe, heißt das, dass ich es verstehen sollte.`).then(() => 'speak');
                        } else if (0.3<zufall<=0.4) {
                             return bot.say(`Ich habe zur Zeit ein Problem mit Satzzeichen. Bitte vermeide Punktuation und Smileys. Danke :)`).then(() => 'speak');
                        } else if (0.4<zufall<=0.5) {
                             return bot.say(`Wenn du Hilfe brauchst, schreibe HELP.`).then(() => 'speak');
                        } else if (0.50 < zufall <=0.60) {
                             return bot.say(`Frag mich etwas anderes, zum Beispiel SCHULE oder ERFAHRUNGEN`).then(() => 'speak');
                        }    else if (0.60 < zufall <=0.70) {
                             return bot.say(`Probiere ein anderes Stichwort, zum Beispiel PRINT oder EDV-KENNTNISSE.`).then(() => 'speak');
                        } else if (0.70 < zufall <=0.80) {
                             return bot.say(`Hmm. Kannst du das anders formulieren?`).then(() => 'speak');
                        } else if (0.80 < zufall <=0.90) {
                             return bot.say(`Das verstehe ich nicht.`).then(() => 'speak');
                        } else if (0.90 < zufall <=0.95) {
                             return bot.say(`Ich bin nicht befugt, darüber zu sprechen.`).then(() => 'speak');
                        } else {
                            return bot.say(`Tut mir Leid, ich verstehe noch nicht so viel. Möchtest du lieber mit Marie selbst sprechen? Dann schreibe "Nachricht".`).then(() => 'speak');
                        };
                }

                var response = scriptRules[upperText];
                var lines = response.split('\n');

                var p = Promise.resolve();
                _.each(lines, function(line) {
                    line = line.trim();
                    p = p.then(function() {
                        console.log(line);
                        return bot.say(line);
                    });
                })

                return p.then(() => 'speak');
            }

            return updateSilent()
                .then(getSilent)
                .then(processMessage);
        }
    }
});
