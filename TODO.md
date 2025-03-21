<!-- FEATURES -->
- [ ] Open info dialog through the app component when clicking on a pin card.
- [ ] Implement card layouts depending on the type of card.
- [ ] Implement a method to detect which kind of card it is based on the fetched data.
- [ ] Translate service highlight responsibility to the navigator component.
- [ ] Add a component to display the result count of the search.
- [ ] Add a timeout to loaders.
- [-] Implement a system to resend the message if the bot response is not received or there's an error. WHile avoiding sending new messages.
- [-] Implement a method to check if the image that is being fetched is not a placeholder.

- [x] Implement an API call to fetch company data from agora.config.js.
- [x] Implement left and right arrows to navigate throught the info dialog as a carousel.
- [x] Add service name to the card view within the carousel.
- [x] Add a "close" button to the carousel component.
- [x] Add a feature to highlight search terms on the card view within the carousel.
- [x] Empty result context when no results are found.
- [x] Create a search context to save all the search that return results.
- [x] Add a debug mode where the user can modify the treshold of the score to display results and view detailed info about the scores.
- [x] Make configuration dynamic based on the html attributes given to the component.
- [x] Implement the greetings display within the "landing" component.
- [x] Implement a feature to make the horizontal scrolling of the card containers smooth (based on cursor position).
- [x] Manage fetch exceptions and display a message to the user.
- [x] Implement a feature to autocomplete searchs.
- [x] Create a showcase component.
- [x] Implement a node view to the "service content" within the showcase component.
- [x] Add suggested search terms to each service in the showcase component.
- [x] Implement the UI within DEV environment.
- [x] Encapsulate the info dialog carousel in a component.
- [x] Order results by service name before fetching them.
- [x] Implement chat history autoloading at startup.
- [x] Implemet a chat clear button.
- [x] Unfold chat window on load automatically when there is a chat history.
- [x] Implement company context (it's loaded from the config file).
- [x] Make navigator sticky and scrollable.
- [x] Add selectable default prompts to the chat window.
- [x] Add featured identifier to featured elements.
- [X] Add markdown library to display formatted bot responses.
- [x] Add a fold-unfold button to display or hide the not featured results.

<!-- BACKEND -->
- [ ] Check the single element api endpoint to retrieve url or null on the image field just like in the service.
- [ ] Look for a solution to fetch the fields that contains an id to get some basic data about the entity. Like "university_origin". 
- [-] Perhaps, bot responses could have a key called 'explanation' and this text could be displayed in a tooltip when hovering result containers.

- [x] Automatize the ingest of data into elastic search when making write operations on Odoo.
- [x] Add a field within the acceleration services module to add suggested search terms.
- [x] Add a field within the acceleration services module to add an image.

<!-- STYLING -->
- [ ] Make fades visibility blend with the background (somehow).
- [x] Improve usability on the navigator component.
- [x] Adapt style to make it coherent.
- [x] Display the images of the acceleration services within the showcase component.
- [x] Display in a user friendly way the score of each result.
- [x] Make the color of the score dynamic based on the score.
- [x] Make a display adaption for mobile devices.
- [x] Correct autoscroll down on the chat window.
- [x] Improve responsiveness.
- [x] Correct 'clear chat' button positioning.

<!-- BUGS -->
- [ ] Drag and drop does not work on mobile displays.
- [ ] Solve a bug where "next" and "previous" buttons in carousel are mixing results from different services (wrappers).
- [x] Solve issue when the CDN cache is not being purged properly (mainly with css files).
- [x] Solve "highlight search terms" bug when the query is just one letter.
- [x] Solve style bug where some texts are blurry (maybe due to the font size).
- [x] Solve bug where the showcase cards are being rendered twice.
- [x] Solve style issues within the dev environment.
- [x] Solve issue when url in the carousel window is not being build correctly.
- [x] Avoid rendering greetings if there was previous results.
- [x] Solve pointer events issue when the Chat component is over some card and the ChatWindow is hidden. 

<!-- FROM 13th March -->
- [x] Add translation to the query sent to the search engine.
    - [x] Install LibreTranslate service within the docker container.
- [x] Add 'tab' word to the placeholder in the searchbar.
    - [x] Add 'tab' word to the autocomplete dropdown items.
- [x] Truncate carousel cards descriptions.
- [x] Solve service info display once result cards are displayed.
- [x] Remove extra fields temporarily from the carousel cards.
- [x] Rediseño visual.
- [x] Create a new repo within aUPaEU organization to host common utilities like LibreTranslate or HTMLExtractor.
- [x] Open all the links in new tabs.
- [x] Add metagora data fetching.
- [x] Make the metagora navigator render conditionally.
- [x] Make showcase cards less wide.
- [x] Each time the pages re-renders, the selected agora button is not maintaining its state.
- [x] Make color variations on the default images for dynamic cards (based on title hash ¿?).

<!-- FROM 19th March -->
- [ ] Revisar los matches parciales porque no están funcionando... quizás es porque ahora hay una condición must para la primera palabra de la query y esta no acepta el match parcial (ejemplo: 'acoustics' vs 'acoustic'). The issue is that the partial match takes into account more letters ie. 'acoustic' returns 'acoustic-s' as a match but not the reverse 'acoustics' does not return 'acoustic' as a match.
- [ ] Display showcase card when hovering the navigator (it should be implemented with a debouncer).
- [ ] Make carousel cards more big.
- [ ] Implement a breadcrumb within the carousel card Service >> Sub-service >> Catalogue.
- [ ] Make navigator menu dynamic to be always visible when scrolling up and down.
- [ ] Add a checkbox to the navigator items to use them as a filter. If you check one the rest uncheck, then you can check others.
- [ ] Add a button near the searchbar to clear the filtering.
- [ ] Change the config 'host' to a list in the case of the metagora and check all the business logic related to that. 
- [ ] Ensure the proper work of the metagora data fetching when fetching from different hosts (ie. CIVIS).
- [ ] The partial matches are not being highlighted properly.
- [ ] When the metagora is selected, hide the navigator and show another widget like a european map with the location of each alliance.
- [ ] Keep the greetings until the user makes the first click or scrolls down ¿?
- [ ] Animate the metagora navigator buttons on click.
- [ ] Solve greetings animation bug when changing to the showcase.
- [ ] Remove greetings if there are results to be displayed.
- [ ] Make results permanent. 