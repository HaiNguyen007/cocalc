import { List, Map } from "immutable";
import {
  React,
  Component,
  Rendered,
  rclass,
  rtypes
} from "../../app-framework";

import { TimeTravelActions } from "./actions";
import { Document } from "./document";
import { NavigationButtons } from "./navigation-buttons";
import { NavigationSlider } from "./navigation-slider";

interface Props {
  actions: TimeTravelActions;
  id: string;
  path: string;
  desc: Map<string, any>;
  // reduxProps
  versions: List<Date>;
}

class TimeTravel extends Component<Props> {
  public shouldComponentUpdate(next_props): boolean {
    if (this.props.versions != next_props.versions) return true;
    if (this.props.desc != next_props.desc) {
      return true;
    }
    return false;
  }

  public static reduxProps({ name }) {
    return {
      [name]: {
        versions: rtypes.immutable.List
      }
    };
  }

  private get_version(): Date | undefined {
    if (this.props.desc == null || this.props.versions == null) return;
    const version = this.props.desc.get("version");
    const d: Date | undefined = this.props.versions.get(version);
    if (d != null) return d;
    return this.props.versions.get(-1);
  }

  private render_version(): Rendered {
    return <div>{JSON.stringify(this.get_version())}</div>;
  }

  private get_doc(): any {
    const version = this.get_version();
    if (version == null) return;
    return this.props.actions.get_doc(version);
  }

  private render_document(): Rendered {
    const doc = this.get_doc();
    if (doc == null) return;
    return <Document doc={doc} path={this.props.path} />;
  }

  private render_navigation_buttons(): Rendered {
    if (this.props.desc == null || this.props.versions == null) return;
    return (
      <NavigationButtons
        id={this.props.id}
        actions={this.props.actions}
        version={this.props.desc.get("version")}
        max={this.props.versions.size - 1}
      />
    );
  }

  private render_navigation_slider(): Rendered {
    if (this.props.desc == null || this.props.versions == null) return;
    return (
      <NavigationSlider
        id={this.props.id}
        actions={this.props.actions}
        version={this.props.desc.get("version")}
        max={this.props.versions.size - 1}
      />
    );
  }

  public render(): Rendered {
    return (
      <div>
        {this.render_navigation_buttons()}
        {this.render_navigation_slider()}
        TimeTravel {JSON.stringify(this.props.versions.toJS())} <br /> Version:{" "}
        {this.render_version()}
        {this.render_document()}
      </div>
    );
  }
}

const tmp = rclass(TimeTravel);
export { tmp as TimeTravel };