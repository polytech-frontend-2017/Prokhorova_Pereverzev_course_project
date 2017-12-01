

export class Store {
    //private itTournir = 0;
    addListener(handler) {
        this._handlers.push(handler);
    }
    emitChange(){
        this._handlers.forEach(fn => fn());
    }
    constructor() {
        this.competition = {title:'Some title 1', date:null};

        this.itTournir = 0;                         //итератор для id турнира (private)
        this.idCompetitor = 0;                      //итератор для id соревнующегося (private)
        this.activeTournir = null;
        this._handlers = [];
        this.tournirs = [{
            id: this.itTournir++,
            ageRange: {min:5,max:10},
            qiuRange: {min:10,max:6},
            massRange:{min:10,max:60},
            tours: [
                {
                    id:1,
                    groups:[]
                }],
            competitors: [],
        }];
        this.competitors=[
            {name: 'Max',
                surname: 'Perevrezev',
                patronomics: 'Evgenievna',
                qiu: 10,
                age: 21,
                mass:100,
                id: this.idCompetitor++,},
            {name: 'Vadim',
                surname: 'Pack',
                patronomics: 'Gennadievich',
                qiu: 1,
                age: 38,
                mass:80,
                id: this.idCompetitor++,}
        ];
    }
    createCompetition(Title, Date){
        this.competition = {title:Title, date:Date};
        // { ...this, competition: {Title,Date} } было бы в Redux
        this.emitChange();
    }
    setActiveTournir(ActiveTournir){
        this.activeTournir = ActiveTournir;
        this.emitChange();
    }
    addTournir(AgeMin,AgeMax,QiuMin, QiuMax,MassMin,MassMax){
        this.tournirs.push({
            id: this.itTournir++,
            ageRange: {min:AgeMin,max:AgeMax},
            qiuRange: {min:QiuMin,max:QiuMax},
            massRange:{min:MassMin,max:MassMax},
            tours: [
                {
                    id:1,
                    groups:[]
                }],
            competitors: [],
        });
        console.dir(this.tournirs);
        this.emitChange();
    }
    destroyTournir(id){
        this.tournirs.splice(id,1);
        this.emitChange();
    }
    addCompetitor(Name, Surname, Patronomics, Qiu, Age,Mass){
        let Competitor = {
                name: Name,
                surname: Surname,
                patronomics: Patronomics,
                qiu: Qiu,
                age: Age,
                mass:Mass,
                id: this.idCompetitor++,
            };
            this.competitors.push(Competitor);
        if (this.tournirs.length > 0){
            /*this.tournirs.forEach(tournament => {
                if (tournament.ageRange.min <= Age &&
                    tournament.ageRange.max > Age &&
                    tournament.qiuRange.min <= Qiu &&
                    tournament.qiuRange.max > Qiu) {
                    tournament.competitors.push(Competitor);
                    if (tournament.competitors.length%2===1)
                        tournament.tours.groups.push({first:'Someone', second:'Someone'})
                }
            })*/
        }
        this.emitChange();
    }
    destroyCompetitor(id){
        this.competitors.splice(id,1);
        this.emitChange();
    }
    addTour(){
        this.tournirs[this.activeTournir].tours.push(
            {
                groups:[],
            }
        );
        this.emitChange();
    }
    addGroup(){

    }

}


export default Store;