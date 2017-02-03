class FSM {
    /**
     * Creates new FSM instance.
     * @param config
     */
    constructor(config) {
        if (config == null){
            throw new Error("List has zero length");
        }

        this.config = config;
        this.state = config.initial;
        this.hist = [];
        this.ind = 0;
        this.hist[this.ind++] = this.state;
        this.init = true;
        this.indexUndo = 1;
        this.allStates = [];
        for (var ev in this.config.states) {
            this.allStates.push(ev);
        }
        
    }

    /**
     * Returns active state.
     * @returns {String}
     */
    getState() {
        return this.state;
    }

    /**
     * Goes to specified state.
     * @param state
     */
    changeState(state) {
        
        this.init = false;
        this.indexUndo = 1;
        var flagFind = false;
        for(var st in this.config.states){
            if(st == state){
                this.state = state;
                this.hist[this.ind++] = this.state;
                flagFind = true;
            }
        }
        if(flagFind == false){
             throw new Error("State isn't exist");
        }
    }

    /**
     * Changes state according to event transition rules.
     * @param event
     */
    trigger(event) {
        
        this.init = false;
        this.flagFindEvent = false;
        for(var i in this.allStates){

            if(this.config.states[this.allStates[i]].transitions[event] != undefined){
               
                if(this.hist[this.ind-1] == this.allStates[i]){
                    
                    this.state = this.config.states[this.allStates[i]].transitions[event];
                    this.hist[this.ind++] = this.state;
                    this.flagFindEvent = true;
                }
                else{
                    if(this.hist[this.ind-1] == this.config.states[this.allStates[i]].transitions[event]){
                        this.flagFindEvent = true;
                    }
                }

            }
            
        }

       
        if(this.flagFindEvent == false){
            
            throw new Error("hmmm... exception?");

        }
       
    }

    /**
     * Resets FSM state to initial.
     */
    reset() {
        this.clearHistory();
    }

    /**
     * Returns an array of states for which there are specified event transition rules.
     * Returns all states if argument is undefined.
     * @param event
     * @returns {Array}
     */
    getStates(event) {
       
        var arrStates = [];
        
        for(var i in this.allStates){
           
            if(this.config.states[this.allStates[i]].transitions[event] != undefined){
              
                arrStates.push(this.allStates[i]);
            }
        }
           
        if(event != null){
            return arrStates;
        }
        else{
            return this.allStates;
        }
    }

    /**
     * Goes back to previous state.
     * Returns false if undo is not available.
     * @returns {Boolean}
     */
    undo() {
        if(this.init)
            return false;
        this.indexUndo++;

        if((this.hist.length-this.indexUndo) < 0){
            this.indexUndo--;
            return false;
        } else{
            this.state = this.hist[this.hist.length-this.indexUndo];
            return true;
        }

        

    }

    /**
     * Goes redo to state.
     * Returns false if redo is not available.
     * @returns {Boolean}
     */
    redo() {
        
        if(this.init)
            return false;
        
        if(this.indexUndo >= 2){
            this.state = this.hist[this.hist.length-this.indexUndo+1];
           
            this.indexUndo --;
           
            
            return true;
        }
        return false;
    }

    /**
     * Clears transition history
     */
    clearHistory() {
                
        this.state = this.config.initial;
        this.ind = 0;
        this.undoValue = null;
        this.hist.length = 0;
        
    }
}

module.exports = FSM;

/** @Created by Uladzimir Halushka **/