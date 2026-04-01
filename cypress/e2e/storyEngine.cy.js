describe('Story Engine', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  // ── Initial state ──────────────────────────────────────────────────────────

  it('shows the opening card on load', () => {
    cy.get('[data-testid="opening-card"]').should('be.visible');
  });

  it('shows three choice buttons on load', () => {
    cy.get('[data-testid="choice-button-0"]').should('be.visible');
    cy.get('[data-testid="choice-button-1"]').should('be.visible');
    cy.get('[data-testid="choice-button-2"]').should('be.visible');
  });

  it('does not show story text before the game starts', () => {
    cy.get('[data-testid="story-log"]').find('.log-story').should('have.length', 0);
  });

  // ── First choice ───────────────────────────────────────────────────────────

  it('shows a loading indicator after clicking a choice', () => {
    cy.fixture('storyResponse').then((story) => {
      cy.intercept('POST', '/api/chat', (req) => {
        if (req.body.messages?.[0]?.content?.includes?.('Analyze this story scene')) {
          req.reply({ body: story.musicAnalysis });
        } else {
          req.reply({ delay: 1000, body: story.opening });
        }
      }).as('slowAPI');
      cy.get('[data-testid="choice-button-0"]').click();
      cy.get('[data-testid="loading-indicator"]').should('be.visible');
    });
  });

  it('displays story text after API responds', () => {
    cy.fixture('storyResponse').then((story) => {
      cy.intercept('POST', '/api/chat', (req) => {
        if (req.body.messages?.[0]?.content?.includes?.('Analyze this story scene')) {
          req.reply({ body: story.musicAnalysis });
        } else {
          req.reply({ body: story.opening });
        }
      }).as('claudeAPI');
      cy.get('[data-testid="choice-button-0"]').click();
      cy.wait('@claudeAPI');
      cy.contains('You stand at the base of the cliffs').should('be.visible');
    });
  });

  it('hides the opening card after the first choice', () => {
    cy.fixture('storyResponse').then((story) => {
      cy.intercept('POST', '/api/chat', (req) => {
        if (req.body.messages?.[0]?.content?.includes?.('Analyze this story scene')) {
          req.reply({ body: story.musicAnalysis });
        } else {
          req.reply({ body: story.opening });
        }
      }).as('claudeAPI');
      cy.get('[data-testid="choice-button-0"]').click();
      cy.wait('@claudeAPI');
      cy.get('[data-testid="opening-card"]').should('not.exist');
    });
  });

  it('displays three choice buttons after story loads', () => {
    cy.fixture('storyResponse').then((story) => {
      cy.intercept('POST', '/api/chat', (req) => {
        if (req.body.messages?.[0]?.content?.includes?.('Analyze this story scene')) {
          req.reply({ body: story.musicAnalysis });
        } else {
          req.reply({ body: story.opening });
        }
      }).as('claudeAPI');
      cy.get('[data-testid="choice-button-0"]').click();
      cy.wait('@claudeAPI');
      cy.get('[data-testid="choices-container"]').find('button').should('have.length', 3);
    });
  });

  it('choice buttons contain the correct text', () => {
    cy.fixture('storyResponse').then((story) => {
      cy.intercept('POST', '/api/chat', (req) => {
        if (req.body.messages?.[0]?.content?.includes?.('Analyze this story scene')) {
          req.reply({ body: story.musicAnalysis });
        } else {
          req.reply({ body: story.opening });
        }
      }).as('claudeAPI');
      cy.get('[data-testid="choice-button-0"]').click();
      cy.wait('@claudeAPI');
      cy.contains('Climb towards the dark shape that might be a cave').should('be.visible');
      cy.contains('Search the cliff face for handholds').should('be.visible');
      cy.contains('Look back at Mirileth one last time').should('be.visible');
    });
  });

  // ── Second choice ──────────────────────────────────────────────────────────

  it('clicking a choice triggers a new API call', () => {
    cy.fixture('storyResponse').then((story) => {
      let callCount = 0;
      cy.intercept('POST', '/api/chat', (req) => {
        if (req.body.messages?.[0]?.content?.includes?.('Analyze this story scene')) {
          req.reply({ body: story.musicAnalysis });
        } else {
          callCount++;
          req.reply({ body: callCount === 1 ? story.opening : story.choiceResponse });
        }
      }).as('claudeAPI');
      cy.get('[data-testid="choice-button-0"]').click();
      cy.wait('@claudeAPI');
      cy.contains('Climb towards the dark shape that might be a cave').click();
      cy.wait('@claudeAPI');
      cy.get('[data-testid="story-log"]').find('.story-entry').should('have.length', 2);
    });
  });

  it('displays new scene text after making a choice', () => {
    cy.fixture('storyResponse').then((story) => {
      let callCount = 0;
      cy.intercept('POST', '/api/chat', (req) => {
        if (req.body.messages?.[0]?.content?.includes?.('Analyze this story scene')) {
          req.reply({ body: story.musicAnalysis });
        } else {
          callCount++;
          req.reply({ body: callCount === 1 ? story.opening : story.choiceResponse });
        }
      }).as('claudeAPI');
      cy.get('[data-testid="choice-button-0"]').click();
      cy.wait('@claudeAPI');
      cy.contains('Climb towards the dark shape that might be a cave').click();
      cy.wait('@claudeAPI');
      cy.contains('You climb toward the dark shape').should('be.visible');
    });
  });

  it('shows the player choice in the story log', () => {
    cy.fixture('storyResponse').then((story) => {
      let callCount = 0;
      cy.intercept('POST', '/api/chat', (req) => {
        if (req.body.messages?.[0]?.content?.includes?.('Analyze this story scene')) {
          req.reply({ body: story.musicAnalysis });
        } else {
          callCount++;
          req.reply({ body: callCount === 1 ? story.opening : story.choiceResponse });
        }
      }).as('claudeAPI');
      cy.get('[data-testid="choice-button-0"]').click();
      cy.wait('@claudeAPI');
      cy.contains('Climb towards the dark shape that might be a cave').click();
      cy.wait('@claudeAPI');
      cy.contains('Climb towards the dark shape that might be a cave').should('be.visible');
    });
  });

  it('previous scene is still visible after making a choice', () => {
    cy.fixture('storyResponse').then((story) => {
      let callCount = 0;
      cy.intercept('POST', '/api/chat', (req) => {
        if (req.body.messages?.[0]?.content?.includes?.('Analyze this story scene')) {
          req.reply({ body: story.musicAnalysis });
        } else {
          callCount++;
          req.reply({ body: callCount === 1 ? story.opening : story.choiceResponse });
        }
      }).as('claudeAPI');
      cy.get('[data-testid="choice-button-0"]').click();
      cy.wait('@claudeAPI');
      cy.contains('Climb towards the dark shape that might be a cave').click();
      cy.wait('@claudeAPI');
      cy.contains('You stand at the base of the cliffs').should('be.visible');
    });
  });

  it('previous scene is faded compared to current scene', () => {
    cy.fixture('storyResponse').then((story) => {
      let callCount = 0;
      cy.intercept('POST', '/api/chat', (req) => {
        if (req.body.messages?.[0]?.content?.includes?.('Analyze this story scene')) {
          req.reply({ body: story.musicAnalysis });
        } else {
          callCount++;
          req.reply({ body: callCount === 1 ? story.opening : story.choiceResponse });
        }
      }).as('claudeAPI');
      cy.get('[data-testid="choice-button-0"]').click();
      cy.wait('@claudeAPI');
      cy.contains('Climb towards the dark shape that might be a cave').click();
      cy.wait('@claudeAPI');
      cy.contains('You stand at the base of the cliffs')
        .closest('.log-story')
        .should('have.attr', 'style')
        .and('include', 'opacity: 0.45');
    });
  });

  // ── Error handling ─────────────────────────────────────────────────────────

  it('displays an error message when the API fails', () => {
    cy.intercept('POST', '/api/chat', {
      statusCode: 500,
      body: { error: { message: 'Internal Server Error' } }
    }).as('claudeAPIError');
    cy.get('[data-testid="choice-button-0"]').click();
    cy.wait('@claudeAPIError');
    cy.get('[data-testid="error-message"]').should('be.visible');
  });

  it('does not crash when the API fails', () => {
    cy.intercept('POST', '/api/chat', {
      statusCode: 500,
      body: { error: { message: 'Internal Server Error' } }
    }).as('claudeAPIError');
    cy.get('[data-testid="choice-button-0"]').click();
    cy.wait('@claudeAPIError');
    cy.get('body').should('exist');
    cy.get('h1').should('exist');
  });

  // ── Music Sidebar ──────────────────────────────────────────────────────────

  describe('Music Sidebar', () => {
    it('shows the Score Companion sidebar on load', () => {
      cy.get('[data-testid="music-sidebar"]').should('exist');
    });

    it('shows the music sidebar after the story starts', () => {
      cy.fixture('storyResponse').then((story) => {
        cy.intercept('POST', '/api/chat', (req) => {
          if (req.body.messages?.[0]?.content?.includes?.('Analyze this story scene')) {
            req.reply({ body: story.musicAnalysis });
          } else {
            req.reply({ body: story.opening });
          }
        }).as('claudeAPI');
        cy.get('[data-testid="choice-button-0"]').click();
        cy.wait('@claudeAPI');
        cy.contains('SCORE COMPANION').should('exist');
      });
    });

    it('shows mood tags after analysis completes', () => {
      cy.fixture('storyResponse').then((story) => {
        cy.intercept('POST', '/api/chat', (req) => {
          if (req.body.messages?.[0]?.content?.includes?.('Analyze this story scene')) {
            req.reply({ body: story.musicAnalysis });
          } else {
            req.reply({ body: story.opening });
          }
        }).as('claudeAPI');
        cy.get('[data-testid="choice-button-0"]').click();
        cy.wait('@claudeAPI');
        cy.wait('@claudeAPI');
        cy.get('[data-testid="mood-tag"]').should('have.length.greaterThan', 0);
      });
    });

    it('shows a pacing tag after analysis completes', () => {
      cy.fixture('storyResponse').then((story) => {
        cy.intercept('POST', '/api/chat', (req) => {
          if (req.body.messages?.[0]?.content?.includes?.('Analyze this story scene')) {
            req.reply({ body: story.musicAnalysis });
          } else {
            req.reply({ body: story.opening });
          }
        }).as('claudeAPI');
        cy.get('[data-testid="choice-button-0"]').click();
        cy.wait('@claudeAPI');
        cy.wait('@claudeAPI');
        cy.get('[data-testid="pacing-tag"]').should('exist');
      });
    });

    it('shows matched piece titles after analysis completes', () => {
      cy.fixture('storyResponse').then((story) => {
        cy.intercept('POST', '/api/chat', (req) => {
          if (req.body.messages?.[0]?.content?.includes?.('Analyze this story scene')) {
            req.reply({ body: story.musicAnalysis });
          } else {
            req.reply({ body: story.opening });
          }
        }).as('claudeAPI');
        cy.get('[data-testid="choice-button-0"]').click();
        cy.wait('@claudeAPI');
        cy.wait('@claudeAPI');
        cy.get('[data-testid="piece-title"]').should('have.length.greaterThan', 0);
      });
    });

    it('shows YouTube and Spotify links for each piece', () => {
      cy.fixture('storyResponse').then((story) => {
        cy.intercept('POST', '/api/chat', (req) => {
          if (req.body.messages?.[0]?.content?.includes?.('Analyze this story scene')) {
            req.reply({ body: story.musicAnalysis });
          } else {
            req.reply({ body: story.opening });
          }
        }).as('claudeAPI');
        cy.get('[data-testid="choice-button-0"]').click();
        cy.wait('@claudeAPI');
        cy.wait('@claudeAPI');
        cy.contains('YouTube').should('exist');
        cy.contains('Spotify').should('exist');
      });
    });

    it('updates the music brief after a new choice is made', () => {
      cy.fixture('storyResponse').then((story) => {
        let callCount = 0;
        cy.intercept('POST', '/api/chat', (req) => {
          if (req.body.messages?.[0]?.content?.includes?.('Analyze this story scene')) {
            req.reply({ body: story.musicAnalysis });
          } else {
            callCount++;
            req.reply({ body: callCount === 1 ? story.opening : story.choiceResponse });
          }
        }).as('claudeAPI');
        cy.get('[data-testid="choice-button-0"]').click();
        cy.wait('@claudeAPI');
        cy.contains('Climb towards the dark shape that might be a cave').click();
        cy.wait('@claudeAPI');
        cy.wait('@claudeAPI');
        cy.get('[data-testid="mood-tag"]').should('exist');
      });
    });
  });
});
