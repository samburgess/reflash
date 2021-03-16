import React from "react";
import ListCard from './ListCard'


//scrollable component with all a users cards
export default class MyDeck extends React.Component{


    //cards data structure will be passed through props
    constructor(props){
        super(props)
        this.state = {
            open: false
        }
    }

    toggle = () => {
        this.setState({open: !this.state.open})
    }

    render(){

        let cardList = <ul></ul>

        let i = -1
        cardList = this.props.cards.map( (el) => 
            <ListCard key={el[0]} word={el[0]} def={el[1]} bin={el[2]} wrongs={el[3]} i={i+=1}/>
        )

        return(

            <div className='deck'>
                <h1 onClick = {e => this.toggle(e)}> See My Cards \/</h1>
                {this.state.open ? cardList : null}
            </div>

        )
    }

}