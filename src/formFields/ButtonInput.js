import React from "react";
import Button from "../widgets/ButtonWidget";

export default function ButtonInput(props) {
  const { uiField } = props;
  return <Button uiField={uiField} />;
}
