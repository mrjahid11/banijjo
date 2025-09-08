import React from "react";
import Screeners from "./Screeners";
import Supercharts from "./Supercharts";
import FundementalGraphs from "./FundementalGraphs";
import YieldCurves from "./YieldCurves";
import Options from "./Options";

const Products = () => {
  return (
    <div>
      <Supercharts />
      <Screeners />
      <FundementalGraphs />
      <YieldCurves />
      <Options />
    </div>
  );
};

export default Products;
