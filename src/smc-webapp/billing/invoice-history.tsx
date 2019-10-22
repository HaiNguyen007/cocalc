const { Panel } = require("react-bootstrap");
import { Component, React, Rendered } from "../app-framework";
import { Icon, Loading } from "../r_misc";
import { Invoice } from "./invoice";
import { Invoices } from "./types";
import { WindowedList } from "../r_misc/windowed-list";

interface Props {
  invoices?: Invoices;
}

export class InvoiceHistory extends Component<Props> {
  private invoices_list_ref = React.createRef<WindowedList>();

  private render_header(): Rendered {
    return (
      <span>
        <Icon name="list-alt" /> Invoices and receipts
      </span>
    );
  }

  private render_invoice({ index: idx }): Rendered | undefined {
    if (this.props.invoices == null) return;
    const invoice = this.props.invoices.data[idx];
    if (invoice == null) return;
    return <Invoice key={invoice.id} invoice={invoice} />;
  }

  private render_invoices(): Rendered[] | Rendered {
    if (this.props.invoices == null) {
      return <Loading />;
    }

    const size = this.props.invoices.data.length;

    return (
      <div className={"smc-vfill"} style={{ height: "300px" }}>
        <WindowedList
          ref={this.invoices_list_ref}
          overscan_row_count={1}
          estimated_row_size={size}
          row_count={size}
          row_renderer={this.render_invoice.bind(this)}
          row_key={idx => `${idx}`}
          cache_id={"invoices"}
        />
      </div>
    );
  }

  public render(): Rendered {
    return (
      <Panel header={this.render_header()}>{this.render_invoices()}</Panel>
    );
  }
}
