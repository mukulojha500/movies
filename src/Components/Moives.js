import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'
import data from './Content.js';
import './Movies.css';

function Movies(props) {
  const [recommendations, setRecommendations] = useState([]);
  const [details, setDetails] = useState([]);
  const [info, setInfo] = useState([]);
  const [loader, setLoader] = useState(false);

  const fetchMovie = async (myMovie) => {
    myMovie = myMovie.toLowerCase();
    let getMov = "";
    for (let i of data) {
      var str = i.title;
      if (typeof str === "string") {
        str = str.toLowerCase();
        if (str === myMovie) {
          getMov = i.title;
          break;
        }
      }
    }
    if (getMov === "") {
      alert("No movie found");
      return
    }
    try {
      const requestBody = {
        movie: getMov,
      };
      const response = await fetch('https://movierecommendation-cvzy.onrender.com/movie_recommendation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const responseData = await response.json();
      const recommendationsArray = Object.values(responseData);
      const array = Object.values(recommendationsArray[0]);
      setRecommendations(array);
    } catch (err) {
      console.log(err);
    }
  };

  const [selectedMovie, setSelectedMovie] = useState('');

  const change = (e) => {
    const selectedValue = e.target.value;
    setSelectedMovie(selectedValue);
  };

  useEffect(() => {
    const populateDetails = async () => {
      const updatedDetails = await data.filter((item) => recommendations.includes(item.title));
      setDetails(updatedDetails);
    };

    populateDetails();
  }, [recommendations]);

  useEffect(() => {
    const populateInfo = async () => {
      setLoader(true);
      try {
        let loadedInfo = [];
        for (var items of details) {
          const data = await fetch(`https://api.themoviedb.org/3/movie/${items.movie_id}?language=en-US`, {
            method: 'GET',
            headers: {
              accept: 'application/json',
              Authorization: `Bearer ${props.apiKey}`
            }
          });
          const d = await data.json();
          loadedInfo.push(d);
          if (loadedInfo.length === 5) {
            setInfo(loadedInfo);
            break;
          }
        }
      } catch (err) {
        console.log(err);
      }
      setLoader(false);
    };
    if (details.length >= 5) {
      populateInfo();
    }
  }, [details, info]);

  return (
    <div className='dropdown container'>
      <div className="input-group mb-3">
        <input type="text" className="form-control" value={selectedMovie} placeholder='Type or Select a movie' onChange={change} aria-label="Recipient's username" aria-describedby="button-addon2" />
        <button className="btn btn-outline-secondary" type="button" id="button-addon2" onClick={() => fetchMovie(selectedMovie)}>Get Recommendations</button>
      </div>
      <button className="btn btn-secondary dropdown-toggle button" type="button" data-bs-toggle="dropdown" aria-expanded="false">
        Select Movie
      </button>
      <ul className="dropdown-menu dropdown-menu-dark">
        {data.map((element, index) => (
          <li className="dropdown-item" key={index} onClick={() => change({ target: { value: element.title } })}>{element.title}</li>
        ))}
      </ul>
      <div id='recommendations'>
        {info.length > 0 ? (
          info.map((element, index) => (
            <div className="card grid" style={{ width: "18rem", height: "43rem", margin:"1rem" }} key={index}>
              <div className='g-col-6 g-col-md-4'>
                <img src={`https://image.tmdb.org/t/p/w500${element.poster_path}`} className="card-img-top" alt="..." />
                <div className="card-body">
                  <h5 className="card-title">{element.title}</h5>
                  <p className="card-text">
                    {element.overview.split(' ').slice(0, 25).join(' ')}
                    {element.overview.split(' ').length > 25 && '...'}
                  </p>
                  <Link to={element.homepage} target='_blank' className="btn btn-primary">Go to homepage</Link>
                </div>
              </div>
            </div>
          ))
        ) : (<div className={`loader ${loader ? 'spinner-border' : ''}`} role="status">
          <span className="visually-hidden">Loading...</span>
        </div>)
        }
      </div>
    </div>
  );
}

export default Movies;
