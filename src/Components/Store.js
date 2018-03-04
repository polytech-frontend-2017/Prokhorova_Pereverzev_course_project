export class Store {
  addListener(handler) {
    this._handlers.push(handler);
  }
  emitChange() {
    this._handlers.forEach(fn => fn());
  }
  constructor() {
    this.competition = { title: 'Some title 1', date: null };
    this.itTournir = 1;
    this.idCompetitor = 0;
    this.storeVersion = 0;
    this._handlers = [];
    this.tournirs = [
      {
        id: this.itTournir++,
        ageRange: { min: 5, max: 100 },
        qiuRange: { min: 10, max: 6 },
        massRange: { min: 10, max: 60 },
        groups: [],
        competitors: [],
        fixed: false
      },
      {
        id: this.itTournir++,
        ageRange: { min: 10, max: 100 },
        qiuRange: { min: 6, max: 1 },
        massRange: { min: 10, max: 90 },
        groups: [],
        competitors: [],
        fixed: false
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
        id: this.idCompetitor++,
        tournirsId: [1]
      },
      {
        name: 'Vadim',
        surname: 'Pack',
        patronomics: 'Gennadievich',
        qiu: 2,
        age: 38,
        mass: 80,
        id: this.idCompetitor++,
        tournirsId: [2]
      },
      {
        name: 'Genadiy',
        surname: 'Pack',
        patronomics: 'Vadimovich',
        qiu: 10,
        age: 68,
        mass: 88,
        id: this.idCompetitor++,
        tournirsId: [1]
      },
      {
        name: 'Vitaliy',
        surname: 'Turalchuk',
        patronomics: 'Aleksandrovich',
        qiu: 10,
        age: 23,
        mass: 70,
        id: this.idCompetitor++,
        tournirsId: [1]
      },
      {
        name: 'Elena',
        surname: 'Lischina',
        patronomics: 'Aleksandrovna',
        qiu: 6,
        age: 23,
        mass: 55,
        id: this.idCompetitor++,
        tournirsId: [2]
      }
    ];
    this.createCompetition = this.createCompetition.bind(this);
    this.addTournir = this.addTournir.bind(this);
    this.fixedTournir = this.fixedTournir.bind(this);
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
    this.emitChange();
  }
  fixedTournir(idTournir) {
    let activeTournir = this.tournirs.find(t => t.id === idTournir);
    activeTournir.fixed = !activeTournir.fixed;
  }
  addTournir(AgeMin, AgeMax, QiuMin, QiuMax, MassMin, MassMax) {
    this.tournirs.push({
      id: this.itTournir++,
      ageRange: { min: AgeMin, max: AgeMax },
      qiuRange: { min: QiuMin, max: QiuMax },
      massRange: { min: MassMin, max: MassMax },
      groups: [],
      competitors: [],
      fixed: false
    });
    this.competitors.map(competitor => {
      if (
        competitor.qiu <= QiuMin &&
        competitor.qiu > QiuMax &&
        competitor.age >= AgeMin &&
        competitor.age < AgeMax
      )
        competitor.tournirsId.push(this.itTournir - 1);
      return true;
    });

    console.log(this.tournirs);
    this.emitChange();
  }
  destroyTournir(id) {
    const index = this.tournirs.findIndex(tournir => tournir.id === id);
    this.tournirs.splice(index, 1);
    this.emitChange();
  }
  addCompetitor(Name, Surname, Patronomics, Qiu, Age, Mass) {
    let Competitor = {
      name: Name,
      surname: Surname,
      patronomics: Patronomics,
      qiu: Number(Qiu),
      age: Number(Age),
      mass: Number(Mass),
      id: this.idCompetitor++,
      tournirsId: []
    };
    this.tournirs.map(tournir => {
      console.log(tournir.id + ' проверился!');
      if (
        Competitor.qiu <= tournir.qiuRange.min &&
        Competitor.qiu > tournir.qiuRange.max &&
        Competitor.age >= tournir.ageRange.min &&
        Competitor.age < tournir.ageRange.max
      )
        Competitor.tournirsId.push(tournir.id);
    });
    console.log(Competitor);

    this.competitors.push(Competitor);
    this.emitChange();
  }
  destroyCompetitor(id) {
    this.competitors.splice(id, 1);
    this.emitChange();
  }
  addGroup(pair, idTournir) {
    let activeTournir_ = this.tournirs.find(t => t.id === idTournir);
    activeTournir_.groups.push(pair);
    this.emitChange();
  }
  destroyGroup(idPair, idTournir) {
    let activeTournir_ = this.tournirs.find(t => t.id === idTournir);
    activeTournir_.groups = activeTournir_.groups.filter(
      pair => pair.id !== idPair
    );
    this.emitChange();
  }
  destroyAllGroups(idTournir) {
    this.tournirs.find(t => t.id === idTournir).groups = [];
    this.emitChange();
  }
  addScore(idPair, manId, idTournir, score) {
    const Pairs = this.tournirs.find(t => t.id === idTournir).groups;
    const pair = Pairs.find(p => p.id === idPair);
    if (pair) {
      if (manId === 1) pair.win1 = score;
      else pair.win2 += score;
      this.emitChange();
    }
  }
  destroyScore(idPair, idTournir) {
    const Pairs = this.tournirs.find(t => t.id === idTournir).groups;
    const pair = Pairs.find(p => p.id === idPair);
    if (pair) {
      pair.win1 = 0;
      pair.win2 = 0;
      this.emitChange();
    }
  }
}

export default Store;
