// cypress/e2e/instagram-stories.cy.ts

describe('Instagram Stories App', () => {
  beforeEach(() => {
    // Intercept and stub the API request for stories
    cy.intercept('GET', '**/stories.json', {
      fixture: 'stories.json'
    }).as('getStories');

    // Visit the homepage
    cy.visit('/');
    cy.wait('@getStories');
  });

  it('should display the stories list on the homepage', () => {
    cy.contains('h1', 'Instagram').should('be.visible');
    cy.get('[data-testid^="story-circle-"]').should('have.length.at.least', 1);
  });

  it('should open story viewer when clicking on a story', () => {
    // Click on the first story
    cy.get('[data-testid^="story-circle-"]').first().click();
    
    // Verify story viewer is displayed
    cy.get('[data-testid="story-viewer-container"]').should('be.visible');
    
    // Verify story elements are present
    cy.get('[data-testid^="progress-bar-"]').should('exist');
    cy.get('[data-testid="optimized-image"]').should('exist');
  });

  it('should navigate to the next story when clicking on the right side', () => {
    // Click on the first story
    cy.get('[data-testid^="story-circle-"]').first().click();
    
    // Wait for image to load
    cy.get('[data-testid="optimized-image"]').should('be.visible');
    
    // Get the current story URL
    cy.url().then((url) => {
      const initialUrl = url;
      
      // Click on the right side of the screen (2/3 of the screen width)
      cy.get('[data-testid="story-viewer-container"]').then($el => {
        const width = $el.width() || 0;
        cy.get('[data-testid="story-viewer-container"]').click(width * 0.8, 10);
      });
      
      // Verify URL has changed (navigated to next story)
      cy.url().should('not.eq', initialUrl);
    });
  });

  it('should navigate to the previous story when clicking on the left side', () => {
    // Click on the first story, then navigate to second story
    cy.get('[data-testid^="story-circle-"]').first().click();
    cy.get('[data-testid="optimized-image"]').should('be.visible');
    
    // Click right to go to next story
    cy.get('[data-testid="story-viewer-container"]').then($el => {
      const width = $el.width() || 0;
      cy.get('[data-testid="story-viewer-container"]').click(width * 0.8, 10);
    });
    
    // Wait for the next story to load
    cy.get('[data-testid="optimized-image"]').should('be.visible');
    
    // Get the current story URL
    cy.url().then((url) => {
      const secondStoryUrl = url;
      
      // Click on the left side of the screen (1/3 of the screen width)
      cy.get('[data-testid="story-viewer-container"]').then($el => {
        const width = $el.width() || 0;
        cy.get('[data-testid="story-viewer-container"]').click(width * 0.2, 10);
      });
      
      // Verify URL has changed back to the previous story
      cy.url().should('not.eq', secondStoryUrl);
    });
  });

  it('should close the story viewer when clicking the close button', () => {
    // Click on the first story
    cy.get('[data-testid^="story-circle-"]').first().click();
    
    // Verify story viewer is displayed
    cy.get('[data-testid="story-viewer-container"]').should('be.visible');
    
    // Click the close button
    cy.get('[data-testid="close-button"]').click();
    
    // Verify we're back on the homepage
    cy.get('[data-testid="story-viewer-container"]').should('not.exist');
    cy.contains('h1', 'Instagram').should('be.visible');
  });

  it('should show loading spinner when stories are loading', () => {
    // Visit the page but delay the API response
    cy.visit('/');
    cy.intercept('GET', '**/stories.json', (req) => {
      req.on('response', (res) => {
        res.setDelay(1000);
      });
    }).as('delayedStories');
    
    // Check that loading spinner is visible
    cy.get('[data-testid="loading-spinner"]').should('be.visible');
    cy.contains('Loading stories...').should('be.visible');
    
    // Wait for stories to load
    cy.wait('@delayedStories');
    
    // Check that spinner is gone
    cy.get('[data-testid="loading-spinner"]').should('not.exist');
  });

  it('should show loading spinner when story image is loading', () => {
    // Click on the first story
    cy.get('[data-testid^="story-circle-"]').first().click();
    
    // Intercept image request and delay it
    cy.intercept('GET', 'https://picsum.photos/**', (req) => {
      req.on('response', (res) => {
        res.setDelay(1000);
      });
    }).as('imageLoading');
    
    // Check that loading spinner is visible
    cy.get('[data-testid="loading-spinner"]').should('be.visible');
    cy.contains('Loading image...').should('be.visible');
    
    // Wait for image to load
    cy.wait('@imageLoading');
    
    // Check that image is visible and spinner is gone
    cy.get('[data-testid="optimized-image"]').should('be.visible');
    cy.contains('Loading image...').should('not.exist');
  });

  it('should show progress bars for all stories of a user', () => {
    // Click on the first story
    cy.get('[data-testid^="story-circle-"]').first().click();
    
    // Get the number of stories for the first user
    cy.fixture('stories.json').then((data) => {
      const firstUserStories = data.users[0].stories.length;
      
      // Verify we have the correct number of progress bars
      cy.get('[data-testid^="progress-bar-"]').should('have.length', firstUserStories);
      
      // First story should be active
      cy.get('[data-testid="progress-bar-active"]').should('exist');
    });
  });

  it('should auto-navigate to the next story after 5 seconds', () => {
    // Click on the first story
    cy.get('[data-testid^="story-circle-"]').first().click();
    
    // Wait for image to load
    cy.get('[data-testid="optimized-image"]').should('be.visible');
    
    // Get the initial URL
    cy.url().then((initialUrl) => {
      // Wait for auto-navigation (slightly longer than 5 seconds)
      cy.wait(5500);
      
      // URL should have changed
      cy.url().should('not.eq', initialUrl);
    });
  });
});