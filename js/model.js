//Model
var model = function() {
    var self = this;
    self.churchesOfTvmArray = [{
        type: ['st.joseph\'s\ cathedral', 'cathedral'],
        cords: {
            lat: 8.504535,
            lng: 76.951724
        },
        description: 'St.Joseph\'s\ Cathedral',
        wikiURL: 'St. Joseph\'s\ Cathedral, Trivandrum'
    }, {
        type: ['st. mary\'s\ cathedral'],
        cords: {
            lat: 8.526051,
            lng: 76.938205
        },
        description: 'St. Mary\'s\ Cathedral',
        wikiURL: 'St. Mary\'s\ Cathedral, Pattom'
    }, {
        type: ['st therese of lisieux church'],
        cords: {
            lat: 8.513679,
            lng: 76.962118
        },
        description: 'St Therese of Lisieux Church',
        wikiURL: 'St. Theresa of Lisieux Catholic Church, Vellayambalam'
    }, {
        type: ['madre de deus church'],
        cords: {
            lat: 8.494171,
            lng: 76.900379
        },
        description: 'Madre de deus church',
        wikiURL: 'Madre de deus church vettukad'
    }, {
        type: ['st ignatius church'],
        cords: {
            lat: 8.573487,
            lng: 76.837352
        },
        description: 'St Ignatius Church',
        wikiURL: 'St Ignatius Church Puthenthope'
    }, {
        type: ['st. mary, basilica', 'basilica'],
        cords: {
            lat: 8.502922,
            lng: 76.949833
        },
        description: 'St. Mary, Basilica',
        wikiURL: 'St. Mary, Queen of Peace Basilica'
    }];
};


var searchModel = function() {
    var self = this;
    self.autoCompleteSearchArray = [
        'Madre de deus church', 'St Ignatius Church', 'St. Mary, Basilica', 'Basilica', 'St Therese of Lisieux Church', 'St. Mary\'s\ Cathedral',
        'Cathedral', 'St.Joseph\'s\ Cathedral'
    ];
};
