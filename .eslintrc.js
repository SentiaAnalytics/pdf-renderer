module.exports = {
    "extends": "standard",
    "plugins": [
        "standard",
        "promise"
    ],
    "rules" : {
        "semi" : ["error", "always"]
    },
    "env": {
        "node" : true,
        "mocha": true,
        "es6": true
    }
};