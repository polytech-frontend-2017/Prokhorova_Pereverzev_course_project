

export class Store {
    //private itTournir = 0;
    addListener(handler) {
        this._handlers.push(handler);
    }
    emitChange(){
        this._handlers.forEach(fn => fn());
    }
    constructor() {
        this.competition = {title:'', date:null};
        this.tournirs = [];
        this.itTournir = 0;                         //итератор для id турнира (private)
        this.activeTournir = null;
        this._handlers = [];
        //нужен handler для отслеживания текущего!!!
    }
    createCompetition(Title, Date){
        this.competition = {Title, Date};
        // { ...this, competition: {Title,Date} } было бы в Redux
        this.emitChange();
    }
    setActiveTournir(ActiveTournir){
        this.activeTournir = ActiveTournir;
        this.emitChange();
    }
    addTournir(AgeMin,AgeMax,QiuMin, QiuMax){
        this.tournirs.push({
            id: this.itTournir++,
            ageRange: {min:AgeMin,max:AgeMax},
            qiuRange: {min:QiuMin,max:QiuMax},
            tours: [
                {
                    id:1,
                    groups:[]
                }],
            competitors: [],
        });
        this.emitChange();
    }
    addCompetitor(Name, Surname, Patronomics, Qiu, Age){
        if (this.tournirs.length > 0){
            var Competitor = {
                name: Name,
                surname: Surname,
                patronomics: Patronomics,
                qiu: Qiu,
                age: Age,
            };
            this.tournirs.forEach(tournament => {
                if (tournament.ageRange.min <= Age &&
                    tournament.ageRange.max > Age &&
                    tournament.qiuRange.min <= Qiu &&
                    tournament.qiuRange.max > Qiu) {
                    tournament.competitors.push(Competitor);
                    if (tournament.competitors.length%2===1)
                    {
                        tournament.tours.groups.push({first:'Someone', second:'Someone'})
                    }
                }
            })
        }
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
    /*
    addCompetitor(Name,Surname,Patronymic, Age, Qiu) {
        this.competitors.push();}*/

}


export default Store;