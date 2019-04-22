import React from 'react';
import HeapGraph from './heapgraph';
import classnames from 'classnames';

export default function (bundle, deps) {

  bundle.defineAction('memoryChanged', 'memoryChanged');
  bundle.addReducer('memoryChanged', memoryChanged);
  // bundle.use('stepperProgress');
  bundle.use('stepperViewControlsChanged', 'getStepperDisplay');

  function MemoryMapSelector (state, props) {
    const getMessage = state.get('getMessage');
    const stepperState = deps.getStepperDisplay(state);
    return {state: stepperState, getMessage};
  }

  bundle.defineView('MemoryMap', MemoryMapSelector, class MemoryMap extends React.PureComponent {
    updateMemoryContent = payload => {
      this.props.dispatch({type: "memoryChanged", payload});
    };

    render () {
      const { state } = this.props;
      if (!state) return false;

      const { core, oldCore, memoryContents } = state;

      const context      = { core, oldCore, memoryContents };
      const maxAddress   = core.memory.size - 1;
      const startAddress = 0;

      return (
        <div>
          <HeapGraph context={context} startAddress={startAddress} maxAddress={maxAddress}/>
        </div>
      );
    };

  });
};

function memoryChanged(state, action) {
  const { payload } = action;
  return state.updateIn(['stepper', 'current'], function(stepperState) {
    let { memoryContents } = stepperState;

    Object.keys(payload.contents).map((key, index) => {
      memoryContents.contents[key] = payload.contents[key];
    });

    Object.keys(payload.addresses).map((key, index) => {
      memoryContents.addresses[key] = payload.addresses[key];
    });

    Object.keys(payload.connections).map((key, index) => {
      memoryContents.connections[key] = payload.connections[key];
    });

    stepperState.memoryContents = memoryContents;

    return stepperState;
  });
}
