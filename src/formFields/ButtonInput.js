import React from "react";
import Button from "../fields/ButtonWidget";

export default function ButtonInput(props) {
  const { uiField } = props;
  return <Button uiField={uiField} />;
}
