# Whack a Mole:

- `npx serve .` or open html
- `utils`- reusable util methods.
- `constants`- static variables.
- `main` - main code is located there.

## Simple whack a mole game:

- Mole randomly emerges from random hole. But never twice from same one.
- 1 second interval for mole to be hit. Appears and after 1s it goes down - UNHITABLE while going down. Only while emerging and being emerged
- Scores are kept by names into localstorage. If you type name that had score score is shown on intro step.
- Preload of images before starting app. For testing purposes 300ms interval between each asset load.
- Did without dev server. So no imports
- Simple animations for actions and couple images for development.
- Orentation change resume/pause.
- Persisting localstorage.
- Restart after game is finished.

## TBD:

- Hold hole/mole refs so that they are not queried everytime. Now not really nescessary because too litle holes so no real impact doing that.
- Add scoreboard since array of names and scores are being saved into localstorage.
- Add sound on smash.
- Add `boom` efect on successful smash.
- Refactor? Add options for area size. Add options for difficulty - create constants for interval speed and animation speed.
