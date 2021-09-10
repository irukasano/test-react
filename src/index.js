// https://ja.reactjs.org/tutorial/tutorial.html#detecting-changes
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props){
  return (
    <button
      className={`square ${props.highlight ? 'highlight' : ''}`}
      onClick={props.onClick}
    >
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    let highlight = this.props.highlightIndex === i ;
    return <Square
      value={this.props.squares[i]}
      highlight={highlight}
      onClick={() => this.props.onClick(i)}
    />;
  }

  render() {
    const numbers = 3;

    const items = [];
    for ( let i = 0 ; i < numbers ; i++ ){
      const list = [];
      for ( let ii = 0 ; ii < numbers ; ii++ ){
        const index = i * numbers + ii;
        list.push(<span>{this.renderSquare(index)}</span>);
      }
      items.push(
        <div className="board-row">
          {list}
        </div>
      );
    }

    return (
      <div>
        {items}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      history : [{
        squares: Array(9).fill(null),
        currentIndex: null,
        stepNumber : 0,
      }],
      stepNumber : 0,
      orderAsc : true,
      xIsNext : true,
    };
  }

  handleClick(i){
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length -1];
    const squares = current.squares.slice();
    if ( calcarateWinner(squares) || squares[i]){
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history : history.concat([{
        squares: squares,
        currentIndex: i,
        stepNumber : history.length,
      }]),
      stepNumber : history.length,
      xIsNext : !this.state.xIsNext,
    });
  }

  jumpTo(step){
    this.setState({
      stepNumber : step,
      xIsNext : ( step % 2 ) === 0,
    });
  }

  orderHistory(){
    this.setState({
      stepNumber : this.state.history.length -1,
      orderAsc : !this.state.orderAsc,
    });
  }

  render() {
    let history = this.state.history.slice();
    const current = history[this.state.stepNumber];
    const winner = calcarateWinner(current.squares);

    const sortLabel = this.state.orderAsc ? 'ASC' : 'DESC';
    if (! this.state.orderAsc ){
      history = history.sort((a, b) => {
        return (a.stepNumber > b.stepNumber) ? -1 : 1;
      });
    }
    const order = <div><button onClick={() => this.orderHistory()}>SORT {sortLabel}</button></div>

    const moves = history.map((step) => {
      const stepNumber = step.stepNumber;
      const row = Math.ceil(step.currentIndex / 3);
      const col = (step.currentIndex % 3) + 1;
      const desc = stepNumber ?
        'Go to move row=' + row + '/col=' + col :
        'Go to game start';
      if ( this.state.stepNumber === stepNumber ){
        return (
          <li key={stepNumber}>
            <button onClick={() => this.jumpTo(stepNumber)}><strong>{desc}</strong></button>
          </li>
        );
      } else {
        return (
          <li key={stepNumber}>
            <button onClick={() => this.jumpTo(stepNumber)}>{desc}</button>
          </li>
        );
      }
    });

    let status;
    let lastIndex = null;
    if ( winner ){
      status = 'Winner: ' + winner;
      lastIndex = this.state.history[this.state.history.length-1].currentIndex;
    } else {
      if ( history.length < 9 ){
        status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
      } else {
        status = 'Draw ..';
      }
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            highlightIndex={lastIndex}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{ status }</div>
          <div>{ order }</div>
          <ol>{ moves }</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function calcarateWinner(squares){
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for ( let i = 0 ; i < lines.length ; i++ ){
    const [a, b, c] = lines[i];
    if ( squares[a] && squares[a] === squares[b] && squares[a] === squares[c])
    {
      return squares[a];
    }
  }
  return null;
}

