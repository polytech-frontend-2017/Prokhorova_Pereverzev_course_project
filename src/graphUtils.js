export class Store {
    constructor() {
        this.competitors = [{
            Name: '',
            qu: 8
        }];
        this.tournaments = [
            {
                id: 1,
                competitions: [{competitors: this.competitors}]
            }
        ]
    }

    addCompetitor({name, qu}) {
        this.competitors.push();
    }
}

function getGraphData(store, tournamentId) {
    var data = [

    ];
    var tournament = store.tournaments.find(x => x.id === tournamentId);
    /*tournament.competitions.forEach(x => {
        data.push(...)
    });*/
}