import React from "react";
import ReactToPrint from "react-to-print";
import Demo from "./Demo";
import { Button } from "@material-ui/core";
class ExportPdfComponent extends React.Component {
  render() {
    return (
      <div>
        {/* <h1>Export HTMl Table in PDF File</h1> */}

        <Demo ref={(response) => (this.componentRef = response)} />

        <ReactToPrint
          content={() => this.componentRef}
          trigger={() => (
            <Button variant={"contained"} color={"primary"}>
              Print to PDF
            </Button>
          )}
        />
      </div>
    );
  }
}

export default ExportPdfComponent;
