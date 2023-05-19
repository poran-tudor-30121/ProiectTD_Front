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

function HomePage() {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
    const [searchText, setSearchText] = useState('');
    const [selectedFilter, setSelectedFilter] = useState('title');
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
    const [rating, setRating] = useState('');

    useEffect(() => {
        fetchMovies();
    }, []);

    useEffect(() => {
        filterMovies();
    }, [searchText]);

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
        const ratingData = {
            user: localStorage.getItem('your_user_id'), // Replace with the actual user ID
            movieTitle: selectedMovie?.title,
            rating: parseFloat(rating),
        };

        // Send a POST request to the addrating endpoint
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
                filteredMovies.map((movie) => (
                    <div key={movie.title} onClick={() => handleMovieClick(movie)}>
                        <h3>{movie.title}</h3>
                        <p>Director: {movie.director}</p>
                        <p>Genre: {movie.genre}</p>
                        <p>Rating: {movie.rating}</p>
                    </div>
                ))
            )}
        </Box>
    );
}

export default HomePage;
