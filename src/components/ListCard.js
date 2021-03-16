import React from 'react';

export default class Card extends React.Component{

    constructor(props){

        super(props)

        this.state = {

            flipped : false,
            bin : parseInt(props.bin),
            lastWrong: props.wrong,
            i:props.i
        }

    }


    flip = () =>{
        this.setState({flipped: this.state.flipped ? false : true})
    }


    render(){

        console.log()

        return(

            <div className='deckCard'>
                <p>{this.state.flipped ? this.props.def : this.props.word}</p>
                <p>bin: {this.state.bin}</p>
                <p>Time to next appearance: {(Date.now() - this.state.lastWrong) / 1000} Seconds</p>
                <button onClick = {this.flip}>Flip Card</button>
            </div>
        )
    }
 
}