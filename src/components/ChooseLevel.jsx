import React from 'react';
import _ from 'lodash';

export default (props) => {
  const translation = {
    easy: 'łatwy',
    medium: 'średni',
    hard: 'trudny',
  }
  const listOfLevels = props.levels.map((level, i) =>
      <div className="col-sm-4 text-center" key={i}>
        <button className="btn btn-info btn-lg" onClick={() => props.getWord(level)}>
          {_.capitalize(translation[level])}
        </button>
      </div>
  );
  return (
    <div className="row text-center">
      <h3>Wybierz poziom</h3>
      <br/><br/>
      {listOfLevels}
    </div>
  );
};
