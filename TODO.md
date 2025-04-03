# TODO AGORA AI ASSISTANT FRONTEND

## PENDING TASKS

### 🚀 FEATURES
- [ ] Open info dialog through the app component when clicking on a pin card
- [ ] Implement card layouts depending on the type of card
- [ ] Implement a method to detect which kind of card it is based on the fetched data
- [ ] Translate service highlight responsibility to the navigator component
- [ ] Add a component to display the result count of the search
- [ ] Add a timeout to loaders
- [ ] Display showcase card when hovering the navigator (with debouncer)
- [ ] Make carousel cards bigger
- [ ] Implement a breadcrumb within the carousel card (Service >> Sub-service >> Catalogue)
- [ ] Make navigator menu dynamic to be always visible when scrolling up and down
- [ ] Add a checkbox to the navigator items to use them as a filter
- [ ] Change the config 'host' to a list for metagora and check related business logic
- [ ] Ensure proper work of metagora data fetching from different hosts (ie. CIVIS)
- [ ] When metagora is selected, hide navigator and show European map with alliance locations
- [ ] Keep greetings until user makes first click/scroll or until services are loaded
- [ ] Remove greetings if there are results to be displayed
- [ ] Make results permanent
- [ ] Add filtering on a model level
- [ ] Reimplement Opik
- [ ] Adapt interface to recover chat

### 🔧 BACKEND
- [ ] Check single element API endpoint to retrieve url or null on image field

### 🎨 STYLING
- [ ] Make fades visibility blend with the background
- [ ] Improve pinbox on desktop display

### 🐞 BUGS
- [ ] Drag and drop does not work on mobile displays
- [ ] Solve bug where "next" and "previous" buttons in carousel mix results from different services
- [ ] The partial matches are not being highlighted properly

## ⏳ IN PROGRESS

- [-] Implement system to resend message if bot response not received/error (while avoiding sending new messages)
- [-] Implement method to check if fetched image is not a placeholder
- [-] Bot responses could have 'explanation' key displayed in tooltip when hovering result containers
- [-] Add filtering on a service level into the query

## ✅ COMPLETED TASKS

### FEATURES
- [x] Look for solution to fetch fields containing IDs to get basic entity data (e.g., "university_origin")
- [x] Implement an API call to fetch company data from agora.config.js
- [x] Implement left/right arrows to navigate through info dialog as carousel
- [x] Add service name to card view within carousel
- [x] Add "close" button to carousel component
- [x] Add feature to highlight search terms on card view within carousel
- [x] Empty result context when no results found
- [x] Create search context to save searches that return results
- [x] Add debug mode for threshold modification and detailed score info
- [x] Make configuration dynamic based on component HTML attributes
- [x] Implement greetings display within "landing" component
- [x] Implement smooth horizontal scrolling for card containers
- [x] Manage fetch exceptions and display user message
- [x] Implement search autocomplete
- [x] Create showcase component
- [x] Implement node view for "service content" in showcase
- [x] Add suggested search terms to each service in showcase
- [x] Implement UI within DEV environment
- [x] Encapsulate info dialog carousel in component
- [x] Order results by service name before fetching
- [x] Implement chat history autoloading at startup
- [x] Implement chat clear button
- [x] Unfold chat window on load when chat history exists
- [x] Implement company context from config file
- [x] Make navigator sticky and scrollable
- [x] Add selectable default prompts to chat window
- [x] Add featured identifier to featured elements
- [x] Add markdown library for formatted bot responses
- [x] Add fold-unfold button to display/hide non-featured results
- [x] Add translation to search engine queries
- [x] Add 'tab' word to searchbar placeholder and autocomplete dropdown
- [x] Truncate carousel cards descriptions
- [x] Add metagora data fetching
- [x] Make metagora navigator render conditionally
- [x] Add filtering on service level
- [x] Add language selector to searchbar
- [x] Add refresh logic to page
- [x] Add first implementation of map
- [x] Avoid search term highlight in breadcrumb

### BACKEND
- [x] Automatize ingest of data into elastic search for Odoo write operations
- [x] Add field in acceleration services module for suggested search terms
- [x] Add field in acceleration services module for images
- [x] Install LibreTranslate service in docker container
- [x] Create new repo in aUPaEU organization for common utilities (LibreTranslate, HTMLExtractor)
- [x] Improve elasticsearch query with partial matches and stemming
- [x] Solved bug where href attributes were being translated

### STYLING
- [x] Improve navigator component usability
- [x] Adapt style for coherence
- [x] Display acceleration services images in showcase
- [x] Display result scores in user-friendly way
- [x] Make score color dynamic based on value
- [x] Create mobile display adaptation
- [x] Fix chat window autoscroll
- [x] Improve responsiveness
- [x] Fix 'clear chat' button positioning
- [x] Make showcase cards less wide
- [x] Make color variations on default images for dynamic cards
- [x] Animate metagora navigator buttons on click

### BUGS
- [x] Fix CDN cache purging (mainly CSS files)
- [x] Fix "highlight search terms" bug with single-letter queries
- [x] Fix blurry text styling (possibly font size related)
- [x] Fix double rendering of showcase cards
- [x] Fix styling issues in dev environment
- [x] Fix incorrect URL building in carousel
- [x] Avoid rendering greetings with previous results
- [x] Fix pointer events when Chat component over cards with hidden ChatWindow
- [x] Fix service info display with result cards
- [x] Remove extra fields temporarily from carousel cards
- [x] Fix metagora button state persistence
- [x] Fix partial matches functionality
- [x] Fix greetings animation bug when changing to showcase

## 📊 PROGRESS SUMMARY
- Total tasks: 84
- Completed: 59 (70%)
- In progress: 4 (5%)
- Pending: 21 (25%)

