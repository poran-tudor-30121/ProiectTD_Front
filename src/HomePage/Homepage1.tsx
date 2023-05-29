import React, { useState, useEffect } from 'react';
import { TextField, Autocomplete, Box, Button } from '@mui/material';
import axios from 'axios';

interface Movie {
    title: string;
    director: string;
    genre: string;
    overview: string;
    rating: number;
}

interface Rating {
    movie: Movie;
    rating: number;
}

function HomePage() {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
    const [searchText, setSearchText] = useState('');
    const [selectedFilter, setSelectedFilter] = useState('title');
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
    const [rating, setRating] = useState('');
    const [ratings, setRatings] = useState<Rating[]>([]);
    const [loggedInUserUsername, setLoggedInUserUsername] = useState('');
    const [showUserRatings, setShowUserRatings] = useState(false);

    useEffect(() => {
        fetchMovies();
    }, []);

    useEffect(() => {
        filterMovies();
    }, [searchText]);

    useEffect(() => {
        const username = localStorage.getItem('your_user_username');
        if (username) {
            setLoggedInUserUsername(username);
            fetchUserRatings(username);
        }
    }, []);

    const fetchUserRatings = (username: string) => {
        const userUserDTO = { username: username };
        axios
            .post('/ProjectMovies/userRatings', userUserDTO)
            .then((response) => {
                setRatings(response.data);
            })
            .catch((error) => {
                console.error('Failed to fetch user ratings:', error);
            });
    };

    async function fetchMovies() {
        try {
            let response;
            if (selectedFilter === 'title') {
                response = await axios.post<Movie[]>('http://localhost:8080/ProjectMovies/moviesByTitle', {
                    title: searchText,
                });
            } else if (selectedFilter === 'director') {
                response = await axios.post<Movie[]>('http://localhost:8080/ProjectMovies/moviesByDirector', {
                    director: searchText,
                });
            } else if (selectedFilter === 'genre') {
                response = await axios.post<Movie[]>('http://localhost:8080/ProjectMovies/moviesByGenre', {
                    genre: searchText,
                });
            } else {
                response = await axios.post<Movie[]>('http://localhost:8080/ProjectMovies/movies');
            }
            setMovies(response.data);
        } catch (error) {
            console.error(error);
        }
    }

    function filterMovies() {
        let filteredResults: Movie[] = [];
        if (searchText) {
            if (selectedFilter === 'title') {
                filteredResults = movies.filter((movie) =>
                    movie.title.toLowerCase().includes(searchText.toLowerCase())
                );
            } else if (selectedFilter === 'director') {
                filteredResults = movies.filter((movie) =>
                    movie.director.toLowerCase().includes(searchText.toLowerCase())
                );
            } else if (selectedFilter === 'genre') {
                filteredResults = movies.filter((movie) =>
                    movie.genre.toLowerCase().includes(searchText.toLowerCase())
                );
            }
        }
        setFilteredMovies(filteredResults);
    }

    function handleSearchTextChange(event: React.ChangeEvent<HTMLInputElement>) {
        setSearchText(event.target.value);
    }

    function handleFilterChange(event: React.ChangeEvent<{}>, value: string | null) {
        setSelectedFilter(value || 'title');
    }

    function handleMovieClick(movie: Movie) {
        setSelectedMovie(movie);
    }

    const handleRatingChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = event.target.value;
        const formattedRating = Number(inputValue).toFixed(2);
        setRating(formattedRating);
    };

    const handleRatingSubmit = () => {
        // Perform rating submission logic here
        // Create a rating object with the necessary data
        const handleRatingSubmit = () => {
            if (!loggedInUserUsername || !selectedMovie || !rating) {
                console.error('Incomplete data for rating submission');
                return;
            }

            const ratingData = {
                username: loggedInUserUsername,
                movieTitle: selectedMovie.title,
                rating: parseFloat(rating),
            };

            axios
                .post('/ProjectMovies/addrating', ratingData)
                .then((response) => {
                    const newRating = response.data;
                    console.log('Successfully added rating:', newRating);
                    // Do something with the new rating if needed
                })
                .catch((error) => {
                    console.error('Failed to add rating:', error);
                });
        };
    };

    return (
        <Box>
            <TextField
                label="Search"
                value={searchText}
                onChange={handleSearchTextChange}
                style={{ marginBottom: '1rem' }}
            />
            <Autocomplete
                options={['title', 'director', 'genre']}
                value={selectedFilter}
                onChange={handleFilterChange}
                renderInput={(params) => <TextField {...params} label="Filter By" />}
            />
            {selectedMovie ? (
                <div>
                    <h3>{selectedMovie.title}</h3>
                    <p>Director: {selectedMovie.director}</p>
                    <p>Genre: {selectedMovie.genre}</p>
                    <p>Overview: {selectedMovie.overview}</p>
                    <p>Rating: {selectedMovie.rating}</p>
                    <Button variant="contained" onClick={() => setSelectedMovie(null)}>
                        Close Overview
                    </Button>
                    <div>
                        <TextField
                            type="number"
                            label="Rating"
                            value={rating}
                            onChange={handleRatingChange}
                            inputProps={{
                                step: '0.01',
                                min: '0',
                                max: '10',
                            }}
                        />
                        <Button variant="contained" onClick={handleRatingSubmit}>
                            Submit Rating
                        </Button>
                    </div>
                </div>
            ) : (
                <div>
                    <h2
                        onClick={() => setShowUserRatings(!showUserRatings)}
                        style={{ cursor: 'pointer', transition: 'color 0.3s', fontFamily: 'cursive' }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.color = 'purple';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.color = 'blue';
                        }}
                    >
                        {loggedInUserUsername} Ratings
                    </h2>
                    {showUserRatings && (
                        <ul>
                            {ratings.map((rating: Rating, index: number) => (
                                <li key={index}>
                                    <p>Movie: {rating.movie.title}</p>
                                    <p>Rating: {rating.rating}</p>
                                </li>
                            ))}
                        </ul>
                    )}
                    {filteredMovies.map((movie) => (
                        <div key={movie.title} onClick={() => handleMovieClick(movie)}>
                            <h3>{movie.title}</h3>
                            <p>Director: {movie.director}</p>
                            <p>Genre: {movie.genre}</p>
                            <p>Rating: {movie.rating}</p>
                        </div>
                    ))}
                </div>
            )}
        </Box>
    );
}

export default HomePage;
