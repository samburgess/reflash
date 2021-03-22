import React from 'react';
import Card from './components/Card.js'
import MyDeck from './components/MyDeck'
import axios from 'axios'

export default class ReFlash extends React.Component{

    constructor(props){
        super(props)
        this.state = {

            cards: this.props.data[1],  //user cards
            tempWord: "",
            tempDef: "",
            activeCards : [],
            permaDone: false
        }

        this.user = this.props.data[0] //username

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

        this.SERVER_ADDR=this.props.SERVER_ADDR
    }

    componentDidMount(){

        //this.testCards()

        //bin : time out in seconds

        this.myInterval = setInterval(() => {

            if(this.state.activeCards.length === 0){
                this.genActiveCards()
                //check if permadone
                let i;
                for(i=0; i < this.state.cards.length; i++){
                    if(this.state.cards[i][2] < 11){
                        this.setState({permaDone:true})
                        break
                    }
                }
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
        //check if word already in cards
        let i;
        for(i=0; i < this.state.cards.length; i++){
            if( this.state.cards[i][0] === this.state.tempWord){
                alert("Word already in deck")
                return;
            }
        }

        newMap.push([this.state.tempWord, this.state.tempDef, 0, 0, 0, newMap.length])

        this.setState({cards:newMap}, () =>{
            this.postNewCards()
        })

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
        //ascending order 1-10 (bin 11 never goes in active deck, 0 always goes on end)
        for(i=1; i<11; i++){
            for(j=0; j<activeCards.length; j++){
                if(activeCards[j][2] === i){
                    sortedActive.push(activeCards[j])
                }
            }
        }
        //append 0 bucket to end
        for(j=0; j<activeCards.length; j++){
            if(activeCards[j][2] === 0){
                sortedActive.push(activeCards[j])
            }
        }

        this.setState({activeCards:sortedActive}, () =>{
            this.postNewCards()
        })
    }

    setCardBin = (i, n, timeAns=-1, isWrong=false) => {

        let newCards = this.state.cards
        newCards[i][2] = n //set bucket
        if(timeAns>0){
            newCards[i][3] = timeAns
        }
        if(isWrong){
            newCards[i][4] += 1
            if (newCards[i][4] > 9){    //hard to remember
                newCards[i][2] = 11
            }
        }
        this.setState({cards:newCards})
        this.genActiveCards()


    }

    postNewCards = () =>{
        let payload = JSON.stringify(['new cards', this.user, this.state.cards])

        axios.post(this.SERVER_ADDR,  payload)
            .then(res => {
                //console.log(res);
            }).catch(e => {
                console.log("ERROR**   ", e)
        })

    }

    render(){

        return(

            <div className='reFlash'>
                <form className="cardAdd">
                    <h2>Add a card</h2>
                    <input placeholder="word" onChange={e => this.setState({tempWord:e.target.value})} />
                    <input placeholder="definition" onChange={e => this.setState({tempDef:e.target.value})}/>
                    <input type="submit" onClick ={e => this.addCard(e)}/>
                </form>
                <div className="activeCard">
                    {this.state.activeCards.length > 0 ?
                        <Card
                            word={this.state.activeCards[0][0]}
                            def={this.state.activeCards[0][1]}
                            bin={this.state.activeCards[0][2]}
                            i={this.state.activeCards[0][5]}
                            setBin={this.setCardBin}/> :
                        this.state.permaDone ?
                            <p>You are temporarily done; please come back later to review more words.</p> : 
                            <p>you have no more words to review; you are permanently done!</p>
                    }
                </div>

                <MyDeck className="deck" cards={this.state.cards} timeOuts={this.timeOuts}/>
            </div>
        )

    }





}