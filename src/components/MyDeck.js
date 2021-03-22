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

    componentDidMount(){
        console.log("render")
    }

    componentWillUnmount() {
        // fix Warning: Can't perform a React state update on an unmounted component
        this.setState = (state,callback)=>{
            return;
        };
    }

    toggle = () => {
        this.setState({open: !this.state.open})
    }

    render(){

        let cardList = <ul></ul>

        let i = -1
        cardList = this.props.cards.map( (el) => 
            <ListCard
                key={el[0]}
                word={el[0]}
                def={el[1]}
                bin={el[2]}
                seen={el[3]}
                wrongs={el[4]}
                i={i+=1}
                timeOut={this.props.timeOuts[el[2]]}
            />
        )

        return(

            <div className='deck' key={this.props.cards}>
                <h1 onClick = {e => this.toggle(e)}> See My Cards \/</h1>
                {this.state.open ? cardList : null}
            </div>

        )
    }

}