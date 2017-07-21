import React from 'react';
// import _ from 'lodash';

export default (props) => {
  return (
    <div className="row">
      <div className="col-sm-6">

        <div className="text-center h2" style={{letterSpacing: 20}}>
          {[...props.word].map(letter => props.guessedChars.indexOf(letter) > -1? letter : '_')}
        </div>
        <br /> <br />
        <form onSubmit={e => props.handleSubmit(e)}>
          <label>Wprowadź literę
            <input style={{ margin: '5px' }}
                   type="text"
                   value={props.currentChar}
                   pattern="[A-Za-ząćęłńóśżź]{1}"
                   maxLength={1}
                   onChange={e => props.handleChange(e)} autoFocus={true}
                   disabled={props.gameStatus}/>
          </label>
          <button className="btn btn-info"
                  disabled={props.gameStatus}>
            Sprawdź
          </button>
        </form>
      </div>
      <div className="col-sm-6">
        <div>
          <p>Nieudane próby: { props.numberOfUserTries } </p>
          <p>Pozostało prób: { props.triesLeft } </p>
          <p>Użyte znaki: { props.missedChars.join(', ') } </p>
        </div>
      </div>
    </div>
  );
};
