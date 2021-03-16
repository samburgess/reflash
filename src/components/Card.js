import React from 'react';
import '../App.css'

export default class Card extends React.Component{

    constructor(props){

        super(props)

        this.state = {

            flipped : false,
            bin : parseInt(props.bin),
            lastWrong: parseInt(props.wrong)
        }

    }


    flip = () =>{
        this.setState({flipped: this.state.flipped ? false : true})
    }

    gotIt = () =>{
        this.setState({flipped:false})
        this.props.setBin(this.props.i, Math.min(this.props.bin + 1, 11), Date.now())
    }

    notIt = () => {
        this.setState({flipped:false})
        this.props.setBin(this.props.i, 1, Date.now())
    }


    render(){

        return(

            <div className='CardOuter'>
                <h3>{this.state.flipped ? this.props.def : this.props.word}</h3>
                <div>
                    {this.state.flipped ? <div>
                        <button onClick={this.gotIt}>I got it</button>
                        <button onClick={this.notIt}>I did not get it</button>
                    </div>:""}
                </div>
                <button onClick = {this.flip}>Flip Card</button>
            </div>
        )
    }

}