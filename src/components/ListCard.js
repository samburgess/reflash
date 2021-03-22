import React from 'react';

export default class Card extends React.Component{

    constructor(props){

        super(props)

        this.state = {

            flipped : false,
            bin : parseInt(props.bin),
            lastSeen: props.seen,
            i:props.i,
            nextApp:null
        }

    }

    componentDidMount(){
        this.myInterval = setInterval(() => {

            this.setState({nextApp: Math.max(0, this.props.timeOut - Math.floor((Date.now() - this.state.lastSeen) / 1000))})
            
        }, 1000)
    }

    componentWillUnmount() {
        // fix Warning: Can't perform a React state update on an unmounted component
        this.setState = (state,callback)=>{
            return;
        };
    }


    flip = () =>{
        this.setState({flipped: this.state.flipped ? false : true})
    }


    render(){

        return(

            <div className='deckCard'>
                <p>{this.state.flipped ? this.props.def : this.props.word}</p>
                <p>bin: {this.state.bin}</p>
                <p>Time to next appearance: {this.state.nextApp} Seconds</p>
                <p>Number of times answered incorrectly: {this.props.wrongs}</p>
                <button onClick = {this.flip}>Flip Card</button>
            </div>
        )
    }
 
}