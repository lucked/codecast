
import React from 'react';
import {Button, Panel} from 'react-bootstrap';
import EpicComponent from 'epic-component';

import {use, defineSelector, defineView} from '../utils/linker';
import Editor from '../buffers/editor';
import {TermView} from '../stepper/terminal';

export default function* (deps) {

  yield use(
    'getTranslateState', 'getStepperDisplay',
    'sourceInit', 'sourceEdit', 'sourceSelect', 'sourceScroll',
    'inputInit', 'inputEdit', 'inputSelect', 'inputScroll',
    'translateClearDiagnostics',
    'StackView', 'DirectivesPane'
  );

  yield defineSelector('MainViewSelector', function (state, props) {
    const translate = deps.getTranslateState(state);
    const diagnostics = translate && translate.get('diagnosticsHtml');
    const stepperDisplay = deps.getStepperDisplay(state);
    const haveStepper = !!stepperDisplay;
    const terminal = haveStepper && stepperDisplay.terminal;
    const readOnly = haveStepper || props.preventInput;
    return {diagnostics, readOnly, terminal};
  });

  yield defineView('MainView', 'MainViewSelector', EpicComponent(self => {

    const onSourceInit = function (editor) {
      self.props.dispatch({type: deps.sourceInit, editor});
    };

    const onSourceSelect = function (selection) {
      self.props.dispatch({type: deps.sourceSelect, selection});
    };

    const onSourceEdit = function (delta) {
      self.props.dispatch({type: deps.sourceEdit, delta});
    };

    const onSourceScroll = function (firstVisibleRow) {
      self.props.dispatch({type: deps.sourceScroll, firstVisibleRow});
    };

    const onInputInit = function (editor) {
      self.props.dispatch({type: deps.inputInit, editor});
    };

    const onInputSelect = function (selection) {
      self.props.dispatch({type: deps.inputSelect, selection});
    };

    const onInputEdit = function (delta) {
      self.props.dispatch({type: deps.inputEdit, delta});
    };

    const onInputScroll = function (firstVisibleRow) {
      self.props.dispatch({type: deps.inputScroll, firstVisibleRow});
    };

    const onClearDiagnostics = function () {
      self.props.dispatch({type: deps.translateClearDiagnostics});
    };

    const renderSourcePanelHeader = function () {
      return (
        <span>
          {'Source'}
          {self.props.haveStepper && <span>{' '}<i className="fa fa-lock"/></span>}
        </span>
      );
    };

    const renderInputOutputHeader = function () {
      return (
        <div className="row">
          <div className="col-sm-6">
            {'Entrée'}
            {self.props.haveStepper && <span>{' '}<i className="fa fa-lock"/></span>}
          </div>
          <div className="col-sm-6">Sortie</div>
        </div>
      );
    };

    const diagnosticsPanelHeader = (
      <div>
        <div className="pull-right">
          <Button className="close" onClick={onClearDiagnostics}>×</Button>
        </div>
        <span>Messages</span>
      </div>
    );

    self.render = function () {
      const {diagnostics, readOnly, terminal} = self.props;
      const editorRowHeight = '300px';
      return (
        <div>
          <div className="row">
            <div className="col-sm-3">
              <Panel header={<span>Variables</span>}>
                {<deps.StackView height={editorRowHeight}/>}
              </Panel>
            </div>
            <div className="col-sm-9">
              <Panel header={renderSourcePanelHeader()}>
                <Editor onInit={onSourceInit} onEdit={onSourceEdit} onSelect={onSourceSelect} onScroll={onSourceScroll}
                        readOnly={readOnly} mode='c_cpp' width='100%' height={editorRowHeight} />
              </Panel>
            </div>
          </div>
          <div className="row">
            {diagnostics && <div className="col-sm-12">
              <Panel header={diagnosticsPanelHeader}>
                <div dangerouslySetInnerHTML={diagnostics}/>
              </Panel>
            </div>}
            <div className="col-sm-12">
              <deps.DirectivesPane/>
              <Panel header={renderInputOutputHeader()}>
                <div className="row">
                  <div className="col-sm-6">
                    <Editor onInit={onInputInit} onEdit={onInputEdit} onSelect={onInputSelect} onScroll={onInputScroll}
                            readOnly={readOnly} mode='text' width='100%' height='150px' />
                  </div>
                  <div className="col-sm-6">
                    {terminal
                      ? <TermView buffer={terminal}/>
                      : <div className="terminal">
                          <div className="terminal-placeholder">
                            {"Programme arrêté, pas de sortie à afficher."}
                          </div>
                        </div>}
                  </div>
                </div>
              </Panel>
            </div>
          </div>
        </div>
      );
    };

  }));

};
