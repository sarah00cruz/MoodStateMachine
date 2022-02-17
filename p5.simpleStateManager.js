
/*******************************************************************************************************************
    SimpleStateManager
    for P5.js
    Written by Scott Kildall
    Loads a CSV table in the constructor
    SimpleStateManager variables:
        this.statesTable                =  CSV file table, loaded in preload(), used in setup(), then not used again
        this.currentState               =  index of the current state in the array, default to 1st state
        this.stateNames                 =  Array of state names
        this.states                     =  Array of State variables, matches entries and size of state names
        this.setImageFilenameCallback   =  Callback for image filename, when a new state is selected
        this.setTransitionsCallback     =  Callback for image filename, when a new state is selected
        
    State variables:
        this.stateName          = name of the state (for reference)
        this.imageFilename      = relative local path of filename
        this.transitions        = array of transitions (Strings)
        this.nextState          = next state we are going to
*********************************************************************************************************************/

class SimpleStateManager {
    // Clickable layout table is an OPTIONAL parameter
    constructor(statesFilename) {
        this.statesTable = loadTable(statesFilename, 'csv', 'header');
        this.currentState = 0;   
        this.stateNames = [];
        this.states = [];    
        this.stateNames = []; 
        this.setImageFilenameCallback = null;
        this.setTransitionsCallback = null; 
    }

    // expects as .csv file with the format as outlined in the readme file
    // this will go through the states table and:
    // (1) add a new state for every unique state
    // (2) add a 
    setup(imageFilenameCallback, transitionsArrayCallback) {
        console.log(this.statesTable);

        this.setImageFilenameCallback = imageFilenameCallback;
        this.setTransitionsCallback = transitionsArrayCallback;

        // For each row, allocate a new state, if it is unique
        // and always add a transition
        for( let i = 0; i < this.statesTable.getRowCount(); i++ ) {
            let stateName = this.statesTable.getString(i, 'StateName');
            
            // find the state index in the statesArray
            let stateArrayIndex = this.stateNames.indexOf(stateName); 

            console.log("index: " + i + " = " + stateName );
            console.log("state index = " + stateArrayIndex);

            // if not present, we add it
            if( stateArrayIndex === -1 ) {
                this.stateNames.push(stateName);
                this.states.push(new State(stateName, this.statesTable.getString(i, 'PNGFilename')));
                stateArrayIndex = this.states.length - 1;
            }
            
            this.states[stateArrayIndex].addTransition(this.statesTable.getString(i, 'TransitionText'), this.statesTable.getString(i, 'NewState'))
            
        }
        
        // All DONE
        console.log("Setup done");
        console.log(this.states);
        
        this.performCallbacks();

        return this.hasValidStates;
    }

    // set new state, make callbacks
    newState(transitionsName) {
        //console.log(transitionsName)
        //console.log(this.states[this.currentState].transitions);
        
        // find the state index in the statesArray
        let newStateIndex = this.states[this.currentState].transitions.indexOf(transitionsName); 
        if( newStateIndex === -1 ) {
            console.log("Error in newState(), transition not found");
            return;
        }

        // grab the state name
        let newStateName = this.states[this.currentState].nextStates[newStateIndex];
        this.currentState = this.stateNames.indexOf(newStateName); 

        console.log( "new state = " + newStateName);   

        this.performCallbacks();
    }

    performCallbacks() {
        // perform initial callbacks - if there is an invalid CSV, this will produce an error
        this.setImageFilenameCallback(this.states[this.currentState].imageFilename);
        this.setTransitionsCallback(this.states[this.currentState ].transitions);
    }
}

class State {
    constructor(stateName, imageFilename) {
        this.stateName = stateName;
        this.imageFilename = imageFilename;
        this.transitions = [];
        this.nextStates = [];
    }

    addTransition(transitionText,nextState) {
        this.transitions.push(transitionText);
        this.nextStates.push(nextState);
    }
}
