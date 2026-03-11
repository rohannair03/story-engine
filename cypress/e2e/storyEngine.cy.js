describe('Story Engine', () => {
  const defaultMusicResponse = () => {
    cy.intercept('POST', 'https://api.anthropic.com/v1/messages', (req) => {
      if (req.body.messages?.[0]?.content?.includes?.('Analyze this story scene')) {
        req.reply({
          statusCode: 200,
          body: {
            content: [{ text: JSON.stringify({ moods: ['melancholic', 'searching'], pacing: 'slow' }) }]
          }
        });
      } else {
        req.continue();
      }
    }).as('musicAPI');
  };

  it('shows the Begin Story button on load', () => {
    cy.visit('/');
    cy.contains('Begin Story').should('be.visible');
  });

  it('does not show story text before the game starts', () => {
    cy.visit('/');
    cy.get('p').should('not.exist');
  });

  it('shows a loading indicator after clicking Begin Story', () => {
    cy.fixture('storyResponse').then((story) => {
      cy.intercept('POST', 'https://api.anthropic.com/v1/messages', (req) => {
        if (!req.body.messages?.[0]?.content?.includes?.('Analyze this story scene')) {
          req.reply({ delay: 1000, body: story.opening });
        } else {
          req.reply({ body: story.musicAnalysis });
        }
      }).as('slowAPI');
      cy.visit('/');
      cy.contains('Begin Story').click();
      cy.contains('Kennit presses on...').should('be.visible');
    });
  });

  it('displays story text after API responds', () => {
    cy.fixture('storyResponse').then((story) => {
      cy.intercept('POST', 'https://api.anthropic.com/v1/messages', (req) => {
        if (req.body.messages?.[0]?.content?.includes?.('Analyze this story scene')) {
          req.reply({ body: story.musicAnalysis });
        } else {
          req.reply({ body: story.opening });
        }
      }).as('claudeAPI');
      cy.visit('/');
      cy.contains('Begin Story').click();
      cy.wait('@claudeAPI');
      cy.contains('You stand at the base of the cliffs').should('be.visible');
    });
  });

  it('hides the Begin Story button after the story starts', () => {
    cy.fixture('storyResponse').then((story) => {
      cy.intercept('POST', 'https://api.anthropic.com/v1/messages', (req) => {
        if (req.body.messages?.[0]?.content?.includes?.('Analyze this story scene')) {
          req.reply({ body: story.musicAnalysis });
        } else {
          req.reply({ body: story.opening });
        }
      }).as('claudeAPI');
      cy.visit('/');
      cy.contains('Begin Story').click();
      cy.wait('@claudeAPI');
      cy.contains('Begin Story').should('not.exist');
    });
  });

  it('displays three choice buttons after story loads', () => {
    cy.fixture('storyResponse').then((story) => {
      cy.intercept('POST', 'https://api.anthropic.com/v1/messages', (req) => {
        if (req.body.messages?.[0]?.content?.includes?.('Analyze this story scene')) {
          req.reply({ body: story.musicAnalysis });
        } else {
          req.reply({ body: story.opening });
        }
      }).as('claudeAPI');
      cy.visit('/');
      cy.contains('Begin Story').click();
      cy.wait('@claudeAPI');
      cy.get('button').should('have.length', 3);
    });
  });

  it('choice buttons contain the correct text', () => {
    cy.fixture('storyResponse').then((story) => {
      cy.intercept('POST', 'https://api.anthropic.com/v1/messages', (req) => {
        if (req.body.messages?.[0]?.content?.includes?.('Analyze this story scene')) {
          req.reply({ body: story.musicAnalysis });
        } else {
          req.reply({ body: story.opening });
        }
      }).as('claudeAPI');
      cy.visit('/');
      cy.contains('Begin Story').click();
      cy.wait('@claudeAPI');
      cy.contains('Climb towards the dark shape that might be a cave').should('be.visible');
      cy.contains('Search the cliff face for handholds').should('be.visible');
      cy.contains('Look back at Mirileth one last time').should('be.visible');
    });
  });

  it('clicking a choice triggers a new API call', () => {
    cy.fixture('storyResponse').then((story) => {
      let callCount = 0;
      cy.intercept('POST', 'https://api.anthropic.com/v1/messages', (req) => {
        if (req.body.messages?.[0]?.content?.includes?.('Analyze this story scene')) {
          req.reply({ body: story.musicAnalysis });
        } else {
          callCount++;
          req.reply({ body: callCount === 1 ? story.opening : story.choiceResponse });
        }
      }).as('claudeAPI');
      cy.visit('/');
      cy.contains('Begin Story').click();
      cy.wait('@claudeAPI');
      cy.contains('Climb towards the dark shape that might be a cave').click();
      cy.wait('@claudeAPI');
      cy.wrap(null).should(() => expect(callCount).to.equal(2));
    });
  });

  it('displays new scene text after making a choice', () => {
    cy.fixture('storyResponse').then((story) => {
      let callCount = 0;
      cy.intercept('POST', 'https://api.anthropic.com/v1/messages', (req) => {
        if (req.body.messages?.[0]?.content?.includes?.('Analyze this story scene')) {
          req.reply({ body: story.musicAnalysis });
        } else {
          callCount++;
          req.reply({ body: callCount === 1 ? story.opening : story.choiceResponse });
        }
      }).as('claudeAPI');
      cy.visit('/');
      cy.contains('Begin Story').click();
      cy.wait('@claudeAPI');
      cy.contains('Climb towards the dark shape that might be a cave').click();
      cy.wait('@claudeAPI');
      cy.contains('You climb toward the dark shape').should('be.visible');
    });
  });

  it('shows the player choice in the story log', () => {
    cy.fixture('storyResponse').then((story) => {
      let callCount = 0;
      cy.intercept('POST', 'https://api.anthropic.com/v1/messages', (req) => {
        if (req.body.messages?.[0]?.content?.includes?.('Analyze this story scene')) {
          req.reply({ body: story.musicAnalysis });
        } else {
          callCount++;
          req.reply({ body: callCount === 1 ? story.opening : story.choiceResponse });
        }
      }).as('claudeAPI');
      cy.visit('/');
      cy.contains('Begin Story').click();
      cy.wait('@claudeAPI');
      cy.contains('Climb towards the dark shape that might be a cave').click();
      cy.wait('@claudeAPI');
      cy.contains('Climb towards the dark shape that might be a cave').should('be.visible');
    });
  });

  it('previous scene is still visible after making a choice', () => {
    cy.fixture('storyResponse').then((story) => {
      let callCount = 0;
      cy.intercept('POST', 'https://api.anthropic.com/v1/messages', (req) => {
        if (req.body.messages?.[0]?.content?.includes?.('Analyze this story scene')) {
          req.reply({ body: story.musicAnalysis });
        } else {
          callCount++;
          req.reply({ body: callCount === 1 ? story.opening : story.choiceResponse });
        }
      }).as('claudeAPI');
      cy.visit('/');
      cy.contains('Begin Story').click();
      cy.wait('@claudeAPI');
      cy.contains('Climb towards the dark shape that might be a cave').click();
      cy.wait('@claudeAPI');
      cy.contains('You stand at the base of the cliffs').should('be.visible');
    });
  });

  it('previous scene is faded compared to current scene', () => {
    cy.fixture('storyResponse').then((story) => {
      let callCount = 0;
      cy.intercept('POST', 'https://api.anthropic.com/v1/messages', (req) => {
        if (req.body.messages?.[0]?.content?.includes?.('Analyze this story scene')) {
          req.reply({ body: story.musicAnalysis });
        } else {
          callCount++;
          req.reply({ body: callCount === 1 ? story.opening : story.choiceResponse });
        }
      }).as('claudeAPI');
      cy.visit('/');
      cy.contains('Begin Story').click();
      cy.wait('@claudeAPI');
      cy.contains('Climb towards the dark shape that might be a cave').click();
      cy.wait('@claudeAPI');
      cy.contains('You stand at the base of the cliffs')
        .should('have.attr', 'style')
        .and('include', 'opacity: 0.45');
    });
  });

  it('displays an error message when the API fails', () => {
    cy.intercept('POST', 'https://api.anthropic.com/v1/messages', {
      statusCode: 500,
      body: { error: { message: 'Internal Server Error' } }
    }).as('claudeAPIError');
    cy.visit('/');
    cy.contains('Begin Story').click();
    cy.wait('@claudeAPIError');
    cy.contains('Internal Server Error').should('be.visible');
  });

  it('does not crash when the API fails', () => {
    cy.intercept('POST', 'https://api.anthropic.com/v1/messages', {
      statusCode: 500,
      body: { error: { message: 'Internal Server Error' } }
    }).as('claudeAPIError');
    cy.visit('/');
    cy.contains('Begin Story').click();
    cy.wait('@claudeAPIError');
    cy.get('body').should('exist');
    cy.get('h1').should('exist');
  });

  describe('Music Sidebar', () => {
    it('does not show the music sidebar before the story starts', () => {
      cy.visit('/');
      cy.get('[data-testid="music-sidebar"]').should('not.exist');
    });

    it('shows the music sidebar after the story starts', () => {
      cy.fixture('storyResponse').then((story) => {
        cy.intercept('POST', 'https://api.anthropic.com/v1/messages', (req) => {
          if (req.body.messages?.[0]?.content?.includes?.('Analyze this story scene')) {
            req.reply({ body: story.musicAnalysis });
          } else {
            req.reply({ body: story.opening });
          }
        }).as('claudeAPI');
        cy.visit('/');
        cy.contains('Begin Story').click();
        cy.wait('@claudeAPI');
        cy.get('[data-testid="music-sidebar"]').should('exist');
      });
    });

    it('shows mood tags after analysis completes', () => {
      cy.fixture('storyResponse').then((story) => {
        cy.intercept('POST', 'https://api.anthropic.com/v1/messages', (req) => {
          if (req.body.messages?.[0]?.content?.includes?.('Analyze this story scene')) {
            req.reply({ body: story.musicAnalysis });
          } else {
            req.reply({ body: story.opening });
          }
        }).as('claudeAPI');
        cy.visit('/');
        cy.contains('Begin Story').click();
        cy.wait('@claudeAPI');
        cy.wait('@claudeAPI');
        cy.get('[data-testid="mood-tag"]').should('have.length.greaterThan', 0);
      });
    });

    it('shows a pacing tag after analysis completes', () => {
      cy.fixture('storyResponse').then((story) => {
        cy.intercept('POST', 'https://api.anthropic.com/v1/messages', (req) => {
          if (req.body.messages?.[0]?.content?.includes?.('Analyze this story scene')) {
            req.reply({ body: story.musicAnalysis });
          } else {
            req.reply({ body: story.opening });
          }
        }).as('claudeAPI');
        cy.visit('/');
        cy.contains('Begin Story').click();
        cy.wait('@claudeAPI');
        cy.wait('@claudeAPI');
        cy.get('[data-testid="pacing-tag"]').should('exist');
      });
    });

    it('shows matched piece titles after analysis completes', () => {
      cy.fixture('storyResponse').then((story) => {
        cy.intercept('POST', 'https://api.anthropic.com/v1/messages', (req) => {
          if (req.body.messages?.[0]?.content?.includes?.('Analyze this story scene')) {
            req.reply({ body: story.musicAnalysis });
          } else {
            req.reply({ body: story.opening });
          }
        }).as('claudeAPI');
        cy.visit('/');
        cy.contains('Begin Story').click();
        cy.wait('@claudeAPI');
        cy.wait('@claudeAPI');
        cy.get('[data-testid="piece-title"]').should('have.length.greaterThan', 0);
      });
    });

    it('shows YouTube and Spotify links for each piece', () => {
      cy.fixture('storyResponse').then((story) => {
        cy.intercept('POST', 'https://api.anthropic.com/v1/messages', (req) => {
          if (req.body.messages?.[0]?.content?.includes?.('Analyze this story scene')) {
            req.reply({ body: story.musicAnalysis });
          } else {
            req.reply({ body: story.opening });
          }
        }).as('claudeAPI');
        cy.visit('/');
        cy.contains('Begin Story').click();
        cy.wait('@claudeAPI');
        cy.wait('@claudeAPI');
        cy.contains('YouTube').should('exist');
        cy.contains('Spotify').should('exist');
      });
    });

    it('updates the music brief after a new choice is made', () => {
      cy.fixture('storyResponse').then((story) => {
        let callCount = 0;
        cy.intercept('POST', 'https://api.anthropic.com/v1/messages', (req) => {
          if (req.body.messages?.[0]?.content?.includes?.('Analyze this story scene')) {
            req.reply({ body: story.musicAnalysis });
          } else {
            callCount++;
            req.reply({ body: callCount === 1 ? story.opening : story.choiceResponse });
          }
        }).as('claudeAPI');
        cy.visit('/');
        cy.contains('Begin Story').click();
        cy.wait('@claudeAPI');
        cy.contains('Climb towards the dark shape that might be a cave').click();
        cy.wait('@claudeAPI');
        cy.wait('@claudeAPI');
        cy.get('[data-testid="mood-tag"]').should('exist');
      });
    });
  });
});