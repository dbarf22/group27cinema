describe('template spec', () => {
  it('passes', () => {
      cy.visit('http://localhost:3000')
      cy.get('#login').click();
      cy.get('[name="email"]').click();
      cy.get('[name="email"]').type('dbarfield4@gmail.com');
      cy.get('[name="password"]').click();
      cy.get('[name="password"]').type('1234');
      cy.get('[name="rememberMe"]').check();
      cy.get('[data-testid="loginFormSubmit"]').click();
      cy.wait(1000);

      cy.get('#portal').click();
      cy.get('#addMovie').click();
      cy.get('#title').type("Movie Name")
      cy.get('#castList').type("Actor 1, Actor 2, Actor 3");
      cy.get('#director').type("Director Name");
      cy.get('#producer').type("Producer Name");
      cy.get('#duration').type("120");
      cy.get('#reviewScore').type("4.2");
      cy.get('#ratingCode').select('1');

      cy.get('#description').type("Movie description blah blah blah");

      cy.get('#poster').type("https://m.media-amazon.com/images/M/MV5BZTcyZGIyODctZGJhOS00MWUyLWI5ZWEtMjg4YzhkMDczMDBhXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg");
      cy.get('#trailer').type("https://www.youtube.com/watch?v=AXEK7y1BuNQ")
      cy.get('#genre').type("Action")
      cy.get('#addGenre').click();
      cy.get('#genre').type("Comedy")
      cy.get('#addGenre').click();

      cy.get('#submitButton').click();
      cy.wait(1000);
      cy.get('#successMessage').contains('Movie added successfully!');


      cy.intercept('GET', '/api/movies').as('getMovies');
      cy.get("#home").click();

      let id = 0;

      cy.wait('@getMovies').then((interception) => {
          const movies = interception.response.body;

          const addedMovie = movies.find(m => m.title === "Movie Name");

          expect(addedMovie).to.exist;
          expect(addedMovie.castList).to.eql("Actor 1, Actor 2, Actor 3");
          expect(addedMovie.director).to.equal("Director Name");
          expect(addedMovie.producer).to.equal("Producer Name");
          expect(addedMovie.duration).to.equal(120);
          expect(addedMovie.rating).to.equal(4.2);
          expect(addedMovie.ratingCode.id).to.equal(1);
          expect(addedMovie.description).to.equal("Movie description blah blah blah");
          expect(addedMovie.poster).to.include("m.media-amazon.com");
          expect(addedMovie.trailer).to.include("youtube.com");
          expect(addedMovie.genre).to.include("Action, Comedy");

          const movieId = addedMovie.id;

          cy.request('DELETE', `/api/admin/movies/${movieId}`)
              .then((response) => {
                  expect(response.status).to.be.oneOf([200, 204]);
              });

      });
      cy.reload();

  })
})