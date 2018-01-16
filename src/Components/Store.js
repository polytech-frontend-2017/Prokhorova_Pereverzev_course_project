export class Store {
  //private itTournir = 0;
  addListener(handler) {
    this._handlers.push(handler);
  }
  emitChange() {
    this._handlers.forEach(fn => fn());
  }
  constructor() {
    this.competition = { title: 'Some title 1', date: null };
    this.itTournir = 0; //итератор для id турнира (private)
    this.idCompetitor = 0; //итератор для id соревнующегося (private)
    this.activeTournir = null;
    this._handlers = [];
    this.tournirs = [
      {
        id: this.itTournir++,
        ageRange: { min: 5, max: 100 },
        qiuRange: { min: 10, max: 6 },
        massRange: { min: 10, max: 60 },
        groups: [],
        competitors: []
      },
      {
        id: this.itTournir++,
        ageRange: { min: 10, max: 100 },
        qiuRange: { min: 6, max: 1 },
        massRange: { min: 10, max: 90 },
        groups: [],
        competitors: []
      }
    ];
    this.competitors = [
      {
        name: 'Max',
        surname: 'Perevrezev',
        patronomics: 'Evgenievna',
        qiu: 10,
        age: 21,
        mass: 100,
        id: this.idCompetitor++
      },
      {
        name: 'Vadim',
        surname: 'Pack',
        patronomics: 'Gennadievich',
        qiu: 2,
        age: 38,
        mass: 80,
        id: this.idCompetitor++
      },
      {
        name: 'Genadiy',
        surname: 'Pack',
        patronomics: 'Vadimovich',
        qiu: 10,
        age: 68,
        mass: 88,
        id: this.idCompetitor++
      },
      {
        name: 'Vitaliy',
        surname: 'Turalchuk',
        patronomics: 'Aleksandrovich',
        qiu: 10,
        age: 23,
        mass: 70,
        id: this.idCompetitor++
      },
      {
        name: 'Elena',
        surname: 'Lischina',
        patronomics: 'Aleksandrovna',
        qiu: 6,
        age: 23,
        mass: 55,
        id: this.idCompetitor++
      }
    ];
    this.createCompetition = this.createCompetition.bind(this);
    this.setActiveTournir = this.setActiveTournir.bind(this);
    this.addTournir = this.addTournir.bind(this);
    this.destroyTournir = this.destroyTournir.bind(this);
    this.addCompetitor = this.addCompetitor.bind(this);
    this.destroyCompetitor = this.destroyCompetitor.bind(this);
    this.addGroup = this.addGroup.bind(this);
    this.destroyGroup = this.destroyGroup.bind(this);
    this.destroyAllGroups = this.destroyAllGroups.bind(this);
    this.addListener = this.addListener.bind(this);
    this.emitChange = this.emitChange.bind(this);
    this.addScore = this.addScore.bind(this);
    this.destroyScore = this.destroyScore.bind(this);
  }
  createCompetition(Title, Date) {
    this.competition = { title: Title, date: Date };
    // { ...this, competition: {Title,Date} } было бы в Redux
    this.emitChange();
  }
  setActiveTournir(ActiveTournir) {
    this.activeTournir = ActiveTournir;
    //this.emitChange();
  }
  addTournir(AgeMin, AgeMax, QiuMin, QiuMax, MassMin, MassMax) {
    this.tournirs.push({
      id: this.itTournir++,
      ageRange: { min: AgeMin, max: AgeMax },
      qiuRange: { min: QiuMin, max: QiuMax },
      massRange: { min: MassMin, max: MassMax },
      groups: [],
      competitors: []
    });
    console.dir(this.tournirs);
    this.emitChange();
  }
  destroyTournir(id) {
    this.tournirs.splice(id, 1);
    this.emitChange();
  }
  addCompetitor(Name, Surname, Patronomics, Qiu, Age, Mass) {
    let Competitor = {
      name: Name,
      surname: Surname,
      patronomics: Patronomics,
      qiu: Qiu,
      age: Age,
      mass: Mass,
      id: this.idCompetitor++
    };
    this.competitors.push(Competitor);
    this.emitChange();
  }
  destroyCompetitor(id) {
    this.competitors.splice(id, 1);
    this.emitChange();
  }
  addGroup(pair) {
    let activeTournir_ = this.tournirs.find(
      t => t.id === this.activeTournir.id
    );
    activeTournir_.groups.push(pair);
    this.emitChange();
  }
  destroyGroup(id) {
    let activeTournir_ = this.tournirs.find(
      t => t.id === this.activeTournir.id
    );
    activeTournir_.groups = activeTournir_.groups.filter(
      pair => pair.id !== id
    );
    this.emitChange();
  }
  destroyAllGroups() {
    this.tournirs.find(t => t.id === this.activeTournir.id).groups = [];
    this.emitChange();
  }
  addScore(id, man) {
    const Pairs = this.tournirs.find(t => t.id === this.activeTournir.id)
      .groups;
    const pair = Pairs.find(p => p.id === id);
    if (man === 1) pair.win1 += 1;
    else pair.win2 += 1;
    this.emitChange();
  }
  destroyScore(id) {
    const Pairs = this.tournirs.find(t => t.id === this.activeTournir.id)
      .groups;
    const pair = Pairs.find(p => p.id === id);
    pair.win1 = 0;
    pair.win2 = 0;
    this.emitChange();
  }
}

export default Store;
