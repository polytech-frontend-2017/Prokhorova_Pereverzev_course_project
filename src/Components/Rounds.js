import React,{ Component } from 'react';
import connectDecorator from "../context/connectDecorator";
import './Rounds.css';
import Graph from './Graph';



class Rounds extends Component {
    constructor(props) {
        super(props);
        this.currentSets=this.currentSets.bind(this);
        this.filterCompetitors=this.filterCompetitors.bind(this);
        this.countDeepLevelTree=this.countDeepLevelTree.bind(this);
        this.state={
            currentTournirId:this.props.tournirs[0].id,
            currentCompetitors:this.filterCompetitors(this.props.tournirs[0]),
        };
        if (this.state.currentCompetitors.length!==0)
            this.levels = Math.ceil(Math.log2(Math.ceil(this.state.currentCompetitors.length/2)));
        else
            this.levels =0;
    }
    countDeepLevelTree(currentCompetitors){
        if (currentCompetitors.length!==0)
            this.levels = Math.ceil(Math.log2(Math.ceil(currentCompetitors.length/2)));
    }
    currentSets(event){
        let currentTournir = this.props.tournirs.find(tournir=> tournir.id === Number(event.target.value));
        let currCompetitors=this.filterCompetitors(currentTournir);
        this.countDeepLevelTree(currCompetitors);
        this.setState({
            currentCompetitors:currCompetitors,
            currentTournirId:currentTournir.id,
        });
    }
    filterCompetitors(currentTournir){
        return this.props.competitors.filter(competitor=>
            competitor.qiu<=currentTournir.qiuRange.min &&
            competitor.qiu>currentTournir.qiuRange.max &&
            competitor.age>=currentTournir.ageRange.min &&
            competitor.age<currentTournir.ageRange.max
        );
    }
    componentWillMount(){
        /*let arr=this.filterCompetitors(this.props.tournirs[0]);
        this.setState({
            currentCompetitors:arr,
        });*/
    }
    componentWillUpdate(){}

    render(){
        let widthGraph = this.levels*300,
            heightGraph =  2**this.levels * 150;
        return(
            <div className={'rounds-main'}>
                <div className={'container-rounds-list'}>
                    <select className={'container-rounds'} onChange={this.currentSets}
                            value={this.state.currentTournirId}>
                        {this.props.tournirs.map((tournir,i)=>
                            <option key={i} value={tournir.id}>
                                {tournir.id+1+'. Кю: '+tournir.qiuRange.min+'-'+tournir.qiuRange.max+
                                '; Возраст: '+tournir.ageRange.min+'-'+tournir.ageRange.max}
                                </option>
                        )}
                    </select>
                    <div>
                        {this.state.currentCompetitors.map((competitor,i)=>
                            <div className={'list-competitor'} key={i}>
                                <span>
                                    {i+1+'. '+competitor.name+' '+competitor.surname}
                                </span><br/>
                            </div>
                        )}
                    </div>
                    <button onClick={this.createPairs}>Начать соревнование</button>
                </div>
                <div ref={ref => this.ref = ref} className={'Graph'}>

                    <svg width={widthGraph+300} height={heightGraph+100}>
                        {<Graph
                            currentCompetitors = {this.state.currentCompetitors}
                            x={0}
                            y={0}
                            width={widthGraph}
                            height={heightGraph}
                            axisMargin={200}
                            deepLevel={this.levels}
                        />}
                    </svg>
                </div>
            </div>
        )
    }

    componentDidMount(){
        /*enter()*/
    }
    componentDidUpdate(prevProps, prevState){
        /*update()*/
    }

}

export default connectDecorator(Rounds,
    ['addTournir','destroyTournir'],
    store => ({
        tournirs: store.tournirs,
        competitors: store.competitors,

    })
);