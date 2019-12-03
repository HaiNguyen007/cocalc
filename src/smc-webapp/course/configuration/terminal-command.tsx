import { List, Map, fromJS } from "immutable";
import {
  React,
  ReactDOM,
  Component,
  Rendered,
  rtypes,
  redux,
  rclass
} from "../../app-framework";

import { FormControl, FormGroup, InputGroup, Button } from "react-bootstrap";

import { Card } from "cocalc-ui";

import { Icon } from "../../r_misc";

import { Result } from "../student-projects/run-in-all-projects";

import { CourseActions } from "../actions";
import { CourseStore, TerminalCommand, TerminalCommandOutput } from "../store";

interface Props {
  name: string;
  terminal_command?: TerminalCommand;
}

class TerminalCommandPanel extends Component<Props, {}> {
  constructor(props) {
    super(props);
  }

  get_actions(): CourseActions {
    const actions = redux.getActions(this.props.name);
    if (actions == null) {
      throw Error("actions must be defined");
    }
    return actions as CourseActions;
  }

  static reduxProps({ name }) {
    return {
      [name]: {
        terminal_command: rtypes.immutable.Map
      }
    };
  }

  shouldComponentUpdate(next): boolean {
    return this.props.terminal_command !== next.terminal_command;
  }

  render_button(running: boolean): Rendered {
    return (
      <Button
        style={{ width: "6em" }}
        onClick={() => this.run_terminal_command()}
        disabled={running}
      >
        <Icon name={running ? "cc-icon-cocalc-ring" : "play"} spin={running} />{" "}
        Run
      </Button>
    );
  }

  render_input(): Rendered {
    const c = this.props.terminal_command;
    let input = "";
    let running = false;
    if (c != null) {
      input = c.get("input", "");
      running = c.get("running", false);
    }
    return (
      <form
        onSubmit={e => {
          e.preventDefault();
          this.run_terminal_command();
        }}
      >
        <FormGroup>
          <InputGroup>
            <FormControl
              type="text"
              value={input}
              ref="input"
              placeholder="Terminal command..."
              onChange={e => {
                e.preventDefault();
                this.set_field(
                  "input",
                  ReactDOM.findDOMNode(this.refs.input).value
                );
              }}
            />
            <InputGroup.Button disabled={running}>
              {this.render_button(running)}
            </InputGroup.Button>
          </InputGroup>
        </FormGroup>
      </form>
    );
  }

  render_running(): Rendered {
    const c = this.props.terminal_command;
    if (c != null && c.get("running")) {
      return (
        <div
          style={{
            color: "#888",
            padding: "5px",
            fontSize: "16px",
            fontWeight: "bold"
          }}
        >
          <Icon name={"cc-icon-cocalc-ring"} spin /> Running...
        </div>
      );
    }
  }

  render_output(): Rendered {
    const c = this.props.terminal_command;
    if (c == null) return;
    const output = c.get("output");
    if (!output) return;
    const v: Rendered[] = [];
    output.forEach(result => {
      v.push(this.render_result(result));
    });
    return <div style={{ maxHeight: "400px", overflowY: "auto" }}>{v}</div>;
  }

  render_result(result: TerminalCommandOutput): Rendered {
    return <Output key={result.get("project_id")} result={result} />;
  }

  private get_store(): CourseStore {
    const store = redux.getStore(this.props.name);
    if (store == null) throw Error("store must be defined");
    return store as any;
  }

  set_field(field: "input" | "running" | "output", value: any): void {
    const store: CourseStore = this.get_store();
    let terminal_command: TerminalCommand = store.get(
      "terminal_command",
      Map() as TerminalCommand
    );
    if (value == null) {
      terminal_command = terminal_command.delete(field);
    } else {
      terminal_command = terminal_command.set(field, value);
    }
    this.get_actions().setState({ terminal_command });
  }

  run_log(result: Result): void {
    // Important to get from store, not from props, since on second
    // run old output isn't pushed down to props by the time this
    // gets called.
    const store = redux.getStore(this.props.name);
    if (!store) {
      return;
    }
    const c = (store as any).get("terminal_command");
    let output;
    if (c == null) {
      output = List();
    } else {
      output = c.get("output", List());
    }
    this.set_field("output", output.push(fromJS(result)));
  }

  async run_terminal_command(): Promise<void> {
    const c = this.props.terminal_command;
    if (c == null) return;
    const input = c.get("input");
    this.set_field("output", undefined);
    if (!input) {
      return;
    }
    try {
      this.set_field("running", true);
      await this.get_actions().student_projects.run_in_all_student_projects(
        input,
        undefined,
        undefined,
        this.run_log.bind(this)
      );
    } finally {
      this.set_field("running", false);
    }
  }

  render_terminal(): Rendered {
    return (
      <div>
        {this.render_input()}
        {this.render_output()}
        {this.render_running()}
      </div>
    );
  }

  render_header(): Rendered {
    return (
      <>
        <Icon name="terminal" /> Run Terminal command in all student projects
      </>
    );
  }

  render() {
    return (
      <Card title={this.render_header()}>
        {this.render_terminal()}
        <hr />
        <span style={{ color: "#666" }}>
          Run a terminal command in the home directory of all student projects.
        </span>
      </Card>
    );
  }
}

const PROJECT_LINK_STYLE = {
  maxWidth: "80%",
  overflow: "hidden",
  textOverflow: "ellipsis",
  cursor: "pointer",
  display: "block",
  whiteSpace: "nowrap"
};

class Output extends Component<{ result: TerminalCommandOutput }, {}> {
  shouldComponentUpdate(next): boolean {
    return this.props.result !== next.result;
  }

  open_project(): void {
    const project_id = this.props.result.get("project_id");
    redux.getActions("projects").open_project({ project_id });
  }

  render(): Rendered {
    const result = this.props.result;
    const project_id: string = result.get("project_id");
    const title: string = redux.getStore("projects").get_title(project_id);
    // as any below for style because typescript is a broken (?).
    return (
      <div style={{ borderTop: "1px solid #ccc", padding: "5px" }}>
        <a
          style={PROJECT_LINK_STYLE as any}
          onClick={this.open_project.bind(this)}
        >
          {title}
        </a>
        <pre style={{ maxHeight: "200ex", overflow: "auto" }}>
          {result.get("stdout")}
          <div style={{ color: "white", background: "red" }}>
            {result.get("stderr")}
          </div>
        </pre>
      </div>
    );
  }
}

const TerminalCommandPanel0 = rclass(TerminalCommandPanel);
export { TerminalCommandPanel0 as TerminalCommandPanel };
