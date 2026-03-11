describe('Story Engine', () => {

  beforeEach(() => {
    cy.visit('/');
  });

  // ─── PAGE LOAD ───────────────────────────────────────────

  it('shows the Begin Story button on load', () => {
    cy.contains('Begin Story').should('be.visible');
  });

  it('does not show story text before the game starts', () => {
    cy.get('p').should('not.exist');
  });

  // ─── STARTING THE STORY ──────────────────────────────────

  it('shows a loading indicator after clicking Begin Story', () => {
    cy.fixture('storyResponse').then((story) => {
      cy.mockClaudeAPI(story.opening);
      cy.contains('Begin Story').click();
      cy.contains('Kennit presses on...').should('be.visible');
    });
  });

  it('displays story text after API responds', () => {
    cy.fixture('storyResponse').then((story) => {
      cy.mockClaudeAPI(story.opening);
      cy.contains('Begin Story').click();
      cy.wait('@claudeAPI');
      cy.contains('You stand at the base of the cliffs').should('be.visible');
    });
  });

  it('hides the Begin Story button after the story starts', () => {
    cy.fixture('storyResponse').then((story) => {
      cy.mockClaudeAPI(story.opening);
      cy.contains('Begin Story').click();
      cy.wait('@claudeAPI');
      cy.contains('Begin Story').should('not.exist');
    });
  });

  // ─── CHOICE BUTTONS ──────────────────────────────────────

  it('displays three choice buttons after story loads', () => {
    cy.fixture('storyResponse').then((story) => {
      cy.mockClaudeAPI(story.opening);
      cy.contains('Begin Story').click();
      cy.wait('@claudeAPI');
      cy.get('button').should('have.length', 3);
    });
  });

  it('choice buttons contain the correct text', () => {
    cy.fixture('storyResponse').then((story) => {
      cy.mockClaudeAPI(story.opening);
      cy.contains('Begin Story').click();
      cy.wait('@claudeAPI');
      cy.contains('Climb towards the dark shape that might be a cave').should('be.visible');
      cy.contains('Study the cliff face carefully before committing to a route').should('be.visible');
      cy.contains('Check your pack one final time before leaving the ground').should('be.visible');
    });
  });

  // ─── MAKING A CHOICE ─────────────────────────────────────

  it('clicking a choice triggers a new API call', () => {
    cy.fixture('storyResponse').then((story) => {
      cy.mockClaudeAPI(story.opening);
      cy.contains('Begin Story').click();
      cy.wait('@claudeAPI');

      cy.mockClaudeAPI(story.choiceResponse);
      cy.contains('Climb towards the dark shape that might be a cave').click();
      cy.wait('@claudeAPI');

      cy.get('@claudeAPI.all').should('have.length', 2);
    });
  });

  it('displays new scene text after making a choice', () => {
    cy.fixture('storyResponse').then((story) => {
      cy.mockClaudeAPI(story.opening);
      cy.contains('Begin Story').click();
      cy.wait('@claudeAPI');

      cy.mockClaudeAPI(story.choiceResponse);
      cy.contains('Climb towards the dark shape that might be a cave').click();
      cy.wait('@claudeAPI');

      cy.contains('You scan the cliff face methodically').should('be.visible');
    });
  });

  it('shows the player choice in the story log', () => {
    cy.fixture('storyResponse').then((story) => {
      cy.mockClaudeAPI(story.opening);
      cy.contains('Begin Story').click();
      cy.wait('@claudeAPI');

      cy.mockClaudeAPI(story.choiceResponse);
      cy.contains('Climb towards the dark shape that might be a cave').click();
      cy.wait('@claudeAPI');

      cy.contains('Climb towards the dark shape that might be a cave').should('be.visible');
    });
  });

  // ─── STORY LOG ───────────────────────────────────────────

  it('previous scene is still visible after making a choice', () => {
    cy.fixture('storyResponse').then((story) => {
      cy.mockClaudeAPI(story.opening);
      cy.contains('Begin Story').click();
      cy.wait('@claudeAPI');

      cy.mockClaudeAPI(story.choiceResponse);
      cy.contains('Climb towards the dark shape that might be a cave').click();
      cy.wait('@claudeAPI');

      cy.contains('You stand at the base of the cliffs').should('be.visible');
    });
  });

  it('previous scene is faded compared to current scene', () => {
  cy.fixture('storyResponse').then((story) => {
    cy.mockClaudeAPI(story.opening);
    cy.contains('Begin Story').click();
    cy.wait('@claudeAPI');

    cy.mockClaudeAPI(story.choiceResponse);
    cy.contains('Climb towards the dark shape that might be a cave').click();
    cy.wait('@claudeAPI');

    // Check the inline style attribute directly
    cy.contains('You stand at the base of the cliffs')
      .should('have.attr', 'style')
      .and('include', 'opacity: 0.45');
  });
});

  // ─── ERROR HANDLING ──────────────────────────────────────

  it('displays an error message when the API fails', () => {
    cy.mockClaudeAPIError();
    cy.contains('Begin Story').click();
    cy.wait('@claudeAPIError');
    cy.contains('Internal server error').should('be.visible');
  });

  it('does not crash when the API fails', () => {
    cy.mockClaudeAPIError();
    cy.contains('Begin Story').click();
    cy.wait('@claudeAPIError');
    cy.get('body').should('exist');
    cy.get('h1').should('contain', 'Story Engine');
  });

});