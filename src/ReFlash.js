import React from 'react';
import Card from './components/Card.js'
import MyDeck from './components/MyDeck'

export default class ReFlash extends React.Component{

    constructor(props){
        super(props)
        this.state = {

            user: "",
            cards: this.props.data[1],
            tempWord: "",
            tempDef: "",
            activeCards : []
        }
        this.timeOuts = new Map()
        this.timeOuts[0] = 0
        this.timeOuts[1] = 5
        this.timeOuts[2] = 25
        this.timeOuts[3] = 120
        this.timeOuts[4] = 600  //10 min
        this.timeOuts[5] = 3600 //1 HR
        this.timeOuts[6] = 18000 //5hr
        this.timeOuts[7] = 86400 //day
        this.timeOuts[8] = 432000 //5 days
        this.timeOuts[9] = 2160000 //25 days
        this.timeOuts[10] = 1.051e+7 //4 months
        this.timeOuts[11] = Infinity

    }

    componentDidMount(){

        //this.testCards()

        //bin : time out in seconds

        this.myInterval = setInterval(() => {

            if(this.state.activeCards.length === 0){
                this.genActiveCards()
            }
            
        }, 1000)

        let i
        let activeCards = []
        for(i=0; i < this.state.cards.length; i++){
            if (Math.floor((Date.now() - this.state.cards[i][3])/1000) > this.timeOuts[this.state.cards[i][2]]){
                activeCards.push(this.state.cards[i])
            }
        }
        this.setState({activeCards:activeCards})
    }

    componentWillUnmount() {
        // fix Warning: Can't perform a React state update on an unmounted component
        this.setState = (state,callback)=>{
            return;
        };
    }

    addCard = (e) => {
     
        e.preventDefault()
        let newMap = this.state.cards
        newMap.push([this.state.tempWord, this.state.tempDef, 0, 0])
        this.setState({cards:newMap})

    }

    genActiveCards = () => {

        //  if (current time - last wrong timestamp) > bin timeout:
        //add to current cards
        let i
        let activeCards = []
        for(i=0; i < this.state.cards.length; i++){
            if (Math.floor((Date.now() - this.state.cards[i][3])/1000) > this.timeOuts[this.state.cards[i][2]]){
                activeCards.push(this.state.cards[i])
            }
        }

        //sort by bucket
        //bucket sort - O(n) * 12 -> O(n)
        let sortedActive = []
        i = 0
        let j = 0
        for(i=0; i<12; i++){
            for(j=0; j<activeCards.length; j++){
                if(activeCards[j][2] == i){
                    sortedActive.push(activeCards[j])
                }
            }
        }

        this.setState({activeCards:sortedActive})
    }

    testCards = () => {

        //card schema: [word, definition, bin, date of last wrong]

        let newMap = this.state.cards
        newMap.push(['sam', 'a pretty cool guy', 0, 0])
        newMap.push(['car', 'four wheeled vehicle', 0, 0])
        newMap.push(['bike', 'two wheeled vehicle', 0, 0])
        newMap.push(['javascript', 'web based shenanigans', 0, 0])
        newMap.push(['python', 'fancy psuedocode', 0, 0])
        newMap.push(['sun', 'fire in the sky', 0, 0])

        this.setState({cards:newMap})
    }

    setCardBin = (i, n, wrong=-1) => {

        let newCards = this.state.cards
        newCards[i][2] = n //set bucket
        if(wrong>0){
            newCards[i][3] = wrong
        }
        this.setState({cards:newCards})
        this.genActiveCards()

    }

    render(){

        return(

            <div className='reFlash'>
                <h1>ReFlash: Spatial Memory Training</h1>
                <form>
                    <h2>Add a card</h2>
                    <input placeholder="word" onChange={e => this.setState({tempWord:e.target.value})} />
                    <input placeholder="definition" onChange={e => this.setState({tempDef:e.target.value})}/>
                    <input type="submit" onClick ={e => this.addCard(e)}/>
                </form>
                {this.state.activeCards.length > 0 ?
                    <Card
                        word={this.state.activeCards[0][0]}
                        def={this.state.activeCards[0][1]}
                        bin={this.state.activeCards[0][2]}
                        wrongs={this.state.activeCards[0][3]} 
                        i={this.state.activeCards[0][4]}
                        setBin={this.setCardBin}/> :
                 <p>No Active Cards</p>}

                <MyDeck cards={this.state.cards} setBin={this.setCardBin} timeOuts={this.timeOuts}/>
            </div>
        )

    }





}